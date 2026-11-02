"use client";

import { useLanguage } from "./LanguageProvider";

export function DraftLoading() {
  const { t } = useLanguage();
  return <div className="py-24 text-center text-sm text-scotia-muted">{t.loadingDraft}</div>;
}
