# 04 — Arsitektur

## Struktur folder (target)

```
argyweb/
├─ CLAUDE.md
├─ docs/                         # spesifikasi (jangan dihapus)
├─ reference/                    # token, konten, prototipe acuan
├─ messages/
│  ├─ id.json                    # teks UI (mulai dari reference/content/messages.id.json)
│  └─ en.json
├─ public/
│  ├─ cv/                        # CV dari web lama
│  ├─ certificates/              # gambar/PDF sertifikat dari web lama
│  ├─ projects/[slug]/           # screenshot proyek
│  └─ chip-fallback.webp
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx           # html/body, font, ThemeProvider, NextIntlClientProvider, Navbar,
│  │  │  │                       # ChipCanvas (persisten), Intro, ChatWidget, slot @modal
│  │  │  ├─ page.tsx             # Beranda
│  │  │  ├─ work/page.tsx        # Karya        (/id/karya, /en/work)
│  │  │  ├─ work/[slug]/page.tsx # Detail       (/id/karya/x, /en/work/x)
│  │  │  ├─ about/page.tsx       # Tentang      (/id/tentang, /en/about)
│  │  │  ├─ @modal/default.tsx   # return null
│  │  │  ├─ @modal/(.)work/[slug]/page.tsx   # panel intip (intercepting route)
│  │  │  └─ not-found.tsx
│  │  ├─ api/chat/route.ts       # chatbot streaming
│  │  ├─ sitemap.ts, robots.ts
│  │  └─ opengraph-image.tsx (+ per proyek)
│  ├─ components/
│  │  ├─ layout/ Navbar, Footer, ContactSection
│  │  ├─ home/ Hero, Marquee, FeaturedBento, AboutTeaser
│  │  ├─ work/ FilterBar, WorkCard, WorkGrid
│  │  ├─ project/ ProjectHero, ProjectCover, Highlights, Gallery, PrevNext, ProjectPeek
│  │  ├─ about/ Profile, Stats, StackGroups, Timeline, Certificates, CertificateLightbox
│  │  ├─ three/ ChipCanvas, Chip, ChipParts, CircuitMaterial, useChipAnchors, chipStore
│  │  ├─ intro/ Intro
│  │  ├─ chat/ ChatWidget, ChatPanel
│  │  └─ ui/ Button, Pill, Eyebrow, Card, Drawer, ChipAnchor
│  ├─ content/
│  │  ├─ projects.ts             # dari reference/content/projects.ts
│  │  ├─ profile.ts              # kontak, sosial, CV, fakta
│  │  ├─ certificates.ts         # dari web lama
│  │  └─ timeline.ts
│  ├─ i18n/ routing.ts, request.ts, navigation.ts
│  ├─ lib/ chat-knowledge.ts, seo.ts, utils.ts
│  └─ styles/ globals.css, tokens.css
├─ middleware.ts                 # next-intl
├─ .env.example
└─ playwright.config.ts, tests/
```

Nama folder rute memakai bahasa Inggris (`work`, `about`); URL Indonesia dihasilkan lewat `pathnames` next-intl.

## i18n (next-intl)

```ts
// src/i18n/routing.ts
export const routing = defineRouting({
  locales: ['id', 'en'],
  defaultLocale: 'id',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/work': { id: '/karya', en: '/work' },
    '/work/[slug]': { id: '/karya/[slug]', en: '/work/[slug]' },
    '/about': { id: '/tentang', en: '/about' },
  },
});
```

- Pakai `Link`, `useRouter`, `usePathname` dari `src/i18n/navigation.ts` (bukan dari `next/link`).
- Toggle bahasa: `router.replace({ pathname, params }, { locale: next })` supaya tetap di halaman yang sama.
- `generateStaticParams` untuk locale dan slug proyek (semua halaman statis).
- Metadata: `alternates.languages` untuk hreflang.

## Panel intip (intercepting route)

- Kartu bento di Beranda memakai `<Link href={{ pathname: '/work/[slug]', params: { slug } }} scroll={false}>`.
- Navigasi klien dari Beranda ditangkap `@modal/(.)work/[slug]` → render `<ProjectPeek>` (drawer) di atas Beranda. Tutup = `router.back()`.
- Akses langsung / refresh URL → `work/[slug]/page.tsx` (halaman penuh).
- **Risiko**: kombinasi intercepting route dengan pathname terlokalisasi next-intl bisa tidak tertangkap. Uji dulu di Fase 3. Kalau gagal, fallback: drawer state di klien + `window.history.pushState` ke URL proyek, dan tutup dengan `history.back()`. Catat keputusan di laporan.

## Canvas 3D persisten

- `ChipCanvas` dirender di `[locale]/layout.tsx`, `position: fixed; inset: 0; pointer-events: none; z-index: 1`. Konten `z-index: 2`. Selama intro: `z-index: 101` (di atas overlay).
- Karena layout tidak di-remount saat navigasi, chip tidak reload dan bisa terbang antar halaman.
- `useChipAnchors()`: `IntersectionObserver` + `ResizeObserver` pada semua `[data-chip-anchor]`; pilih anchor aktif; simpan rect ke `chipStore` (Zustand). Saat rute berubah (`usePathname`), scan ulang anchor setelah render.
- Komponen `<Chip>` membaca target dari store di `useFrame` dan me-lerp posisi, skala, opacity.

## State global (Zustand, `chipStore`)

```ts
{
  intro: { progress: number; done: boolean; gone: boolean },
  anchor: { id: string; rect: DOMRect; opacity: number } | null,
  scrollVelocity: number,
  glow: number,
  chatOpen: boolean,
  pendingChatQuestion?: string,   // dari tombol "Tanya AI soal proyek ini"
}
```

## Tema

`next-themes` dengan `attribute="data-theme"`, `defaultTheme="system"`, `enableSystem`. Chip membaca tema lewat `useTheme().resolvedTheme` untuk intensitas environment dan glow.

## Intro

- Komponen klien di layout. Cek `sessionStorage.getItem('argy-intro-seen')`; jika ada, langsung `done` (chip mulai di anchor, tanpa animasi perakitan).
- Progres: `useProgress()` (drei) digabung `document.fonts.ready`; minimum 1,8 detik.
- Overlay `aria-hidden` setelah selesai; tombol Lewati fokus pertama.

## Data & konten

Konten statis di `src/content/*.ts` (bertipe), dibaca server components. Tidak ada database. Detail di `docs/05`.

## Lingkungan

`.env.example`:

```
# Chatbot memakai Gemini (keputusan Argy, 2026-11-02)
GOOGLE_GENERATIVE_AI_API_KEY=
AI_MODEL=gemini-2.5-flash-lite        # opsional
# Rate limit (opsional, Upstash Redis)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_SITE_URL=https://argyweb.vercel.app
```
