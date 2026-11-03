import { devices, expect, test, type Page } from "@playwright/test";

/**
 * Putar chip 3D (src/components/three/ChipGrab.tsx): mouse horizontal saja, sentuhan (geser kiri-kanan = putar,
 * atas-bawah = scroll, tahan lalu geser = pegang chip), keyboard, inersia, dan kembali ke pose normal.
 * Pose dibaca dari window.__chip (hanya aktif dengan ?chipdebug). Frame di mesin tanpa GPU lambat, jadi semua
 * penantian memakai batas longgar.
 */

type Chip = { pose: { yaw: number; pitch: number }; drag: { vYaw: number; vPitch: number; active: boolean } };
const GRAB = "button.chip-grab";
const LONG = 25_000;

async function open(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem("argy-intro-seen", "1"));
  await page.goto("/id?chipdebug", { waitUntil: "load" });
  await expect(page.locator(GRAB)).toBeVisible({ timeout: LONG });
}
const pose = (page: Page) => page.evaluate(() => (window as unknown as { __chip: Chip }).__chip.pose);
const centre = async (page: Page) => {
  const b = await page.locator(GRAB).boundingBox();
  expect(b).not.toBeNull();
  return { x: b!.x + b!.width / 2, y: b!.y + b!.height / 2 };
};

test.describe("desktop (mouse + keyboard)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("seret horizontal memutar chip (yaw), gerak vertikal diabaikan", async ({ page }) => {
    await open(page);
    const before = await pose(page);
    const c = await centre(page);
    await page.mouse.move(c.x, c.y);
    await page.mouse.down();
    for (let i = 1; i <= 12; i++) await page.mouse.move(c.x + i * 25, c.y);
    await page.mouse.up();
    await page.waitForTimeout(400);
    const after = await pose(page);
    expect(after.yaw - before.yaw).toBeGreaterThan(1.2);
    expect(Math.abs(after.pitch)).toBeLessThan(0.05);

    // Gerak vertikal saja: tidak membalik chip.
    await page.mouse.move(c.x, c.y);
    await page.mouse.down();
    for (let i = 1; i <= 10; i++) await page.mouse.move(c.x, c.y + i * 20);
    await page.mouse.up();
    await page.waitForTimeout(400);
    expect(Math.abs((await pose(page)).pitch)).toBeLessThan(0.05);
  });

  test("tombol panah memutar dan membalik; Esc mengembalikan ke pose normal", async ({ page }) => {
    await open(page);
    await page.locator(GRAB).focus();
    const before = await pose(page);
    for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowRight");
    for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(500);
    const turned = await pose(page);
    expect(turned.yaw - before.yaw).toBeGreaterThan(0.4);
    expect(Math.abs(turned.pitch)).toBeGreaterThan(0.4);

    await page.keyboard.press("Escape");
    await expect.poll(async () => Math.abs((await pose(page)).pitch), { timeout: LONG }).toBeLessThan(0.05);
  });

  test("setelah dilepas, pitch kembali sendiri ke pose normal (tanpa Esc)", async ({ page }) => {
    await open(page);
    await page.locator(GRAB).focus();
    for (let i = 0; i < 4; i++) await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(300);
    expect(Math.abs((await pose(page)).pitch)).toBeGreaterThan(0.5);
    await expect.poll(async () => Math.abs((await pose(page)).pitch), { timeout: 40_000 }).toBeLessThan(0.05);
  });

  test("tombol putar punya nama aksesibel dan bisa difokus keyboard", async ({ page }) => {
    await open(page);
    await expect(page.getByRole("button", { name: /Chip CPU 3D/ })).toBeVisible();
    await page.locator(GRAB).focus();
    await expect(page.locator(GRAB)).toBeFocused();
  });

  test("reduced-motion: tetap bisa diputar, tanpa inersia", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page);
    const before = await pose(page);
    const c = await centre(page);
    await page.mouse.move(c.x, c.y);
    await page.mouse.down();
    for (let i = 1; i <= 8; i++) await page.mouse.move(c.x + i * 20, c.y);
    await page.mouse.up();
    await page.waitForTimeout(500);
    expect((await pose(page)).yaw - before.yaw).toBeGreaterThan(0.5);
    const v = await page.evaluate(() => (window as unknown as { __chip: Chip }).__chip.drag.vYaw);
    expect(v).toBe(0);
  });
});

// `defaultBrowserType` tidak boleh di-`use` di dalam grup (memaksa worker baru); ambil sisanya saja.
const { defaultBrowserType: _ignored, ...pixel } = devices["Pixel 7"];
void _ignored;

test.describe("HP / tablet (sentuhan)", () => {
  test.use(pixel);

  /** Gerakkan jari lewat protokol Chrome (sentuhan sungguhan, termasuk perilaku scroll dan touch-action). */
  async function finger(page: Page) {
    const cdp = await page.context().newCDPSession(page);
    const send = (type: "touchStart" | "touchMove" | "touchEnd", x: number, y: number) =>
      cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y }] });
    return {
      down: (x: number, y: number) => send("touchStart", x, y),
      move: (x: number, y: number) => send("touchMove", x, y),
      up: () => send("touchEnd", 0, 0),
    };
  }

  test("geser kiri-kanan memutar chip 360° dan tidak men-scroll halaman", async ({ page }) => {
    await open(page);
    const before = await pose(page);
    const c = await centre(page);
    const f = await finger(page);
    await f.down(c.x - 60, c.y);
    for (let i = 1; i <= 10; i++) await f.move(c.x - 60 + i * 12, c.y + (i % 2));
    await f.up();
    await page.waitForTimeout(500);
    expect((await pose(page)).yaw - before.yaw).toBeGreaterThan(0.8);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(5);
  });

  test("geser atas-bawah langsung men-scroll halaman (chip tidak berputar)", async ({ page }) => {
    await open(page);
    await page.evaluate(() => {
      new MutationObserver(() => {
        if (document.querySelector("button.chip-grab[data-grab]")) (window as unknown as { __grabbed: boolean }).__grabbed = true;
      }).observe(document.body, { attributes: true, subtree: true, attributeFilter: ["data-grab"] });
    });
    const c = await centre(page);
    const f = await finger(page);
    await f.down(c.x, c.y + 80);
    for (let i = 1; i <= 12; i++) await f.move(c.x, c.y + 80 - i * 18);
    await f.up();
    await page.waitForTimeout(600);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(40);
    expect(await page.evaluate(() => (window as unknown as { __grabbed?: boolean }).__grabbed ?? false)).toBe(false);
  });

  test("tahan lalu geser = mode pegang chip: putar bebas dan halaman tidak scroll", async ({ page }) => {
    await open(page);
    const c = await centre(page);
    const f = await finger(page);
    await f.down(c.x, c.y);
    await page.waitForTimeout(500);
    await expect(page.locator(`${GRAB}[data-grab="free"]`)).toHaveCount(1);
    for (let i = 1; i <= 10; i++) await f.move(c.x, c.y + i * 12);
    await page.waitForTimeout(200);
    await f.up();
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(5);
    expect(Math.abs((await pose(page)).pitch)).toBeGreaterThan(0.4);
  });
});
