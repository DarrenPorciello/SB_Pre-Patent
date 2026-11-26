"use client";

import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/Header";
import { PatentSearch } from "@/components/PatentSearch";
import { useLanguage } from "@/components/LanguageProvider";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-scotia-mist">
      <SiteHeader />
      <main>
        <section className="border-b border-scotia-line bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
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
                  href="#how"
                  className="rounded-full border border-scotia-ink px-6 py-3 text-sm font-semibold text-scotia-ink hover:bg-scotia-paper"
                >
                  {t.howItWorks}
                </a>
              </div>
              <PatentSearch />
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-scotia-ink">{t.howItWorks}</h2>
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
