# CLAUDE.md — argyweb (Portofolio 3D Argy Fawwaz Akbar)

Baca file ini dulu, lalu dokumen di `docs/` sesuai urutan nomor. Jangan mulai coding sebelum membaca `docs/01` sampai `docs/04`.

## Ringkasan proyek

Portofolio pribadi **Argy Fawwaz Akbar** (full-stack developer, mahasiswa D4 TRPL Sekolah Vokasi IPB University). Fokus utama: **desain dan pengalaman 3D**. Ciri khas:

- **Satu objek 3D chip CPU** yang hidup di canvas persisten dan **berpindah posisi setiap scroll ke section lain dan setiap pindah halaman**.
- **Intro "chip dirakit"**: papan → pin → die → tutup, mengikuti progres loading, lalu chip meluncur ke hero.
- **Multi-halaman**: Beranda, Karya, Detail Proyek (studi kasus), Tentang. Detail proyek bisa dibuka sebagai **panel intip** dari Beranda (intercepting route).
- **Dark/light mode**, **dua bahasa (ID default, EN)** dengan URL terlokalisasi.
- **Chatbot AI** yang menjawab pertanyaan tentang isi portofolio.
- Gaya visual **"Silicon"**: putih keperakan + grid sirkuit tipis, biru kobalt, navy, emas, perak, ungu. Elegan, bukan seperti mainan.

## Sumber kebenaran (urutan prioritas)

1. Instruksi Argy di chat Claude Code.
2. Dokumen di `docs/` (spesifikasi).
3. `reference/styles/tokens.css` (token desain) dan `reference/content/*` (konten).
4. `reference/prototype/portfolio-prototype.dc.html` (prototipe desain yang sudah disetujui; referensi visual dan perilaku, **bukan** kode untuk di-copy).

Kalau dokumen dan prototipe berbeda, ikuti **dokumen**. Prototipe punya 3 masalah yang sudah diketahui dan HARUS diperbaiki (lihat di bawah).

## Masalah dari prototipe yang WAJIB diselesaikan

1. **Ukuran CPU belum pas** di beberapa section/halaman. Ikuti tabel ukuran dan posisi di `docs/03-3D-CPU-SPEC.md`.
2. **Teks tertutup CPU.** Aturan keras: chip tidak boleh berada di belakang teks yang sedang dibaca. Pakai "zona aman" per section (`docs/03`, bagian Legibility).
3. **Belum responsif di HP.** Semua halaman harus rapi di lebar 360–430px, tanpa scroll horizontal. Chip punya perilaku khusus mobile (`docs/03`, bagian Mobile).

## Stack

- **Next.js (App Router, versi stabil terbaru) + TypeScript (strict)**
- **Tailwind CSS v4** dengan token dari `tokens.css` dipetakan lewat `@theme`
- **React Three Fiber + @react-three/drei** untuk 3D (mesh asli, bukan raymarching layar penuh; alasan di `docs/03`)
- **GSAP** (atau `motion`) untuk timeline intro dan transisi chip; **Lenis** opsional untuk smooth scroll
- **next-intl** untuk i18n dan pathname terlokalisasi
- **next-themes** untuk tema
- **Zustand** untuk state global ringan (section aktif, status intro, panel chat)
- **Vercel AI SDK** untuk chatbot (provider lewat env, lihat `docs/06`)
- Deploy: **Vercel**

Cek versi terbaru paket sebelum install; jangan menebak API yang sudah berubah, baca dokumentasi resminya.

## Peta dokumen

| File | Isi |
|---|---|
| `docs/01-PRD.md` | Tujuan, halaman, fitur, kriteria selesai |
| `docs/02-DESIGN-SYSTEM.md` | Warna, tipografi, komponen, gerak, aksesibilitas |
| `docs/03-3D-CPU-SPEC.md` | Bentuk & material chip, koreografi scroll, intro, ukuran, zona aman, mobile, performa |
| `docs/04-ARCHITECTURE.md` | Struktur folder, routing, i18n, intercepting route, canvas persisten, state |
| `docs/05-CONTENT.md` | Model konten, daftar proyek, migrasi konten dari web lama (sertifikat, CV, kontak) |
| `docs/06-CHATBOT.md` | Chatbot: prompt sistem, sumber pengetahuan, batasan, UI |
| `docs/07-BUILD-PLAN.md` | Tahapan kerja + checklist + cara verifikasi |
| `reference/` | Token, data konten siap pakai, shader & prototipe acuan |

## Aturan kerja

- **Kerjakan per fase** sesuai `docs/07-BUILD-PLAN.md`. Selesaikan dan verifikasi satu fase sebelum lanjut. Laporkan ringkas di akhir tiap fase.
- **Konten tidak boleh dikarang.** Semua teks proyek, angka, tanggal, dan klaim diambil dari `reference/content/` dan web lama (`D:\Projekan\argy-web-main`). Nilai yang masih `[...]` dibiarkan sebagai placeholder dan dicatat di laporan, jangan diisi tebakan.
- **Tidak ada hex literal di komponen.** Semua warna lewat token.
- **Semua teks UI lewat next-intl** (`messages/id.json`, `messages/en.json`). Tidak ada string hardcode di JSX.
- **Aksesibilitas**: elemen interaktif pakai `<button>`/`<a>` asli, focus terlihat, kontras ≥ 4.5:1, `prefers-reduced-motion` dihormati, panel/drawer punya focus trap dan bisa ditutup dengan Esc.
- **Jangan menyalin desain al.is-a.dev.** Situs itu hanya inspirasi untuk ide "objek 3D yang berpindah saat scroll". Layout, warna, tipografi, dan komponen argyweb harus mengikuti dokumen ini.
- Jangan commit secret. API key hanya di `.env.local` (lihat `.env.example`).

## Perintah (isi setelah scaffold)

```bash
pnpm dev          # dev server
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm build        # build produksi
pnpm test:e2e     # Playwright (cek responsif & screenshot)
```

## Definition of Done (seluruh proyek)

- 4 halaman × 2 bahasa × 2 tema tampil benar di 360px, 768px, 1280px, 1440px.
- Chip tidak pernah menutupi teks yang sedang dibaca; ukurannya sesuai tabel di `docs/03`.
- Intro muncul sekali per sesi, bisa dilewati, progres mengikuti loading asli.
- Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95, SEO 100.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` lolos tanpa error.
