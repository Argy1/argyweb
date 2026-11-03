import { expect, test } from "@playwright/test";

/** SEO teknis: metadata, canonical/hreflang, data terstruktur, robots, dan sitemap. */
const pages = [
  { path: "/id", lang: "id" },
  { path: "/en", lang: "en" },
  { path: "/id/karya", lang: "id" },
  { path: "/id/tentang", lang: "id" },
  { path: "/id/kontak", lang: "id" },
  { path: "/en/about", lang: "en" },
  { path: "/id/karya/kopaseba", lang: "id" },
];

for (const { path, lang } of pages) {
  test(`metadata dan data terstruktur ${path}`, async ({ request }) => {
    const res = await request.get(path);
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<title>[^<]{10,70}<\/title>/);
    expect(html).toMatch(/<meta name="description" content="[^"]{50,170}"/);
    expect(html).toContain(`<html lang="${lang}"`);
    expect(html).toMatch(/<link rel="canonical" href="https?:\/\/[^"]+"/);
    expect(html).toContain('hrefLang="x-default"');
    expect(html).toMatch(/<meta property="og:image" content="https?:\/\/[^"]+"/);
    expect(html).toMatch(/<meta name="twitter:image" content="https?:\/\/[^"]+"/);
    expect(html).toContain('<meta property="og:site_name" content="Argy Fawwaz Akbar"');

    const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    if (path !== "/id/karya") expect(blocks.length).toBeGreaterThan(0); // Karya (daftar) tanpa JSON-LD khusus
    const flat = blocks.flatMap((b) => (b["@graph"] ? b["@graph"] : [b]));
    if (path === "/id" || path === "/en") {
      const types = flat.map((n) => n["@type"]);
      expect(types).toContain("WebSite");
      expect(types).toContain("Person");
      const p = flat.find((n) => n["@type"] === "Person");
      expect(p.name).toBe("Argy Fawwaz Akbar");
      expect(p.sameAs.length).toBeGreaterThanOrEqual(3);
      expect(p.alternateName).toContain("Argy Fawwaz");
    }
    if (path === "/id/tentang") expect(blocks.map((b) => b["@type"])).toContain("ProfilePage");
  });
}

test("nama lengkap ada di teks beranda yang terlihat (H1/lead), bukan hanya di metadata", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("argy-intro-seen", "1"));
  await page.goto("/id", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main")).toContainText("Argy Fawwaz Akbar");
});

test("robots dan sitemap: dapat diindeks, mencakup halaman utama dan proyek, tanpa /api", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Allow: \//);
  expect(robots).toMatch(/Disallow: \/api\//);
  expect(robots).toMatch(/Sitemap: https?:\/\/\S+\/sitemap\.xml/);
  const xml = await (await request.get("/sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(locs.length).toBeGreaterThanOrEqual(26);
  expect(locs.some((l) => /\/id$/.test(l))).toBe(true);
  expect(locs.some((l) => l.includes("/karya/kopaseba"))).toBe(true);
  expect(locs.some((l) => l.includes("/api"))).toBe(false);
  expect(xml).toContain("<lastmod>");
});

test("halaman tidak ada mengembalikan 404 (bukan 200) agar tidak diindeks", async ({ request }) => {
  const res = await request.get("/id/halaman-yang-tidak-ada");
  expect(res.status()).toBe(404);
});
