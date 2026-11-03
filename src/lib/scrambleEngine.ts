import { useChipStore } from "@/components/three/chipStore";
import { useFxStore } from "@/lib/fxStore";

/**
 * Mesin animasi teks "scramble / decode" untuk judul (docs/08 §5).
 *
 * Teks asli TIDAK diubah: ia tetap di HTML (SEO, pembaca layar, salin, LCP) dan menentukan layout.
 * Saat animasi berjalan teks asli dibuat transparan (`.scr-run`) dan sebuah lapisan `aria-hidden`
 * (`.scr-layer`, anak elemen) menggambar karakter acak tepat di posisi tiap huruf asli, lalu tiap huruf
 * "mengunci" ke huruf aslinya dari kiri ke kanan. Karena layout tidak disentuh, tidak ada layout shift.
 *
 * Satu IntersectionObserver dan satu loop rAF dipakai bersama oleh semua judul di halaman.
 */

// Tanpa kurung kurawal/siku/backslash: terlalu tinggi dan melebar menimpa huruf tetangga.
const GLYPHS = "01<>/#$%&*+=?ABCDEF";
/** Karakter acak sedikit lebih kecil dari huruf asli supaya tidak menimpa tetangganya. */
const GLYPH_SCALE = 0.84;
/** Animasi bersamaan maksimum; sisanya langsung final (scroll cepat tidak membuat jank). */
const MAX_ACTIVE = 6;
/** Elemen harus sepenuhnya keluar layar selama ini sebelum boleh diputar ulang. */
const REPLAY_AFTER_MS = 800;
/** Karakter acak diganti tiap interval ini (bukan tiap frame: lebih tenang dan hemat). */
const TICK_MS = 50;
/** Bagian tinggi elemen yang harus terlihat supaya animasi mulai. */
const START_RATIO = 0.6;

interface Slot {
  node: HTMLElement;
  final: string;
  /** Ukuran font huruf asli, dipulihkan saat huruf mengunci. */
  fontSize: string;
  /** Huruf/angka diacak; tanda baca hanya digambar apa adanya. */
  scramble: boolean;
  lockAt: number;
  locked: boolean;
}

interface Run {
  layer: HTMLElement;
  slots: Slot[];
  start: number;
  duration: number;
  lastTick: number;
}

interface Entry {
  el: HTMLElement;
  /** Terlihat ≥ START_RATIO saat ini. */
  inView: boolean;
  played: number;
  /** Saat elemen sepenuhnya keluar layar; null bila belum/sedang terlihat sebagian. */
  outSince: number | null;
  run: Run | null;
}

const entries = new Map<Element, Entry>();
const runs = new Set<Entry>();
let observer: IntersectionObserver | null = null;
let raf = 0;
let globalsReady = false;
let waitingIntro = false;

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
const isLetterOrDigit = (ch: string) => /[\p{L}\p{N}]/u.test(ch);

function motionAllowed(): boolean {
  if (useFxStore.getState().mode === "lite") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function introPending(): boolean {
  if (document.documentElement.dataset.intro === "seen") return false;
  return !useChipStore.getState().introGone;
}

/** Selesaikan satu animasi: buang lapisan, kembalikan teks asli. */
function finish(entry: Entry) {
  const run = entry.run;
  if (!run) return;
  run.layer.remove();
  entry.el.classList.remove("scr-run");
  delete entry.el.dataset.scr;
  entry.run = null;
  runs.delete(entry);
  entry.played += 1;
  entry.outSince = null;
  entry.el.dataset.scrPlays = String(entry.played);
}

function finishAll() {
  for (const entry of [...runs]) finish(entry);
}

function tick() {
  raf = 0;
  // Satu sumber waktu (sama dengan yang dipakai start()), bukan argumen rAF.
  const now = performance.now();
  for (const entry of [...runs]) {
    const run = entry.run;
    if (!run) continue;
    const t = now - run.start;
    const refresh = now - run.lastTick >= TICK_MS;
    if (refresh) run.lastTick = now;
    let pending = 0;
    for (const slot of run.slots) {
      if (slot.locked) continue;
      if (!slot.scramble || t >= slot.lockAt) {
        slot.node.textContent = slot.final;
        slot.node.style.fontSize = slot.fontSize;
        delete slot.node.dataset.x;
        slot.locked = true;
      } else {
        pending += 1;
        if (refresh) slot.node.textContent = randomGlyph();
      }
    }
    if (pending === 0 && t >= run.duration) finish(entry);
  }
  if (runs.size > 0) raf = requestAnimationFrame(tick);
}

/** Ukur posisi tiap huruf dengan Range, lalu pasang lapisan karakter acak dan mulai animasi. */
function start(entry: Entry) {
  const host = entry.el;
  const hostRect = host.getBoundingClientRect();
  if (hostRect.width < 2 || hostRect.height < 2) return;

  const layer = document.createElement("span");
  layer.className = "scr-layer";
  layer.setAttribute("aria-hidden", "true");

  const range = document.createRange();
  const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement?.closest(".scr-layer") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });

  const measured: { ch: string; r: DOMRect; style: CSSStyleDeclaration }[] = [];
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    const text = node.nodeValue ?? "";
    const parent = node.parentElement;
    if (!parent || text.trim() === "") continue;
    const style = getComputedStyle(parent);
    if (style.visibility === "hidden" || style.display === "none") continue;
    let i = 0;
    for (const ch of text) {
      const len = ch.length;
      if (/\S/.test(ch)) {
        range.setStart(node, i);
        range.setEnd(node, i + len);
        const r = range.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) measured.push({ ch, r, style });
      }
      i += len;
    }
  }
  if (measured.length === 0) return;

  const n = measured.length;
  const duration = Math.min(1100, 520 + 28 * n);
  const slots: Slot[] = measured.map(({ ch, r, style }, index) => {
    const node = document.createElement("span");
    node.className = "scr-ch";
    node.style.left = `${r.left - hostRect.left - host.clientLeft}px`;
    node.style.top = `${r.top - hostRect.top - host.clientTop}px`;
    node.style.width = `${r.width}px`;
    node.style.height = `${r.height}px`;
    node.style.lineHeight = `${r.height}px`;
    // Lapisan ini anak elemen `.scr-run`, yang (beserta turunannya) dibuat transparan dengan !important;
    // warna inline harus !important juga supaya menang.
    node.style.setProperty("color", style.color, "important");
    node.style.fontFamily = style.fontFamily;
    node.style.fontWeight = style.fontWeight;
    const scramble = isLetterOrDigit(ch);
    node.style.fontSize = scramble ? `${parseFloat(style.fontSize) * GLYPH_SCALE}px` : style.fontSize;
    const jitter = (Math.random() - 0.5) * 0.08 * duration;
    const lockAt = 0.18 * duration + 0.82 * duration * (index / n) + (scramble ? jitter : 0);
    if (scramble) {
      node.dataset.x = "1";
      node.textContent = randomGlyph();
    } else {
      node.textContent = ch;
    }
    layer.appendChild(node);
    return { node, final: ch, fontSize: style.fontSize, scramble, lockAt: Math.max(60, lockAt), locked: !scramble };
  });

  host.appendChild(layer);
  host.classList.add("scr-run");
  host.dataset.scr = "run";
  const now = performance.now();
  entry.run = { layer, slots, start: now, duration, lastTick: now };
  runs.add(entry);
  if (!raf) raf = requestAnimationFrame(tick);
}

