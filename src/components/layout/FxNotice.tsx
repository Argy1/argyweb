"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useFxStore } from "@/lib/fxStore";
import { CloseIcon } from "@/components/ui/icons";

/** Toast setelah mesin latar menyerah (perangkat terasa berat): menawarkan mencoba efek penuh lagi. */
export function FxNotice() {
  const t = useTranslations("fx");
  const notice = useFxStore((s) => s.notice);
  const dismiss = useFxStore((s) => s.dismissNotice);
  const setMode = useFxStore((s) => s.setMode);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(dismiss, 12000);
    return () => window.clearTimeout(id);
  }, [notice, dismiss]);

  if (!notice) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-pop-in fixed bottom-[calc(env(safe-area-inset-bottom,0px)+16px)] left-4 z-[70] flex max-w-[min(420px,calc(100vw-120px))] items-start gap-3 rounded-lg border border-line bg-surface p-4 text-sm shadow-[0_20px_50px_-20px_var(--shadow)]"
    >
      <div className="flex min-w-0 flex-col gap-2.5">
        <p className="m-0 leading-snug font-semibold">{t("notice")}</p>
        <button
          type="button"
          onClick={() => setMode("full")}
          className="self-start rounded-chip bg-gold px-3.5 py-2 text-[13px] font-bold text-tile-ink"
        >
          {t("tryFull")}
        </button>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t("close")}
        className="grid size-9 flex-none place-items-center rounded-full bg-surface-2"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}
