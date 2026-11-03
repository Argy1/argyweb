import { expect, test } from "@playwright/test";

/** Tombol dan aksi yang harus benar-benar bekerja: filter Karya, salin email, unduh CV, formulir kontak. */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("argy-intro-seen", "1"));
});

test("filter Karya: klik kategori menyaring kartu, menandai chip, dan menyimpan query", async ({ page }) => {
  await page.goto("/id/karya", { waitUntil: "networkidle" });
  const cards = page.locator("main a[href*='/karya/']");
  const total = await cards.count();
  const mobile = page.getByRole("button", { name: /^Mobile/ });
  await mobile.click();
  await expect(mobile).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/kategori=mobile/);
  await expect.poll(() => cards.count()).toBeLessThan(total);
  await page.getByRole("button", { name: /^Semua/ }).click();
  await expect.poll(() => cards.count()).toBe(total);
});

test("Kopaseba dan Confindant ada di Karya, DigitalPMO tidak", async ({ page }) => {
  await page.goto("/id/karya", { waitUntil: "networkidle" });
  await expect(page.getByRole("link", { name: /Kopaseba/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Confindant/ }).first()).toBeVisible();
  await expect(page.getByText("DigitalPMO")).toHaveCount(0);
  await page.goto("/id/karya/confindant", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Confindant" })).toBeVisible();
  const broken = await page.evaluate(() =>
    [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
  );
  expect(broken).toEqual([]);
});

test("unduh CV memberi berkas", async ({ page }) => {
  await page.goto("/id/tentang", { waitUntil: "networkidle" });
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("link", { name: /Unduh CV/i }).first().click()]);
  expect(download.suggestedFilename()).toBe("CV-Argy-Fawwaz-Akbar.jpg");
});

test("formulir kontak: validasi, kirim sukses, batas laju, dan jatuh ke mailto", async ({ page }) => {
  await page.goto("/id/kontak", { waitUntil: "networkidle" });
  const send = page.getByRole("button", { name: "Kirim pesan" });

  await send.click();
  await expect(page.locator("[aria-invalid=true]")).toHaveCount(3);

  const fill = async () => {
    await page.getByLabel("Nama").fill("Tester");
    await page.getByLabel("Email kamu").fill("tester@example.com");
    await page.getByLabel("Pesan").fill("Halo, ini uji formulir.");
  };

  let payload: Record<string, unknown> = {};
  await page.route("**/api/contact", (route) => {
    payload = route.request().postDataJSON();
    return route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
  });
  await fill();
  await send.click();
  await expect(page.getByText(/Terkirim/)).toBeVisible();
  expect(payload).toMatchObject({ name: "Tester", email: "tester@example.com", topic: "Proyek", website: "" });
  await expect(page.getByLabel("Nama")).toHaveValue("");

  await page.unroute("**/api/contact");
  await page.route("**/api/contact", (route) => route.fulfill({ status: 429, contentType: "application/json", body: '{"ok":false}' }));
  await fill();
  await send.click();
  await expect(page.getByRole("alert").filter({ hasText: "Terlalu banyak pesan" })).toBeVisible();

  await page.unroute("**/api/contact");
  await page.route("**/api/contact", (route) => route.fulfill({ status: 501, contentType: "application/json", body: '{"ok":false}' }));
  await send.click();
  await expect(page.getByText(/aplikasi email kamu dibuka/)).toBeVisible();
});

test("endpoint kontak menolak tanpa key dan input tidak valid dengan jelas", async ({ request }) => {
  const res = await request.post("/api/contact", { data: { name: "x", email: "bukan-email", message: "" } });
  // Tanpa RESEND_API_KEY → 501; dengan key → 400 karena input tidak valid. Keduanya bukan 200.
  expect([400, 501]).toContain(res.status());
  const json = await res.json();
  expect(json.ok).toBe(false);
});

test("salin email menyalin alamat sungguhan", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/id/kontak", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Salin alamat email" }).first().click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("tokichimikuni51@gmail.com");
});
