"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/Header";
import { downloadDisclosurePdf } from "@/lib/pdf";
import { getSession } from "@/lib/sessions";
import { RESULT_KEY } from "@/lib/storage";
import type { DisclosureState, FactorResult, Rating, ScreeningResult } from "@/lib/types";
import { ScoringLoader } from "@/components/ScoringLoader";
import { displayPoints } from "@/lib/rationale";
import { useLanguage } from "@/components/LanguageProvider";
import type { Messages } from "@/lib/i18n";
import type { PointSource } from "@/lib/types";
import { factorWeightPercent } from "@/lib/weights";

type Payload = {
  state: DisclosureState;
  result: ScreeningResult;
  sessionId?: string;
  patentId?: string;
};

function factorOrigin(
  factor: FactorResult,
  scoredBy: ScreeningResult["scoredBy"],
  t: Messages,
) {
  if (factor.source === "local-rules" || (!factor.source && scoredBy === "local-rules")) {
    return {
      label: t.localRules,
      className: "bg-scotia-paper text-scotia-ink",
    };
  }
  if (factor.usedWebSearch) {
    return {
      label: t.aiAgentWeb,
      className: "bg-scotia-teal/10 text-scotia-teal",
    };
  }
  return {
    label: t.aiAgent,
    className: "bg-scotia-ink/10 text-scotia-ink",
  };
}

function pointBadgeLabel(source: PointSource, t: Messages) {
  if (source === "local-rules") {
    return { label: t.localRules, className: "bg-scotia-paper text-scotia-ink" };
  }
  if (source === "ai-agent-web") {
    return { label: t.aiAgentWeb, className: "bg-scotia-teal/10 text-scotia-teal" };
  }
  return { label: t.aiAgent, className: "bg-scotia-ink/10 text-scotia-ink" };
}

function tone(rating: Rating) {
  if (rating === "High") return "bg-scotia-teal text-white";
  if (rating === "Medium") return "bg-scotia-ink text-white";
  return "bg-scotia-red text-white";
}

