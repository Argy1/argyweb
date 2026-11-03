import { expect, test } from "@playwright/test";

/**
 * Efek: sakelar Penuh/Ringan, transisi halaman (View Transitions), dan efek kursor.
 * Jalankan dengan Chrome tanpa flag SwiftShader (GPU asli) dan ?bgforce supaya pemantau FPS tidak
 * mematikan latar di mesin tanpa GPU. Lihat playwright.config.ts (launchOptions diganti di sini).
 */
test.use({ launchOptions: { args: [] }, viewport: { width: 1280, height: 800 } });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("argy-intro-seen", "1"));
});

const home = "/id?bgforce";

test("default: efek penuh aktif (latar hidup, tanpa data-fx)", async ({ page }) => {
  await page.goto(home, { waitUntil: "networkidle" });
  await expect(page.locator("html")).not.toHaveAttribute("data-fx", /.*/);
  await expect(page.locator("html")).toHaveAttribute("data-bg", "live", { timeout: 15_000 });
  await expect(page.getByRole("switch", { name: /Efek: Penuh/ })).toHaveAttribute("aria-checked", "true");
});

test("sakelar footer: Ringan mematikan latar, tersimpan, dan bisa kembali ke Penuh", async ({ page }) => {
  await page.goto(home, { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("data-bg", "live", { timeout: 15_000 });

  const toggle = page.getByRole("switch", { name: /Efek:/ });
  await toggle.scrollIntoViewIfNeeded();
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-fx", "lite");
  await expect(page.locator("html")).not.toHaveAttribute("data-bg", /.*/);
  expect(await page.evaluate(() => localStorage.getItem("argy-fx"))).toBe("lite");

  // Muat ulang: tetap Ringan, dan data-fx sudah terpasang sebelum hydration (tanpa kedipan).
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-fx", "lite");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(4000);
  await expect(page.locator("html")).not.toHaveAttribute("data-bg", /.*/);

  const again = page.getByRole("switch", { name: /Efek: Ringan/ });
  await again.scrollIntoViewIfNeeded();
  await again.click();
  await expect(page.locator("html")).not.toHaveAttribute("data-fx", /.*/);
  await expect(page.locator("html")).toHaveAttribute("data-bg", "live", { timeout: 15_000 });
});

test("reduced-motion: terkunci Ringan dan sakelar dinonaktifkan", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.addInitScript(() => sessionStorage.setItem("argy-intro-seen", "1"));
  await page.goto("/id", { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("data-fx", "lite");
  await expect(page.getByRole("switch", { name: /Efek:/ })).toBeDisabled();
  await ctx.close();
});

test("transisi halaman: memakai View Transition, arah benar, navbar tetap diam", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __vt: { calls: number; dirs: string[] }; __hdr: string[] };
    w.__vt = { calls: 0, dirs: [] };
    const orig = Document.prototype.startViewTransition;
    Document.prototype.startViewTransition = function (cb) {
      w.__vt.calls++;
      w.__vt.dirs.push(document.documentElement.dataset.navDir ?? "");
      return orig.call(this, cb);
    };
    w.__hdr = [];
    const tick = () => {
      const r = document.querySelector("header.site-header")?.getBoundingClientRect();
      if (r) w.__hdr.push(`${Math.round(r.x)},${Math.round(r.y)}`);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.goto(home, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  await page.getByRole("link", { name: "Karya", exact: true }).first().click();
  await expect(page).toHaveURL(/\/id\/karya/);
  await page.waitForTimeout(1200);
  await page.getByRole("link", { name: "Beranda", exact: true }).first().click();
  await expect(page).toHaveURL(/\/id(\?|$)/);
  await page.waitForTimeout(1200);

  const r = await page.evaluate(() => {
    const w = window as unknown as { __vt: { calls: number; dirs: string[] }; __hdr: string[] };
    return { ...w.__vt, headerPositions: [...new Set(w.__hdr)].length, vtLeft: document.documentElement.hasAttribute("data-vt") };
  });
  expect(r.calls).toBeGreaterThanOrEqual(2);
  expect(r.dirs.slice(0, 2)).toEqual(["forward", "back"]);
  expect(r.headerPositions).toBe(1);
  expect(r.vtLeft).toBe(false);
});

test("efek kursor: menggambar saat mouse bergerak dan bersih setelah pergi", async ({ page }) => {
  await page.goto(home, { waitUntil: "networkidle" });
  await page.waitForTimeout(4000);
  const painted = () =>
    page.evaluate(() => {
      const c = document.querySelector<HTMLCanvasElement>("canvas.z-40");
      if (!c) return -1;
      const ctx = c.getContext("2d");
      if (!ctx) return -1;
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let i = 3; i < d.length; i += 16) if (d[i] > 6) n++;
      return n;
    });
  expect(await painted()).toBe(0);
  for (let i = 0; i < 25; i++) await page.mouse.move(300 + i * 18, 400 + Math.sin(i / 3) * 40);
  await page.waitForTimeout(120);
  expect(await painted()).toBeGreaterThan(40);
  // Kursor meninggalkan jendela: kanvas dibersihkan.
  await page.evaluate(() => document.documentElement.dispatchEvent(new MouseEvent("mouseleave")));
  await page.waitForTimeout(1500);
  expect(await painted()).toBe(0);
});

test("mode Ringan: tanpa efek kursor dan transisi hanya fade", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("argy-fx", "lite"));
  await page.goto(home, { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  for (let i = 0; i < 25; i++) await page.mouse.move(300 + i * 18, 400);
  await page.waitForTimeout(200);
  const painted = await page.evaluate(() => {
    const c = document.querySelector<HTMLCanvasElement>("canvas.z-40");
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return 0;
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 16) if (d[i] > 6) n++;
    return n;
  });
  expect(painted).toBe(0);
  const name = await page.evaluate(() => getComputedStyle(document.documentElement, "::view-transition-new(argy-page)").animationName);
  expect(name).toContain("nav-fade");
  expect(name).not.toContain("nav-slide");
});
