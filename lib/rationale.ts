import type { FactorSource, PointSource, RationalePoint } from "./types";

export function splitIntoPoints(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  return trimmed
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.!?])\s+(?=[A-Z“"‘])/))
    .map((part) => part.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

export function pointsFromText(text: string, source: PointSource): RationalePoint[] {
  const parts = splitIntoPoints(text);
  const lines = parts.length ? parts : text.trim() ? [text.trim()] : [];
  return lines.map((line) => ({ text: line, source }));
}

function normalizeSource(value: unknown, webFactor: boolean): PointSource {
  const raw = String(value ?? "").toLowerCase();
  if (raw.includes("web") || raw.includes("search") || raw === "ai-agent-web") {
    return "ai-agent-web";
  }
  if (raw.includes("local") || raw.includes("rule")) return "ai-agent";
  if (webFactor && (raw.includes("web") || raw === "search")) return "ai-agent-web";
  return "ai-agent";
}

function inferSource(text: string, webFactor: boolean, fallback: PointSource): PointSource {
  if (!webFactor) return fallback;
  if (
    /\b(patent|uspto|espacenet|google patents|found|search|vendor|competitor product|press release|github)\b/i.test(
      text,
    )
  ) {
    return "ai-agent-web";
  }
  if (/\b(disclosure only|from the (form|disclosure)|scored from the disclosure)\b/i.test(text)) {
    return "ai-agent";
  }
  return fallback;
}

export function parseAgentPoints(
  raw: unknown,
  webFactor: boolean,
  fallback: RationalePoint[] = [],
): RationalePoint[] {
  const defaultSource: PointSource = "ai-agent";

  if (Array.isArray(raw)) {
    const points = raw
      .map((item) => {
        if (typeof item === "string" && item.trim()) {
          return {
            text: item.trim(),
            source: inferSource(item, webFactor, defaultSource),
          };
        }
        if (item && typeof item === "object") {
          const row = item as Record<string, unknown>;
          const text = String(row.text ?? row.point ?? row.rationale ?? "").trim();
          if (!text) return null;
          return {
            text,
            source: row.source
              ? normalizeSource(row.source, webFactor)
              : inferSource(text, webFactor, defaultSource),
          };
        }
        return null;
      })
      .filter((point): point is RationalePoint => Boolean(point));
    if (points.length) return points;
  }

  if (typeof raw === "string" && raw.trim()) {
    return splitIntoPoints(raw).map((text) => ({
      text,
      source: inferSource(text, webFactor, defaultSource),
    }));
  }

  return fallback;
}

export function joinPoints(points: RationalePoint[]): string {
  return points.map((point) => point.text).join(" ");
}

export function displayPoints(factor: {
  rationale: string;
  points?: RationalePoint[];
  source?: FactorSource;
  usedWebSearch?: boolean;
}): RationalePoint[] {
  if (factor.points?.length) return factor.points;
  const source: PointSource =
    factor.source === "local-rules"
      ? "local-rules"
      : factor.usedWebSearch
        ? "ai-agent-web"
        : "ai-agent";
  return pointsFromText(factor.rationale, source);
}

export function pointBadge(source: PointSource): { label: string; className: string } {
  if (source === "local-rules") {
    return { label: "Local rules", className: "bg-scotia-paper text-scotia-ink" };
  }
  if (source === "ai-agent-web") {
    return { label: "AI agent · web search", className: "bg-scotia-teal/10 text-scotia-teal" };
  }
  return { label: "AI agent", className: "bg-scotia-ink/10 text-scotia-ink" };
}

export function factorScoreBadge(
  source: FactorSource | undefined,
  usedWebSearch: boolean | undefined,
  scoredBy?: "openai-agent" | "local-rules",
): { label: string; className: string } {
  if (source === "local-rules" || (!source && scoredBy === "local-rules")) {
    return pointBadge("local-rules");
  }
  if (usedWebSearch) return pointBadge("ai-agent-web");
  if (source === "ai-agent" || scoredBy === "openai-agent") return pointBadge("ai-agent");
  return pointBadge("local-rules");
}
