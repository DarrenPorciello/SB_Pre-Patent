"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScotiaLogo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "./LanguageProvider";
import { useAdmin } from "./AdminProvider";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  const { isAdmin } = useAdmin();
  const pathname = usePathname();

  return (
    <header className="border-b border-scotia-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-4">
          <ScotiaLogo />
          <span className="hidden h-6 w-px bg-scotia-line sm:block" />
          <p className="hidden text-sm text-scotia-muted sm:block">{t.prePatentScreening}</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/patents"
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                pathname === "/patents"
                  ? "bg-scotia-ink text-white"
                  : "text-scotia-ink hover:bg-scotia-mist"
              }`}
            >
              {t.existingPatents}
            </Link>
          )}
          <LanguageToggle />
          <span className="rounded-full border border-scotia-red/20 bg-scotia-red/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-scotia-red">
            {t.confidential}
          </span>
          {!compact && (
            <Link
              href="/apply?new=1"
              className="rounded-full bg-scotia-red px-4 py-2 text-sm font-semibold text-white hover:bg-scotia-red-dark"
            >
              {t.startDisclosure}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-scotia-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-scotia-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{t.footerInternal}</p>
        <p>{t.footerHigh}</p>
      </div>
    </footer>
  );
}
