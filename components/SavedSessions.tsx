"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  deleteSession,
  listSessions,
  requiredProgress,
  type SavedSession,
} from "@/lib/sessions";
import { SECTIONS } from "@/lib/questions";
import { localizedSectionTitle } from "@/lib/question-i18n";
import type { Rating } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

function tone(rating: Rating) {
  if (rating === "High") return "bg-scotia-teal text-white";
  if (rating === "Medium") return "bg-scotia-ink text-white";
  return "bg-scotia-red text-white";
}

export function SavedSessions() {
  const { locale, t } = useLanguage();
  const [sessions, setSessions] = useState<SavedSession[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  useEffect(() => {
    const load = () => setSessions(listSessions());
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  const remove = (id: string) => {
    deleteSession(id);
    setSessions(listSessions());
    setPendingDelete(null);
  };

  const savedLabel = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return t.savedOnDevice;
    return t.savedAt(
      date.toLocaleString(locale === "es" ? "es" : "en", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    );
  };

  return (
    <section id="saved" className="border-b border-scotia-line bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight text-scotia-ink">{t.savedSessions}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-scotia-muted">{t.savedIntro}</p>

        {sessions === null ? (
          <p className="mt-8 text-sm text-scotia-muted">{t.loadingSessions}</p>
        ) : sessions.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-scotia-line bg-scotia-mist px-6 py-10">
            <p className="text-sm font-medium text-scotia-ink">{t.noSessions}</p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-scotia-muted">
              {t.noSessionsBody}
            </p>
            <Link
              href="/apply?new=1"
              className="mt-6 inline-flex rounded-full bg-scotia-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-scotia-red-dark"
            >
              {t.startDisclosure}
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {sessions.map((session) => {
              const progress = requiredProgress(session.state);
              const percent = progress.total ? Math.round((progress.filled / progress.total) * 100) : 0;
              const inventor = session.state.inventors.find((person) => person.name.trim())?.name;
              const section = SECTIONS[Math.min(Math.max(session.step, 0), SECTIONS.length - 1)];
              const title =
                (typeof session.state.answers.title === "string" &&
                  session.state.answers.title.trim()) ||
                t.untitled;
              return (
                <li
                  key={session.id}
                  className="rounded-2xl border border-scotia-line bg-scotia-mist p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-scotia-ink">{title}</h3>
                        {session.patentId ? (
                          <span className="rounded-full bg-white px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-scotia-ink">
                            {t.patentId(session.patentId)}
                          </span>
                        ) : null}
                        {session.status === "screened" && session.overall ? (
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone(session.overall)}`}
                          >
                            {t.ratings[session.overall]}
                            {typeof session.overallScore === "number"
                              ? ` · ${session.overallScore}`
                              : ""}
                          </span>
                        ) : (
                          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-scotia-ink">
                            {t.inProgress}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-scotia-muted">
                        {t.sectionOf(
                          Math.min(session.step, SECTIONS.length - 1) + 1,
                          SECTIONS.length,
                          localizedSectionTitle(locale, section.id, section.title),
                        )}
                        {inventor ? ` · ${inventor}` : ""}
                      </p>
                      <div className="mt-4 max-w-md">
                        <div className="mb-1.5 flex items-center justify-between text-xs text-scotia-muted">
                          <span>{t.requiredAnswers(progress.filled, progress.total)}</span>
                          <span>{savedLabel(session.updatedAt)}</span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-scotia-line">
                          <div className="h-full bg-scotia-red" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/apply?session=${session.id}`}
                        className="rounded-full bg-scotia-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-scotia-red-dark"
                      >
                        {t.continue}
                      </Link>
                      {session.result && (
                        <Link
                          href={`/results?session=${session.id}`}
                          className="rounded-full border border-scotia-ink px-5 py-2.5 text-sm font-semibold text-scotia-ink hover:bg-white"
                        >
                          {t.viewResults}
                        </Link>
                      )}
                      {pendingDelete === session.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => remove(session.id)}
                            className="rounded-full px-4 py-2.5 text-sm font-semibold text-scotia-red hover:bg-white"
                          >
                            {t.remove}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(null)}
                            className="rounded-full px-4 py-2.5 text-sm font-medium text-scotia-muted hover:bg-white"
                          >
                            {t.keep}
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPendingDelete(session.id)}
                          className="rounded-full px-4 py-2.5 text-sm font-medium text-scotia-muted hover:bg-white"
                        >
                          {t.remove}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
