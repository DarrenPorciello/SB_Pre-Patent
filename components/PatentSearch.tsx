"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { findSessionByPatentId, sessionPath } from "@/lib/sessions";
import { useLanguage } from "./LanguageProvider";

export function PatentSearch() {
  const { t } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const id = query.trim();
    if (!/^\d{6}$/.test(id)) {
      setError(t.searchInvalid);
      return;
    }
    const session = findSessionByPatentId(id);
    if (!session) {
      setError(t.searchNotFound);
      return;
    }
    setError("");
    router.push(sessionPath(session));
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-md">
      <label htmlFor="patent-search" className="text-sm font-medium text-scotia-ink">
        {t.searchLabel}
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="patent-search"
          inputMode="numeric"
          autoComplete="off"
          maxLength={6}
          value={query}
          placeholder={t.searchPlaceholder}
          onChange={(event) => {
            setQuery(event.target.value.replace(/\D/g, "").slice(0, 6));
            setError("");
          }}
          className="w-full rounded-full border border-scotia-line bg-white px-4 py-3 font-mono text-sm tracking-wider text-scotia-ink outline-none placeholder:font-sans placeholder:tracking-normal focus:border-scotia-ink"
        />
        <button
          type="submit"
          className="rounded-full bg-scotia-ink px-5 py-3 text-sm font-semibold text-white hover:bg-black"
        >
          {t.searchAction}
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-scotia-red">{error}</p> : null}
    </form>
  );
}
