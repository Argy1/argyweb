"use client";

import { useEffect, useRef } from "react";
import { useFxStore } from "@/lib/fxStore";

/**
 * Efek kursor desktop (sorot + jejak percikan). Hanya untuk pointer halus + hover, mode Penuh, dan bukan
 * reduced-motion. Mesin dimuat dinamis setelah halaman selesai dimuat + idle.
 */
export function CursorFx() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mode = useFxStore((s) => s.mode);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || mode === "lite") return;
    if (!window.matchMedia("(pointer: fine) and (hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let stop: (() => void) | null = null;
    let idleId: number | undefined;

    const begin = async () => {
      const { startCursorFx } = await import("./cursorEngine");
      if (cancelled) return;
      stop = startCursorFx(canvas);
    };
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") idleId = window.requestIdleCallback(() => void begin(), { timeout: 2500 });
      else idleId = window.setTimeout(() => void begin(), 600);
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) {
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleId);
        clearTimeout(idleId);
      }
      stop?.();
    };
  }, [mode]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-40 h-[100lvh] w-full"
    />
  );
}
