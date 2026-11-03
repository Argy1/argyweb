"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, type ReactNode } from "react";
import { useFxStore } from "@/lib/fxStore";

export function Providers({ children }: { children: ReactNode }) {
  // Membaca pilihan efek tersimpan + prefers-reduced-motion sekali di klien.
  useEffect(() => useFxStore.getState().hydrate(), []);
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem storageKey="argy-theme">
      {children}
    </ThemeProvider>
  );
}
