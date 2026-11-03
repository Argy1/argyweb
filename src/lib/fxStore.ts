import { create } from "zustand";

/**
 * Mode efek: "full" (default) = latar bergerak, efek kursor, transisi geser, chip berputar saat scroll.
 * "lite" = latar statis, tanpa efek kursor, transisi hanya fade, chip tanpa putaran scroll/tilt kursor.
 *
 * Sumber mode:
 *  - default : belum ada pilihan
 *  - user    : pilihan eksplisit lewat sakelar footer (disimpan di localStorage)
 *  - auto    : mesin latar menyerah karena perangkat tidak mampu (hanya sesi ini, tidak disimpan)
 *  - system  : prefers-reduced-motion (sakelar dikunci)
 */
export type FxMode = "full" | "lite";
export type FxSource = "default" | "user" | "auto" | "system";

const KEY = "argy-fx";

function apply(mode: FxMode) {
  if (typeof document === "undefined") return;
  if (mode === "lite") document.documentElement.dataset.fx = "lite";
  else delete document.documentElement.dataset.fx;
}

interface FxState {
  mode: FxMode;
  source: FxSource;
  /** Toast "perangkat terasa berat" setelah peralihan otomatis. */
  notice: boolean;
  /** Dipanggil sekali di klien (Providers). Mengembalikan fungsi pembersih. */
  hydrate: () => () => void;
  setMode: (mode: FxMode) => void;
  /** Dipanggil mesin latar saat pemantau FPS menyerah. */
  giveUp: () => void;
  dismissNotice: () => void;
}

export const useFxStore = create<FxState>((set, get) => ({
  mode: "full",
  source: "default",
  notice: false,

  hydrate: () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (reduce.matches) {
        apply("lite");
        set({ mode: "lite", source: "system" });
        return;
      }
      // Peralihan otomatis di sesi ini tidak ditimpa oleh pembacaan ulang.
      if (get().source === "auto") return;
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(KEY);
      } catch {
        /* private mode */
      }
      const mode: FxMode = saved === "lite" ? "lite" : "full";
      apply(mode);
      set({ mode, source: saved ? "user" : "default" });
    };
    sync();
    reduce.addEventListener("change", sync);
    return () => reduce.removeEventListener("change", sync);
  },

  setMode: (mode) => {
    if (get().source === "system") return;
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      /* private mode */
    }
    apply(mode);
    set({ mode, source: "user", notice: false });
  },

  giveUp: () => {
    if (get().mode === "lite") return;
    apply("lite");
    set({ mode: "lite", source: "auto", notice: true });
  },

  dismissNotice: () => set({ notice: false }),
}));
