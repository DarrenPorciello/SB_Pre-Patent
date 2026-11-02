"use client";

import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/Header";
import { ScotiaMark } from "@/components/Logo";
import { SavedSessions } from "@/components/SavedSessions";
import { useLanguage } from "@/components/LanguageProvider";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-scotia-mist">
      <SiteHeader />
      <main>
        <section className="border-b border-scotia-line bg-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-scotia-red">
                {t.homeEyebrow}
              </p>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-scotia-ink sm:text-[2.75rem] sm:leading-[1.15]">
                {t.homeTitle}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-scotia-muted">
                {t.homeLead}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/apply?new=1"
                  className="rounded-full bg-scotia-red px-6 py-3 text-sm font-semibold text-white hover:bg-scotia-red-dark"
                >
                  {t.startDisclosure}
                </Link>
                <a
                  href="#saved"
                  className="rounded-full border border-scotia-ink px-6 py-3 text-sm font-semibold text-scotia-ink hover:bg-scotia-paper"
                >
                  {t.savedSessions}
                </a>
                <a
                  href="#how"
                  className="rounded-full border border-scotia-ink px-6 py-3 text-sm font-semibold text-scotia-ink hover:bg-scotia-paper"
                >
                  {t.howItWorks}
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-scotia-line bg-scotia-mist p-8">
              <div className="flex items-center gap-3">
                <ScotiaMark size={44} />
                <div>
                  <p className="font-semibold text-scotia-ink">{t.agentName}</p>
                  <p className="text-sm text-scotia-muted">{t.agentTagline}</p>
                </div>
              </div>
              <ul className="mt-8 space-y-3">
                {t.factors.map((factor) => (
                  <li
                    key={factor}
                    className="flex items-center justify-between border-b border-scotia-line pb-3 text-sm last:border-0"
                  >
                    <span className="text-scotia-ink">{factor}</span>
                    <span className="text-xs font-medium uppercase tracking-wider text-scotia-muted">
                      {t.weighted}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <SavedSessions />

        <section id="how" className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-scotia-ink">{t.whenUsed}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-scotia-muted">{t.whenUsedBody}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {t.stages.map((stage) => (
              <article key={stage.n} className="rounded-2xl border border-scotia-line bg-white p-6">
                <p className="text-xs font-semibold tracking-[0.16em] text-scotia-red">{stage.n}</p>
                <h3 className="mt-3 text-lg font-semibold text-scotia-ink">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-scotia-muted">{stage.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-scotia-line bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-2xl font-semibold tracking-tight text-scotia-ink">{t.ratingMeans}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <article>
                <p className="text-sm font-semibold text-scotia-ink">{t.ratings.Low}</p>
                <p className="mt-2 text-sm leading-relaxed text-scotia-muted">{t.ratingLow}</p>
              </article>
              <article>
                <p className="text-sm font-semibold text-scotia-ink">{t.ratings.Medium}</p>
                <p className="mt-2 text-sm leading-relaxed text-scotia-muted">{t.ratingMedium}</p>
              </article>
              <article>
                <p className="text-sm font-semibold text-scotia-ink">{t.ratings.High}</p>
                <p className="mt-2 text-sm leading-relaxed text-scotia-muted">{t.ratingHigh}</p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
