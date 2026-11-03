# 09 — SEO: agar situs muncul di Google

Tujuan: orang yang mencari **"Argy Fawwaz Akbar"**, **"Argy Fawwaz"**, atau **"portofolio Argy Fawwaz Akbar"** menemukan situs ini. Dokumen ini memisahkan **yang sudah ada di kode** dari **langkah yang hanya bisa dilakukan Argy** (butuh akun Google dan akses pengaturan domain), karena muncul di Google tidak bisa dipaksa dari kode: Google harus menemukan, merayapi, dan memutuskan mengindeks situs.

Terakhir diperbarui: 2026-11-03.

## 1. Yang sudah ada di kode

| Bagian | Detail | Berkas |
|---|---|---|
| Judul & deskripsi unik per halaman | Beranda: `Argy Fawwaz Akbar · Portofolio Full-stack Developer` (ID) / `… Full-stack Developer Portfolio` (EN). Halaman lain: `<Judul> · Argy Fawwaz Akbar`. Deskripsi proyek dipotong ≤160 karakter (`trimDescription`). | `messages/*.json`, `src/lib/seo.ts` |
| Nama lengkap di teks yang terlihat | Lead hero: "Saya Argy Fawwaz Akbar, full-stack developer…" (bukan hanya di metadata). | `messages/*.json` (`hero.lead`) |
| Canonical + hreflang (`id`, `en`, `x-default`) | Per halaman, dari `alternatesFor`. | `src/lib/seo.ts` |
| Open Graph + Twitter card + gambar OG per halaman/proyek | Gambar 1200×630 dibuat dinamis. | `opengraph-image.tsx` |
| Data terstruktur JSON-LD | Beranda: `WebSite` + `Person` (`@graph`, `@id` stabil, `alternateName`, `sameAs` GitHub/LinkedIn/Instagram, `knowsAbout`, `alumniOf`). Tentang: `ProfilePage` dengan `Person` sebagai entitas utama. Proyek: `CreativeWork`. Kontak: `Person`. | `src/lib/jsonld.ts` |
| `robots.txt` | Mengizinkan semua, memblokir `/api/`, menunjuk sitemap. Meta robots: `index, follow`, `max-image-preview: large`. | `src/app/robots.ts`, `src/app/[locale]/layout.tsx` |
| `sitemap.xml` | 26 URL (halaman × 2 bahasa) dengan `lastmod` dan alternates bahasa. Bertambah otomatis bila proyek ditambah. | `src/app/sitemap.ts` |
| Tag verifikasi Search Console / Bing | Dipasang otomatis dari env `GOOGLE_SITE_VERIFICATION` dan `BING_SITE_VERIFICATION`. | `src/app/[locale]/layout.tsx` |
| Konten dapat dibaca perayap | Teks halaman ada di HTML server-render; animasi scramble tidak mengubah teks aslinya. 404 sungguhan mengembalikan status 404. | — |
| Tes otomatis | `tests/seo.spec.ts` memeriksa semua poin di atas. | `tests/seo.spec.ts` |

## 2. Langkah yang harus dilakukan Argy (urut)

### A. Daftarkan situs di Google Search Console (wajib, ±10 menit)

> **Status 2026-11-03:** properti Awalan URL `https://argyweb.vercel.app/` sudah dibuat dan token tag HTML sudah tertanam di kode (`profile.googleSiteVerification`), jadi **tidak perlu mengisi env di Vercel**. Tinggal deploy lalu klik **Verifikasi**. Jangan hapus tag setelah berhasil. Langkah di bawah dipertahankan sebagai referensi (mis. untuk domain baru).
1. Buka <https://search.google.com/search-console> dengan akun Google.
2. **Tambahkan properti** → pilih tipe **"Awalan URL"** (URL prefix) → isi `https://argyweb.vercel.app` (persis sama, tanpa `/` di akhir).
3. Pilih metode verifikasi **"Tag HTML"**. Google menampilkan potongan seperti `<meta name="google-site-verification" content="ABC123...">`. **Salin hanya nilai `content`** (`ABC123...`).
4. Di Vercel → proyek `argyweb` → Settings → Environment Variables → tambah `GOOGLE_SITE_VERIFICATION` = nilai tadi (Production **dan** Preview) → **Redeploy** (deploy ulang) supaya tag muncul.
5. Kembali ke Search Console, klik **Verifikasi**. (Verifikasi berhasil bila tag terlihat di `https://argyweb.vercel.app/id`.)

> Alternatif tanpa menunggu deploy: metode "Berkas HTML" (unduh berkas `googleXXXX.html`, taruh di `public/`, deploy). Metode tag lebih rapi.

