# 08 — Status & Catatan Kerja (baca ini setelah CLAUDE.md)

Dokumen ini adalah **sumber kebenaran untuk kondisi terkini** proyek: apa yang sudah jadi, keputusan yang sudah diambil, cara menjalankan, variabel env, dan apa yang masih terbuka. `docs/01`–`07` adalah spesifikasi awal; bila berbeda dengan dokumen ini, **dokumen ini yang terbaru** (spesifikasi awal tidak diubah supaya jejak desain tetap ada).

Terakhir diperbarui: 2026-11-03.

## 1. Ringkasan kondisi

- Semua fase `docs/07` selesai, **termasuk deploy**: situs live di Vercel (`https://argyweb.vercel.app`); merge ke `main` = deploy produksi otomatis, tiap PR dapat preview (lihat §6).
- Fitur utama saat ini: chip CPU 3D persisten yang berpindah antar section dan halaman (di HP/tablet lewat anchor "stage") dan **bisa diputar pengguna** (seret/sentuh/keyboard, 360°), intro "chip dirakit", 5 halaman × 2 bahasa × 2 tema, navbar satu kapsul (menu ☰ di HP), animasi teks scramble/decode pada judul, latar sirkuit hidup + efek kursor + transisi halaman (semua bisa dimatikan lewat mode Ringan), chatbot Gemini dengan konteks panduan situs + indeks proyek, formulir kontak (Resend, fallback `mailto:`), sertifikat dengan lightbox, SEO (metadata, hreflang, OG image, sitemap, JSON-LD).
- Halaman: Beranda `/id`, Karya `/id/karya` (+ detail `/id/karya/[slug]`), Tentang `/id/tentang`, Kontak `/id/kontak`; versi Inggris `/en`, `/en/work`, `/en/work/[slug]`, `/en/about`, `/en/contact`.
- 9 proyek di Karya; 8 punya tautan live (hanya Smart City Traffic yang belum). Unggulan di Beranda: Klik PDPI, Kopaseba, Direktori PDPI. Status Live: Klik PDPI, Kopaseba, Direktori PDPI, Direktori PPDS, Kontraku; Proyek kuliah: Confindant, AgriVision, Smart City Traffic, Mindra.
- Halaman Tentang: sertifikat (6) tampil dengan pratinjau gambar dan bisa dibuka di lightbox; timeline "Jejak sejauh ini" berisi PDPI (2025 – 2026), IPB, UI, SMA.
- Kualitas terakhir terukur: `pnpm lint`, `pnpm typecheck`, `pnpm build` bersih; **136 tes Playwright lolos** (visual 80 + efek 6 + alur 6 + mobile 10 + scramble 16 (termasuk penjaga cakupan judul) + putar chip 8 + SEO 10); Lighthouse mobile (simulasi): Accessibility/Best Practices/SEO 100, Performance ~73–77 (turun dari target 85 karena inisialisasi WebGL; tanpa WebGL ~93). Opsi menunda 3D lebih lama belum diputuskan. **Lighthouse belum diukur ulang** setelah fitur header ☰, chip stage, dan animasi scramble.

## 2. Tumpukan teknologi (versi saat ini)

Next.js 16.4 (App Router, Turbopack, `src/proxy.ts` sebagai middleware), React 19, TypeScript strict, Tailwind CSS v4 (token dipetakan lewat `@theme inline`), React Three Fiber (tanpa drei), next-intl (pathname terlokalisasi), next-themes, Zustand, Vercel AI SDK v7 + `@ai-sdk/google` (Gemini), Upstash Ratelimit (opsional), Playwright. Package manager: **pnpm**.

## 3. Menjalankan

