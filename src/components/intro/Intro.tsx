"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { chipMotion, useChipStore } from "@/components/three/chipStore";
import { ChipAnchor } from "@/components/ui/ChipAnchor";

export const INTRO_KEY = "argy-intro-seen";
const MIN_MS = 1800;
const SLOW_MS = 4000;
const HOLD_MS = 650;
const PART_MARKS = [0.26, 0.5, 0.74, 0.97];
const PART_DOTS = ["var(--navy)", "var(--gold)", "var(--violet)", "var(--steel)"];

function markSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* private mode */
  }
}

/**
 * Overlay intro "chip dirakit" (docs/03 §4). Dirender di server supaya kunjungan pertama tidak berkedip;
 * script kecil di <head> menyembunyikannya lewat html[data-intro="seen"] untuk kunjungan berikutnya.
 */
export function Intro() {
  const t = useTranslations("intro");
  const parts = t.raw("parts") as string[];
  const setIntro = useChipStore((s) => s.setIntro);
  const sceneReady = useChipStore((s) => s.sceneReady);
  const [state, setState] = useState<"running" | "done" | "gone">("running");
  const [pct, setPct] = useState(0);
  const [slow, setSlow] = useState(false);
  const skipRef = useRef<HTMLButtonElement>(null);
  const progress = useRef(0);
  const signals = useRef({ fonts: false, load: false, scene: false });
  const finishing = useRef(false);

  signals.current.scene = sceneReady;

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {
      /* private mode */
    }
    if (seen) {
      setIntro({ introActive: false, introDone: true, introGone: true, introProgress: 1 });
      const raf = requestAnimationFrame(() => setState("gone"));
      return () => cancelAnimationFrame(raf);
    }
    setIntro({ introActive: true, introDone: false, introGone: false, introProgress: 0 });
    skipRef.current?.focus({ preventScroll: true });
    document.documentElement.style.overflow = "hidden";

    document.fonts.ready.then(() => (signals.current.fonts = true));
    if (document.readyState === "complete") signals.current.load = true;
    else window.addEventListener("load", () => (signals.current.load = true), { once: true });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (finishing.current) return;
      const elapsed = performance.now() - start;
      const s = signals.current;
      const real = (s.fonts ? 0.2 : 0) + (s.load ? 0.1 : 0) + (s.scene ? 0.7 : 0);
      if (reduce) {
        if ((s.scene && s.fonts) || elapsed > 1200) finish();
        return;
      }
      const target = Math.min(real, elapsed / MIN_MS);
      progress.current += (target - progress.current) * 0.1;
      if (target >= 1 && progress.current > 0.995) progress.current = 1;
      useChipStore.getState().setIntro({ introProgress: progress.current });
      setPct(Math.floor(progress.current * 100));
      if (elapsed > SLOW_MS && real < 1) setSlow(true);
      if (progress.current >= 1) {
        finishing.current = true;
        chipMotion.flash(1.5);
        window.setTimeout(finish, HOLD_MS);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    finishing.current = true;
    markSeen();
    progress.current = 1;
    setPct(100);
    chipMotion.kick(0.45);
    chipMotion.flash(1.5);
    setIntro({ introProgress: 1, introDone: true });
    setState("done");
    document.documentElement.style.overflow = "";
    window.setTimeout(() => {
      setIntro({ introGone: true });
      setState("gone");
    }, 900);
  }

  if (state === "gone") return null;

  const p = pct / 100;
  // Tahap yang sedang dipasang: Papan (0–26%), Pin (26–50%), Die (50–74%), Tutup (74–97%).
  const idx = Math.max(0, [0, ...PART_MARKS.slice(0, 3)].findLastIndex((m) => p >= m));
  const label = p >= 0.97 ? t("ready") : slow ? t("almost") : t("assembling", { part: parts[idx].toLowerCase() });

  return (
    <div className="intro bg-circuit" data-state={state} aria-hidden={state !== "running"} inert={state !== "running"}>
      <div className="flex items-center justify-between gap-4">
        <span className="font-display text-2xl font-black tracking-[-0.03em]">
          argy<span className="text-blue">.</span>
        </span>
        <button
          ref={skipRef}
          type="button"
          onClick={finish}
          className="min-h-11 rounded-chip border-[1.5px] border-line bg-surface px-[18px] text-sm font-bold text-ink transition-colors hover:border-blue"
        >
          {t("skip")} →
        </button>
      </div>

      <div className="grid flex-1 place-items-center py-4">
        <ChipAnchor id="intro" fallback />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-5">
        <p
          className="m-0 font-display text-[clamp(84px,14vw,190px)] leading-[0.82] font-black tracking-[-0.06em] tabular-nums"
          role="progressbar"
          aria-label={t("progressLabel")}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          {String(pct).padStart(2, "0")}
          <small className="ml-[0.06em] text-[0.32em] tracking-normal text-accent">%</small>
        </p>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <p className="m-0 font-display text-[clamp(20px,2.2vw,28px)] font-extrabold tracking-[-0.02em] sm:text-right" aria-live="polite">
            {label}
          </p>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {parts.map((part, i) => {
              const on = p >= PART_MARKS[i];
              return (
                <span key={part} className="intro-part" data-on={on}>
                  <i style={on ? { background: PART_DOTS[i] } : undefined} />
                  {part}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
