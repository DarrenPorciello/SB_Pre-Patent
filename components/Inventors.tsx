"use client";

import type { Inventor } from "@/lib/types";
import { blankInventor } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

export function InventorsEditor({
  inventors,
  onChange,
  error,
}: {
  inventors: Inventor[];
  onChange: (inventors: Inventor[]) => void;
  error?: boolean;
}) {
  const { t } = useLanguage();
  const update = (id: string, patch: Partial<Inventor>) => {
    onChange(inventors.map((inv) => (inv.id === id ? { ...inv, ...patch } : inv)));
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-scotia-red">5</p>
        <h3 className="mt-1 text-[15px] font-medium text-scotia-ink">
          {t.inventorsTitle}
          <span className="text-scotia-red"> *</span>
        </h3>
        <p className="mt-1 text-sm text-scotia-muted">{t.inventorsHint}</p>
        {error && <p className="mt-2 text-sm text-scotia-red">{t.inventorError}</p>}
      </div>

      {inventors.map((inv, index) => (
        <div key={inv.id} className="rounded-xl border border-scotia-line bg-scotia-mist p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-scotia-ink">{t.inventorN(index + 1)}</p>
            {inventors.length > 1 && (
              <button
                type="button"
                className="text-sm text-scotia-muted hover:text-scotia-red"
                onClick={() => onChange(inventors.filter((item) => item.id !== inv.id))}
              >
                {t.remove}
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-lg border border-scotia-line bg-white px-3 py-2.5 text-sm outline-none focus:border-scotia-ink"
              placeholder={t.fullName}
              value={inv.name}
              onChange={(e) => update(inv.id, { name: e.target.value })}
            />
            <input
              className="rounded-lg border border-scotia-line bg-white px-3 py-2.5 text-sm outline-none focus:border-scotia-ink"
              placeholder={t.workEmail}
              type="email"
              value={inv.email}
              onChange={(e) => update(inv.id, { email: e.target.value })}
            />
            <input
              className="sm:col-span-2 rounded-lg border border-scotia-line bg-white px-3 py-2.5 text-sm outline-none focus:border-scotia-ink"
              placeholder={t.address}
              value={inv.address}
              onChange={(e) => update(inv.id, { address: e.target.value })}
            />
            <input
              className="rounded-lg border border-scotia-line bg-white px-3 py-2.5 text-sm outline-none focus:border-scotia-ink"
              placeholder={t.residency}
              value={inv.residency}
              onChange={(e) => update(inv.id, { residency: e.target.value })}
            />
            <input
              className="rounded-lg border border-scotia-line bg-white px-3 py-2.5 text-sm outline-none focus:border-scotia-ink"
              placeholder={t.nationality}
              value={inv.nationality}
              onChange={(e) => update(inv.id, { nationality: e.target.value })}
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <YesNo
              label={t.employee}
              yesLabel={t.yes}
              noLabel={t.no}
              value={inv.employee}
              onChange={(employee) => update(inv.id, { employee })}
            />
            <YesNo
              label={t.outsideFunding}
              yesLabel={t.yes}
              noLabel={t.no}
              value={inv.outsideFunding}
              onChange={(outsideFunding) => update(inv.id, { outsideFunding })}
            />
          </div>
        </div>
      ))}

      {inventors.length < 5 && (
        <button
          type="button"
          onClick={() => onChange([...inventors, blankInventor()])}
          className="text-sm font-semibold text-scotia-red hover:text-scotia-red-dark"
        >
          {t.addInventor}
        </button>
      )}
    </div>
  );
}

function YesNo({
  label,
  value,
  onChange,
  yesLabel,
  noLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  yesLabel: string;
  noLabel: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-scotia-ink">{label}</p>
      <div className="flex gap-2">
        {(["yes", "no"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`min-w-[72px] rounded-full border px-3 py-1.5 text-sm ${
              value === opt
                ? "border-scotia-red bg-scotia-red text-white"
                : "border-scotia-line bg-white"
            }`}
          >
            {opt === "yes" ? yesLabel : noLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