```bash
pnpm install
cp .env.example .env.local     # isi key sesuai §4
pnpm dev                        # http://localhost:3000 → /id
pnpm lint && pnpm typecheck && pnpm build
pnpm test:e2e                   # 136 tes (visual 80 + efek 6 + alur tombol 6 + mobile 10 + scramble 16 (termasuk penjaga cakupan judul) + putar chip 8 + SEO 10)
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

Status di Vercel (dicek 2026-11-03): `GOOGLE_GENERATIVE_AI_API_KEY`, `RESEND_API_KEY`, dan `NEXT_PUBLIC_SITE_URL` **ada** di Production dan Preview. Ketiganya bertipe *sensitive*, jadi nilainya tidak bisa dibaca lewat API/MCP; **validitasnya belum terverifikasi** (uji lewat perilaku: chatbot tanpa catatan "Mode demo", kirim pesan uji di Kontak, tautan di jawaban chatbot).

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
- **Tombol situs live** (2026-11-03): field `link` di `projects.ts` memunculkan tombol di tiga tempat: pill domain + titik hijau (`--ok`) di kartu Karya (`WorkCard.tsx`), tombol "Kunjungi" di panel intip (`ProjectPeek.tsx`), dan pill mengambang di pojok kanan bawah cover halaman detail (tombol biru di hero detail sudah ada sebelumnya). Kartu Karya memakai pola *stretched link*: tautan nama proyek meliput seluruh kartu (`after:absolute after:inset-0`), tombol live berdiri sendiri di atasnya (`z-10`), sehingga tidak ada `<a>` di dalam `<a>`. Kartu kini `<article>`, bukan satu `<a>`.
- **Sertifikat PDF punya pratinjau gambar** (2026-11-03): iframe PDF tidak andal (terutama di HP), jadi tiap sertifikat PDF punya JPG halaman pertama (`image`) selain PDF asli (`file`). Kartu dan lightbox memakai `image`; `file` hanya untuk tombol "Buka file di tab baru". Lightbox mendahulukan gambar dan jatuh ke iframe hanya bila tidak ada gambar.
- **Modal dirender lewat portal ke `document.body`** (`Lightbox.tsx`): `<main>` adalah stacking context (`z-[2]`), jadi dialog di dalamnya tidak bisa menembus navbar (`z-30`) walau `z-[80]`. Modal baru di dalam halaman harus memakai portal juga.

- **Pengetahuan chatbot** (2026-11-03, `src/lib/chat-knowledge.ts`): "melatih" Gemini = melengkapi konteks dan aturan penalaran di prompt; tidak ada fine-tuning. Konteks kini berisi: profil, proyek, stack, perjalanan, sertifikat, **Indeks proyek** (per kategori, status, teknologi, tautan live; disusun otomatis dari `projects.ts` supaya model tidak salah menyaring), dan **panduan situs** (halaman + URL, fitur chip 3D/intro/tema/bahasa/panel intip/efek/formulir kontak). Prompt mengatur cara menafsirkan pertanyaan di luar template (sinonim, typo, campuran ID-EN, pertanyaan lanjutan), kapan menalar vs mengaku tidak tahu, dan penolakan topik di luar portofolio. **Panduan situs ditulis manual di `buildSiteGuide()`; bila fitur situs berubah, perbarui di sana.** Model default `gemini-2.5-flash-lite`; bila jawaban kurang akurat, coba `AI_MODEL=gemini-2.5-flash`. Belum diuji dengan key Gemini asli (hanya isi konteks yang diperiksa).

- **Header satu kapsul di semua lebar** (2026-11-03): ≥768px link langsung di kapsul (di 768–899px tombol Tanya AI hanya ikon); < 768px link pindah ke menu ☰ (`MobileMenu.tsx`: `MenuButton` di kapsul + `MenuPanel` di luar kapsul, karena `backdrop-filter` kapsul memotong elemen `fixed` di dalamnya). Panel solid (`bg-surface`), focus trap + Esc via `useFocusTrap`, tutup saat rute berganti (state turunan `openAt === pathname`), scrim diketuk. Item navigasi dipakai bersama lewat `navItems.ts`. Breakpoint token `nav` (900px) tetap untuk grid halaman; navbar memakai `md:` (768px). Di ≤400px tombol bahasa/tema/AI dikompres supaya muat di 360px.
- **Chip ikut turun di < 1024px (mode "stage")** (2026-11-03): menggantikan `docs/03` §7 ("chip hanya di hero"). Section penting punya anchor kosong rata tengah di alur layout (`<ChipAnchor stage />`, kelas `chip-stage`, ditarik 48px ke atas ke dalam padding section); chip meluncur anchor ke anchor seperti desktop dan tetap tidak menutup teks. Satu section boleh punya dua anchor dengan id sama (stage < 1024px, gutter ≥ 1024px); `anchorTracker.pickAnchor` memakai yang pertama terlihat. Garis aktivasi section di < 1024px = 72% tinggi viewport (desktop 55%) supaya chip mendarat saat anchor mulai masuk layar. **Mode Ringan/`prefers-reduced-motion` di HP (< 768px) = chip hanya di hero** (CSS `html[data-fx="lite"]` menyembunyikan anchor stage dan anchor satu-elemen `home-about`, `contact`, `work-grid`, `project-body`). Ukuran: `--stage-w` = `min(40vw, 22svh)` (HP) / `min(30vw, 28svh)` (tablet); `work-grid`/`project-body` `min(30vw, 18svh)`.

- **Animasi teks "scramble / decode" pada judul** (2026-11-03): huruf mulai sebagai karakter acak (kode dan simbol: `0 1 < > / # $ % & * + = ? A–F`) lalu mengunci satu per satu dari kiri ke kanan. Dipasang lewat `<Scramble as="h1|h2|h3|span">` (`src/components/ui/Scramble.tsx`) di hero, semua H1 dan H2 halaman, dan judul card (kartu proyek, tile unggulan, panel intip, sertifikat, stack, timeline, kartu info Detail/Kontak). **Teks asli tidak pernah diubah** (tetap di HTML untuk SEO/pembaca layar/LCP dan menentukan layout); mesin `src/lib/scrambleEngine.ts` hanya membuat teks asli transparan (`.scr-run`) dan menggambar lapisan `aria-hidden` (`.scr-layer`, anak elemen) di posisi tiap huruf yang diukur dengan `Range.getBoundingClientRect()`, jadi tidak ada layout shift dan latar `.mark` tetap tampil. Aturan: satu `IntersectionObserver` + satu loop rAF; mulai saat ≥60% terlihat; **putar ulang tiap masuk layar lagi, hanya bila elemen sempat sepenuhnya keluar layar ≥ 800 ms**; maksimal 6 animasi bersamaan (sisanya langsung final); menunggu `document.fonts.ready`; hero menunggu intro selesai (`html[data-intro]` / `introGone`); mode Ringan dan `prefers-reduced-motion` = tanpa animasi (animasi yang berjalan diselesaikan seketika saat mode berubah); resize hanya menghentikan animasi bila **lebar** berubah (di HP `resize` juga menyala saat bilah URL bergerak). Durasi `min(1100, 520 + 28·n)` ms; karakter acak diganti tiap 50 ms. Untuk judul di dalam tautan kartu pakai `<Scramble as="span">` DI DALAM tautan, jangan menjadikan tautannya `relative` (stretched link `after:absolute after:inset-0` bergantung pada kartu sebagai induk berposisi). Warna karakter acak ditulis `!important` inline karena `.scr-run *` memakai `!important`. **CSS animasi dibawa mesin sendiri** (`ensureStyle()` menyuntik `<style id="scr-style">` + gaya inline untuk posisi lapisan/karakter), **bukan di `globals.css`**, dan ada pengaman: bila setelah dipasang lapisan tidak `position:absolute` atau teks asli tidak transparan, animasi dibatalkan seketika (judul tidak pernah tampil rusak). Batas beban: maksimal 6 animasi bersamaan (4 di perangkat sentuh) dan 160 karakter acak bersamaan. Jumlah karakter acak selalu = jumlah karakter non-spasi pada teks asli.

