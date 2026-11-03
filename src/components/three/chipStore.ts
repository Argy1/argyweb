import { create } from "zustand";

export type WebGLSupport = "unknown" | "on" | "off";

interface ChipState {
  /** Intro diputar di sesi ini (false = sudah pernah dilihat). */
  introActive: boolean;
  /** Progres loading asli yang sudah di-smooth, 0–1. Dibaca chip untuk tahap perakitan. */
  introProgress: number;
  /** 100% tercapai / dilewati: chip mulai terbang ke anchor halaman. */
  introDone: boolean;
  /** Overlay intro sudah hilang sepenuhnya; canvas kembali ke belakang konten. */
  introGone: boolean;
  /** Frame pertama scene 3D sudah dirender (dipakai sebagai sinyal loading). */
  sceneReady: boolean;
  webgl: WebGLSupport;
  setIntro: (patch: Partial<Pick<ChipState, "introActive" | "introProgress" | "introDone" | "introGone">>) => void;
  setSceneReady: () => void;
  setWebgl: (support: WebGLSupport) => void;
}

export const useChipStore = create<ChipState>((set) => ({
  introActive: false,
  introProgress: 0,
  introDone: false,
  introGone: false,
  sceneReady: false,
  webgl: "unknown",
  setIntro: (patch) => set(patch),
  setSceneReady: () => set({ sceneReady: true }),
  setWebgl: (webgl) => set({ webgl }),
}));

/**
 * Nilai gerak yang berubah tiap frame atau tiap event scroll. Sengaja di luar React/Zustand
 * supaya tidak memicu render ulang.
 */
export const chipMotion = {
  velocity: 0,
  glow: 0,
  /** Posisi & jari-jari chip di layar (px viewport) + opacity, ditulis <Chip> tiap frame; dibaca latar sirkuit. */
  screen: { x: 0, y: 0, r: 0, opacity: 0 },
  /**
   * Putar manual oleh pengguna (seret/sentuh/keyboard). Ditulis <ChipGrab>, dikonsumsi <Chip> tiap frame:
   * delta langsung diterapkan, lalu inersia, lalu pitch kembali ke pose normal (docs/08 §5).
   */
  drag: {
    /** Sedang diseret/ditahan. */
    active: false,
    /** Delta yaw/pitch (rad) yang belum diterapkan. */
    dyaw: 0,
    dpitch: 0,
    /** Kecepatan (rad per frame 60fps) untuk inersia setelah dilepas. */
    vYaw: 0,
    vPitch: 0,
    /** performance.now() saat dilepas; pitch mulai kembali setelah jeda. */
    releasedAt: 0,
    /** Minta pitch kembali ke pose normal segera. */
    reset: false,
  },
  /** Pose saat ini (rad), ditulis <Chip>; dibaca tes lewat window.__chip (hanya dengan ?chipdebug). */
  pose: { yaw: 0, pitch: 0 },
  kick(amount: number) {
    this.velocity += amount;
  },
  flash(amount: number) {
    this.glow = Math.max(this.glow, amount);
  },
};
