import type { DisclosureState } from "./types";
import { STORAGE_KEY, defaultState } from "./types";

export function loadState(): DisclosureState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as DisclosureState;
    return {
      ...defaultState(),
      ...parsed,
      answers: { ...defaultState().answers, ...parsed.answers },
      inventors: parsed.inventors?.length ? parsed.inventors : defaultState().inventors,
      signature: { ...defaultState().signature, ...parsed.signature },
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: DisclosureState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const RESULT_KEY = "scotia-prepatent-result";
