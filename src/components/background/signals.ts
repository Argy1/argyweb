/**
 * "Sinyal sirkuit" saat pindah halaman: NavLink memancarkan sinyal dari titik klik, mesin latar
 * (engine.ts) mengubahnya menjadi riak besar yang menyapu grid. Antrean kecil di luar React.
 */
interface Signal {
  x: number;
  y: number;
  at: number;
}

const queue: Signal[] = [];
let lastNavClick = -Infinity;

export function emitSignal(x: number, y: number) {
  const now = performance.now();
  lastNavClick = now;
  if (queue.length < 3) queue.push({ x, y, at: now });
}

/** Menguras antrean; sinyal yang lebih tua dari 600ms (mesin belum berjalan) dibuang agar tidak muncul terlambat. */
export function drainSignals(handle: (x: number, y: number) => void) {
  const now = performance.now();
  while (queue.length) {
    const s = queue.shift()!;
    if (now - s.at < 600) handle(s.x, s.y);
  }
}

/** Apakah baru saja ada klik NavLink (supaya ChipStage tidak menyentak chip dua kali untuk navigasi yang sama). */
export function navClickedRecently(ms = 1500) {
  return performance.now() - lastNavClick < ms;
}
