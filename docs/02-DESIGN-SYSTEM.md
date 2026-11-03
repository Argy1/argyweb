# 02 — Design System "Silicon"

Token resmi: `reference/styles/tokens.css`. Salin ke `src/styles/tokens.css` dan petakan ke Tailwind v4 lewat `@theme` (mis. `--color-ink: var(--ink)`), supaya kelas seperti `bg-surface`, `text-muted`, `border-line` tersedia. **Tidak ada hex literal di komponen.**

## Konsep

Semua warna diambil dari material chip CPU di hero, supaya halaman dan objek 3D terasa satu dunia:

| Material chip | Token | Peran di UI |
|---|---|---|
| Papan sirkuit biru | `--blue` | Warna utama: tombol primer, link aktif, pita marquee |
| Papan gelap | `--navy` | Kartu gelap, panel kontak, stiker gelap |
| Kaki emas | `--gold` | Highlight teks (stabilo), tombol "Tanya AI", CTA sekunder, bintang marquee |
| Tutup perak | `--steel` | Kartu terang, stiker terang |
| Die ungu | `--violet` | Kartu aksen |
| Cahaya sirkuit | `--glow` | Hover glow, cincin fokus, chip tahap intro aktif |

Latar: `--bg` + pola **grid sirkuit** (kelas `.bg-circuit`): garis 72px sangat tipis + titik di setiap persimpangan.

**Jangan**: rotasi miring pada stiker/kartu, bayangan "keras" offset, warna pastel mint/pink/kuning cerah, gradien ungu-biru. Itu gaya "mainan" yang sudah ditinggalkan.

## Tipografi

| Peran | Font | Bobot | Ukuran |
|---|---|---|---|
| Display (H1 hero) | Gabarito | 800 | `clamp(46px, 7.4vw, 104px)`, line-height .98, tracking -0.04em |
| H1 halaman dalam | Gabarito | 800 | `clamp(44px, 6.6vw, 92px)` |
| H2 section | Gabarito | 800 | `clamp(36px, 5vw, 68px)`, max 15ch, `text-wrap: balance` |
| H3 kartu | Gabarito | 800 | 24–28px |
| Body | Figtree | 400–600 | 17–19px, line-height 1.65–1.75, max ~56ch |
| Label/eyebrow | JetBrains Mono | 500 | 12px, uppercase, tracking .08em |
| Angka besar (intro, stat) | Gabarito | 900 | tabular-nums |

Muat lewat `next/font/google` dengan `display: swap` dan subset `latin`.

## Layout

- Container max 1200px, gutter `max(16px, env(safe-area-inset-*))`, 40px di ≥ 760px.
- Spasi antar section: 120px (desktop), 80px (mobile).
- Hero Beranda tinggi minimal 100svh (pakai `svh`, bukan `vh`, supaya aman di mobile).
- Grid kolom harus menyisakan **zona kosong untuk chip** (lihat `docs/03`, Legibility).

## Komponen

**Navbar** — kapsul `--nav-bg` + blur 14px, border `--line`, tinggi 62px, posisi fixed 14px dari atas. Link: pill 40px; aktif = `bg-ink text-bg`. Toggle bahasa: segmented pill. Tombol tema: lingkaran 44px. Tombol "Tanya AI": pill emas, teks `--tile-ink`.

**Tombol** — tinggi 54px, pill. Primer: `--blue` + teks putih + bayangan biru lembut. Garis: `--surface` + border `--line`. Emas: `--gold` + teks `--tile-ink`. Hover: naik 3px.

**Stiker teknologi (hero)** — pill 38px, font mono 13px, lurus (tanpa rotasi). Variasi: gold, steel, navy (teks putih), surface + border. Hover: glow.

**Kartu bento (Beranda)** — grid 6 kolom, baris 230px, gap 18px. Kartu 1: span 4×2 (dengan deskripsi). Kartu 2–3: span 2. Kartu "Lihat semua": span 6, latar `--ink`, panah emas. Radius 30px. Glyph huruf besar dekoratif di pojok kanan bawah, opacity .17. Hover: `.hover-glow`.

**Kartu karya (halaman Karya)** — header berwarna 170px berisi glyph + nomor + pill status; body `--surface`: nama, jenis · tahun, 3 chip stack, panah. Grid `repeat(auto-fill, minmax(300px, 1fr))`.

**Warna kartu per `tone`** (dari `projects.ts`):

| tone | latar | teks |
|---|---|---|
| blue | `--blue` | `--on-dark` |
| navy | `--navy` | `--on-dark` |
| violet | `--violet` | `--on-dark` |
| gold | `--gold` | `--tile-ink` |
| steel | `--steel` | `--tile-ink` |

Pill status di atas kartu berwarna: `rgba(255,255,255,.5)` dengan teks `--tile-ink`. Kartu navy di mode gelap diberi border `--tile-edge`.

**Panel kontak** — latar `--navy` + grid biru 48px, radius 40px, teks putih. Pill email putih + tombol salin emas. Link: pill outline putih 35%.

**Drawer panel intip** — dari kanan, lebar `min(500px, 100vw)`, scrim navy 38% + blur. Header berwarna sesuai `tone`.

**Chat** — tombol bulat biru 62px kanan bawah; panel 392×560 (mobile: lebar penuh minus 32px). Header biru, avatar emas, gelembung user biru, gelembung bot `--surface-2`, tombol kirim emas.

**Pill rute (prototipe saja)** — di prototipe ada pill URL kiri bawah. **Jangan dibuat** di versi Next.js.

## Gerak

- Easing utama `--ease-out`; transisi halaman: konten fade + naik 18px, 550ms.
- Hover kartu: naik 6px + glow, 300ms.
- Marquee: 34 detik per putaran, berhenti saat `prefers-reduced-motion`.
- Semua animasi dimatikan/dipersingkat saat `prefers-reduced-motion: reduce`.

## Aksesibilitas

- Kontras teks ≥ 4.5:1 di kedua tema (sudah dihitung untuk token; jangan ubah `--muted` tanpa cek ulang).
- Focus ring: 3px `--glow`, offset 3px.
- Target sentuh ≥ 44px.
- Teks di atas kartu `gold/steel` selalu `--tile-ink`.
- Canvas 3D `aria-hidden`, `pointer-events: none`.
