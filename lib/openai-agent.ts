import {
  PRE_PATENT_AGENT_INSTRUCTIONS,
  PRE_PATENT_WEB_AGENT_INSTRUCTIONS,
} from "./agent-instructions";
import { formatDisclosureForAgent } from "./format-disclosure";
import { parseAgentPoints, joinPoints, pointsFromText } from "./rationale";
import { clamp, ratingFromScore, scoreDisclosureApplication } from "./scoring";
import type { DisclosureState, FactorResult, Rating, ScreeningResult, SearchMode } from "./types";

const WEB_SEARCH_FACTORS = new Set(["novelty", "disclosure", "competitor"]);
const FACTOR_WEIGHTS: Record<string, number> = {
  novelty: 0.24,
  development: 0.14,
  disclosure: 0.22,
  revenue: 0.16,
  reputation: 0.1,
  competitor: 0.14,
};

function recomputeOverall(factors: FactorResult[]): { overallScore: number; overall: Rating } {
  let overallScore = factors.reduce(
    (sum, factor) => sum + factor.score * (FACTOR_WEIGHTS[factor.id] ?? 0),
    0,
  );
  const disclosure = factors.find((factor) => factor.id === "disclosure");
  if (disclosure && disclosure.score < 35) {
    overallScore = Math.min(overallScore, 38);
  }
  overallScore = clamp(overallScore);
  return { overallScore, overall: asRating(undefined, overallScore) };
}

const FACTOR_META: { id: string; name: string }[] = [
  { id: "novelty", name: "Novelty" },
  { id: "development", name: "How developed the idea is" },
  { id: "disclosure", name: "Prior public disclosure" },
  { id: "revenue", name: "Revenue opportunity" },
  { id: "reputation", name: "Helping Scotiabank’s reputation" },
  { id: "competitor", name: "Will a competitor want to copy it" },
];

const NEXT_BY_RATING: Record<
  Rating,
  { recommendationTitle: string; nextAction: string }
> = {
  Low: {
    recommendationTitle: "Strengthen the idea, or consider a low-cost public disclosure",
    nextAction:
      "Revise this disclosure with more implementation detail and a clearer difference versus existing technology. Do not present externally without IP guidance.",
  },
  Medium: {
    recommendationTitle: "Gather more documentation and evidence",
    nextAction:
      "Collect lab notes, diagrams, and any NDA-covered discussions. Update this form and resubmit when the Medium gaps are closed.",
  },
  High: {
    recommendationTitle: "Proceed to executive sponsorship",
    nextAction:
      "This idea has passed the automated pre-screen. Seek executive sponsorship to enter the Bank’s formal patent process.",
  },
};

function asRating(value: unknown, score: number): Rating {
  if (value === "High" || value === "Medium" || value === "Low") return value;
  return ratingFromScore(score);
}

function extractJsonObject(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? text).trim();
  try {
    return JSON.parse(candidate);
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(candidate.slice(start, end + 1));
    }
    throw new Error("Agent did not return JSON scores.");
  }
}

function normalizeAgentResult(
  raw: unknown,
  state: DisclosureState,
  searchMode: SearchMode,
): ScreeningResult {
  if (!raw || typeof raw !== "object") {
    throw new Error("Agent JSON was empty.");
  }
  const data = raw as Record<string, unknown>;
  const listed = Array.isArray(data.factors) ? data.factors : [];
  const byId = new Map<string, Record<string, unknown>>();
  for (const item of listed) {
    if (item && typeof item === "object" && "id" in item) {
      const row = item as Record<string, unknown>;
      byId.set(String(row.id), row);
    }
  }

  const localResult = scoreDisclosureApplication(state);
  const localFactors = localResult.factors;
  const factors: FactorResult[] = FACTOR_META.map((meta) => {
    const local = localFactors.find((factor) => factor.id === meta.id);
    const useLocal =
      searchMode === "web" && !WEB_SEARCH_FACTORS.has(meta.id);
    if (useLocal && local) {
      return {
        ...local,
        source: "local-rules",
        reasonSource: "local-rules",
        usedWebSearch: false,
        points: local.points?.length
          ? local.points
          : pointsFromText(local.rationale, "local-rules"),
      };
    }

    const row = byId.get(meta.id) ?? {};
    const score = clamp(Number(row.score) || 0);
    const webFactor = searchMode === "web" && WEB_SEARCH_FACTORS.has(meta.id);
    const localPoints = local?.points?.length
      ? local.points
      : pointsFromText(local?.rationale ?? "", "local-rules");
    const points = parseAgentPoints(row.rationale ?? row.points, webFactor, localPoints);
    const fromAgent = points.some((point) => point.source !== "local-rules");
    return {
      id: meta.id,
      name: typeof row.name === "string" && row.name ? row.name : meta.name,
      score,
      rating: asRating(row.rating, score),
      rationale: joinPoints(points),
      points,
      source: "ai-agent",
      reasonSource: fromAgent ? "ai-agent" : "local-rules",
      usedWebSearch: webFactor,
    };
  });

  const mixed = searchMode === "web" || !data.overallScore;
  const computed = recomputeOverall(factors);
  const overallScore = mixed ? computed.overallScore : clamp(Number(data.overallScore) || computed.overallScore);
  const overall = mixed ? computed.overall : asRating(data.overall, overallScore);
  const fallback = NEXT_BY_RATING[overall];
  const title =
    (typeof state.answers.title === "string" && state.answers.title) || "this idea";

  return {
    submittedAt: new Date().toISOString(),
    overallScore,
    overall,
    factors,
    recommendationTitle:
      typeof data.recommendationTitle === "string" && data.recommendationTitle
        ? data.recommendationTitle
        : fallback.recommendationTitle,
    recommendation:
      typeof data.recommendation === "string" && data.recommendation
        ? data.recommendation
        : `“${title}” received an overall ${overall} on this automated pre-screen.`,
    nextAction:
      typeof data.nextAction === "string" && data.nextAction
        ? data.nextAction
        : fallback.nextAction,
    scoredBy: "openai-agent",
    searchMode,
  };
}

