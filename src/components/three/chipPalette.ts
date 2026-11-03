// Nilai material chip dari docs/03 §2. Warna 3D tidak bisa membaca CSS custom property langsung,
// jadi nilainya dikumpulkan di sini (sama dengan token brand di tokens.css bila ada padanannya).
export const chipPalette = {
  board: "#121A3A", // = --navy
  copper: "#B88C4D",
  glow: "#5B8CFF", // = --glow
  pins: "#E3B34C", // = --gold
  die: "#1A1440",
  dieGrid: "#8C7BFF",
  lid: "#E1E5EC",
  engraveDark: "#292E3D",
  lightKey: "#FFE2B0",
  lightFill: "#5B8CFF",
  white: "#FFFFFF",
} as const;

/** Ukuran geometri (unit three.js), docs/03 §1. */
export const chipDims = {
  board: { w: 1.9, h: 0.09, r: 0.04 },
  pin: { w: 0.06, h: 0.028, len: 0.2, y: -0.02, perSide: 8, gap: 0.18 },
  die: { w: 0.72, h: 0.06, r: 0.012, y: 0.08 },
  // Radius 0.05 di spesifikasi lebih besar dari setengah tinggi (0.045) dan merusak RoundedBox, jadi 0.04.
  lid: { w: 1.32, h: 0.09, r: 0.04, y: 0.15 },
  engraving: { w: 0.62, h: 0.34 },
  /** Lebar efektif chip yang dipakai untuk menghitung skala dari lebar anchor (termasuk pin & putaran). */
  span: 2.9,
} as const;
