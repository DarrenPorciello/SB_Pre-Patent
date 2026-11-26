"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Field } from "./Field";
import { InventorsEditor } from "./Inventors";
import { SECTIONS } from "@/lib/questions";
import { localizedSections } from "@/lib/question-i18n";
import { useLanguage } from "./LanguageProvider";
import { downloadDisclosurePdf } from "@/lib/pdf";
import {
  getSession,
  listSessions,
  newSessionId,
  saveSessionProgress,
  saveSessionResult,
} from "@/lib/sessions";
import { RESULT_KEY } from "@/lib/storage";
import { EXAMPLE_DISCLOSURE } from "@/lib/example";
import { defaultState, emptyState, type DisclosureState } from "@/lib/types";
import { ScoringLoader } from "./ScoringLoader";

const NEW_LOCK = "scotia-prepatent-pending-new";

function isFilled(value: string | string[] | undefined): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value && value.toString().trim());
}

export function DisclosureWizard() {
  const { locale, t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sections = localizedSections(locale);
  const loadedFor = useRef<string | null>(null);
  const [step, setStep] = useState(0);
  const [state, setState] = useState<DisclosureState>(defaultState);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [patentId, setPatentId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [useFraudExample, setUseFraudExample] = useState(false);

  useEffect(() => {
    const requested = searchParams.get("session");
    const isNew = searchParams.get("new") === "1";

    if (requested && !isNew) {
      if (loadedFor.current === requested) return;
      loadedFor.current = requested;
      if (sessionStorage.getItem(NEW_LOCK) === requested) {
        sessionStorage.removeItem(NEW_LOCK);
      }
      const found = getSession(requested);
      setSessionId(requested);
      setPatentId(found?.patentId ?? null);
      setState(found?.state ?? defaultState());
      setStep(found ? Math.min(Math.max(found.step, 0), SECTIONS.length - 1) : 0);
      setReady(true);
      return;
    }

    if (loadedFor.current === "routing") return;
    loadedFor.current = "routing";

    if (isNew) {
      const pending = sessionStorage.getItem(NEW_LOCK);
      if (pending && getSession(pending)) {
        router.replace(`/apply?session=${pending}`);
        return;
      }
      const id = newSessionId();
      sessionStorage.setItem(NEW_LOCK, id);
      saveSessionProgress({ id, state: defaultState(), step: 0 });
      router.replace(`/apply?session=${id}`);
      return;
    }

    const latest = listSessions()[0];
    if (latest) {
      router.replace(`/apply?session=${latest.id}`);
      return;
    }

    const id = newSessionId();
    sessionStorage.setItem(NEW_LOCK, id);
    saveSessionProgress({ id, state: defaultState(), step: 0 });
    router.replace(`/apply?session=${id}`);
  }, [searchParams, router]);

  useEffect(() => {
    if (!ready || !sessionId) return;
    const timer = window.setTimeout(() => {
      const wrote = saveSessionProgress({ id: sessionId, state, step });
      if (!wrote) return;
      setSaving(true);
      window.setTimeout(() => setSaving(false), 700);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [state, step, ready, sessionId]);

  const section = sections[step];
  const isLast = step === SECTIONS.length - 1;
  const progress = ((step + 1) / SECTIONS.length) * 100;

  const missingInSection = useMemo(() => {
    const ids: string[] = [];
    if (section.id === "getting-started") {
      const named = state.inventors.some((inv) => inv.name.trim());
      if (!named) ids.push("inventors");
    }
    for (const q of section.questions) {
      if (q.required && !isFilled(state.answers[q.id])) ids.push(q.id);
    }
    if (section.id === "affirmation") {
      if (!state.signature.name.trim()) ids.push("sig-name");
      if (!state.signature.typedSignature.trim()) ids.push("sig-sign");
      if (!state.signature.date) ids.push("sig-date");
    }
    return ids;
  }, [section, state]);

  const setAnswer = (id: string, value: string | string[]) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [id]: value },
    }));
  };

  const goNext = () => {
    if (missingInSection.length) {
      setErrors(missingInSection);
      return;
    }
    setErrors([]);
    setStep((s) => Math.min(s + 1, SECTIONS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setErrors([]);
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (missingInSection.length) {
      setErrors(missingInSection);
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const detail =
          payload && typeof payload.error === "string"
            ? payload.error
            : `Screening failed (${response.status})`;
        throw new Error(detail.slice(0, 400));
      }
      const result = payload;
      if (sessionId) saveSessionResult(sessionId, state, step, result);
      const savedPatentId = sessionId ? getSession(sessionId)?.patentId ?? patentId : patentId;
      sessionStorage.setItem(
        RESULT_KEY,
        JSON.stringify({ state, result, sessionId, patentId: savedPatentId }),
      );
      router.push(sessionId ? `/results?session=${sessionId}` : "/results");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t.scoringFailed);
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) {
    return <div className="py-24 text-center text-sm text-scotia-muted">{t.loadingDraft}</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {submitting && <ScoringLoader overlay />}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs text-scotia-muted">
          <span>{section.eyebrow}</span>
          <span>{saving ? t.saved : t.draftSaved}</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-scotia-line">
          <div className="h-full bg-scotia-red transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {sections.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setErrors([]);
                setStep(index);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                index === step
                  ? "bg-scotia-ink text-white"
                  : index < step
                    ? "bg-scotia-red/10 text-scotia-red"
                    : "bg-scotia-paper text-scotia-muted"
              }`}
            >
              {index + 1}. {item.title}
            </button>
          ))}
        </div>
      </div>

      {patentId ? (
        step === 0 ? (
          <div className="mb-6 rounded-2xl border-2 border-scotia-red bg-scotia-red/5 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-scotia-red">
              {t.patentIdLabel}
            </p>
            <p className="mt-1 font-mono text-4xl font-bold tracking-[0.18em] text-scotia-ink sm:text-5xl">
              {patentId}
            </p>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-scotia-red">
              {t.patentIdKeep}
            </p>
          </div>
        ) : (
          <div className="mb-6 rounded-2xl border border-scotia-line bg-white px-6 py-4">
            <p className="text-sm text-scotia-ink">
              <span className="font-semibold">{t.patentIdLabel}:</span>{" "}
              <span className="font-mono tracking-wide">{patentId}</span>
            </p>
            <p className="mt-1 text-sm text-scotia-ink">
              <span className="font-semibold">{t.patentTitleLabel}:</span>{" "}
              {(typeof state.answers.title === "string" && state.answers.title.trim()) || t.untitled}
            </p>
          </div>
        )
      ) : null}

      <div className="rounded-2xl border border-scotia-line bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-scotia-red">
          {t.inventionDisclosure}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-scotia-ink">
          {section.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-scotia-muted">{section.description}</p>

        {section.id === "getting-started" ? (
          <label className="mt-6 flex items-center gap-3 rounded-xl border border-scotia-line bg-scotia-mist px-4 py-3">
            <input
              type="checkbox"
              checked={useFraudExample}
              onChange={(event) => {
                const checked = event.target.checked;
                setUseFraudExample(checked);
                setState(checked ? structuredClone(EXAMPLE_DISCLOSURE) : emptyState());
                setErrors([]);
              }}
              className="h-4 w-4 accent-scotia-red"
            />
            <span className="text-sm font-semibold text-scotia-ink">{t.fraudExample}</span>
          </label>
        ) : null}

        <div className="mt-8 space-y-8">
          {section.questions.map((question) => (
            <Field
              key={question.id}
              question={question}
              value={state.answers[question.id] ?? (question.type === "checkbox" ? [] : "")}
              onChange={(value) => setAnswer(question.id, value)}
              error={errors.includes(question.id)}
            />
          ))}

          {section.id === "getting-started" && (
            <InventorsEditor
              inventors={state.inventors}
              onChange={(inventors) => setState((prev) => ({ ...prev, inventors }))}
              error={errors.includes("inventors")}
            />
          )}

          {section.id === "affirmation" && (
            <Affirmation
              state={state}
              errors={errors}
              onChange={(signature) => setState((prev) => ({ ...prev, signature }))}
            />
          )}
        </div>

        {errors.length > 0 && (
          <p className="mt-6 text-sm text-scotia-red">
            {t.requiredFields}
          </p>
        )}
        {submitError ? <p className="mt-6 text-sm text-scotia-red">{submitError}</p> : null}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-scotia-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="rounded-full border border-scotia-line px-5 py-2.5 text-sm font-medium text-scotia-ink disabled:opacity-40"
          >
            {t.back}
          </button>
          <div className="flex flex-col gap-3 sm:flex-row">
            {isLast && (
              <button
                type="button"
                onClick={() => downloadDisclosurePdf(state, undefined, patentId)}
                className="rounded-full border border-scotia-ink px-5 py-2.5 text-sm font-semibold text-scotia-ink hover:bg-scotia-paper"
              >
                {t.downloadPdf}
              </button>
            )}
            {isLast ? (
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="rounded-full bg-scotia-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-scotia-red-dark disabled:opacity-60"
              >
                {submitting ? t.searchingScoring : t.submitScreening}
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="rounded-full bg-scotia-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-scotia-red-dark"
              >
                {t.continue}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Affirmation({
  state,
  errors,
  onChange,
}: {
  state: DisclosureState;
  errors: string[];
  onChange: (signature: DisclosureState["signature"]) => void;
}) {
  const { t } = useLanguage();
  const sig = state.signature;
  const inputClass = (errorId?: string) =>
    `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm outline-none ${
      errorId && errors.includes(errorId)
        ? "border-scotia-red"
        : "border-scotia-line focus:border-scotia-ink"
    }`;

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-scotia-ink">{t.affirmationBody}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            {t.name} <span className="text-scotia-red">*</span>
          </label>
          <input
            className={inputClass("sig-name")}
            value={sig.name}
            onChange={(e) => onChange({ ...sig, name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">{t.email}</label>
          <input
            className={inputClass()}
            type="email"
            value={sig.email}
            onChange={(e) => onChange({ ...sig, email: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            {t.typedSignature} <span className="text-scotia-red">*</span>
          </label>
          <input
            className={inputClass("sig-sign")}
            value={sig.typedSignature}
            onChange={(e) => onChange({ ...sig, typedSignature: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            {t.date} <span className="text-scotia-red">*</span>
          </label>
          <input
            className={inputClass("sig-date")}
            type="date"
            value={sig.date}
            onChange={(e) => onChange({ ...sig, date: e.target.value })}
          />
        </div>
      </div>
      <p className="text-sm text-scotia-muted">{t.affirmationHint}</p>
    </div>
  );
}

