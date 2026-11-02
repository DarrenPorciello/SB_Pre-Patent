import { SECTIONS } from "./questions";
import { loadState, saveState } from "./storage";
import { STORAGE_KEY, type DisclosureState, type Rating, type ScreeningResult } from "./types";

export interface SavedSession {
  id: string;
  patentId: string;
  createdAt: string;
  updatedAt: string;
  step: number;
  status: "draft" | "screened";
  overall?: Rating;
  overallScore?: number;
  state: DisclosureState;
  result?: ScreeningResult;
}

const SESSIONS_KEY = "scotia-prepatent-sessions-v1";
const MIGRATED_KEY = "scotia-prepatent-sessions-migrated";

export function newSessionId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `session-${Date.now()}`;
}

const PATENT_ID_DIGITS = 8;
const NUMERIC_PATENT_ID = /^\d{8}$/;

function randomDigitId(): string {
  const min = 10 ** (PATENT_ID_DIGITS - 1);
  const max = 10 ** PATENT_ID_DIGITS;
  const value =
    typeof crypto !== "undefined" && crypto.getRandomValues
      ? crypto.getRandomValues(new Uint32Array(1))[0] % (max - min) + min
      : Math.floor(Math.random() * (max - min) + min);
  return String(value);
}

export function nextPatentId(sessions: SavedSession[]): string {
  const used = new Set(sessions.map((session) => session.patentId));
  let id = randomDigitId();
  while (used.has(id)) id = randomDigitId();
  return id;
}

function withPatentIds(sessions: SavedSession[]): { sessions: SavedSession[]; changed: boolean } {
  let changed = false;
  const next: SavedSession[] = [];
  for (const session of sessions) {
    if (NUMERIC_PATENT_ID.test(session.patentId ?? "")) {
      next.push(session);
      continue;
    }
    changed = true;
    next.push({ ...session, patentId: nextPatentId(next) });
  }
  return { sessions: next, changed };
}

export function sessionTitle(state: DisclosureState): string {
  const title = state.answers.title;
  if (typeof title === "string" && title.trim()) return title.trim();
  return "Untitled invention";
}

function isFilled(value: string | string[] | undefined): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value && value.toString().trim());
}

export function requiredProgress(state: DisclosureState): { filled: number; total: number } {
  let filled = 0;
  let total = 0;
  for (const section of SECTIONS) {
    for (const question of section.questions) {
      if (!question.required) continue;
      total += 1;
      if (isFilled(state.answers[question.id])) filled += 1;
    }
  }
  total += 1;
  if (state.inventors.some((inventor) => inventor.name.trim())) filled += 1;
  const signatureFields = [state.signature.name, state.signature.typedSignature, state.signature.date];
  total += signatureFields.length;
  filled += signatureFields.filter((value) => value.trim()).length;
  return { filled, total };
}

export function sessionSectionLabel(step: number): string {
  const section = SECTIONS[Math.min(Math.max(step, 0), SECTIONS.length - 1)];
  return `Section ${Math.min(step, SECTIONS.length - 1) + 1} of ${SECTIONS.length} · ${section.title}`;
}

function sortSessions(sessions: SavedSession[]): SavedSession[] {
  return [...sessions].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
}

function writeSessions(sessions: SavedSession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sortSessions(sessions)));
}

function migrateLegacyOnce() {
  if (localStorage.getItem(MIGRATED_KEY) === "1") return;
  const existing = localStorage.getItem(SESSIONS_KEY);
  localStorage.setItem(MIGRATED_KEY, "1");
  if (existing) return;
  if (!localStorage.getItem(STORAGE_KEY)) return;
  try {
    const now = new Date().toISOString();
    const session: SavedSession = {
      id: newSessionId(),
      patentId: nextPatentId([]),
      createdAt: now,
      updatedAt: now,
      step: 0,
      status: "draft",
      state: loadState(),
    };
    writeSessions([session]);
  } catch {
    localStorage.removeItem(MIGRATED_KEY);
  }
}

export function listSessions(): SavedSession[] {
  if (typeof window === "undefined") return [];
  try {
    migrateLegacyOnce();
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedSession[];
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter((session) => session && session.id && session.state);
    const { sessions, changed } = withPatentIds(valid);
    const sorted = sortSessions(sessions);
    if (changed) writeSessions(sorted);
    return sorted;
  } catch {
    return [];
  }
}

export function getSession(id: string): SavedSession | null {
  return listSessions().find((session) => session.id === id) ?? null;
}

export function saveSessionProgress(input: {
  id: string;
  state: DisclosureState;
  step: number;
}): boolean {
  const sessions = listSessions();
  const now = new Date().toISOString();
  const index = sessions.findIndex((session) => session.id === input.id);
  if (index === -1) {
    sessions.push({
      id: input.id,
      patentId: nextPatentId(sessions),
      createdAt: now,
      updatedAt: now,
      step: input.step,
      status: "draft",
      state: input.state,
    });
  } else {
    const existing = sessions[index];
    const sameState = JSON.stringify(existing.state) === JSON.stringify(input.state);
    if (sameState && existing.step === input.step) return false;
    const editedAfterScore = existing.status === "screened" && !sameState;
    sessions[index] = {
      ...existing,
      updatedAt: now,
      step: input.step,
      state: input.state,
      status: editedAfterScore ? "draft" : existing.status,
      overall: editedAfterScore ? undefined : existing.overall,
      overallScore: editedAfterScore ? undefined : existing.overallScore,
      result: editedAfterScore ? undefined : existing.result,
    };
  }
  writeSessions(sessions);
  saveState(input.state);
  return true;
}

export function saveSessionResult(
  id: string,
  state: DisclosureState,
  step: number,
  result: ScreeningResult,
) {
  const sessions = listSessions();
  const now = new Date().toISOString();
  const existing = sessions.find((session) => session.id === id);
  const next: SavedSession = {
    id,
    patentId: existing?.patentId || nextPatentId(sessions.filter((session) => session.id !== id)),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    step,
    status: "screened",
    overall: result.overall,
    overallScore: result.overallScore,
    state,
    result,
  };
  writeSessions([next, ...sessions.filter((session) => session.id !== id)]);
  saveState(state);
}

export function deleteSession(id: string) {
  writeSessions(listSessions().filter((session) => session.id !== id));
}
