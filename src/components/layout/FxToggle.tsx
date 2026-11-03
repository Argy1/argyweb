"use client";

import { useTranslations } from "next-intl";
import { useFxStore } from "@/lib/fxStore";

/** Sakelar efek Penuh/Ringan di footer. Pilihan disimpan di perangkat; prefers-reduced-motion mengunci ke Ringan. */
export function FxToggle() {
  const t = useTranslations("fx");
  const mode = useFxStore((s) => s.mode);
  const source = useFxStore((s) => s.source);
  const setMode = useFxStore((s) => s.setMode);
  const full = mode === "full";
  const locked = source === "system";

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        role="switch"
        aria-checked={full}
        aria-describedby="fx-hint"
        disabled={locked}
        onClick={() => setMode(full ? "lite" : "full")}
        className="inline-flex min-h-11 items-center gap-2.5 rounded-chip border border-line bg-surface px-3.5 text-sm font-semibold text-ink transition-colors hover:border-blue disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span
          aria-hidden="true"
          className={`relative h-[22px] w-[38px] flex-none rounded-full transition-colors duration-200 ${full ? "bg-blue" : "bg-line"}`}
        >
          <i
            className={`absolute top-[3px] left-[3px] size-4 rounded-full bg-on-dark shadow-[0_1px_3px_var(--shadow)] transition-transform duration-200 ${full ? "translate-x-4" : ""}`}
          />
        </span>
        <span>
          {t("label")}: {full ? t("full") : t("lite")}
        </span>
      </button>
      <span id="fx-hint" className="max-w-[34ch] text-xs leading-snug text-muted">
        {locked ? t("system") : full ? t("hintFull") : t("hintLite")}
      </span>
    </div>
  );
}
