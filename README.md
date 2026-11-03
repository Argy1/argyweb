# argyweb

Portofolio 3D Argy Fawwaz Akbar. Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · React Three Fiber · next-intl · next-themes · Zustand · Vercel AI SDK.

Spesifikasi lengkap ada di [`CLAUDE.md`](CLAUDE.md) dan [`docs/`](docs). **Status terkini, keputusan, variabel env, dan daftar yang masih terbuka: [`docs/08-STATUS.md`](docs/08-STATUS.md).**

## Menjalankan

```bash
pnpm install
cp .env.example .env.local   # isi key (lihat docs/08 §4): Gemini untuk chatbot, Resend untuk formulir kontak
pnpm dev                      # http://localhost:3000 → /id
```

| Perintah | Fungsi |
|---|---|
| `pnpm dev` | dev server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm build` / `pnpm start` | build & jalankan produksi |
| `pnpm test:e2e` | Playwright, 92 tes: `visual.spec.ts` (5 halaman × 2 bahasa × 2 tema × 360/768/1280/1440 px, cek scroll horizontal & teks di zona chip, screenshot ke `tests/__screenshots__/`), `fx.spec.ts` (efek, transisi, kursor), `flows.spec.ts` (filter, kontak, CV, salin email) |

Playwright memakai Chrome yang terpasang (`channel: "chrome"`). Untuk menguji server yang sudah jalan: `BASE_URL=http://localhost:3000 pnpm test:e2e`. Tambahkan `?chipdebug` di URL untuk melihat kotak anchor chip.

## Struktur singkat

- `src/app/[locale]/` — Beranda, `work` (/karya), `work/[slug]` (/karya/[slug]), `about` (/tentang), `contact` (/kontak), OG image, 404.
- `src/app/api/chat/route.ts` — chatbot streaming dengan Gemini (`GOOGLE_GENERATIVE_AI_API_KEY`, model dari `AI_MODEL`, default `gemini-2.5-flash-lite`; tanpa key → mode demo kata kunci). Rate limit 20 pesan/10 menit/IP (Upstash bila diisi, selain itu in-memory).
- `src/components/three/` — canvas persisten, chip (geometri & material sesuai `docs/03`), pelacak anchor.
- `src/components/intro/Intro.tsx` — intro "chip dirakit", sekali per sesi.
- `src/content/` — proyek, profil, sertifikat, perjalanan, stack (sumber yang sama untuk halaman & chatbot).
- `messages/id.json`, `messages/en.json` — semua teks UI.

## Keputusan teknis

- **Panel intip** memakai fallback `history.pushState` (bukan intercepting route): aturan rewrite intercepting route Next 16 menangkap navigasi dari *semua* halaman di bawah `[locale]` (termasuk halaman Karya dan prev/next proyek), bertentangan dengan PRD F4.
- **Posisi chip** mengikuti elemen `[data-chip-anchor]` yang menempati ruang kosong nyata di layout; ukurannya diatur CSS per breakpoint di `src/styles/globals.css`.
- **Tanpa drei**: rounded box, environment panel cahaya, dan bayangan dibuat sendiri supaya bundle 3D tetap kecil.
- Mobile: DPR 1, material tanpa clearcoat/anisotropi, environment 64 px, render berhenti saat anchor tersembunyi.
- Screenshot proyek di `public/projects/[slug]/`: dari web lama (Klik PDPI, Direktori PDPI, Kontraku) dan dari aplikasi yang dijalankan lokal (Smart City Traffic, Mindra, AgriVision, Direktori PPDS, Kopaseba, Confindant; halaman publik saja, Confindant memakai data demo). Screenshot pertama dipakai sebagai sampul kartu.
- Formulir Kontak mengirim email sungguhan lewat `POST /api/contact` (Resend, butuh `RESEND_API_KEY`; honeypot + rate limit). Tanpa key atau saat jaringan gagal, formulir jatuh ke `mailto:` dan memberi tahu pengunjung.
- **Latar sirkuit hidup** (`src/components/background/`): Canvas 2D fixed di belakang chip. Menggambar grid 72px sendiri (grid CSS dimatikan setelah frame pertama via `html[data-bg="live"]`), titik bergelombang, jalur bersiku dengan kilatan biru/emas/ungu, kursor menyalakan & mendorong titik (klik/ketuk melepas riak), chip menyalakan papan di sekitarnya (posisi chip dibaca dari `chipMotion.screen`), percikan emas acak, dan makin cepat saat scroll. Warna dibaca dari token CSS. Mulai setelah load + idle + intro selesai; `prefers-reduced-motion` → tidak jalan (grid CSS statis). Mesin memantau FPS nyata: turun ke mode ringan, lalu berhenti sendiri di perangkat tanpa akselerasi GPU (tambahkan `?bgforce` di URL untuk mematikan pemantau saat debugging).
- **Mode efek Penuh/Ringan** (`src/lib/fxStore.ts`, sakelar di footer `FxToggle`): default Penuh, disimpan di `localStorage["argy-fx"]`, dipasang sebagai `html[data-fx="lite"]` oleh inline script sebelum paint (tanpa kedipan). Ringan = latar statis (grid CSS), tanpa efek kursor, transisi halaman hanya fade, chip 3D tetap tampil tapi tanpa putaran scroll/tilt kursor. `prefers-reduced-motion` mengunci Ringan. Bila pemantau FPS latar menyerah, mode beralih otomatis ke Ringan untuk sesi itu dan `FxNotice` menawarkan "Coba efek penuh".
- **Transisi halaman**: `NavLink` (`src/components/ui/NavLink.tsx`) membungkus navigasi dengan `document.startViewTransition` manual (`src/lib/pageTransition.ts`), geser maju/mundur menurut urutan rute (Beranda → Karya → detail → Tentang → Kontak), navbar/chip/kanvas latar/tombol chat diberi `view-transition-name` sendiri sehingga diam. Integrasi `<ViewTransition>` React tidak dipakai karena di Next 16.4 tidak memicu transisi untuk pola ini. Catatan: nama `page` untuk `view-transition-name` dibuang oleh pipeline CSS Next, jadi dipakai `argy-page`. Klik tautan juga memancarkan "sinyal sirkuit" (riak besar) di latar (`signals.ts`).
- **Efek kursor** (`CursorFx.tsx` + `cursorEngine.ts`): kanvas overlay z-40, sorot lembut + jejak percikan, hanya `pointer: fine` + mode Penuh.
- Tanpa WebGL: gambar `public/chip-fallback.webp` (render dari scene) tampil di anchor hero.