- **Chip bisa diputar pengguna** (2026-11-03): `src/components/three/ChipGrab.tsx` memasang `<button class="chip-grab">` transparan (fixed, z-20, di bawah navbar z-30) yang **mengikuti posisi chip** (`chipMotion.screen`) dan hanya aktif saat chip diam (gerak < 1,5 px/frame), cukup terlihat (opacity > 0,55, jari-jari ≥ 36 px) dan intro selesai, jadi tidak menutupi konten (anchor chip memang ruang kosong). **Mouse/pena**: seret **horizontal** = putar 360° (yaw); gerak vertikal diabaikan. **Sentuhan**: geser kiri-kanan = putar 360°; geser atas-bawah = scroll halaman biasa (`touch-action: pan-y`); **tahan ±280 ms lalu geser = mode "pegang chip"** (putar bebas dua sumbu, halaman tidak ikut scroll karena listener `touchmove` non-pasif memanggil `preventDefault`; getar 10 ms + kilatan glow). **Keyboard**: fokus tombol (nama aksesibel dari `chip.label`), panah kiri/kanan memutar, atas/bawah membalik, Esc/Home kembali ke pose normal. **Setelah dilepas**: inersia (peluruhan 0,955/frame), lalu setelah jeda 1,2 dtk pitch kembali ke pose normal lewat jalur terpendek (0,96/frame); yaw tidak punya pose normal (putaran santai lanjut dari sudut terakhir). Keyboard menunda kembalinya +1,8 dtk. Mode Ringan/reduced-motion: tetap bisa diputar (aksi pengguna), tanpa inersia dan kembali lebih cepat. Status gerak ada di `chipMotion.drag` (ditulis `ChipGrab`, dikonsumsi `Chip`); pose dibaca tes lewat `window.__chip` (hanya dengan `?chipdebug`). **Sisi bawah papan punya bola solder BGA** (`InstancedMesh` ≤ 256 bola, area tengah kosong; hanya digambar saat |pitch| > 0,3). Posisi/ukuran/`touch-action` tombol ditulis **inline** (bukan `globals.css`, lihat §9 soal CSS basi) karena menentukan apakah halaman bisa di-scroll. Putar vertikal dengan mouse sengaja **tidak** ada (permintaan Argy): sisi bawah chip di desktop terlihat lewat keyboard (panah atas/bawah) atau lewat mode "pegang" di layar sentuh.

## 6. Deploy ke Vercel (aktif)

- Proyek Vercel `argyweb` (tim `argy-fawwazs-projects`) terhubung ke repo `Argy1/argyweb`. **Push/merge ke `main` = deploy produksi otomatis**; alias produksi `argyweb.vercel.app`. Tiap PR otomatis dibuatkan preview dan bot Vercel mengomentari statusnya (Building → Ready). Build tipikal ±30 detik.
- Env Production + Preview sudah ada (lihat §4). Mengubah env butuh deploy ulang.
- Alur kerja: branch dari `main` → PR → tinjau preview → **squash merge** (riwayat `main` bersih) → hapus branch. Jangan `git push --force` (diblokir di sesi cloud; bila branch sudah di-squash/rebase-merge, mulai branch baru dari `main`).
- Pemantauan setelah deploy: status deployment `READY` dan tanpa error runtime (Vercel MCP: `get_deployment`, `get_runtime_errors`).
- **Masih perlu diuji manual di produksi**: chatbot dengan Gemini asli, kirim pesan uji di `/id/kontak` (cek inbox dan spam), `NEXT_PUBLIC_SITE_URL` = alamat final, bagikan tautan untuk cek OG image, Lighthouse mobile pada URL produksi.

