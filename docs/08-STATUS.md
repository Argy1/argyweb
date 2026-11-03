# 08 — Status & Catatan Kerja (baca ini setelah CLAUDE.md)

Dokumen ini adalah **sumber kebenaran untuk kondisi terkini** proyek: apa yang sudah jadi, keputusan yang sudah diambil, cara menjalankan, variabel env, dan apa yang masih terbuka. `docs/01`–`07` adalah spesifikasi awal; bila berbeda dengan dokumen ini, **dokumen ini yang terbaru** (spesifikasi awal tidak diubah supaya jejak desain tetap ada).

Terakhir diperbarui: 2026-11-03.

## 1. Ringkasan kondisi

- Semua fase `docs/07` selesai **kecuali deploy ke Vercel** (belum dilakukan; lihat §6).
- Halaman: Beranda `/id`, Karya `/id/karya` (+ detail `/id/karya/[slug]`), Tentang `/id/tentang`, Kontak `/id/kontak`; versi Inggris `/en`, `/en/work`, `/en/work/[slug]`, `/en/about`, `/en/contact`.
- 9 proyek di Karya. Unggulan di Beranda: Klik PDPI, Kopaseba, Direktori PDPI.
- Kualitas terakhir terukur: `pnpm lint`, `pnpm typecheck`, `pnpm build` bersih; **92 tes Playwright lolos**; Lighthouse mobile (simulasi): Accessibility/Best Practices/SEO 100, Performance ~73–77 (turun dari target 85 karena inisialisasi WebGL; tanpa WebGL ~93). Opsi menunda 3D lebih lama belum diputuskan.

## 2. Tumpukan teknologi (versi saat ini)

Next.js 16.4 (App Router, Turbopack, `src/proxy.ts` sebagai middleware), React 19, TypeScript strict, Tailwind CSS v4 (token dipetakan lewat `@theme inline`), React Three Fiber (tanpa drei), next-intl (pathname terlokalisasi), next-themes, Zustand, Vercel AI SDK v7 + `@ai-sdk/google` (Gemini), Upstash Ratelimit (opsional), Playwright. Package manager: **pnpm**.

## 3. Menjalankan

```bash
pnpm install
cp .env.example .env.local     # isi key sesuai §4
pnpm dev                        # http://localhost:3000 → /id
pnpm lint && pnpm typecheck && pnpm build
pnpm test:e2e                   # 92 tes (visual 80 + efek 6 + alur tombol 6)
```

Catatan penting untuk pengujian:
- Dev server yang sedang dipakai orang lain tidak selalu mengikuti perubahan file. Cara andal: `pnpm build` lalu `pnpm start --port 32xx`, dan jalankan `BASE_URL=http://localhost:32xx pnpm exec playwright test`.
- `tests/fx.spec.ts` butuh Chrome dengan GPU asli (tanpa flag SwiftShader; sudah diatur di file itu) dan URL `?bgforce` supaya pemantau FPS tidak mematikan latar di mesin tanpa GPU.
- Playwright memakai Chrome terpasang (`channel: "chrome"`).

## 4. Variabel lingkungan

Semua ada di `.env.example` (templat kosong, aman di-commit). **`.env.local` tidak pernah di-commit** (`.gitignore` memuat `.env*` kecuali `.env.example`).

| Variabel | Wajib? | Fungsi |
|---|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | untuk chatbot AI | Key Gemini (Google AI Studio). Tanpa key, chatbot jalan di **mode demo** (jawaban kata kunci dari konten). |
| `AI_MODEL` | tidak | Default `gemini-2.5-flash-lite` (tier termurah yang stabil). |
| `RESEND_API_KEY` | untuk kirim email | Formulir Kontak. Tanpa key → `POST /api/contact` membalas 501 dan form jatuh ke `mailto:`. |
| `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | tidak | Default tujuan = email di `src/content/profile.ts`; pengirim default `onboarding@resend.dev`. **Tanpa domain terverifikasi di Resend, tujuan hanya boleh email pemilik akun Resend.** |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | tidak | Rate limit terdistribusi untuk chat & kontak. Tanpa ini dipakai penghitung in-memory per instance. |
| `NEXT_PUBLIC_SITE_URL` | ya di produksi | Alamat situs lengkap tanpa `/` di akhir (mis. `https://argyweb.vercel.app`). Dipakai untuk canonical, hreflang, OG image, sitemap, dan tautan di jawaban chatbot. Lokal: `http://localhost:3000`. |

