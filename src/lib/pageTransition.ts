/**
 * Transisi pindah halaman lewat View Transitions API browser (tanpa bergantung pada integrasi React).
 *
 * runNavTransition(arah, navigasi): memulai transisi, menjalankan navigasi (router.push) di dalam callback,
 * lalu menahan transisi sampai halaman baru benar-benar tampil (notifyRouteCommitted dipanggil ChipStage
 * saat pathname berubah). Ada batas waktu supaya layar tidak pernah tertahan lama.
 * Browser tanpa API ini, atau reduced-motion → navigasi langsung tanpa transisi.
 */
export type NavDirection = "forward" | "back";

type VTDocument = Document & { startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> } };

let release: (() => void) | null = null;

export function runNavTransition(direction: NavDirection, navigate: () => void) {
  const doc = document as VTDocument;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduce || release) {
    navigate();
    return;
  }
  const root = document.documentElement;
  root.dataset.navDir = direction;
  root.dataset.vt = "";
  const transition = doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        const done = () => {
          release = null;
          resolve();
        };
        release = done;
        window.setTimeout(done, 1500);
        navigate();
      }),
  );
  const cleanup = () => {
    delete root.dataset.navDir;
    delete root.dataset.vt;
  };
  transition.finished.then(cleanup, cleanup);
}

/**
 * Dipanggil setelah rute baru ter-commit; melepas transisi yang menunggu. Sengaja setTimeout, bukan
 * requestAnimationFrame: selama callback transisi menunggu, browser menangguhkan rendering sehingga rAF tidak jalan.
 */
export function notifyRouteCommitted() {
  const fn = release;
  if (!fn) return;
  window.setTimeout(fn, 40);
}