## 7. Konten proyek (Karya)

Sumber: `src/content/projects.ts` (data + `projectGallery` untuk screenshot). Screenshot di `public/projects/<slug>/`.

Proyek dengan `link` di `projects.ts` otomatis mendapat tombol situs live (pill domain di kartu Karya, tombol di panel intip, pill di cover halaman detail). Pembaruan 2026-11-03: tahun Klik PDPI dan Direktori PDPI = 2025; semua tautan di bawah diberikan Argy.

| Slug | Status | Tautan live | Catatan |
|---|---|---|---|
| `klik-pdpi` | Live | klikpdpi.com | 2025. Screenshot dari web lama. |
| `kopaseba` | Live | kopaseba.vercel.app | Screenshot dari repo lokal `D:\Projekan\Kopaseba` (halaman publik; katalog/pembiayaan dilewati karena gambar produk kosong; foto pengurus tidak dipakai). |
| `confindant` | Proyek kuliah | confindant.vercel.app | Flutter + Next.js + Laravel 12 + Gemini. Screenshot dari web lokal dengan **akun & data demo** (bukan data nyata). Konten dari studi kasus web lama. |
| `direktori-pdpi` | Live | direktoripdpi.com | 2025. Stack dibaca dari repo `Argy1/pdpi-member` (React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Supabase). |
| `direktori-ppds` | Live | direktori-ppds.vercel.app | Satu screenshot lokal. Stack dibaca dari repo `Argy1/Direktori-PPDS` (Next.js, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Three.js). |
| `agrivision` | Proyek kuliah | agrivision-blond-nine.vercel.app | Screenshot dari proyek lokal di `D:\Semester 5\...`. |
| `smart-city-traffic` | Proyek kuliah | (belum ada) | Screenshot dari proyek lokal di `D:\Semester 5\...`. |
| `mindra` | Proyek kuliah | web-omega-one-69.vercel.app/beranda | Pernah ikut lomba UINIC 8.0 (masih tertulis di ringkasan dan sorotan proyek, sudah tidak di timeline); screenshot dari `D:\Projekan\Mindra\web`. |
| `kontraku` | Live | kontraku.vercel.app | Screenshot dari web lama. |

Riwayat perubahan daftar: TradeMatrix AI, MAGPAD, Logic Gates 3D, argyweb v1, Driving Events dihapus atas permintaan Argy; DigitalPMO diganti Kopaseba; Confindant ditambah. **Daftar di `docs/05-CONTENT.md` (13 proyek) adalah daftar awal dan sudah usang.**

Cara menambah proyek baru: tambah objek di `projects.ts` (teks `id` dan `en`), tambah entri di `projectGallery` (gambar JPG ±100 KB di `public/projects/<slug>/`), lalu `pnpm build` — halaman detail, OG image, sitemap, dan pengetahuan chatbot ikut otomatis. Jumlah proyek di statistik/tautan "Lihat semua N proyek" dihitung otomatis.

Cara menambah sertifikat: taruh berkas di `public/certificates/` (nama kebab-case), tambah entri di `src/content/certificates.ts`. Untuk PDF, render dulu halaman pertamanya ke JPG dengan poppler (di mesin Argy: `C:\Users\argyf\.claude\poppler\...\Library\bin`, sudah ada di PATH):

```bash
pdftoppm -jpeg -jpegopt quality=82 -r 130 -singlefile nama.pdf nama   # → nama.jpg
```

lalu isi `image: "/certificates/nama.jpg"` dan `file: "/certificates/nama.pdf"`. Gambar langsung (PNG/JPG) cukup memakai `image`.

## 8. Yang masih terbuka (menunggu Argy)

