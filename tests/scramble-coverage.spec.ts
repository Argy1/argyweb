import { expect, test } from "@playwright/test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Penjaga cakupan: setiap judul (<h1>/<h2>/<h3>) di kode sumber harus memakai <Scramble>, kecuali yang
 * memang dikecualikan. Dibuat setelah H1 halaman Tentang terlewat saat animasi judul dipasang.
 * Tes ini murni membaca berkas (tanpa browser), jadi cepat dan tidak peka waktu.
 */

const ROOT = join(__dirname, "..", "src");

/** Judul yang sengaja tidak beranimasi: alasan wajib ditulis. */
const EXEMPT: { file: RegExp; reason: string }[] = [
  { file: /app[\\/]not-found\.tsx$/, reason: "404 tingkat akar (di luar [locale], server murni, dua bahasa)" },
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : /\.tsx$/.test(name) ? [p] : [];
  });
}

test("semua judul memakai <Scramble> (kecuali yang dikecualikan atau sr-only)", () => {
  const offenders: string[] = [];
  for (const file of walk(ROOT)) {
    if (EXEMPT.some((e) => e.file.test(file))) continue;
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (!/<h[1-3][\s>]/.test(line)) return;
      // Judul khusus pembaca layar (sr-only) tidak terlihat, jadi tidak perlu animasi.
      const context = lines.slice(i, i + 3).join(" ");
      if (/sr-only/.test(context)) return;
      offenders.push(`${file.replace(ROOT, "src")}:${i + 1}  ${line.trim()}`);
    });
  }
  expect(offenders, "judul tanpa <Scramble>").toEqual([]);
});
