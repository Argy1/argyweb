"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { invalidateAnchors, startAnchorTracking, stopAnchorTracking } from "./anchorTracker";
import { navClickedRecently } from "@/components/background/signals";
import { notifyRouteCommitted } from "@/lib/pageTransition";
import { useFxStore } from "@/lib/fxStore";
import { chipMotion, useChipStore } from "./chipStore";

const ChipCanvas = dynamic(() => import("./ChipCanvas"), { ssr: false });

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Canvas 3D persisten di layout: tidak di-unmount saat pindah halaman (docs/04). */
export function ChipStage() {
  const webgl = useChipStore((s) => s.webgl);
  const setWebgl = useChipStore((s) => s.setWebgl);
  const setSceneReady = useChipStore((s) => s.setSceneReady);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const firstPath = useRef(true);
  const [debug] = useState(() => typeof window !== "undefined" && /[?&]chipdebug\b/.test(window.location.search));

  // Kunjungan tanpa intro: scene 3D dimulai saat browser idle supaya tidak bersaing dengan render
  // konten pertama. Dengan intro, langsung dimulai karena progres intro menunggu scene.
  useEffect(() => {
    const ok = detectWebGL();
    document.documentElement.dataset.webgl = ok ? "on" : "off";
    if (!ok) {
      setWebgl("off");
      setSceneReady();
      return;
    }
    if (document.documentElement.dataset.intro !== "seen") {
      setWebgl("on");
      return;
    }
    const start = () => setWebgl("on");
    // Safari belum punya requestIdleCallback.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
  }, [setWebgl, setSceneReady]);

  useEffect(() => {
    if (debug) document.documentElement.dataset.chipDebug = "";
  }, [debug]);

  useEffect(() => {
    startAnchorTracking();
    return stopAnchorTracking;
  }, []);

  // Pindah halaman: dorongan putaran + pindai ulang anchor setelah render.
  useEffect(() => {
    invalidateAnchors();
    notifyRouteCommitted();
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    document.documentElement.dataset.nav = "";
    // NavLink sudah menyentak chip saat klik; ini untuk navigasi lain (tombol Back/Forward, dsb.).
    if (useFxStore.getState().mode === "full" && !navClickedRecently()) chipMotion.kick(0.6);
  }, [pathname]);

  if (webgl !== "on") return null;
  return <ChipCanvas dark={resolvedTheme === "dark"} />;
}
