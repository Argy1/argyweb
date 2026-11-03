// Palet latar dibaca dari token CSS (tema terang/gelap); dipakai mesin latar dan efek kursor.
export type RGB = [number, number, number];

export interface Palette {
  grid: RGB;
  gridA: number;
  dotA: number;
  primary: RGB;
  gold: RGB;
  violet: RGB;
  dark: boolean;
}

export function parseColor(raw: string): { rgb: RGB; a: number } {
  const s = raw.trim();
  if (s.startsWith("#")) {
    let hex = s.slice(1);
    if (hex.length === 3) hex = hex.replace(/./g, (c) => c + c);
    const n = parseInt(hex.slice(0, 6), 16);
    return { rgb: [(n >> 16) & 255, (n >> 8) & 255, n & 255], a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1 };
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { rgb: [p[0] ?? 0, p[1] ?? 0, p[2] ?? 0], a: p[3] ?? 1 };
  }
  return { rgb: [128, 128, 128], a: 1 };
}

export function readPalette(): Palette {
  const root = document.documentElement;
  const cs = getComputedStyle(root);
  const token = (name: string) => parseColor(cs.getPropertyValue(name));
  const dark = root.dataset.theme === "dark";
  const grid = token("--grid");
  return {
    grid: grid.rgb,
    gridA: grid.a,
    dotA: token("--dot").a,
    primary: token(dark ? "--glow" : "--blue").rgb,
    gold: token("--gold").rgb,
    violet: token("--violet").rgb,
    dark,
  };
}

export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
export const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${clamp(a, 0, 1).toFixed(3)})`;
export function mixRgba(a: RGB, b: RGB, t: number, alpha: number) {
  const k = 1 - t;
  return `rgba(${(a[0] * k + b[0] * t) | 0},${(a[1] * k + b[1] * t) | 0},${(a[2] * k + b[2] * t) | 0},${clamp(alpha, 0, 1).toFixed(3)})`;
}
