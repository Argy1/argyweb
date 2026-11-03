# 05 — Konten

> **Status implementasi (2026-11-03):** konten yang berlaku ada di `src/content/*` (9 proyek, 6 sertifikat, timeline 4 item) dan dijelaskan di `docs/08` §7; daftar proyek di dokumen ini adalah rencana awal. Stack Direktori PDPI dan Direktori PPDS dibaca dari repo aslinya. Statistik "8 gerbang logika" dan fakta "Sedang dibangun" sudah dihapus.

## Prinsip

- Semua konten bertipe di `src/content/*.ts`, bilingual (`id`, `en`).
- **Jangan mengarang.** Sumber yang sah hanya: (1) `reference/content/*` (sudah disetujui Argy di prototipe), (2) web lama di `D:\Projekan\argy-web-main`, (3) jawaban Argy.
- Placeholder ditulis `[...]` dan tetap tampil apa adanya sampai diisi. Kumpulkan daftar placeholder di laporan tiap fase.

## Sudah tersedia (dari prototipe)

| File | Isi |
|---|---|
| `reference/content/projects.ts` | 13 proyek lengkap: slug, nama, glyph, kategori, tone warna, tahun, link, stack, dan teks ID/EN (jenis, status, peran, ringkasan, 3 sorotan). 3 pertama = unggulan Beranda. Juga `timeline` dan `stackGroups`. |
| `reference/content/messages.id.json` / `.en.json` | Semua teks UI dari prototipe (navbar, hero, section, intro, chat, dsb.) |

> **Usang:** daftar 13 proyek di bawah adalah rencana awal. Daftar yang berlaku sekarang (9 proyek: Klik PDPI, Kopaseba, Confindant, Direktori PDPI, Direktori PPDS, AgriVision, Smart City Traffic, Mindra, Kontraku) ada di `src/content/projects.ts` dan dijelaskan di `docs/08-STATUS.md` §7.

Urutan proyek awal: Klik PDPI, TradeMatrix AI, DigitalPMO, Direktori PDPI, Direktori PPDS, AgriVision, Smart City Traffic, Mindra, Kontraku, Driving Events, MAGPAD, Logic Gates 3D, argyweb v1.

## WAJIB diambil dari web lama (`D:\Projekan\argy-web-main`)

Web lama berisi konten yang tidak ada di prototipe. Di **Fase 0**, telusuri repo lama (komponen halaman, folder data/konten, `public/`, file i18n) dan buat inventaris berikut. Salin aset (gambar, PDF) ke `public/` versi baru dengan nama file yang rapi (kebab-case).

| Konten | Tujuan di proyek baru | Catatan |
|---|---|---|
| **Sertifikat** (judul, penerbit, tanggal, gambar/PDF, link verifikasi) | `src/content/certificates.ts` + `public/certificates/` | Tampil di halaman Tentang (grid + lightbox). Tambahkan jumlahnya sebagai stat bila relevan. |
| **CV** (file PDF) | `public/cv/` | Tombol "Unduh CV" di Tentang dan link di Kontak. Kalau ada versi ID & EN, tampilkan sesuai bahasa. |
| **Kontak** (email, nomor WA bila ada, lokasi) | `src/content/profile.ts` | Ganti placeholder `[email kamu]` di prototipe. Tampilkan email sebagai teks yang bisa disalin. |
| **Sosial media** (GitHub, LinkedIn, Instagram, dll.) | `src/content/profile.ts` | GitHub yang sudah diketahui: `github.com/Argy1`. |
| **Foto profil** | `public/profile/` | Ganti placeholder foto di Tentang. |
| **Pengalaman kerja/organisasi & pendidikan** | `src/content/timeline.ts` | Lengkapi `[tahun]` di item PDPI dan tambah item yang belum ada. *(Selesai 2026-11-03: PDPI = 2025 – 2026; item UINIC 8.0 dan EPIC 2026 dihapus atas permintaan Argy.)* |
| **Proyek yang tidak ada di daftar 13** | tambahkan ke `projects.ts` | Tanyakan Argy apakah ditampilkan. |
| **Screenshot proyek** | `public/projects/[slug]/` | Ganti placeholder galeri di detail proyek. |
| **Tahun proyek** yang masih `[tahun]` | `projects.ts` | Klik PDPI, Direktori PDPI, Logic Gates 3D, argyweb v1. *(Selesai 2026-11-03: Klik PDPI dan Direktori PDPI = 2025; dua lainnya sudah dihapus dari Karya. Lihat `docs/08` §7.)* |
| **Skill / tools tambahan** | `stackGroups` | Hanya yang benar-benar dipakai. |
| **Teks bio/tentang** yang lebih lengkap | `messages/*.json` | Boleh dipakai bila lebih tepat dari versi prototipe. |

Setelah inventaris selesai, kirim ringkasan ke Argy: apa yang ditemukan, apa yang akan dipakai, dan apa yang masih kosong.

## Skema yang perlu ditambahkan

```ts
// src/content/certificates.ts
export interface Certificate {
  id: string;
  title: Record<Locale, string>;
  issuer: string;
  date: string;              // 'YYYY-MM' atau 'YYYY'
  category?: 'course' | 'competition' | 'organization' | 'other';
  image?: string;            // /certificates/xxx.webp
  file?: string;             // /certificates/xxx.pdf
  credentialUrl?: string;
}

// src/content/profile.ts
export const profile = {
  name: 'Argy Fawwaz Akbar',
  role: { id: 'Full-stack developer', en: 'Full-stack developer' },
  email: '[dari web lama]',
  location: 'Indonesia (WIB, UTC+7)',
  socials: [{ label: 'GitHub', href: 'https://github.com/Argy1' } /* + dari web lama */],
  cv: { id: '/cv/[file].pdf', en: '/cv/[file].pdf' },
  photo: '/profile/[file].webp',
};
```

## Fakta yang sudah pasti (boleh dipakai di mana saja)

- Argy Fawwaz Akbar, mahasiswa D4 Teknologi Rekayasa Perangkat Lunak, Sekolah Vokasi IPB University (2024 – sekarang).
- Full-stack developer; membangun Klik PDPI dan direktori anggota PDPI yang mengelola 1.800+ profil dokter paru.
- 8 gerbang logika dimodelkan di Blender (Logic Gates 3D).
- 2026: Ketua tim Mindra di UINIC 8.0 Web Development Competition; tim MAGPAD sampai presentasi final EPIC 2026 BPC.

## Yang sengaja TIDAK dimasukkan

Data pribadi sensitif (NIM, alamat rumah, nomor identitas). Nomor WhatsApp hanya jika memang ditampilkan di web lama dan Argy setuju.
