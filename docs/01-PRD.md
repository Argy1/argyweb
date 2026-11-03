# 01 — Product Requirements (PRD)

> **Status implementasi (2026-11-03):** F1–F11 sudah dibangun dan live. Perbedaan dari dokumen ini (ikuti `docs/08`): ada halaman **Kontak** terpisah (`/id/kontak`, `/en/contact`) selain bagian kontak di footer; navbar < 768px memakai menu ☰ (F3); panel intip memakai `history.pushState`, bukan intercepting route (F4); daftar proyek kini 9 (F5); angka "8 gerbang logika" dihapus (F7). Fitur di luar PRD awal: latar sirkuit hidup, mode efek Penuh/Ringan, transisi halaman, efek kursor, formulir kontak (Resend), animasi teks judul scramble/decode.

## Tujuan

1. Membuat rekruter, klien, dan juri lomba **langsung paham** Argy adalah full-stack developer yang kuat di web, mobile, AI, dan 3D, dalam 10 detik pertama.
2. Menjadi **karya desain** itu sendiri: pengalaman 3D yang halus, cepat, dan berkesan.
3. Memudahkan **berbagi link** ke satu proyek (studi kasus) atau ke profil.
4. Memudahkan **menghubungi** Argy (email, LinkedIn, GitHub, CV) dan bertanya lewat chatbot.

## Pengguna

- Rekruter / HR teknis (cepat, ingin bukti nyata: proyek, stack, CV).
- Klien freelance (ingin contoh hasil dan cara kontak).
- Juri lomba / dosen (ingin konteks proyek kampus dan lomba).
- Sesama developer (tertarik detail teknis dan 3D).

## Halaman & rute

Bahasa default `id`. Pathname dilokalisasi.

| Halaman | ID | EN | Isi |
|---|---|---|---|
| Beranda | `/id` | `/en` | Hero, pita keahlian, 3 karya unggulan (bento) + kartu "Lihat semua", ringkasan tentang + angka, kontak |
| Karya | `/id/karya` | `/en/work` | Semua proyek, filter kategori, grid kartu |
| Detail proyek | `/id/karya/[slug]` | `/en/work/[slug]` | Studi kasus: ringkasan, cover + meta, sorotan, stack, screenshot, tanya AI, prev/next |
| Tentang | `/id/tentang` | `/en/about` | Profil, foto, fakta, angka, stack, perjalanan, **sertifikat**, unduh CV |

Bagian **Kontak + footer** tampil di bawah setiap halaman (komponen bersama). Tidak ada halaman kontak terpisah.

## Fitur

### F1. Objek 3D chip CPU persisten
Spesifikasi lengkap di `docs/03`. Ringkas: satu canvas di layout, tidak di-unmount saat pindah halaman, chip berpindah posisi/ukuran per section, berputar mengikuti kecepatan scroll, miring mengikuti kursor (desktop).

### F2. Intro "chip dirakit"
- Muncul **sekali per sesi** (`sessionStorage`), hanya saat pertama masuk situs (rute mana pun).
- Progres 0–100 mengikuti loading asli (font, model/tekstur 3D, environment). Durasi minimum 1,8 detik, maksimum 4 detik (kalau loading lebih lama, intro tetap menunggu tapi tampil label "Hampir siap…").
- 4 tahap: Papan (0–26%), Pin (26–50%), Die (50–74%), Tutup (74–97%); di 100% sirkuit dan ukiran "AF" menyala, layar intro memudar, chip meluncur ke posisi hero.
- Tombol **Lewati**. `prefers-reduced-motion`: intro diganti fade singkat tanpa animasi perakitan.
- Konten halaman sudah dirender di bawah intro (SEO dan LCP tidak terhalang).

### F3. Navigasi
- Navbar kapsul melayang: logo `argy.`, link Beranda / Karya / Tentang / Kontak (Kontak = scroll ke section kontak), toggle bahasa ID/EN, toggle tema, tombol emas "Tanya AI".
- Link aktif berdasarkan rute (Detail proyek menyalakan "Karya").
- Mobile (< 900px): link pindah ke baris kapsul di bawah navbar atau menu sheet; target sentuh ≥ 44px.
- Ganti bahasa mempertahankan halaman yang sama (`/id/karya/x` ↔ `/en/work/x`).

### F4. Panel intip proyek (Beranda)
Klik kartu bento di Beranda → drawer dari kanan berisi ringkasan, stack, tombol "Buka halaman penuh". URL sudah menjadi `/id/karya/[slug]`. Refresh/buka langsung URL itu → halaman penuh. Dari halaman Karya, klik kartu langsung ke halaman penuh.

### F5. Karya + filter
Kategori: Semua, Web, Mobile, AI & Data, 3D, Bisnis (dengan jumlah). Filter tersinkron ke query (`?kategori=web` / `?category=web`) supaya bisa dibagikan.

### F6. Detail proyek
Breadcrumb, eyebrow jenis, judul, ringkasan, tombol kunjungi (jika ada link), tombol "Tanya AI soal proyek ini" (buka chat + kirim pertanyaan otomatis), cover berwarna sesuai `tone` dengan meta (Peran, Tahun, Status, Kategori), Sorotan bernomor, Stack, galeri screenshot (placeholder kalau belum ada), navigasi prev/next melingkar.

### F7. Tentang
Profil + foto, bio, fakta, angka (1.800+ profil dokter, jumlah proyek, 8 gerbang logika), stack, perjalanan (timeline), **sertifikat** (grid kartu, klik untuk lihat gambar/PDF dalam lightbox), tombol **Unduh CV** (file dari web lama).

### F8. Tema
`system` default, toggle manual tersimpan. Chip ikut tema (pencahayaan dan intensitas glow).

### F9. Dua bahasa
Semua teks UI dan konten bilingual. `<html lang>` sesuai. `hreflang` alternates di metadata.

### F10. Chatbot AI
Lihat `docs/06`. Tombol mengambang kanan bawah + tombol "Tanya AI" di navbar. Streaming, saran pertanyaan, menjawab dalam bahasa halaman.

### F11. SEO & sharing
Metadata per halaman per bahasa, Open Graph image dinamis per proyek (`next/og`), sitemap, robots, JSON-LD `Person` dan `CreativeWork`.

## Di luar lingkup (versi 1)

Blog, CMS, login, komentar, analytics selain Vercel Analytics.

## Kriteria selesai (acceptance)

- Semua fitur F1–F11 berfungsi di Chrome, Safari (iOS), Firefox terbaru.
- Tidak ada scroll horizontal di 360px.
- Chip tidak menutupi teks (cek visual di 4 breakpoint, 2 tema).
- Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100.
- Tidak ada teks hardcode di luar file messages/konten.
