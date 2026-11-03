import { expect, test, type Page } from "@playwright/test";

/**
 * Animasi teks "scramble / decode" pada judul (src/lib/scrambleEngine.ts, components/ui/Scramble.tsx).
 * Durasi nyata bergantung pada kecepatan render mesin (di CI tanpa GPU bisa 2–3 detik), jadi semua
 * penantian memakai timeout longgar, bukan jeda tetap.
 */

const HERO_ID = "Saya bikin web yang memukau dan terasa hidup.";
const HERO = "#hero-title";
const DONE_TIMEOUT = 15_000;

async function seeIntro(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem("argy-intro-seen", "1"));
}

/** Merekam keadaan tepat saat atribut data-scr="run" dipasang (sebelum frame berikutnya digambar). */
async function recordRunStart(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __runs: unknown[] }).__runs = [];
    new MutationObserver((muts) => {
      for (const m of muts) {
        const el = m.target as HTMLElement;
        if (m.attributeName !== "data-scr" || el.dataset.scr !== "run") continue;
        const r = el.getBoundingClientRect();
        const layer = el.querySelector(".scr-layer");
        (window as unknown as { __runs: unknown[] }).__runs.push({
          id: el.id,
          w: r.width,
          h: r.height,
          color: getComputedStyle(el).color,
          layerAriaHidden: layer?.getAttribute("aria-hidden"),
          chars: el.querySelectorAll(".scr-ch").length,
        });
      }
    }).observe(document, { attributes: true, subtree: true, attributeFilter: ["data-scr"] });
  });
}

const plays = (page: Page, sel = HERO) => page.locator(sel).getAttribute("data-scr-plays");

test("hero: teks akhir identik, tidak ada lapisan tersisa, nama aksesibel utuh", async ({ page }) => {
  await seeIntro(page);
  await page.goto("/id", { waitUntil: "load" });
  await expect(page.locator(HERO)).toHaveAttribute("data-scr-plays", "1", { timeout: DONE_TIMEOUT });
  await expect(page.locator(`${HERO} .scr-layer`)).toHaveCount(0);
  await expect(page.locator(HERO)).not.toHaveClass(/scr-run/);
  const text = await page.locator(HERO).evaluate((el) => (el.textContent ?? "").replace(/\s+/g, " ").trim());
  expect(text).toBe(HERO_ID);
  await expect(page.getByRole("heading", { level: 1, name: HERO_ID })).toBeVisible();
});

test("hero: tidak ada layout shift dan lapisan karakter aria-hidden saat animasi berjalan", async ({ page }) => {
  await seeIntro(page);
  await recordRunStart(page);
  await page.goto("/id", { waitUntil: "load" });
  await expect(page.locator(HERO)).toHaveAttribute("data-scr-plays", "1", { timeout: DONE_TIMEOUT });

  const during = await page.evaluate(
    () => (window as unknown as { __runs: { id: string; w: number; h: number; color: string; layerAriaHidden: string; chars: number }[] }).__runs.find((r) => r.id === "hero-title"),
  );
  expect(during, "animasi hero sempat berjalan").toBeTruthy();
  expect(during!.layerAriaHidden).toBe("true");
  expect(during!.chars).toBeGreaterThan(20);
  expect(during!.color).toBe("rgba(0, 0, 0, 0)"); // teks asli transparan selama animasi
  const after = await page.locator(HERO).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { w: r.width, h: r.height };
  });
  expect(Math.abs(after.w - during!.w)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(after.h - during!.h)).toBeLessThanOrEqual(0.5);
});

test("hero: nama aksesibel heading tidak berubah selama animasi", async ({ page }) => {
  await seeIntro(page);
  await page.goto("/id", { waitUntil: "load" });
  await page.waitForSelector(`${HERO}[data-scr="run"]`, { timeout: DONE_TIMEOUT });
  await expect(page.getByRole("heading", { level: 1, name: HERO_ID })).toBeVisible();
});