### B. Kirim sitemap dan minta pengindeksan
1. Search Console → **Sitemap** → isi `sitemap.xml` → Kirim. Status harus "Berhasil" dan menemukan 26 URL.
2. **Inspeksi URL** (kotak pencarian di atas): tempel `https://argyweb.vercel.app/id` → **Minta pengindeksan**. Ulangi untuk `/en`, `/id/tentang`, `/id/karya`, dan beberapa halaman proyek. Ada kuota harian kecil, cukup halaman utama dulu.
3. Pengindeksan biasanya butuh **beberapa hari sampai 2–3 minggu**. Di tab **Halaman** (Pengindeksan) lihat apakah "Terindeks". Bila "Ditemukan, saat ini belum diindeks" itu normal untuk situs baru.

### C. Bangun sinyal bahwa situs ini milik "Argy Fawwaz Akbar" (paling berpengaruh untuk pencarian nama)
Google mencocokkan nama dengan situs yang **ditautkan dari profil lain yang sah**. Lakukan semuanya:
- **GitHub** (`github.com/Argy1`): isi kolom *Website* di profil dengan `https://argyweb.vercel.app`, dan tulis nama lengkap "Argy Fawwaz Akbar" di kolom *Name*. Pin repo `argyweb` dan tulis URL situs di *About* repo.
- **LinkedIn**: tambahkan situs di *Contact info → Website* dan di bagian *Featured*.
- **Instagram** (`@argy.py`): taruh URL situs di bio.
- **Situs proyek yang sudah live** (klikpdpi.com, direktoripdpi.com, Kopaseba, dll.): bila memungkinkan, tambahkan tautan "Dibangun oleh Argy Fawwaz Akbar" di footer yang mengarah ke `https://argyweb.vercel.app`.
- Gunakan **nama yang sama persis** ("Argy Fawwaz Akbar") di semua profil.

### D. Pertimbangkan domain sendiri (sangat disarankan untuk jangka panjang)
`*.vercel.app` adalah subdomain bersama: sah diindeks, tetapi sulit bersaing untuk pencarian nama dan terlihat kurang profesional. Domain seperti `argyfawwaz.com` / `argyfawwaz.dev` (±Rp150–300 ribu per tahun) lebih mudah diingat dan membuat nama merek terasa milik Argy. Bila dibeli:
1. Vercel → Settings → Domains → tambahkan domain, ikuti instruksi DNS.
2. Ubah `NEXT_PUBLIC_SITE_URL` di Vercel ke domain baru, deploy ulang (semua canonical, sitemap, dan JSON-LD ikut berubah otomatis).
3. Tambahkan properti **baru** di Search Console untuk domain itu dan ulangi langkah A–B.
4. Alamat lama `argyweb.vercel.app` tetap bisa dibuka setelah ganti domain. Agar tidak ada dua versi yang bersaing, tambahkan redirect permanen (308) dari host `argyweb.vercel.app` ke domain baru (aturan `redirects` dengan `has: [{ type: "host", value: "argyweb.vercel.app" }]` di `next.config.ts`; minta Claude memasangnya).

### E. (Opsional) Bing
<https://www.bing.com/webmasters> → impor dari Search Console (paling mudah), atau verifikasi dengan `BING_SITE_VERIFICATION` seperti di langkah A. Bing menyuplai juga DuckDuckGo dan beberapa mesin lain.

## 3. Cara memeriksa hasilnya

- **Search Console → Performa**: kata kunci yang dipakai orang, jumlah tayangan/klik. Cari kueri "argy fawwaz".
- Cari langsung di Google: `site:argyweb.vercel.app` (menunjukkan halaman yang sudah terindeks) dan `"Argy Fawwaz Akbar"`.
- **Uji data terstruktur**: <https://search.google.com/test/rich-results> dan <https://validator.schema.org/> dengan URL `https://argyweb.vercel.app/id`.
- **Pratinjau berbagi** (OG): tempel tautan di WhatsApp/LinkedIn.
- **Lighthouse** (Chrome DevTools) kategori SEO harus 100.

## 4. Ekspektasi yang realistis

- Pencarian **nama lengkap yang unik** biasanya cepat (hari–minggu) begitu terindeks dan ada tautan dari profil GitHub/LinkedIn.
- Pencarian umum seperti "portofolio full-stack developer" **tidak realistis** untuk halaman pertama (persaingan sangat ketat); fokus pada pencarian nama dan kombinasi nama + kata kunci ("Argy Fawwaz Akbar IPB", "Argy Fawwaz Akbar Kopaseba").
- Halaman GitHub dan LinkedIn Argy bisa tampil **di atas** situs sendiri untuk beberapa waktu; itu normal. Tautan silang (langkah C) membantu situs naik.
- Tidak ada cara mempercepat pengindeksan selain langkah B; jangan memakai layanan "jasa SEO instan".

## 5. Perawatan

- Tambah proyek/halaman → sitemap ikut otomatis; cukup deploy.
- Ubah teks `hero.lead`/`meta.*` dengan tetap menyertakan nama lengkap.
- Jangan menaruh teks tersembunyi atau memuat kata kunci berulang (bisa dianggap spam).
- Setelah ganti domain atau struktur URL, perbarui `NEXT_PUBLIC_SITE_URL` dan kirim ulang sitemap.
