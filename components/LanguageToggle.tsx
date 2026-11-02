"use client";

import { LOCALES } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className="inline-flex rounded-full border border-scotia-line bg-scotia-mist p-0.5"
      role="group"
      aria-label={t.language}
    >
      {LOCALES.map((item) => {
        const active = locale === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setLocale(item.id)}
            aria-pressed={active}
            className={`min-w-[2.25rem] rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
              active
                ? "bg-scotia-ink text-white"
                : "text-scotia-muted hover:text-scotia-ink"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
