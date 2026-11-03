import { expect, test, type Page } from "@playwright/test";

/**
 * Header HP/tablet (satu kapsul + menu ☰) dan anchor "stage" yang membuat chip 3D ikut turun di < 1024px.
 * Ukuran: HP 390×780, tablet 768×900.
 */

async function prepare(page: Page, opts: { lite?: boolean } = {}) {
  await page.addInitScript((lite) => {
    sessionStorage.setItem("argy-intro-seen", "1");
    if (lite) localStorage.setItem("argy-fx", "lite");
  }, !!opts.lite);
}

/** id anchor chip yang punya ukuran nyata (tidak di-`display:none` oleh CSS). */
function visibleAnchors(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("[data-chip-anchor]")]
      .filter((a) => a.offsetWidth > 1)
      .map((a) => a.dataset.chipAnchor as string),
  );
}

test.describe("HP 390px", () => {
  test.use({ viewport: { width: 390, height: 780 } });

  test("menu ☰: link tersembunyi sampai dibuka, klik link pindah halaman dan menutup menu", async ({ page }) => {
    await prepare(page);
    await page.goto("/id", { waitUntil: "load" });
    const toggle = page.getByRole("button", { name: "Buka menu" });
    await expect(toggle).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Menu navigasi" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Karya", exact: true })).toBeHidden();

    await toggle.click();
    const menu = page.getByRole("navigation", { name: "Menu navigasi" });
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: "Tutup menu" })).toHaveAttribute("aria-expanded", "true");
    await expect(menu.getByRole("link")).toHaveCount(4);
    await expect(menu.getByRole("link", { name: "Beranda" })).toHaveAttribute("aria-current", "page");

    await menu.getByRole("link", { name: "Karya" }).click();
    await expect(page).toHaveURL(/\/id\/karya$/);
    await expect(page.getByRole("navigation", { name: "Menu navigasi" })).toHaveCount(0);
  });

  test("menu ☰: Esc menutup dan fokus kembali ke tombol", async ({ page }) => {
    await prepare(page);
    await page.goto("/id", { waitUntil: "load" });
    await page.getByRole("button", { name: "Buka menu" }).click();
    await expect(page.getByRole("navigation", { name: "Menu navigasi" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("navigation", { name: "Menu navigasi" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Buka menu" })).toBeFocused();
  });

  test("menu ☰: mengetuk area di luar panel menutupnya", async ({ page }) => {
    await prepare(page);
    await page.goto("/id", { waitUntil: "load" });
    await page.getByRole("button", { name: "Buka menu" }).click();
    await expect(page.getByRole("navigation", { name: "Menu navigasi" })).toBeVisible();
    await page.mouse.click(195, 700);
    await expect(page.getByRole("navigation", { name: "Menu navigasi" })).toHaveCount(0);
  });

  test("Beranda: chip punya anchor di tiap section (mode Penuh)", async ({ page }) => {
    await prepare(page);
    await page.goto("/id", { waitUntil: "load" });
    const ids = await visibleAnchors(page);
    for (const id of ["home-hero", "home-work", "home-about", "contact"]) expect(ids, id).toContain(id);
  });

  test("Beranda: mode Ringan membuat chip kembali hanya di hero", async ({ page }) => {
    await prepare(page, { lite: true });
    await page.goto("/id", { waitUntil: "load" });
    const ids = await visibleAnchors(page);
    expect(ids).toContain("home-hero");
    for (const id of ["home-work", "home-about", "contact"]) expect(ids, id).not.toContain(id);
  });

  test("halaman lain punya anchor stage (Karya, Tentang, Kontak)", async ({ page }) => {
    await prepare(page);
    await page.goto("/id/karya", { waitUntil: "load" });
    expect(await visibleAnchors(page)).toContain("work-grid");
    await page.goto("/id/tentang", { waitUntil: "load" });
    expect(await visibleAnchors(page)).toEqual(expect.arrayContaining(["about-hero", "about-stack", "about-journey"]));
    await page.goto("/id/kontak", { waitUntil: "load" });
    expect(await visibleAnchors(page)).toEqual(expect.arrayContaining(["contact-hero", "contact-form"]));
  });

  test("tombol di kapsul tidak melimpah keluar (390px)", async ({ page }) => {
    await prepare(page);
    await page.goto("/id", { waitUntil: "load" });
    const over = await page.evaluate(() => {
      const capsule = document.querySelector("header .wrap > div") as HTMLElement;
      const box = capsule.getBoundingClientRect();
      return [...capsule.querySelectorAll("a,button")].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > box.right + 0.5 || r.left < box.left - 0.5);
      }).length;
    });
    expect(over).toBe(0);
  });
});

test.describe("HP 360px", () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test("kapsul header muat tanpa melimpah (ID dan EN)", async ({ page }) => {
    await prepare(page);
    for (const path of ["/id", "/en"]) {
      await page.goto(path, { waitUntil: "load" });
      const res = await page.evaluate(() => {
        const capsule = document.querySelector("header .wrap > div") as HTMLElement;
        const box = capsule.getBoundingClientRect();
        const outside = [...capsule.querySelectorAll("a,button")].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > box.right + 0.5 || r.left < box.left - 0.5);
        }).length;
        return { outside, scroll: document.documentElement.scrollWidth };
      });
      expect(res.outside, path).toBe(0);
      expect(res.scroll, path).toBeLessThanOrEqual(360);
    }
  });
});

test.describe("tablet 768px", () => {
  test.use({ viewport: { width: 768, height: 900 } });

  test("link langsung di kapsul, tanpa tombol ☰, dan tanpa melimpah (ID dan EN)", async ({ page }) => {
    await prepare(page);
    for (const [path, work] of [
      ["/id", "Karya"],
      ["/en", "Work"],
    ] as const) {
      await page.goto(path, { waitUntil: "load" });
      await expect(page.getByRole("button", { name: /menu/i })).toBeHidden();
      await expect(page.getByRole("link", { name: work, exact: true }).first()).toBeVisible();
      const outside = await page.evaluate(() => {
        const capsule = document.querySelector("header .wrap > div") as HTMLElement;
        const box = capsule.getBoundingClientRect();
        return [...capsule.querySelectorAll("a,button")].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > box.right + 0.5 || r.left < box.left - 0.5);
        }).length;
      });
      expect(outside, path).toBe(0);
    }
  });
});

test.describe("lebar 900px", () => {
  test.use({ viewport: { width: 900, height: 900 } });

  test("tombol Tanya AI berlabel mulai 900px, ikon saja di bawahnya", async ({ page }) => {
    await prepare(page);
    await page.goto("/id", { waitUntil: "load" });
    await expect(page.getByRole("button", { name: "Tanya AI" }).first().locator("span")).toBeVisible();
    await page.setViewportSize({ width: 899, height: 900 });
    await expect(page.getByRole("button", { name: "Tanya AI" }).first().locator("span")).toBeHidden();
  });
});
