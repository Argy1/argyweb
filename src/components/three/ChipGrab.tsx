"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { useFxStore } from "@/lib/fxStore";
import { chipMotion, useChipStore } from "./chipStore";

/** Tahan jari ini (tanpa bergeser) sebelum masuk mode "pegang chip" (sentuhan). */
const HOLD_MS = 280;
/** Gerak (px) yang dianggap bergeser, bukan menahan. */
const SLOP = 9;
/** Chip yang lebih kecil dari ini (jari-jari px) tidak bisa diputar (anchor kecil di tepi). */
const MIN_RADIUS = 36;
/** Jeda tambahan sebelum pitch kembali setelah keyboard (ms; tombol terus ditekan = bebas melihat). */
const KEY_HOLD_MS = 1800;

type Mode = "idle" | "pending" | "yaw" | "free";

/**
 * Area putar untuk chip 3D (docs/08 §5). Tombol transparan yang mengikuti posisi chip di layar dan hanya aktif
 * saat chip diam dan cukup terlihat, jadi tidak menghalangi konten (anchor chip memang ruang kosong).
 *
 * - Mouse/pena: seret horizontal = putar 360° (yaw); gerak vertikal diabaikan.
 * - Sentuhan: geser kiri-kanan = putar 360°; geser atas-bawah = scroll halaman (touch-action: pan-y);
 *   TAHAN lalu geser = mode "pegang chip" (putar bebas dua sumbu, halaman tidak ikut scroll).
 * - Keyboard: fokus tombol, panah kiri/kanan memutar, atas/bawah membalik, Esc/Home kembali ke pose normal.
 * Setelah dilepas: inersia, lalu pitch kembali ke pose normal (diatur di <Chip>).
 *
 * Posisi, ukuran, dan touch-action ditulis inline (bukan di globals.css): bagian ini menentukan apakah
 * halaman bisa di-scroll, jadi tidak boleh bergantung pada CSS build yang bisa saja basi.
 */