function tryStart(entry: Entry) {
  if (entry.run || !entry.el.isConnected) return;
  if (!motionAllowed() || document.hidden) return;
  if (introPending()) {
    waitForIntro();
    return;
  }
  if (runs.size >= MAX_ACTIVE) return;
  const go = () => {
    // Keadaan bisa berubah selama menunggu font.
    if (!entry.inView || entry.run || !entry.el.isConnected || !motionAllowed() || runs.size >= MAX_ACTIVE) return;
    start(entry);
  };
  if (document.fonts && document.fonts.status !== "loaded") void document.fonts.ready.then(go);
  else go();
}

/** Hero baru "terdekode" setelah overlay intro hilang. */
function waitForIntro() {
  if (waitingIntro) return;
  waitingIntro = true;
  const unsub = useChipStore.subscribe((s) => {
    if (!s.introGone) return;
    unsub();
    waitingIntro = false;
    for (const entry of entries.values()) if (entry.inView && entry.played === 0) tryStart(entry);
  });
}

function onIntersect(list: IntersectionObserverEntry[]) {
  const now = performance.now();
  for (const io of list) {
    const entry = entries.get(io.target);
    if (!entry) continue;
    if (!io.isIntersecting || io.intersectionRatio === 0) {
      // Sepenuhnya keluar layar: catat waktunya, hentikan animasi yang masih berjalan.
      entry.inView = false;
      entry.outSince ??= now;
      finish(entry);
      continue;
    }
    if (io.intersectionRatio >= START_RATIO) {
      if (entry.inView) continue;
      entry.inView = true;
      const leftLongEnough = entry.outSince !== null && now - entry.outSince >= REPLAY_AFTER_MS;
      if (entry.played === 0 || leftLongEnough) tryStart(entry);
    } else {
      // Terlihat sebagian: bukan "keluar layar", jadi tidak boleh memutar ulang bila kembali.
      entry.inView = false;
      entry.outSince = null;
    }
  }
}

function setupGlobals() {
  if (globalsReady) return;
  globalsReady = true;
  // Mode Ringan (termasuk reduced-motion) atau resize: selesaikan semua animasi seketika.
  useFxStore.subscribe((s) => {
    if (s.mode === "lite") finishAll();
  });
  // Di HP, `resize` juga menyala saat bilah URL mengecil/membesar; hanya perubahan lebar yang membuat
  // posisi huruf terukur jadi usang.
  let lastWidth = window.innerWidth;
  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      finishAll();
    },
    { passive: true },
  );
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) finishAll();
  });
}

/** Daftarkan elemen judul. Mengembalikan fungsi pembersih. */
export function registerScramble(el: HTMLElement): () => void {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return () => {};
  setupGlobals();
  observer ??= new IntersectionObserver(onIntersect, { threshold: [0, START_RATIO] });
  const entry: Entry = { el, inView: false, played: 0, outSince: null, run: null };
  entries.set(el, entry);
  observer.observe(el);
  return () => {
    finish(entry);
    observer?.unobserve(el);
    entries.delete(el);
  };
}