- **Uji sungguhan di produksi** (env sudah ada, nilainya belum terverifikasi): chatbot Gemini (tidak ada catatan "Mode demo"; coba pertanyaan di luar template), formulir Kontak (Resend tanpa domain terverifikasi hanya boleh mengirim ke email pemilik akun Resend), dan `NEXT_PUBLIC_SITE_URL` = alamat produksi final.
- **Uji di HP asli** (belum bisa diukur dari sandbox tanpa GPU): menu ☰; gerak chip antar section; animasi scramble (±1 detik hanya perkiraan, di sandbox terukur 2–3 detik); dan **putar chip**: kecepatan inersia, ambang tahan 280 ms untuk mode "pegang chip", geser atas-bawah harus tetap men-scroll, tahan lalu geser tidak boleh men-scroll. Angka yang mudah disetel ada di `ChipGrab.tsx` (`HOLD_MS`, `SLOP`) dan `Chip.tsx` (peluruhan inersia 0,955; kembali ke pose normal 0,96 setelah 1,2 dtk).
- **Lighthouse mobile** pada URL produksi setelah fitur baru (acuan Performance ±73–77; jangan lebih buruk).
- **Hapus branch remote** `claude/pahami-projek-dokumentasi-sbq21x` (sudah tergabung): proxy git sesi cloud menolak penghapusan branch. Lewat GitHub: Branches → ikon tempat sampah, atau `git push origin --delete claude/pahami-projek-dokumentasi-sbq21x`. Agar otomatis ke depannya: Settings → General → *Automatically delete head branches*.
- Repo `Argy1/pdpi-member` (di luar argyweb) punya berkas `.env` yang ter-commit (repo private); cek isinya dan pastikan tidak ada rahasia selain key publik.
- Tidak ada lagi tahun `[tahun]` yang tersisa. Timeline "Jejak sejauh ini" kini: PDPI (2025 – 2026), IPB University, Universitas Indonesia, SMA Negeri 2 Tambun Selatan (item UINIC 8.0 dan EPIC 2026 dihapus atas permintaan Argy, 2026-11-03).
- Smart City Traffic belum punya tautan live.
- Apakah proyek web lama lain (mis. ARIS PDPI) ditampilkan.
- Nomor WhatsApp dan akun TikTok (belum dipasang).
- CV saat ini hanya satu gambar JPG (`public/cv/`); belum ada PDF.
- Opsional: Upstash (rate limit terdistribusi), penundaan 3D untuk menaikkan skor Performance Lighthouse, `RenderPump` berhenti render saat chip di luar layar (hemat baterai HP), dan animasi scramble "sekali per judul" bila "setiap masuk layar" terasa ramai (satu konstanta di `scrambleEngine.ts`).

## 9. Peringatan dan jebakan yang sudah ditemui

- **Jangan commit rahasia.** Key hanya di `.env.local`. Sebelum push, cari nilai key di berkas yang di-stage.
- Git Bash mengubah argumen berawalan `/` menjadi path Windows (`/id` → `C:/Program Files/Git/id`); tulis tanpa `/` awal atau pakai PowerShell.
- `networkidle` di Playwright tidak pernah tercapai untuk dev server Next (HMR); pakai `load` + jeda.
- Peringatan konsol `KHR_parallel_shader_compile` dari three.js tidak berbahaya (sudah ditangani: `compileAsync` hanya bila ekstensi ada). Peringatan `THREE.Clock deprecated` berasal dari internal R3F.
- Proyek eksternal untuk screenshot (Kopaseba, Confindant) dijalankan lokal **tanpa mengubah repo mereka**; Confindant memakai SQLite sementara lewat variabel env, bukan Postgres aslinya.
- `pnpm start --port 3250` yang lama bisa tetap hidup dan membuat start berikutnya gagal `EADDRINUSE`. Cari PID-nya (`netstat -ano | findstr 3250`), pastikan itu `next start` milik sendiri (bukan dev server di 3000), lalu hentikan. Jangan `pnpm build` saat server produksi atau suite Playwright sedang memakai `.next`; hentikan dulu.
- Pane browser pratinjau kadang menampilkan halaman setengah transparan saat animasi masuk; tunggu ~2 detik sebelum screenshot. Lewati intro dengan `sessionStorage.setItem("argy-intro-seen","1")` lalu muat ulang.
- Tautan Mindra memakai path `/beranda`; label domain di pill tanpa path (`label` terpisah dari `href` di `projects.ts`).
- **Cache build bisa menyajikan CSS lama.** Di build lokal dengan `.next` lama dan di build Vercel (cache build dipulihkan antar deploy), aturan baru di `globals.css` sempat **tidak ikut** ke CSS yang disajikan padahal JS-nya baru. Akibatnya (insiden 2026-11-03, produksi): animasi judul tampil rusak. Lokal: `rm -rf .next` lalu build ulang. Aturan umum: **jangan menaruh CSS yang menentukan kebenaran perilaku fitur JS di `globals.css` saja**; bawa bersama fiturnya (mesin scramble menyuntik CSS-nya sendiri) dan pastikan ada pengaman bila gaya tidak berlaku. Setelah deploy, cek CSS produksi (`curl` berkas `/_next/static/**/*.css` dan `grep` aturan baru), bukan hanya status `READY`. Cara memaksa build tanpa cache di Vercel: Redeploy dengan opsi *Use existing Build Cache* dimatikan.
- **Sandbox cloud**: jaringan hanya mengizinkan host tertentu (situs referensi seperti al.is-a.dev dan `*.vercel.app` ditolak). Host baru harus diizinkan di pengaturan jaringan lingkungan. Jangan memakai `pkill -f "next dev"` (pola ikut cocok dengan perintah shell sendiri dan mematikannya); pakai `fuser -k 3250/tcp`.
- **Variabel Vercel bertipe sensitive** tidak bisa dibaca lewat API; verifikasi lewat perilaku situs.
- **Memverifikasi aset produksi lewat `web_fetch_vercel_url`**: respons di atas ±90 KB disimpan ke berkas (aman, tinggal `grep`), tetapi chunk JS yang lebih kecil **dicetak inline** dan bisa membanjiri sesi. Hindari mengambil banyak chunk sekaligus. Cara hemat: ambil HTML halaman (tersimpan ke berkas), cari `I[<id>,[...],"NamaKomponen"]` di payload RSC, dan ambil satu-dua chunk saja. Nama chunk produksi (Vercel) **tidak sama** dengan build lokal.
- **Playwright `page.clock`** menahan hidrasi React (timer palsu): majukan jam dulu sampai halaman terhidrasi sebelum membekukan frame animasi. Kartu Karya di-render ulang sesaat setelah hidrasi (kunci kartu mengikuti filter): beri jeda di tes sebelum memegang elemen kartu. Playwright menolak `.click()` pada teks di kartu karena tautan kartu (stretched link) menutupinya; klik koordinat.
- Lint React 19 melarang melewatkan `ref` objek saat render (`react-hooks/refs`); pakai callback ref yang stabil (`useCallback`, boleh mengembalikan fungsi pembersih).
- `tests/__screenshots__/` diabaikan git (hasil tes visual hanya untuk tinjauan lokal).

