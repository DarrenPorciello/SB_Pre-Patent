"use client";

import type { Question } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

interface FieldProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  error?: boolean;
}

export function Field({ question, value, onChange, error }: FieldProps) {
  const { t } = useLanguage();
  const textValue = Array.isArray(value) ? "" : value;
  const listValue = Array.isArray(value) ? value : [];
  const ring = error
    ? "border-scotia-red ring-2 ring-scotia-red/15"
    : "border-scotia-line focus-within:border-scotia-ink";

  return (
    <div className="space-y-2">
      <label className="block" htmlFor={question.id}>
        <span className="flex flex-wrap items-baseline gap-x-2">
          {question.number && (
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-scotia-red">
              {question.number}
            </span>
          )}
          <span className="text-[15px] font-medium leading-snug text-scotia-ink">
            {question.label}
            {question.required && <span className="text-scotia-red"> *</span>}
          </span>
        </span>
      </label>
      {question.hint && (
        <p className="text-sm leading-relaxed text-scotia-muted">{question.hint}</p>
      )}

      {question.type === "textarea" && (
        <textarea
          id={question.id}
          rows={question.rows ?? 4}
          value={textValue}
          placeholder={question.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full resize-y rounded-lg border bg-white px-3.5 py-3 text-sm leading-relaxed text-scotia-ink outline-none placeholder:text-neutral-400 ${ring}`}
        />
      )}

      {question.type === "text" && (
        <input
          id={question.id}
          type="text"
          value={textValue}
          placeholder={question.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-scotia-ink outline-none placeholder:text-neutral-400 ${ring}`}
        />
      )}

      {question.type === "date" && (
        <input
          id={question.id}
          type="date"
          value={textValue}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full max-w-xs rounded-lg border bg-white px-3.5 py-2.5 text-sm text-scotia-ink outline-none ${ring}`}
        />
      )}

      {question.type === "select" && (
        <select
          id={question.id}
          value={textValue}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full max-w-md rounded-lg border bg-white px-3.5 py-2.5 text-sm text-scotia-ink outline-none ${ring}`}
        >
          <option value="">{t.select}</option>
          {question.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {question.type === "yesno" && (
        <div className="flex gap-2">
          {(["yes", "no"] as const).map((opt) => {
            const selected = textValue === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                className={`min-w-[88px] rounded-full border px-4 py-2 text-sm font-medium ${
                  selected
                    ? "border-scotia-red bg-scotia-red text-white"
                    : "border-scotia-line bg-white text-scotia-ink hover:border-scotia-ink"
                }`}
              >
                {opt === "yes" ? t.yes : t.no}
              </button>
            );
          })}
        </div>
      )}

      {question.type === "radio" && (
        <div className="grid gap-2">
          {question.options?.map((opt) => {
            const selected = textValue === opt.value;
            return (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 text-sm ${
                  selected
                    ? "border-scotia-red bg-scotia-red/5"
                    : "border-scotia-line bg-white hover:border-neutral-400"
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  className="mt-0.5 accent-[#EC111A]"
                  checked={selected}
                  onChange={() => onChange(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}

      {question.type === "checkbox" && (
        <div className="grid gap-2">
          {question.options?.map((opt) => {
            const selected = listValue.includes(opt.value);
            return (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 text-sm ${
                  selected
                    ? "border-scotia-red bg-scotia-red/5"
                    : "border-scotia-line bg-white hover:border-neutral-400"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-0.5 accent-[#EC111A]"
                  checked={selected}
                  onChange={() => {
                    const next = selected
                      ? listValue.filter((v) => v !== opt.value)
                      : [...listValue, opt.value];
                    onChange(next);
                  }}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