function eventText(event: Record<string, unknown>): string {
  if (typeof event.text === "string") return event.text;
  const content = event.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text?: unknown }).text ?? "");
        }
        return "";
      })
      .join("");
  }
  return "";
}

function parseSseBlock(block: string): Record<string, unknown> | null {
  const dataLines = block
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart());
  const payload = dataLines.join("\n").trim();
  if (!payload || payload === "[DONE]") return null;
  try {
    return JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function readAgentOutput(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.body || !contentType.includes("event-stream")) {
    const body = (await response.json()) as Record<string, unknown>;
    const direct =
      (typeof body.output_text === "string" && body.output_text) ||
      eventText(body);
    if (direct) return direct;
    throw new Error("Agent session returned no text.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let output = "";
  let deltas = "";
  let completed = false;
  let failure = "";

  const handleEvent = (event: Record<string, unknown>) => {
    const type = String(event.type ?? "");
    if (type === "agent.session.turn.output_text.done") {
      output = eventText(event) || output;
    }
    if (type === "agent.session.turn.output_text.delta" && typeof event.delta === "string") {
      deltas += event.delta;
    }
    if (type === "error") {
      const err = event.error as { message?: string } | undefined;
      failure = err?.message || "Agent stream error";
    }
    if (
      type === "agent.session.failed" ||
      type === "agent.session.turn.failed" ||
      type === "agent.session.turn.cancelled"
    ) {
      failure = type;
    }
    if (type === "agent.session.turn.completed") {
      const turn = event.turn as { subagent_id?: string | null } | undefined;
      if (!turn?.subagent_id) completed = true;
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";
    for (const chunk of chunks) {
      const event = parseSseBlock(chunk);
      if (event) handleEvent(event);
    }
    if (completed || failure) break;
  }

  if (failure) throw new Error(failure);
  const text = output || deltas;
  if (!text) throw new Error("Agent finished without a score.");
  return text;
}

export function openaiAgentConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

async function createAgentSession(
  apiKey: string,
  body: Record<string, unknown>,
): Promise<Response> {
  return fetch("https://api.openai.com/v1/agents/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "agents=v1",
    },
    body: JSON.stringify(body),
  });
}

export async function scoreWithOpenAIAgent(
  state: DisclosureState,
  webSearch = false,
): Promise<ScreeningResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const searchMode: SearchMode = webSearch ? "web" : "disclosure-only";
  const input = formatDisclosureForAgent(state, webSearch);
  const webTool = {
    type: "web_search",
    mode: "live",
    context_size: "medium",
  };
  const inlineAgent = webSearch
    ? {
        model: process.env.OPENAI_WEB_MODEL?.trim() || process.env.OPENAI_MODEL?.trim() || "gpt-6-astra",
        instructions: PRE_PATENT_WEB_AGENT_INSTRUCTIONS,
        tools: [webTool],
      }
    : {
        model: process.env.OPENAI_MODEL?.trim() || "gpt-5.5",
        instructions: PRE_PATENT_AGENT_INSTRUCTIONS,
        tools: [] as unknown[],
      };
  const base = {
    environment: { type: "none" },
    stream: true,
    input,
  };

  const agentId = webSearch
    ? process.env.OPENAI_WEB_AGENT_ID?.trim()
    : process.env.OPENAI_AGENT_ID?.trim();
  let response: Response | null = null;

  if (agentId) {
    response = await createAgentSession(apiKey, {
      ...base,
      agent_id: agentId,
    });
  }

  if (!response || !response.ok) {
    if (response) await response.text();
    response = await createAgentSession(apiKey, {
      ...base,
      agent: inlineAgent,
    });
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI ${response.status}: ${detail.slice(0, 400)}`);
  }

  const text = await readAgentOutput(response);
  return normalizeAgentResult(extractJsonObject(text), state, searchMode);
}

export function localScore(
  state: DisclosureState,
  agentError?: string,
  searchMode: SearchMode = "disclosure-only",
): ScreeningResult {
  return {
    ...scoreDisclosureApplication(state),
    scoredBy: "local-rules",
    searchMode,
    agentError,
  };
}
