"use client";

import { createElement, useCallback, type ReactNode } from "react";
import { registerScramble } from "@/lib/scrambleEngine";

interface ScrambleProps {
  /** Tag yang dirender. `span` dibuat `inline-block` supaya posisi lapisan karakter akurat (juga di dalam tautan). */
  as?: "h1" | "h2" | "h3" | "span";
  id?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Judul dengan animasi teks "scramble / decode" saat masuk layar (src/lib/scrambleEngine.ts).
 * Teks asli tetap ada di HTML dan tidak diubah; animasi hanya menggambar lapisan `aria-hidden` di atasnya.
 *
 * Untuk teks di dalam tautan kartu pakai `as="span"` DI DALAM tautan; jangan menjadikan tautannya `relative`
 * (pola stretched link `after:absolute after:inset-0` bergantung pada kartu sebagai induk berposisi).
 */
export function Scramble({ as = "span", id, className, children }: ScrambleProps) {
  // Callback ref stabil: React 19 memanggil fungsi pembersih yang dikembalikan saat elemen dilepas.
  const setRef = useCallback((el: HTMLElement | null) => (el ? registerScramble(el) : undefined), []);
  // `span` perlu `inline-block` agar posisi lapisan akurat, kecuali className sudah menentukan display sendiri.
  const hasDisplay = /(^|\s)(block|flex|grid|inline-block|inline-flex)(\s|$)/.test(className ?? "");
  const base = as === "span" && !hasDisplay ? "relative inline-block" : "relative";
  return createElement(as, { ref: setRef, id, className: className ? `${base} ${className}` : base }, children);
}