export function ChipGrab() {
  const t = useTranslations("chip");
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.documentElement.hasAttribute("data-chip-debug")) {
      (window as unknown as { __chip: typeof chipMotion }).__chip = chipMotion;
    }

    const drag = chipMotion.drag;
    const calm = () =>
      useFxStore.getState().mode === "lite" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /** Radian per piksel: menyeret selebar chip ≈ setengah putaran, dibatasi supaya nyaman di semua ukuran. */
    const radPerPx = () => Math.min(0.014, Math.max(0.006, Math.PI / Math.max(1, chipMotion.screen.r * 2)));

    // ── Posisi tombol mengikuti chip; aktif hanya saat chip diam dan terlihat.
    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    let shown = false;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const s = chipMotion.screen;
      const intro = useChipStore.getState();
      const introBusy = intro.introActive && !intro.introGone;
      const moved = Math.hypot(s.x - lastX, s.y - lastY);
      lastX = s.x;
      lastY = s.y;
      const ok =
        !introBusy && s.opacity > 0.55 && s.r >= MIN_RADIUS && (moved < 1.5 || drag.active || mode !== "idle");
      if (ok) {
        const size = Math.round(s.r * 1.9);
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.transform = `translate3d(${Math.round(s.x - size / 2)}px, ${Math.round(s.y - size / 2)}px, 0)`;
      }
      if (ok !== shown) {
        shown = ok;
        el.style.visibility = ok ? "visible" : "hidden";
      }
    };
    raf = requestAnimationFrame(loop);

    // ── Pointer: mouse/pena langsung memutar; sentuhan menunggu arah atau tahanan.
    let mode: Mode = "idle";
    let pid = -1;
    let startX = 0;
    let startY = 0;
    let lastPX = 0;
    let lastPY = 0;
    let lastT = 0;
    let holdTimer = 0;

    const begin = (next: "yaw" | "free") => {
      mode = next;
      drag.active = true;
      el.dataset.grab = next;
      if (next === "free") {
        navigator.vibrate?.(10);
        chipMotion.flash(0.6);
      }
    };
    const release = () => {
      window.clearTimeout(holdTimer);
      const now = performance.now();
      // Berhenti sejenak sebelum dilepas = tanpa inersia.
      if (now - lastT > 90 || calm()) {
        drag.vYaw = 0;
        drag.vPitch = 0;
      }
      drag.active = false;
      drag.releasedAt = now;
      mode = "idle";
      delete el.dataset.grab;
      if (pid !== -1) {
        try {
          el.releasePointerCapture(pid);
        } catch {
          /* sudah dilepas */
        }
      }
      pid = -1;
    };

    const onDown = (e: PointerEvent) => {
      if (pid !== -1) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pid = e.pointerId;
      startX = lastPX = e.clientX;
      startY = lastPY = e.clientY;
      lastT = e.timeStamp;
      drag.vYaw = 0;
      drag.vPitch = 0;
      drag.reset = false;
      try {
        el.setPointerCapture(pid);
      } catch {
        /* abaikan */
      }
      if (e.pointerType === "touch") {
        mode = "pending";
        holdTimer = window.setTimeout(() => {
          if (pid !== -1 && mode === "pending") begin("free");
        }, HOLD_MS);
      } else {
        begin("yaw");
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      let dx = e.clientX - lastPX;
      let dy = e.clientY - lastPY;
      const dtMs = Math.max(1, e.timeStamp - lastT);
      lastPX = e.clientX;
      lastPY = e.clientY;
      lastT = e.timeStamp;

      if (mode === "pending") {
        const tx = e.clientX - startX;
        const ty = e.clientY - startY;
        if (Math.hypot(tx, ty) < SLOP) return;
        window.clearTimeout(holdTimer);
        if (Math.abs(tx) > Math.abs(ty) * 1.2) {
          begin("yaw");
          dx = tx; // terapkan gerak yang tadi masih di dalam "slop" supaya tidak melompat
          dy = 0;
        } else {
          release(); // vertikal = scroll biasa (browser juga akan mengirim pointercancel)
          return;
        }
      }
      if (mode !== "yaw" && mode !== "free") return;

      const k = radPerPx();
      drag.dyaw += dx * k;
      const frames = dtMs / 16.67;
      drag.vYaw = drag.vYaw * 0.5 + ((dx * k) / frames) * 0.5;
      if (mode === "free") {
        drag.dpitch += dy * k;
        drag.vPitch = drag.vPitch * 0.5 + ((dy * k) / frames) * 0.5;
      }
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerId === pid) release();
    };

    // Mode "pegang": halaman tidak boleh ikut scroll. React memasang listener touchmove sebagai pasif,
    // jadi harus listener asli non-pasif.
    const onTouchMove = (e: TouchEvent) => {
      if (mode === "free" && e.cancelable) e.preventDefault();
    };

    // ── Keyboard
    const onKey = (e: KeyboardEvent) => {
      const step = 0.22;
      let handled = true;
      switch (e.key) {
        case "ArrowLeft":
          drag.dyaw -= step;
          if (!calm()) drag.vYaw -= 0.02;
          break;
        case "ArrowRight":
          drag.dyaw += step;
          if (!calm()) drag.vYaw += 0.02;
          break;
        case "ArrowUp":
          drag.dpitch -= step;
          break;
        case "ArrowDown":
          drag.dpitch += step;
          break;
        case "Escape":
        case "Home":
          drag.reset = true;
          break;
        default:
          handled = false;
      }
      if (!handled) return;
      e.preventDefault();
      if (e.key !== "Escape" && e.key !== "Home") drag.releasedAt = performance.now() + KEY_HOLD_MS;
    };

    const onContext = (e: Event) => e.preventDefault();

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("keydown", onKey);
    el.addEventListener("contextmenu", onContext);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(holdTimer);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("keydown", onKey);
      el.removeEventListener("contextmenu", onContext);
      drag.active = false;
    };
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      aria-label={t("label")}
      className="chip-grab"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        zIndex: 20,
        visibility: "hidden",
        margin: 0,
        padding: 0,
        border: 0,
        borderRadius: "50%",
        background: "transparent",
        cursor: "grab",
        touchAction: "pan-y",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    />
  );
}