function displayNextAction(text: string) {
  return text
    .replace(/\s+and contact Scotiabank IP legal\s*\/\s*patent counsel/gi, "")
    .replace(/Scotiabank IP legal\s*[—-]\s*patent counsel\.?/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function AgentStatusBanner({
  reached,
  error,
  searchMode,
}: {
  reached: boolean;
  error?: string;
  searchMode?: ScreeningResult["searchMode"];
}) {
  const usedWeb = searchMode === "web";
  if (reached) {
    return (
      <div className="rounded-2xl border border-scotia-teal/30 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-scotia-teal">
          AI agent reached
        </p>
        <p className="mt-2 text-sm font-medium text-scotia-ink">
          {usedWeb
            ? "The web-search screening agent returned these scores."
            : "The screening agent returned these scores from the disclosure only."}
        </p>
        <p className="mt-1 text-sm text-scotia-muted">
          {usedWeb
            ? "Web search was used for novelty, prior public disclosure, and competitor copy-risk."
            : "No web search was used."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-scotia-red/30 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-scotia-red">
        AI agent was not reached
      </p>
      <p className="mt-2 text-sm font-medium text-scotia-ink">
        These scores came from local rules on this computer, not the screening agent.
      </p>
      {error ? (
        <div className="mt-3 rounded-lg bg-scotia-mist p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-scotia-muted">
            Error
          </p>
          <p className="mt-1 break-words font-mono text-xs leading-relaxed text-scotia-ink">
            {error}
          </p>
        </div>
      ) : (
        <p className="mt-2 text-sm text-scotia-muted">
          No error details were returned. Check OPENAI_API_KEY in .env.local and restart the app.
        </p>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const { t } = useLanguage();
  const [payload, setPayload] = useState<Payload | null>(null);
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (id) {
      const session = getSession(id);
      if (session?.result) {
        setPayload({
          state: session.state,
          result: session.result,
          sessionId: session.id,
          patentId: session.patentId,
        });
        setAnalyzing(false);
        return;
      }
    }
    const raw = sessionStorage.getItem(RESULT_KEY);
    if (!raw) {
      setAnalyzing(false);
      return;
    }
    const parsed = JSON.parse(raw) as Payload;
    if (!parsed.patentId && parsed.sessionId) {
      parsed.patentId = getSession(parsed.sessionId)?.patentId;
    }
    setPayload(parsed);
    setAnalyzing(false);
  }, []);

  if (!payload && !analyzing) {
    return (
      <div className="min-h-screen bg-scotia-mist">
        <SiteHeader compact />
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold text-scotia-ink">No submission found</h1>
          <p className="mt-3 text-sm text-scotia-muted">
            Complete and submit a disclosure to receive a six-factor screening result.
          </p>
          <Link
            href="/apply"
            className="mt-8 inline-flex rounded-full bg-scotia-red px-5 py-2.5 text-sm font-semibold text-white"
          >
            Go to disclosure
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const result = payload?.result;
  const title =
    (typeof payload?.state.answers.title === "string" && payload.state.answers.title) ||
    "Untitled invention";

  return (
    <div className="min-h-screen bg-scotia-mist">
      <SiteHeader compact />
      <main className="mx-auto max-w-4xl px-6 py-12">
        {analyzing || !result ? (
          <div className="flex justify-center py-8">
            <ScoringLoader />
          </div>
        ) : (
          <div className="space-y-6">
            <AgentStatusBanner
              reached={result.scoredBy === "openai-agent"}
              error={result.agentError}
              searchMode={result.searchMode}
            />
            <div className="rounded-2xl border border-scotia-line bg-white p-8">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-scotia-red">
                  Stage 2 · Automatic scoring
                </p>
                {payload.patentId ? (
                  <span className="rounded-full bg-scotia-paper px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-scotia-ink">
                    {t.patentId(payload.patentId)}
                  </span>
                ) : null}
              </div>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-scotia-ink">{title}</h1>
                  <p className="mt-2 text-sm text-scotia-muted">
                    Overall screening score {result.overallScore} / 100
                  </p>
                </div>
                <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tone(result.overall)}`}>
                  {result.overall}
                </span>
              </div>
              <h2 className="mt-8 text-lg font-semibold text-scotia-ink">
                {result.recommendationTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-scotia-muted">{result.recommendation}</p>
              <div className="mt-6 rounded-xl bg-scotia-mist p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-scotia-red">
                  Stage 3 · Next step
                </p>
                <p className="mt-2 text-sm leading-relaxed text-scotia-ink">
                  {displayNextAction(result.nextAction)}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => downloadDisclosurePdf(payload.state, result, payload.patentId)}
                  className="rounded-full bg-scotia-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-scotia-red-dark"
                >
                  Download PDF with scores
                </button>
                <Link
                  href={payload.sessionId ? `/apply?session=${payload.sessionId}` : "/apply"}
                  className="rounded-full border border-scotia-ink px-5 py-2.5 text-sm font-semibold text-scotia-ink"
                >
                  Edit disclosure
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-scotia-line bg-white p-8">
              <h2 className="text-lg font-semibold text-scotia-ink">Patent Submission Review</h2>
              <p className="mt-1 text-sm text-scotia-muted">{t.weightsNote}</p>
              <ul className="mt-8 space-y-6">
                {result.factors.map((factor) => {
                  const origin = factorOrigin(factor, result.scoredBy, t);
                  const points = displayPoints(factor);
                  return (
                  <li key={factor.id}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-scotia-ink">{factor.name}</p>
                        <span className="text-xs text-scotia-muted">
                          {t.weightOfOverall(factorWeightPercent(factor.id))}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${origin.className}`}
                        >
                          {origin.label}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-scotia-muted">
                        {factor.rating} · {factor.score}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-scotia-line">
                      <div
                        className={`h-full ${
                          factor.rating === "High"
                            ? "bg-scotia-teal"
                            : factor.rating === "Medium"
                              ? "bg-scotia-ink"
                              : "bg-scotia-red"
                        }`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                    {points.length ? (
                      <ul className="mt-3 space-y-2">
                        {points.map((point, index) => {
                          const badge = pointBadgeLabel(point.source, t);
                          return (
                            <li
                              key={`${factor.id}-${index}`}
                              className="flex items-start gap-2 text-sm leading-relaxed text-scotia-muted"
                            >
                              <span
                                aria-hidden
                                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-scotia-ink/35"
                              />
                              <span className="min-w-0 flex-1">
                                {point.text}
                                <span
                                  className={`ml-2 inline-block align-middle rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badge.className}`}
                                >
                                  {badge.label}
                                </span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
