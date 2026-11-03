import { expect, test, type Page } from "@playwright/test";

/**
 * Cek visual (docs/07): tiap rute × bahasa × tema × lebar.
 * - tidak ada scroll horizontal
 * - chip (anchor aktif) tidak bertumpuk dengan teks
 * Screenshot disimpan di tests/__screenshots__/ untuk ditinjau manual.
 */

const widths = [360, 768, 1280, 1440];
const themes = ["light", "dark"] as const;
const routes = [
  { name: "home", id: "/id", en: "/en" },
  { name: "work", id: "/id/karya", en: "/en/work" },
  { name: "project", id: "/id/karya/smart-city-traffic", en: "/en/work/smart-city-traffic" },
  { name: "about", id: "/id/tentang", en: "/en/about" },
  { name: "contact", id: "/id/kontak", en: "/en/contact" },
];
const locales = (process.env.LOCALES ?? "id,en").split(",") as ("id" | "en")[];

async function prepare(page: Page, theme: (typeof themes)[number]) {
  await page.addInitScript((t) => {
    sessionStorage.setItem("argy-intro-seen", "1");
    localStorage.setItem("argy-theme", t);
  }, theme);
}

/** Teks yang tumpang tindih dengan kotak anchor chip yang sedang terlihat. */
async function overlaps(page: Page) {
  return page.evaluate(() => {
    const issues: string[] = [];
    const anchors = [...document.querySelectorAll<HTMLElement>("[data-chip-anchor]")].filter((a) => {
      const r = a.getBoundingClientRect();
      return r.width > 2 && r.bottom > 0 && r.top < innerHeight && a.dataset.chipAnchor !== "intro";
    });
    const texts = [...document.querySelectorAll<HTMLElement>("h1,h2,h3,p,a,button,li,dt,dd")].filter(
      (el) => !el.closest("[aria-hidden='true']") && el.offsetParent !== null && getComputedStyle(el).position !== "fixed",
    );
    for (const a of anchors) {
      const ar = a.getBoundingClientRect();
      // Chip menempati ~92% lebar anchor; beri toleransi 6% di tiap sisi.
      const inset = ar.width * 0.06;
      for (const el of texts) {
        if (el.closest(".fixed")) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const x = Math.min(ar.right - inset, r.right) - Math.max(ar.left + inset, r.left);
        const y = Math.min(ar.bottom - inset, r.bottom) - Math.max(ar.top + inset, r.top);
        if (x > 4 && y > 4) issues.push(`${a.dataset.chipAnchor} × ${el.tagName}: ${el.textContent?.trim().slice(0, 30)}`);
      }
    }
    return issues;
  });
}

for (const locale of locales) {
  for (const route of routes) {
    for (const theme of themes) {
      for (const width of widths) {
        test(`${route.name} ${locale} ${theme} ${width}`, async ({ page }) => {
          await prepare(page, theme);
          await page.setViewportSize({ width, height: width < 768 ? 780 : 900 });
          await page.goto(route[locale], { waitUntil: "networkidle" });
          await page.waitForTimeout(1200);

          const sw = await page.evaluate(() => document.documentElement.scrollWidth);
          expect(sw, "scroll horizontal").toBeLessThanOrEqual(width);

          const height = await page.evaluate(() => document.documentElement.scrollHeight);
          const problems: string[] = [];
          for (let y = 0; y < height; y += 700) {
            await page.evaluate((top) => window.scrollTo(0, top), y);
            await page.waitForTimeout(250);
            problems.push(...(await overlaps(page)));
          }
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(900);
          await page.screenshot({
            path: `tests/__screenshots__/${route.name}-${locale}-${theme}-${width}.png`,
            fullPage: false,
          });
          expect([...new Set(problems)], "teks di dalam zona chip").toEqual([]);
        });
      }
    }
  }
}