Di Vercel, isi variabel di Settings → Environment Variables lalu **deploy ulang**.

## 5. Keputusan teknis yang sudah diambil (jangan diulang tanpa alasan)

Lihat juga bagian "Keputusan teknis" di `README.md` (detail tiap fitur). Ringkasnya:

- **Panel intip** proyek memakai `history.pushState` (bukan intercepting route): rewrite intercepting route Next 16 menangkap navigasi dari semua halaman di bawah `[locale]`.
- **Tanpa `@react-three/drei`**: rounded box, environment, bayangan dibuat sendiri demi ukuran bundle.
- **Chatbot hanya Gemini** (`@ai-sdk/google`); tidak ada provider lain. Konteks dibangun dari `src/content/*` lewat `src/lib/chat-knowledge.ts`, jadi menambah proyek otomatis "diketahui" chatbot.
- **Latar sirkuit hidup** (Canvas 2D, `src/components/background/`) dengan pemantau FPS yang menurunkan kualitas lalu berhenti sendiri di perangkat lemah.
- **Mode efek Penuh/Ringan** (`src/lib/fxStore.ts`, sakelar hanya di footer). Ringan = latar statis, tanpa efek kursor, transisi hanya fade, chip 3D tanpa putaran scroll. `prefers-reduced-motion` mengunci Ringan.
- **Transisi halaman** lewat `document.startViewTransition` manual (`src/lib/pageTransition.ts`, `NavLink`). Nama `page` untuk `view-transition-name` dibuang pipeline CSS Next → dipakai `argy-page`. Komponen `<ViewTransition>` React tidak dipakai (tidak memicu di Next 16.4 untuk pola ini).
- **Efek kursor** (`CursorFx.tsx` + `cursorEngine.ts`; nama berbeda huruf besar-kecil karena Windows tidak membedakan).
- **Filter Karya**: state React lokal, query URL (`?kategori=`) hanya cermin yang bisa dibagikan (versi lama bergantung pada `useSearchParams` setelah `replaceState` dan terbukti tidak memperbarui tampilan).
- **Formulir Kontak**: `POST /api/contact` → Resend (REST, tanpa SDK), honeypot + rate limit + validasi; fallback `mailto:`. **Jalur kirim dengan key asli belum pernah diuji** (hanya tampilan, validasi, respons tiruan, dan fallback 501).
- **Konten tidak dikarang**: nilai `[...]` di `src/content/*` dibiarkan sebagai placeholder.
- **Tata letak halaman proyek**: kartu "Sorotan" dan "Stack" sejajar atas-bawah; anchor chip `project-body` ada di bawah grid (bukan di dalam kolom kanan, supaya Stack tidak turun).

## 6. Deploy ke Vercel (belum dilakukan)

1. Impor repo `Argy1/argyweb` di Vercel (framework Next.js terdeteksi otomatis, pnpm).
2. Isi env di §4 (minimal `NEXT_PUBLIC_SITE_URL`, `GOOGLE_GENERATIVE_AI_API_KEY`, `RESEND_API_KEY`).
3. Deploy, lalu perbarui `NEXT_PUBLIC_SITE_URL` bila alamat final berbeda, dan deploy ulang.
4. Uji: `/id`, `/id/kontak` (kirim pesan uji, cek inbox & spam), chatbot, bagikan tautan untuk cek OG image.
5. Jalankan Lighthouse mobile pada URL produksi.

## 7. Konten proyek (Karya)

Sumber: `src/content/projects.ts` (data + `projectGallery` untuk screenshot). Screenshot di `public/projects/<slug>/`.

