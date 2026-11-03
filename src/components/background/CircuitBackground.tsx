"use client";

import { useEffect, useRef } from "react";
import { useChipStore } from "@/components/three/chipStore";
import { useFxStore } from "@/lib/fxStore";

/**
 * Lapisan latar bergerak (z-0, di belakang chip & konten). Mesin Canvas 2D dimuat dinamis dan baru
 * dijalankan setelah halaman selesai dimuat + idle, dan setelah intro selesai, supaya tidak mengganggu
 * LCP/intro. `prefers-reduced-motion`: tidak dijalankan sama sekali (grid CSS statis tetap tampil).
 */
export function CircuitBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mode = useFxStore((s) => s.mode);

  useEffect(() => {
    const canvas = ref.current;
    // Mode Ringan: tidak ada mesin; grid CSS statis tampil.
    if (!canvas || mode === "lite") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let stopEngine: (() => void) | null = null;
    let unsubscribe: (() => void) | null = null;
    let idleId: number | undefined;
    let starting = false;

    const start = async () => {
      if (starting || stopEngine || cancelled || reduce.matches) return;
      starting = true;
      const { startCircuitBackground } = await import("./engine");
      starting = false;
      if (cancelled || stopEngine || reduce.matches) return;
      stopEngine = startCircuitBackground(canvas, { onGiveUp: () => useFxStore.getState().giveUp() });
    };

    const whenIntroDone = () => {
      const s = useChipStore.getState();
      if (!s.introActive || s.introGone) {
        void start();
        return;
      }
      unsubscribe = useChipStore.subscribe((st) => {
        if (!st.introActive || st.introGone) {
          unsubscribe?.();
          unsubscribe = null;
          void start();
        }
      });
    };

    const schedule = () => {
      if (reduce.matches) return;
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(whenIntroDone, { timeout: 2500 });
      } else {
        idleId = window.setTimeout(whenIntroDone, 600);
      }
    };

    const stop = () => {
      stopEngine?.();
      stopEngine = null;
    };

    const onReduceChange = () => {
      if (reduce.matches) stop();
      else schedule();
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    reduce.addEventListener("change", onReduceChange);

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      reduce.removeEventListener("change", onReduceChange);
      unsubscribe?.();
      if (idleId !== undefined) {
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleId);
        clearTimeout(idleId);
      }
      stop();
    };
  }, [mode]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="site-bg pointer-events-none fixed top-0 left-0 z-0 h-[100lvh] w-full"
    />
  );
}
