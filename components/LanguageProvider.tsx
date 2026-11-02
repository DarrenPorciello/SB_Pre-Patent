"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isLocale, LANGUAGE_KEY, messages, type Locale, type Messages } from "@/lib/i18n";

const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
}>({
  locale: "en",
  setLocale: () => {},
  t: messages.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (isLocale(stored)) setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LANGUAGE_KEY, next);
  };

  const value = useMemo(
    () => ({ locale, setLocale, t: messages[locale] }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