## 10. Panduan untuk sesi Claude Code berikutnya (termasuk lewat cloud)

1. Baca `CLAUDE.md`, lalu dokumen ini, lalu `README.md` (detail fitur), baru `docs/01`–`07` bila butuh spesifikasi desain.
2. Jalankan `pnpm install`, salin `.env.example` ke `.env.local` (key tidak ada di repo; minta Argy bila perlu mencoba chatbot/email nyata).
3. Ubah kode lalu `pnpm lint && pnpm typecheck && pnpm build`; untuk perubahan UI jalankan juga `pnpm test:e2e` terhadap build produksi (lihat §3).
4. Aturan proyek tetap berlaku: tanpa hex literal di komponen (pakai token), semua teks UI lewat `messages/*.json`, konten tidak dikarang, aksesibilitas (focus terlihat, `prefers-reduced-motion`, Esc menutup panel).
5. Alur git: branch dari `main` terbaru → commit → PR (draft) → tinjau preview Vercel → squash merge → hapus branch. Merge ke `main` memicu deploy produksi, jadi pastikan `pnpm lint && pnpm typecheck && pnpm build` bersih dan tes relevan lolos sebelum menggabungkan.
6. Perbarui dokumen ini setiap ada keputusan atau perubahan status yang berarti.

## 11. Catatan perubahan

**2026-11-03 (SEO untuk pencarian nama)** — lihat `docs/09-SEO.md`:
- Kode: JSON-LD `WebSite` + `Person` (`@graph`, `@id`, `alternateName`, `knowsAbout`, `sameAs`) di Beranda dan `ProfilePage` di Tentang; judul beranda memuat "Portofolio/Portfolio"; nama lengkap ada di lead hero (teks terlihat); deskripsi proyek dipotong ≤160 (`trimDescription`); Open Graph lengkap (siteName, locale, gambar) di Karya/Tentang/Kontak yang sebelumnya **tanpa gambar OG** karena menimpa `openGraph` layout (`openGraphFor` di `seo.ts`); `lastmod` di sitemap; meta robots `max-image-preview: large`; tag verifikasi lewat env `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION`.
- Tes baru `tests/seo.spec.ts` (10 tes); total 136 tes lolos di build bersih.
- **Tidak bisa dilakukan dari kode** (menunggu Argy): daftar di Google Search Console + isi `GOOGLE_SITE_VERIFICATION` di Vercel, kirim sitemap, minta pengindeksan, tautkan situs dari GitHub/LinkedIn/Instagram, pertimbangkan domain sendiri. Status indeks Google belum diketahui (belum terlihat di pencarian per 2026-11-03).

**2026-11-03 (putar chip 3D + judul terlewat)**:
- Fitur putar chip (lihat §5): seret/sentuh/keyboard, inersia, kembali ke pose normal, sisi bawah BGA. Berkas baru: `ChipGrab.tsx`, tes `tests/chip-rotate.spec.ts` (8 tes, termasuk **sentuhan sungguhan lewat CDP `Input.dispatchTouchEvent`**: geser horizontal memutar tanpa scroll, geser vertikal men-scroll tanpa memutar, tahan lalu geser memutar bebas tanpa scroll).
- Animasi judul: H1 "Kenalan dengan Argy" dan kalimat besar Beranda ikut beranimasi; tes penjaga cakupan `tests/scramble-coverage.spec.ts`.
- Pose dilihat lewat `window.__chip` (`?chipdebug`). Tes memakai batas waktu longgar karena frame lambat di mesin tanpa GPU.

