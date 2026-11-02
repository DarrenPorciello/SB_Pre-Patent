import { EXAMPLE_DISCLOSURE } from "./example";

export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "yesno"
  | "radio"
  | "checkbox"
  | "select";

export interface FieldOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  number?: string;
  label: string;
  hint?: string;
  type: FieldType;
  options?: FieldOption[];
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export interface Section {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  questions: Question[];
}

export interface Inventor {
  id: string;
  name: string;
  email: string;
  address: string;
  residency: string;
  nationality: string;
  employee: string;
  outsideFunding: string;
}

export interface Signature {
  name: string;
  email: string;
  typedSignature: string;
  date: string;
}

export type Answers = Record<string, string | string[]>;

export interface DisclosureState {
  answers: Answers;
  inventors: Inventor[];
  signature: Signature;
}

export const STORAGE_KEY = "scotia-prepatent-disclosure-v5";

export function blankInventor(): Inventor {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `inv-${Date.now()}`,
    name: "",
    email: "",
    address: "",
    residency: "",
    nationality: "",
    employee: "",
    outsideFunding: "",
  };
}

export function defaultState(): DisclosureState {
  return structuredClone(EXAMPLE_DISCLOSURE);
}

export type Rating = "Low" | "Medium" | "High";

export type PointSource = "ai-agent" | "ai-agent-web" | "local-rules";
export type FactorSource = "ai-agent" | "local-rules";

export interface RationalePoint {
  text: string;
  source: PointSource;
}

export interface FactorResult {
  id: string;
  name: string;
  score: number;
  rating: Rating;
  rationale: string;
  points?: RationalePoint[];
  source?: FactorSource;
  reasonSource?: FactorSource;
  usedWebSearch?: boolean;
}

export type ScoredBy = "openai-agent" | "local-rules";
export type SearchMode = "disclosure-only" | "web";

export interface ScreeningResult {
  submittedAt: string;
  overallScore: number;
  overall: Rating;
  factors: FactorResult[];
  recommendationTitle: string;
  recommendation: string;
  nextAction: string;
  scoredBy?: ScoredBy;
  searchMode?: SearchMode;
  agentError?: string;
}
