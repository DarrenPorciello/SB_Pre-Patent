"use client";

import { useLanguage } from "./LanguageProvider";

export function ScoringLoader({
  overlay = false,
  webSearch = false,
}: {
  overlay?: boolean;
  webSearch?: boolean;
}) {
  const { t } = useLanguage();
  const card = (
    <div className="w-full max-w-md rounded-2xl border border-scotia-line bg-white px-8 py-10 text-center shadow-card">
      <div className="mx-auto flex h-16 w-16 items-center justify-center">
        <span className="relative block h-14 w-14">
          <span className="absolute inset-0 rounded-full border-2 border-scotia-line" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-scotia-red border-r-scotia-red" />
        </span>
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-scotia-red">
        {t.agentName}
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-scotia-ink">{t.scoringTitle}</h1>
      <p className="mt-2 text-sm text-scotia-muted">
        {webSearch ? t.scoringWebWait : t.scoringWait}
      </p>
    </div>
  );

  if (!overlay) return card;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scotia-mist/80 px-4 backdrop-blur-sm">
      {card}
    </div>
  );
}
