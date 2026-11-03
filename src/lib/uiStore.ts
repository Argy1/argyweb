import { create } from "zustand";

interface UIState {
  chatOpen: boolean;
  /** Pertanyaan yang dikirim otomatis saat panel chat terbuka (tombol "Tanya AI soal proyek ini"). */
  pendingQuestion: string | null;
  /** Elemen yang membuka chat, untuk mengembalikan fokus saat ditutup. */
  chatReturnFocus: HTMLElement | null;
  /** Slug proyek di panel intip Beranda. */
  peekSlug: string | null;
  openChat: (opts?: { question?: string; returnFocus?: HTMLElement | null }) => void;
  closeChat: () => void;
  takePendingQuestion: () => string | null;
  setPeek: (slug: string | null) => void;
}

export const useUI = create<UIState>((set, get) => ({
  chatOpen: false,
  pendingQuestion: null,
  chatReturnFocus: null,
  peekSlug: null,
  openChat: (opts) =>
    set({
      chatOpen: true,
      pendingQuestion: opts?.question ?? get().pendingQuestion,
      chatReturnFocus:
        opts?.returnFocus ?? (typeof document !== "undefined" ? (document.activeElement as HTMLElement) : null),
    }),
  closeChat: () => {
    const target = get().chatReturnFocus;
    set({ chatOpen: false, chatReturnFocus: null });
    if (target && typeof target.focus === "function") requestAnimationFrame(() => target.focus());
  },
  takePendingQuestion: () => {
    const q = get().pendingQuestion;
    if (q) set({ pendingQuestion: null });
    return q;
  },
  setPeek: (peekSlug) => set({ peekSlug }),
}));