test("judul masuk layar lagi setelah keluar penuh ≥ 800ms → animasi berjalan ulang", async ({ page }) => {
  await seeIntro(page);
  await page.goto("/id", { waitUntil: "load" });
  await expect(page.locator(HERO)).toHaveAttribute("data-scr-plays", "1", { timeout: DONE_TIMEOUT });

  await page.evaluate(() => window.scrollTo(0, 2600));
  await page.waitForTimeout(1300);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator(HERO)).toHaveAttribute("data-scr-plays", "2", { timeout: DONE_TIMEOUT });
});

test("judul tidak berputar ulang bila hanya keluar sebagian (tidak sepenuhnya keluar layar)", async ({ page }) => {
  await seeIntro(page);
  await page.goto("/id", { waitUntil: "load" });
  await expect(page.locator(HERO)).toHaveAttribute("data-scr-plays", "1", { timeout: DONE_TIMEOUT });

  // Geser sedikit saja: judul masih sebagian terlihat, lalu kembali.
  const box = await page.locator(HERO).boundingBox();
  await page.evaluate((y) => window.scrollTo(0, y), Math.round((box?.y ?? 0) + (box?.height ?? 0) * 0.5));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  expect(await plays(page)).toBe("1");
});

test("mode Ringan: animasi tidak pernah berjalan", async ({ page }) => {
  await seeIntro(page);
  await page.addInitScript(() => localStorage.setItem("argy-fx", "lite"));
  await page.goto("/id", { waitUntil: "load" });
  await page.waitForTimeout(2500);
  await expect(page.locator(HERO)).not.toHaveAttribute("data-scr", /.*/);
  expect(await plays(page)).toBeNull();
  await expect(page.locator(".scr-layer")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: HERO_ID })).toBeVisible();
});

test("prefers-reduced-motion: animasi tidak pernah berjalan", async ({ page }) => {
  await seeIntro(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/id", { waitUntil: "load" });
  await page.waitForTimeout(2500);
  expect(await plays(page)).toBeNull();
  await expect(page.locator(".scr-layer")).toHaveCount(0);
});

test("kunjungan pertama: hero menunggu intro selesai, baru terdekode", async ({ page }) => {
  await page.goto("/id", { waitUntil: "load" });
  await page.waitForTimeout(700);
  await expect(page.locator(HERO)).not.toHaveAttribute("data-scr", /.*/);
  expect(await plays(page)).toBeNull();
  await page.getByRole("button", { name: "Lewati" }).click();
  await expect(page.locator(HERO)).toHaveAttribute("data-scr-plays", "1", { timeout: DONE_TIMEOUT });
});

test("judul kartu proyek: teks utuh, tautan kartu penuh (stretched link) tetap bekerja", async ({ page }) => {
  await seeIntro(page);
  await page.goto("/id/karya", { waitUntil: "load" });
  // Kartu dirender ulang sesaat setelah hidrasi (kunci kartu mengikuti filter); tunggu sampai stabil.
  await page.waitForTimeout(1200);
  const card = page.locator("article").first();
  await card.scrollIntoViewIfNeeded();
  const title = card.locator("a > span.inline-block").first();
  await expect(title).toHaveAttribute("data-scr-plays", "1", { timeout: DONE_TIMEOUT });
  await expect(title).toHaveText("Klik PDPI");
  // Klik di bagian lain kartu (bukan nama) tetap membuka proyek lewat pseudo-elemen stretched link.
  // Playwright menolak `.click()` biasa karena tautan kartu sengaja menutupi seluruh kartu dan menangkap
  // klik; klik koordinat seperti pengguna sungguhan.
  const kind = await card.getByText(/Website organisasi/).boundingBox();
  expect(kind).not.toBeNull();
  await page.mouse.click(kind!.x + kind!.width / 2, kind!.y + kind!.height / 2);
  await expect(page).toHaveURL(/\/id\/karya\/klik-pdpi$/);
});

test("judul section di halaman lain beranimasi dan berakhir dengan teks yang benar", async ({ page }) => {
  await seeIntro(page);
  await page.goto("/id/tentang", { waitUntil: "load" });
  const stack = page.locator("#stack-title");
  await stack.scrollIntoViewIfNeeded();
  await expect(stack).toHaveAttribute("data-scr-plays", "1", { timeout: DONE_TIMEOUT });
  await expect(stack).toHaveText("Alat favorit saya");
  await expect(page.locator("#stack-title .scr-layer")).toHaveCount(0);
});