| Slug | Catatan |
|---|---|
| `klik-pdpi` | Live (klikpdpi.com). Screenshot dari web lama. |
| `kopaseba` | Dalam pengembangan, **belum ada tautan live**. Screenshot diambil dari repo lokal `D:\Projekan\Kopaseba` (halaman publik; katalog/pembiayaan dilewati karena gambar produk kosong; foto pengurus tidak dipakai). |
| `confindant` | Dalam pengembangan (Flutter + Next.js + Laravel 12 + Gemini). Screenshot dari web lokal dengan **akun & data demo** (bukan data nyata). Konten dari studi kasus web lama. |
| `direktori-pdpi` | Live (direktoripdpi.com). |
| `direktori-ppds` | Sedang dibangun; satu screenshot lokal. |
| `agrivision`, `smart-city-traffic` | Proyek kuliah; screenshot dari proyek lokal di `D:\Semester 5\...`. |
| `mindra` | Lomba UINIC 8.0; screenshot dari `D:\Projekan\Mindra\web`. |
| `kontraku` | Konsep & desain; screenshot dari web lama. |

Riwayat perubahan daftar: TradeMatrix AI, MAGPAD, Logic Gates 3D, argyweb v1, Driving Events dihapus atas permintaan Argy; DigitalPMO diganti Kopaseba; Confindant ditambah. **Daftar di `docs/05-CONTENT.md` (13 proyek) adalah daftar awal dan sudah usang.**

Cara menambah proyek baru: tambah objek di `projects.ts` (teks `id` dan `en`), tambah entri di `projectGallery` (gambar JPG ±100 KB di `public/projects/<slug>/`), lalu `pnpm build` — halaman detail, OG image, sitemap, dan pengetahuan chatbot ikut otomatis. Jumlah proyek di statistik/tautan "Lihat semua N proyek" dihitung otomatis.

## 8. Yang masih terbuka (menunggu Argy)

- `RESEND_API_KEY` (daftar di resend.com dengan email yang sama dengan `profile.email`) dan uji kirim sungguhan.
- Deploy Vercel + `NEXT_PUBLIC_SITE_URL` final.
- Statistik "8 gerbang logika 3D" (`src/content/profile.ts`, `stats.logicGates`), fakta "sedang dibangun: TradeMatrix AI", dan item timeline MAGPAD: apakah ikut dihapus karena proyeknya sudah tidak ada di Karya.
- Tahun yang masih `[tahun]`: Klik PDPI, Direktori PDPI, dan beberapa item timeline.
- Apakah proyek web lama lain (mis. ARIS PDPI) ditampilkan.
- Nomor WhatsApp dan akun TikTok (belum dipasang).
- CV saat ini hanya satu gambar JPG (`public/cv/`); belum ada PDF.
- Opsional: Upstash (rate limit terdistribusi), penundaan 3D untuk menaikkan skor Performance Lighthouse.

## 9. Peringatan dan jebakan yang sudah ditemui

- **Jangan commit rahasia.** Key hanya di `.env.local`. Sebelum push, cari nilai key di berkas yang di-stage.
- Git Bash mengubah argumen berawalan `/` menjadi path Windows (`/id` → `C:/Program Files/Git/id`); tulis tanpa `/` awal atau pakai PowerShell.
- `networkidle` di Playwright tidak pernah tercapai untuk dev server Next (HMR); pakai `load` + jeda.
- Peringatan konsol `KHR_parallel_shader_compile` dari three.js tidak berbahaya (sudah ditangani: `compileAsync` hanya bila ekstensi ada). Peringatan `THREE.Clock deprecated` berasal dari internal R3F.
- Proyek eksternal untuk screenshot (Kopaseba, Confindant) dijalankan lokal **tanpa mengubah repo mereka**; Confindant memakai SQLite sementara lewat variabel env, bukan Postgres aslinya.

## 10. Panduan untuk sesi Claude Code berikutnya (termasuk lewat cloud)

1. Baca `CLAUDE.md`, lalu dokumen ini, lalu `README.md` (detail fitur), baru `docs/01`–`07` bila butuh spesifikasi desain.
2. Jalankan `pnpm install`, salin `.env.example` ke `.env.local` (key tidak ada di repo; minta Argy bila perlu mencoba chatbot/email nyata).
3. Ubah kode lalu `pnpm lint && pnpm typecheck && pnpm build`; untuk perubahan UI jalankan juga `pnpm test:e2e` terhadap build produksi (lihat §3).
4. Aturan proyek tetap berlaku: tanpa hex literal di komponen (pakai token), semua teks UI lewat `messages/*.json`, konten tidak dikarang, aksesibilitas (focus terlihat, `prefers-reduced-motion`, Esc menutup panel).
5. Perbarui dokumen ini setiap ada keputusan atau perubahan status yang berarti.
