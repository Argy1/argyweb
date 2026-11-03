"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";

/** Pill email + tombol salin emas. `onDark` untuk panel navy, `onLight` untuk latar halaman. */
export function CopyEmail({ variant = "onDark" }: { variant?: "onDark" | "onLight" }) {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const mailRef = useRef<HTMLAnchorElement>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Clipboard ditolak: blok alamatnya supaya tinggal Ctrl+C, dan jangan mengaku sudah tersalin.
      const el = mailRef.current;
      const sel = window.getSelection();
      if (el && sel) {
        const range = document.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  }

  const shell =
    variant === "onDark"
      ? "bg-on-dark text-tile-ink"
      : "border-[1.5px] border-line bg-surface text-ink";

  return (
    <div className={`flex min-h-[54px] max-w-full items-center gap-1.5 rounded-chip py-1.5 pr-1.5 pl-4 sm:pl-5 ${shell}`}>
      <a
        ref={mailRef}
        href={`mailto:${profile.email}`}
        className="mr-1 min-w-0 truncate font-mono text-[12.5px] select-all sm:mr-2 sm:text-[15px]"
      >
        {profile.email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={t("copyLabel")}
        className="min-h-[42px] flex-none rounded-chip bg-gold px-3.5 font-bold text-tile-ink sm:px-[18px]"
      >
        <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
      </button>
    </div>
  );
}
