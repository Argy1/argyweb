"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { CloseIcon, ExternalIcon } from "./icons";

export interface LightboxItem {
  title: string;
  subtitle?: string;
  image?: string;
  file?: string;
  extra?: ReactNode;
}

/** Dialog modal untuk gambar atau PDF (sertifikat, screenshot proyek). */
export function Lightbox({ item, onClose, openFileLabel }: { item: LightboxItem | null; onClose: () => void; openFileLabel?: string }) {
  const t = useTranslations("project");
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const handleClose = useCallback(() => onClose(), [onClose]);
  useFocusTrap(ref, Boolean(item), handleClose, closeRef);

  useEffect(() => {
    if (!item) {
      returnFocus.current?.focus({ preventScroll: true });
      returnFocus.current = null;
      return;
    }
    returnFocus.current ??= document.activeElement as HTMLElement;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [item]);

  if (!item) return null;
  const src = item.file ?? item.image;

  // Portal ke body: <main> adalah stacking context (z-2), sehingga tanpa portal navbar (z-30) menimpa dialog ini.
  return createPortal(
    <div className="animate-fade-in fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-(--scrim) backdrop-blur-[6px]" onClick={handleClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
        className="animate-pop-in relative flex max-h-full w-full max-w-[1000px] flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-[0_30px_70px_-30px_var(--shadow)]"
      >
        <div className="flex items-center gap-3 border-b border-line py-3 pr-3 pl-5">
          <div className="min-w-0">
            <p id="lightbox-title" className="m-0 truncate font-display text-lg font-extrabold">
              {item.title}
            </p>
            {item.subtitle && <p className="m-0 truncate text-sm text-muted">{item.subtitle}</p>}
          </div>
          <div className="ml-auto flex flex-none items-center gap-2">
            {src && openFileLabel && (
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden min-h-11 items-center gap-1.5 rounded-chip border border-line px-4 text-sm font-bold hover:border-blue sm:inline-flex"
              >
                {openFileLabel}
                <ExternalIcon size={14} />
              </a>
            )}
            <button
              ref={closeRef}
              type="button"
              onClick={handleClose}
              aria-label={t("close")}
              className="grid size-11 place-items-center rounded-full bg-surface-2"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-surface-2">
          {/* Gambar didahulukan: iframe PDF tidak tampil di banyak browser (terutama HP). PDF asli tetap lewat tombol "buka file". */}
          {item.image ? (
            <div className="relative h-[75svh] w-full">
              <Image src={item.image} alt={item.title} fill sizes="(max-width: 1000px) 100vw, 1000px" className="object-contain" />
            </div>
          ) : item.file ? (
            <iframe src={`${item.file}#view=FitH`} title={item.title} className="block h-[75svh] w-full border-0" />
          ) : null}
        </div>
        {(item.extra || (src && openFileLabel)) && (
          <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-3 text-sm text-muted">
            {item.extra}
            {src && openFileLabel && (
              <a href={src} target="_blank" rel="noopener noreferrer" className="ml-auto font-bold text-accent sm:hidden">
                {openFileLabel} ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
