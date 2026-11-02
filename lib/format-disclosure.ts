import { SECTIONS } from "./questions";
import type { DisclosureState, Question } from "./types";

function formatAnswer(question: Question, raw: string | string[] | undefined): string {
  if (raw == null) return "";
  if (Array.isArray(raw)) {
    if (!raw.length) return "";
    const labels = question.options
      ? raw.map((value) => question.options?.find((option) => option.value === value)?.label ?? value)
      : raw;
    return labels.join("; ");
  }
  const value = raw.toString().trim();
  if (!value) return "";
  if (question.options) {
    return question.options.find((option) => option.value === value)?.label ?? value;
  }
  return value;
}

export function formatDisclosureForAgent(state: DisclosureState, webSearch = false): string {
  const lines: string[] = [
    "Score this invention disclosure.",
    webSearch
      ? "Reply with JSON only. Each factor rationale must be an array of short bullet objects: {\"text\":\"...\",\"source\":\"web-search\"|\"ai-agent\"|\"local-rules\"}. Use web-search only for novelty, prior public disclosure, and competitor copy-risk."
      : "Reply with JSON only. Each factor rationale must be an array of short bullet objects: {\"text\":\"...\",\"source\":\"ai-agent\"}. Do not use web search.",
    "",
  ];

  for (const section of SECTIONS) {
    const body: string[] = [];
    for (const question of section.questions) {
      const answer = formatAnswer(question, state.answers[question.id]);
      if (!answer) continue;
      const prefix = question.number ? `${question.number}. ` : "";
      body.push(`${prefix}${question.label}`);
      body.push(answer);
      body.push("");
    }
    if (body.length) {
      lines.push(`## ${section.title}`);
      lines.push(...body);
    }
  }

  const inventors = state.inventors.filter((inventor) => inventor.name.trim());
  if (inventors.length) {
    lines.push("## Inventors");
    for (const inventor of inventors) {
      lines.push(
        [
          inventor.name,
          inventor.email,
          inventor.employee === "yes" ? "Scotiabank employee" : inventor.employee,
        ]
          .filter(Boolean)
          .join(" — "),
      );
    }
    lines.push("");
  }

  if (state.signature.name) {
    lines.push("## Affirmation");
    lines.push(`Signed: ${state.signature.name}`);
    if (state.signature.date) lines.push(`Date: ${state.signature.date}`);
  }

  return lines.join("\n");
}
