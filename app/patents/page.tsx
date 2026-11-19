"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/Header";
import { useAdmin } from "@/components/AdminProvider";
import { useLanguage } from "@/components/LanguageProvider";
import {
  deleteSession,
  listSessions,
  sessionPath,
  setSessionReview,
  type ReviewStatus,
  type SavedSession,
} from "@/lib/sessions";

function reviewOf(session: SavedSession): ReviewStatus {
  if (session.status !== "screened") return "pending";
  return session.review ?? "pending";
}

export default function PatentsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { ready, isAdmin } = useAdmin();
  const [sessions, setSessions] = useState<SavedSession[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!isAdmin) {
      router.replace("/");
      return;
    }
    setSessions(listSessions());
  }, [ready, isAdmin, router]);

  const setReview = (id: string, review: ReviewStatus) => {
    setSessionReview(id, review);
    setSessions(listSessions());
  };

  const confirmDelete = (id: string) => {
    deleteSession(id);
    setPendingDelete(null);
    setSessions(listSessions());
  };

  if (!ready || !isAdmin || sessions === null) {
    return (
      <div className="min-h-screen bg-scotia-mist">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm text-scotia-muted">{t.loading}</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-scotia-mist">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-scotia-ink">{t.existingPatents}</h1>
        {sessions.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-scotia-line bg-white px-6 py-10">
            <p className="text-sm font-medium text-scotia-ink">{t.noPatents}</p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-scotia-muted">{t.noPatentsBody}</p>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {sessions.map((session) => {
              const title =
                (typeof session.state.answers.title === "string" && session.state.answers.title.trim()) ||
                t.untitled;
              const scored = session.status === "screened" && Boolean(session.result);
              const review = reviewOf(session);
              return (
                <li
                  key={session.id}
                  className="rounded-2xl border border-scotia-line bg-white px-6 py-5"
                >
                  <p className="text-sm text-scotia-ink">
                    <span className="font-semibold">{t.patentIdLabel}:</span>{" "}
                    <span className="font-mono tracking-wide">{session.patentId}</span>
                  </p>
                  <p className="mt-2 text-scotia-ink">
                    <span className="text-sm font-semibold">{t.titleLabel}:</span>{" "}
                    <span className="text-lg font-semibold">{title}</span>
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {scored ? (
                      <>
                        <select
                          value={review}
                          onChange={(event) => setReview(session.id, event.target.value as ReviewStatus)}
                          className="rounded-full border border-scotia-line bg-scotia-mist px-3 py-1.5 text-sm font-semibold text-scotia-ink outline-none"
                        >
                          <option value="pending">{t.statusPending}</option>
                          <option value="approved">{t.statusApproved}</option>
                          <option value="denied">{t.statusDenied}</option>
                        </select>
                        {typeof session.overallScore === "number" ? (
                          <span className="text-sm font-semibold text-scotia-ink">
                            {t.scoreValue(session.overallScore)}
                            {session.overall ? ` · ${t.ratings[session.overall]}` : ""}
                          </span>
                        ) : null}
                        {review === "pending" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setReview(session.id, "approved")}
                              className="rounded-full bg-scotia-teal px-4 py-1.5 text-sm font-semibold text-white"
                            >
                              {t.approve}
                            </button>
                            <button
                              type="button"
                              onClick={() => setReview(session.id, "denied")}
                              className="rounded-full bg-scotia-red px-4 py-1.5 text-sm font-semibold text-white"
                            >
                              {t.deny}
                            </button>
                          </>
                        ) : null}
                      </>
                    ) : (
                      <span className="rounded-full bg-scotia-mist px-3 py-1.5 text-sm font-semibold text-scotia-ink">
                        {t.statusIncomplete}
                      </span>
                    )}
                    <Link
                      href={sessionPath(session)}
                      className="rounded-full border border-scotia-ink px-4 py-1.5 text-sm font-semibold text-scotia-ink hover:bg-scotia-mist"
                    >
                      {t.viewPatent}
                    </Link>
                    {pendingDelete === session.id ? (
                      <div className="w-full rounded-xl border border-scotia-red/20 bg-scotia-red/5 px-4 py-3">
                        <p className="text-sm font-semibold text-scotia-ink">{t.deletePatentTitle}</p>
                        <p className="mt-1 text-sm text-scotia-muted">{t.deletePatentBody}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => confirmDelete(session.id)}
                            className="rounded-full bg-scotia-red px-4 py-1.5 text-sm font-semibold text-white hover:bg-scotia-red-dark"
                          >
                            {t.deletePatentConfirm}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(null)}
                            className="rounded-full border border-scotia-ink px-4 py-1.5 text-sm font-semibold text-scotia-ink hover:bg-white"
                          >
                            {t.deletePatentCancel}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPendingDelete(session.id)}
                        className="rounded-full px-4 py-1.5 text-sm font-semibold text-scotia-red hover:bg-scotia-red/5"
                      >
                        {t.deletePatent}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
