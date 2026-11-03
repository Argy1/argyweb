"use client";

/**
 * Script inline yang jalan saat HTML di-parse (sebelum paint). Di klien type-nya text/plain supaya React
 * tidak memperingatkan <script> yang dirender; suppressHydrationWarning menerima perbedaan type itu.
 * Pola dari docs Next.js "Preventing flash before hydration".
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
