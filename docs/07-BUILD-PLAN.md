# 07 — Rencana Build (untuk Claude Code)

> **Status:** semua fase di bawah sudah dikerjakan kecuali deploy ke Vercel (Fase 7). Kotak centang tidak diperbarui satu per satu; lihat `docs/08-STATUS.md` untuk kondisi terkini.

Kerjakan berurutan. Setiap fase diakhiri verifikasi dan laporan singkat ke Argy (apa yang selesai, keputusan yang diambil, placeholder yang masih ada). Jangan lompat fase.

## Fase 0 — Persiapan
- [ ] Baca `CLAUDE.md` dan `docs/01`–`docs/06`.
- [ ] Baca web lama `D:\Projekan\argy-web-main` (read-only). Jangan mengubah apa pun di sana.
- [ ] Bandingkan inventaris konten di `docs/05-CONTENT.md` dengan isi web lama; catat yang belum tercantum.
**Selesai jika**: daftar konten final disepakati dengan Argy.

## Fase 1 — Scaffold & fondasi
- [ ] `create-next-app` (TypeScript, App Router, Tailwind, ESLint, `src/`), pnpm.
- [ ] Salin `reference/styles/tokens.css` → `src/styles/tokens.css`, petakan ke `@theme` Tailwind; kelas `.bg-circuit` di body.
- [ ] Font via `next/font/google` (Gabarito, Figtree, JetBrains Mono).
- [ ] next-intl dengan `routing.ts` (pathname terlokalisasi), middleware, `messages/id.json` & `en.json` dari `reference/content/messages.*.json`.
- [ ] next-themes (`data-theme`), Zustand store kosong.
- [ ] Script `typecheck`, Prettier.
**Verifikasi**: `pnpm lint && pnpm typecheck && pnpm build`; `/id` dan `/en` render; ganti tema berfungsi.

## Fase 2 — Layout & halaman statis (tanpa 3D)
- [ ] Navbar (desktop + mobile), Footer, ContactSection.
- [ ] Beranda: Hero (dengan `ChipAnchor`), Marquee, FeaturedBento, AboutTeaser.
- [ ] Karya: FilterBar (sinkron query), WorkGrid, WorkCard.
- [ ] Detail proyek: semua bagian + PrevNext + `generateStaticParams`.
- [ ] Tentang: Profile, Stats, StackGroups, Timeline, **Certificates + lightbox**, tombol CV.
- [ ] Konten dari `src/content/*` (projects, profile, certificates, timeline).
- [ ] Semua anchor chip ditempatkan sesuai tabel `docs/03` §5 (sementara beri outline debug yang bisa dimatikan).
**Verifikasi**: Playwright screenshot 360/768/1280/1440 × light/dark × 4 halaman; tidak ada scroll horizontal; kontras OK.

## Fase 3 — Panel intip
- [ ] Intercepting route `@modal/(.)work/[slug]` + `ProjectPeek` drawer (focus trap, Esc, scrim).
- [ ] Uji dengan pathname terlokalisasi. Jika gagal → fallback `pushState` (lihat `docs/04`).
**Verifikasi**: klik kartu Beranda → drawer + URL berubah; refresh → halaman penuh; back → kembali ke Beranda di posisi scroll yang sama.

## Fase 4 — Chip CPU 3D
- [ ] `ChipCanvas` persisten di layout (dynamic, ssr:false), Environment + Lightformer, ContactShadows.
- [ ] Geometri & material sesuai `docs/03` §1–2, termasuk jalur sirkuit + pulse + ukiran "AF".
- [ ] `useChipAnchors` + lerp posisi/skala/opacity; scroll spin; kursor (desktop); dorongan saat pindah halaman.
- [ ] Mode mobile (DPR 1, anchor tersembunyi → render dijeda).
**Verifikasi**: chip tidak pernah menutupi teks (screenshot tiap section, 4 breakpoint, 2 tema); FPS desktop ~60, mobile ≥ 45 (Chrome DevTools throttling 4×).

## Fase 5 — Intro
- [ ] Overlay intro sesuai `docs/03` §4 + progres asli + `sessionStorage`.
- [ ] Animasi perakitan 4 tahap, flash, transisi ke hero.
- [ ] Reduced motion & tombol Lewati.
**Verifikasi**: kunjungan pertama → intro; refresh dalam sesi → tanpa intro; reduced motion → fade singkat.

## Fase 6 — Chatbot
- [ ] UI chat, route `/api/chat` streaming, knowledge dari konten, rate limit, mode tanpa API key.
- [ ] Tombol "Tanya AI soal proyek ini".
**Verifikasi**: pertanyaan tentang tiap proyek dijawab sesuai konten; pertanyaan di luar topik ditolak sopan; bahasa mengikuti halaman.

## Fase 7 — SEO, performa, polish
- [ ] Metadata + hreflang, OG image (umum + per proyek), sitemap, robots, JSON-LD.
- [ ] Lighthouse mobile ≥ 85 / 95 / 95 / 100. Optimasi gambar (`next/image`), lazy chat.
- [ ] Fallback tanpa WebGL.
- [ ] Deploy ke Vercel (preview dulu).
**Verifikasi**: Lighthouse, cek share link di WhatsApp/LinkedIn (OG image tampil).

## Cara verifikasi visual (disarankan)

Playwright test `tests/visual.spec.ts`: untuk setiap rute × locale × tema × lebar (360, 768, 1280, 1440), tunggu intro selesai (set `sessionStorage` sebelum load), scroll ke tiap section, simpan screenshot ke `tests/__screenshots__/`. Tinjau screenshot sebelum menandai fase selesai.