**2026-11-03 (perbaikan insiden: animasi judul rusak di produksi)**:
- Gejala (dilaporkan Argy dari HP): di produksi karakter acak tampil sebagai teks **tambahan** setelah judul ("alive.Ibuildwebappsthat?" + satu baris simbol), layout melompat, terasa berat. Penyebab: CSS produksi tidak memuat aturan `.scr-*` (cache build Vercel menyajikan CSS lama), jadi lapisan karakter acak mengalir inline dan teks asli tidak transparan. Terkonfirmasi dengan mengambil CSS produksi (`.scr-layer`, `.scr-run`, `.scr-ch`: 0 kemunculan, sedangkan `chip-stage` ada).
- Perbaikan: mesin membawa CSS sendiri + gaya inline + pengaman pembatalan; CSS `.scr-*` dihapus dari `globals.css`; batas beban perangkat sentuh dan total karakter. Karakter acak = jumlah huruf asli (diuji).
- Tes baru (3, total scramble 16 (termasuk penjaga cakupan judul) + putar chip 8): jumlah slot = huruf asli, regresi "semua CSS situs hilang" (judul tidak tumbuh), pengaman bila gaya lapisan dipatahkan. Tes putar ulang diberi jeda longgar (frame lambat di mesin tanpa GPU membuat pemberitahuan IntersectionObserver terlambat).
- Tes `fx.spec.ts` "transisi halaman" ternyata **sudah tidak stabil sebelum animasi judul ada** (gagal 3 dari 6 di `e3d9cfb`, 1 dari 4 di `main`): pembersihan `data-vt` kadang lewat dari jeda tetap 1,2 dtk di mesin tanpa GPU. Diganti `expect.poll` dengan batas 8 dtk (properti yang sama diuji: `data-vt` akhirnya hilang).
- Judul yang terlewat: H1 halaman Tentang ("Kenalan dengan Argy") tidak ikut dipasangi `<Scramble>`, dan kalimat besar di Beranda ("Saya suka mengubah masalah nyata…", `<p>`) belum termasuk cakupan. Keduanya kini beranimasi (`<Scramble as="p">` ditambahkan). **Tes penjaga cakupan** `tests/scramble-coverage.spec.ts` (tanpa browser) gagal bila ada `<h1>`/`<h2>`/`<h3>` tanpa `<Scramble>` kecuali `sr-only` dan 404 tingkat akar; diuji gagal pada kode lama dan lolos pada kode baru.
- Pelajaran: verifikasi pasca-deploy sebelumnya hanya memeriksa teks halaman dan `READY`, tidak memeriksa CSS yang disajikan. Lihat §9.

**2026-11-03 (penutupan: gabung ke `main`, pembersihan branch, dokumentasi)**:
- Seluruh pekerjaan hari ini digabung ke `main`: PR #1 (chatbot, konten, stack, header ☰ + chip stage; rebase-merge), #2 (judul hero; squash), #3 (animasi scramble + dokumentasi; squash), dan **#4** (perbaikan animasi judul yang rusak di produksi + H1 Tentang dan kalimat Beranda + **chip bisa diputar**; squash `0b30269`). Branch kerja **lokal** dihapus; **branch remote masih ada** (lihat §8).
- Dokumentasi diperbarui: `docs/08` (status, deploy aktif, yang terbuka, jebakan, alur git), `README.md`, `CLAUDE.md`, dan banner status di `docs/01`–`07` (spesifikasi awal tidak ditulis ulang; banner menunjuk ke dokumen ini).
- Verifikasi sebelum merge PR #4: `pnpm typecheck`, `pnpm lint`, `pnpm build` (dari nol) bersih; **126 tes Playwright lolos** terhadap build produksi (112 tes pada PR #3).
- **Verifikasi produksi setelah merge #4** (deploy `0b30269`): status `READY` di `argyweb.vercel.app`; tanpa error runtime (1 jam); chunk JS yang disajikan memuat komponen putar chip dengan kode yang sama (`chip-grab`, `touch-action: pan-y`, `touchmove` non-pasif, tahan 280 ms, tombol panah) dan `ProjectPeek` memakai `Scramble`; CSS utama memuat `chip-grab` dan **sengaja tidak** memuat `.scr-*` (mesin membawa CSS sendiri); `/id/tentang` memuat "Kenalan dengan Argy", `/id` memuat "Saya suka mengubah masalah nyata…"; tidak ada penanda error dan tidak ada sisa teks dari bug lama. **Tidak terverifikasi**: string `scr-style` di chunk mesin animasi (chunk-nya tidak bisa ditentukan dari HTML tanpa mengunduh semua chunk), serta perilaku di perangkat nyata (HP/GPU).

