import { chipMotion, useChipStore } from "./chipStore";

/**
 * Memilih anchor chip yang aktif dan membaca posisinya (docs/03 §5).
 *
 * - Setiap section yang ikut koreografi diberi `data-chip-section="<id anchor>"`.
 * - Section aktif = section terakhir (urutan dokumen) yang tepi atasnya sudah melewati 55% tinggi viewport.
 * - Anchor section itu (`[data-chip-anchor="<id>"]`) dipakai; kalau anchor disembunyikan CSS (lebar 0),
 *   chip fade out. Selama intro, anchor `intro` selalu menang.
 */

export interface ChipTarget {
  id: string | null;
  /** Pusat & ukuran anchor dalam piksel viewport. */
  cx: number;
  cy: number;
  w: number;
  h: number;
  opacity: number;
  visible: boolean;
}

const HIDDEN: ChipTarget = { id: null, cx: 0, cy: 0, w: 0, h: 0, opacity: 0, visible: false };

let activeEl: HTMLElement | null = null;
let activeId: string | null = null;
let dirty = true;
let lastScrollY = 0;
let started = 0;
let reduceMotion = false;
let mutationObserver: MutationObserver | null = null;

function markDirty() {
  dirty = true;
}

function onScroll() {
  dirty = true;
  const y = window.scrollY;
  if (!reduceMotion) {
    const next = chipMotion.velocity + (y - lastScrollY) * 0.004;
    chipMotion.velocity = Math.max(-0.35, Math.min(0.35, next));
  }
  lastScrollY = y;
}

export function startAnchorTracking() {
  started += 1;
  if (started > 1) return;
  reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  lastScrollY = window.scrollY;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", markDirty);
  mutationObserver = new MutationObserver(markDirty);
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}

export function stopAnchorTracking() {
  started -= 1;
  if (started > 0) return;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", markDirty);
  mutationObserver?.disconnect();
  mutationObserver = null;
}

export function invalidateAnchors() {
  dirty = true;
}

function pickAnchor(): { el: HTMLElement | null; id: string | null } {
  const { introActive, introDone } = useChipStore.getState();
  if (introActive && !introDone) {
    const el = document.querySelector<HTMLElement>('[data-chip-anchor="intro"]');
    if (el) return { el, id: "intro" };
  }

  const sections = document.querySelectorAll<HTMLElement>("[data-chip-section]");
  if (sections.length === 0) return { el: null, id: null };
  // Di < 1024px anchor stage berada di awal section (di bawah garis 55% ia masih di luar/tepi layar),
  // jadi garis dinaikkan: chip mendarat saat anchor mulai masuk layar, bukan sesudah ia hampir lewat.
  const line = window.innerHeight * (window.innerWidth < 1024 ? 0.72 : 0.55);
  let active: HTMLElement = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top < line) active = section;
  }
  const id = active.dataset.chipSection ?? null;
  if (!id) return { el: null, id: null };
  // Satu section boleh punya dua anchor dengan id sama (stage untuk < 1024px, gutter untuk desktop;
  // CSS menyembunyikan salah satunya). Pakai yang pertama terlihat; kalau semuanya tersembunyi, chip fade out.
  const candidates = document.querySelectorAll<HTMLElement>(`[data-chip-anchor="${id}"]`);
  let el: HTMLElement | null = candidates[0] ?? null;
  for (const c of candidates) {
    if (c.offsetWidth > 1) {
      el = c;
      break;
    }
  }
  return { el, id };
}

let frame = 0;

/** Dipanggil tiap frame oleh scene 3D. */
export function readChipTarget(): ChipTarget {
  frame += 1;
  if (dirty || frame % 20 === 0 || (activeEl && !activeEl.isConnected)) {
    const picked = pickAnchor();
    activeEl = picked.el;
    activeId = picked.id;
    dirty = false;
  }
  if (!activeEl) return HIDDEN;
  const r = activeEl.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return { ...HIDDEN, id: activeId };
  const opacity = Number(activeEl.dataset.chipOpacity ?? "1");
  return {
    id: activeId,
    cx: r.left + r.width / 2,
    cy: r.top + r.height / 2,
    w: r.width,
    h: r.height,
    opacity: Number.isFinite(opacity) ? opacity : 1,
    visible: true,
  };
}