**2026-11-03 (animasi teks judul)**:
- Animasi scramble/decode pada judul (lihat §5). Berkas baru: `src/lib/scrambleEngine.ts`, `src/components/ui/Scramble.tsx`, `tests/scramble.spec.ts` (10 tes: teks akhir identik, tanpa layout shift, `aria-hidden`, nama aksesibel utuh, putar ulang, mode Ringan, reduced-motion, menunggu intro, tautan kartu utuh).
- Catatan uji: durasi animasi nyata di sandbox tanpa GPU 2–3 detik (rAF lambat karena WebGL software); di perangkat dengan GPU mengikuti rumus di §5. Tes memakai timeout longgar. Jam palsu Playwright (`page.clock`) menahan hidrasi React, jadi untuk membekukan frame majukan jam dulu sampai halaman terhidrasi.
- Jebakan: bila `.next` lama dipakai ulang, CSS baru bisa tidak ikut ke build (CSS `.scr-*` sempat tidak tersaji); `rm -rf .next` lalu build ulang.
- Verifikasi: typecheck, lint, build bersih; 112 tes Playwright lolos pada build produksi; tampilan diperiksa di 390px dan 1280px.
- Belum diukur: Lighthouse mobile pada preview (acuan Performance ±73–77), dan rasa animasi di HP/GPU asli.

**2026-11-03 (judul hero)**:
- Kata sorotan emas judul hero diganti atas permintaan Argy karena "effortless" bisa terbaca "tanpa usaha": EN "effortless" → "delightful", ID "enak dipakai" → "memukau" (`messages/*.json`, `hero.h1b`). Kata biru "alive" / "terasa hidup" tetap. `reference/content/messages.*.json` (spesifikasi awal) sengaja tidak diubah.

**2026-11-03 (header HP/tablet + chip ikut turun)**:
- Header: baris link kedua di < 900px dihapus; kini satu kapsul (menu ☰ di HP, link inline di ≥768px). Offset atas halaman `pt-[150px]` → `pt-[112px] md:pt-[120px]`.
- Chip: anchor stage di Beranda (karya, tentang, kontak), Karya (grid), Detail (isi), Tentang (stack, perjalanan), Kontak (formulir). Lihat §5.
- Verifikasi: typecheck, lint, build bersih; 102 tes Playwright lolos terhadap build produksi.
- Tes baru `tests/mobile.spec.ts` (10 tes: menu ☰, Esc/fokus, kapsul tidak melimpah di 360/390/768, label Tanya AI di 900px, anchor stage dan mode Ringan).

**2026-11-03 (pembersihan konten usang + chatbot)**:
- Dihapus atas permintaan Argy: statistik "8 gerbang logika 3D" (`stats.logicGates`, kartu di `Stats.tsx`, `stats.gates` di messages) dan fakta "Sedang dibangun / Building now: TradeMatrix AI dan Direktori PPDS" (`about.facts`). Beranda kini 2 kartu statistik, Tentang 3.
- Stack dirapikan: "Dashboard web" dibuang dari Smart City Traffic, "Mobile" dibuang dari Kontraku (bukan teknologi). Stack Direktori PDPI dan Direktori PPDS diganti dengan teknologi asli yang dibaca dari `package.json`/README repo `Argy1/pdpi-member` (React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Supabase) dan `Argy1/Direktori-PPDS` (Next.js, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Three.js).
- Chatbot: panduan situs + indeks proyek + aturan penalaran di prompt (lihat §5 "Pengetahuan chatbot").
- Verifikasi: typecheck, lint, build bersih; 80 tes visual Playwright lolos terhadap build produksi (tes efek/alur tombol tidak dijalankan ulang).

**2026-11-03 (sesi lanjutan)** — commit `70d381e` dan setelahnya:
- Sertifikat: 4 PDF kini punya pratinjau JPG; kartu menampilkan gambar (ikon dokumen kecil menandai yang berasal dari PDF), klik membuka lightbox berisi gambar, PDF asli lewat tombol "Buka file di tab baru". Sebelumnya kartu hanya placeholder "PDF" dan lightbox memakai iframe PDF yang tidak tampil.
- Lightbox dipindah ke portal `document.body` (sebelumnya tertimpa navbar). Berlaku juga untuk galeri screenshot proyek.
- Tombol situs live di kartu Karya, panel intip, dan cover detail (lihat §5).
- Konten proyek: tahun Klik PDPI dan Direktori PDPI = 2025; tautan live Kopaseba, Confindant, Direktori PPDS, Mindra, Kontraku, AgriVision; status PPDS, Kopaseba, Kontraku → Live; Confindant dan Mindra → Proyek kuliah.
- Timeline: PDPI = 2025 – 2026; item UINIC 8.0 dan EPIC 2026 dihapus. Jawaban demo chatbot disesuaikan (pendidikan = timeline selain PDPI; "lomba" = sertifikat kategori competition).
- Verifikasi: `pnpm lint` dan `pnpm typecheck` bersih setelah semua perubahan; 92 tes Playwright lolos pada build setelah perubahan sertifikat/tombol live. Build setelah perubahan konten terakhir (tautan, status, timeline) sudah dibuat dan diperiksa manual di browser; suite Playwright penuh untuk build itu belum tercatat selesai.

**2026-11-02/03 (sesi pembangunan)** — lihat §5, §7, dan README untuk keputusan teknis, penghapusan/penambahan proyek, formulir kontak, latar sirkuit hidup, mode efek, dan transisi halaman.
