// Data proyek, diambil dari reference/content/projects.ts (disetujui di prototipe).
// Placeholder diapit [ ] belum diketahui; jangan dikarang. Lihat docs/05-CONTENT.md.

import type { AppLocale } from "@/i18n/routing";

export type Locale = AppLocale;
export type ProjectCategory = 'web' | 'mobile' | 'ai' | '3d' | 'biz';
export type TileTone = 'blue' | 'navy' | 'steel' | 'gold' | 'violet';

export interface ProjectCopy {
  kind: string;
  status: string;
  role: string;
  overview: string;
  highlights: string[];
}

export interface Project {
  slug: string;
  name: string;
  glyph: string;          // huruf besar dekoratif di kartu
  category: ProjectCategory;
  tone: TileTone;         // warna kartu, lihat docs/02-DESIGN-SYSTEM.md
  year: string;           // '[tahun]' = belum diketahui, isi dari web lama atau tanya Argy
  featured: boolean;      // tampil di bento Beranda
  link?: { href: string; label: string };
  stack: string[];
  i18n: Record<Locale, ProjectCopy>;
}

export const projects: Project[] = [
  {
    slug: "klik-pdpi",
    name: "Klik PDPI",
    glyph: "KP",
    category: "web",
    tone: "blue",
    year: "2025",
    featured: true,
    link: { href: "https://klikpdpi.com", label: "klikpdpi.com" },
    stack: ["React", "Vite", "TypeScript", "shadcn/ui", "Supabase", "Zod"],
    i18n: {
      id: {
        kind: "Website organisasi",
        status: "Live",
        role: "Full-stack developer",
        overview: "Website resmi Perhimpunan Dokter Paru Indonesia, dengan registrasi dan login anggota, formulir kontak, dan konten organisasi.",
        highlights: [
          "Validasi form dengan Zod dan react-hook-form",
          "Backend Supabase: Postgres dan Edge Functions",
          "Form Register, Login, dan Kontak diuji dengan Boundary Value Analysis dan Equivalence Partitioning",
        ],
      },
      en: {
        kind: "Organization website",
        status: "Live",
        role: "Full-stack developer",
        overview: "Official website of the Indonesian Society of Respirology (PDPI), with member sign-up and login, contact forms and organization content.",
        highlights: [
          "Form validation with Zod and react-hook-form",
          "Supabase backend: Postgres and Edge Functions",
          "Register, Login and Contact forms tested with Boundary Value Analysis and Equivalence Partitioning",
        ],
      },
    },
  },
  {
    slug: "kopaseba",
    name: "Kopaseba",
    glyph: "KS",
    category: "web",
    tone: "navy",
    year: "2026",
    featured: true,
    link: { href: "https://kopaseba.vercel.app", label: "kopaseba.vercel.app" },
    stack: ["Next.js", "React", "TypeScript", "Prisma", "Supabase", "Tailwind CSS", "shadcn/ui"],
    i18n: {
      id: {
        kind: "Website koperasi · CMS",
        status: "Live",
        role: "Solo developer",
        overview: "Situs resmi KOPASEBA (Koperasi Paru Sejahtera Bahagia), koperasi milik PDPI untuk dokter spesialis paru se-Indonesia: katalog produk mitra, unit usaha, pembiayaan anggota, dan dashboard admin.",
        highlights: [
          "Situs publik lengkap: beranda, katalog, unit usaha, pembiayaan, pengurus, legalitas, galeri, dan kontak",
          "Dashboard admin CRUD penuh agar pengurus mengelola konten tanpa developer",
          "Next.js 16 dan Prisma dengan Supabase Auth dan Storage",
        ],
      },
      en: {
        kind: "Cooperative website · CMS",
        status: "Live",
        role: "Solo developer",
        overview: "Official website of KOPASEBA (Koperasi Paru Sejahtera Bahagia), the PDPI cooperative for pulmonologists across Indonesia: partner product catalog, business units, member financing and an admin dashboard.",
        highlights: [
          "Complete public site: home, catalog, business units, financing, board, legal documents, gallery and contact",
          "Full CRUD admin dashboard so the board manages content without a developer",
          "Next.js 16 and Prisma with Supabase Auth and Storage",
        ],
      },
    },
  },
  {
    slug: "confindant",
    name: "Confindant",
    glyph: "CF",
    category: "mobile",
    tone: "blue",
    year: "2026",
    featured: false,
    link: { href: "https://confindant.vercel.app", label: "confindant.vercel.app" },
    stack: ["Flutter", "Riverpod", "Next.js", "Laravel", "PostgreSQL", "Gemini AI"],
    i18n: {
      id: {
        kind: "Aplikasi keuangan · Mobile & web",
        status: "Proyek kuliah",
        role: "Solo developer (mobile, web, backend)",
        overview: "Keuangan personal dan akuntansi organisasi dalam satu aplikasi, ditenagai AI. Pengalaman yang sama di mobile Flutter dan dashboard web Next.js, dengan API Laravel 12.",
        highlights: [
          "Scan struk (OCR), kategorisasi otomatis, forecast cashflow, dan chat keuangan dengan Google Gemini",
          "Dompet, transaksi, anggaran, target tabungan, dan transaksi berulang, plus modul akuntansi organisasi",
          "UI dirancang penuh di Figma sebelum dikodekan",
        ],
      },
      en: {
        kind: "Finance app · Mobile & web",
        status: "Course project",
        role: "Solo developer (mobile, web, backend)",
        overview: "Personal finance and organization accounting in one AI-powered app. The same experience on Flutter mobile and a Next.js web dashboard, backed by a Laravel 12 API.",
        highlights: [
          "Receipt scanning (OCR), auto categorization, cashflow forecast and finance chat with Google Gemini",
          "Wallets, transactions, budgets, savings goals and recurring transactions, plus an organization accounting module",
          "UI fully designed in Figma before being coded",
        ],
      },
    },
  },
  {
    slug: "direktori-pdpi",
    name: "Direktori PDPI",
    glyph: "DP",
    category: "web",
    tone: "gold",
    year: "2025",
    featured: true,
    link: { href: "https://direktoripdpi.com", label: "direktoripdpi.com" },
    stack: ["Web app", "Database"],
    i18n: {
      id: {
        kind: "Direktori anggota",
        status: "Live",
        role: "Full-stack developer",
        overview: "Direktori anggota PDPI yang mengelola lebih dari 1.800 profil dokter paru dari seluruh Indonesia.",
        highlights: [
          "Mengelola 1.800+ profil dokter paru",
          "Data anggota se-Indonesia dalam satu direktori",
          "Live di direktoripdpi.com",
        ],
      },
      en: {
        kind: "Member directory",
        status: "Live",
        role: "Full-stack developer",
        overview: "PDPI member directory managing more than 1,800 pulmonologist profiles from across Indonesia.",
        highlights: [
          "Manages 1,800+ pulmonologist profiles",
          "Nationwide member data in one directory",
          "Live at direktoripdpi.com",
        ],
      },
    },
  },
  {
    slug: "direktori-ppds",
    name: "Direktori PPDS",
    glyph: "PPDS",
    category: "web",
    tone: "violet",
    year: "2026",
    featured: false,
    link: { href: "https://direktori-ppds.vercel.app", label: "direktori-ppds.vercel.app" },
    stack: ["Web app", "Data per kabupaten"],
    i18n: {
      id: {
        kind: "Direktori nasional",
        status: "Live",
        role: "Full-stack developer",
        overview: "Direktori PPDS, konsultan, dan fellow pulmonologi se-Indonesia untuk Kolegium Pulmonologi dan Kedokteran Respirasi Indonesia.",
        highlights: [
          "Data PPDS, konsultan, dan fellow pulmonologi",
          "Perencanaan distribusi per kabupaten",
          "Dibangun untuk Kolegium Pulmonologi dan Kedokteran Respirasi",
        ],
      },
      en: {
        kind: "National directory",
        status: "Live",
        role: "Full-stack developer",
        overview: "A nationwide directory of pulmonology residents, consultants and fellows for the Indonesian College of Pulmonology and Respiratory Medicine.",
        highlights: [
          "Residents, consultants and fellows in one place",
          "Distribution planning per regency",
          "Built for the Indonesian College of Pulmonology",
        ],
      },
    },
  },
  {
    slug: "agrivision",
    name: "AgriVision",
    glyph: "AV",
    category: "ai",
    tone: "steel",
    year: "2026",
    featured: false,
    link: { href: "https://agrivision-blond-nine.vercel.app", label: "agrivision-blond-nine.vercel.app" },
    stack: ["Next.js", "Flutter", "Supabase", "FastAPI", "Railway"],
    i18n: {
      id: {
        kind: "Computer vision · Web & mobile",
        status: "Proyek kuliah",
        role: "Developer · Kelompok 19",
        overview: "Sistem deteksi penyakit dan pemantauan kesehatan tanaman tomat dan cabai berbasis computer vision untuk precision farming.",
        highlights: [
          "Klasifikasi penyakit daun dengan transfer learning CNN",
          "Indeks vegetasi ExG dan VARI untuk pemantauan tanaman",
          "Web Next.js dan app Flutter dengan backend Supabase + FastAPI",
        ],
      },
      en: {
        kind: "Computer vision · Web & mobile",
        status: "Course project",
        role: "Developer · Group 19",
        overview: "A computer vision system that detects diseases and monitors the health of tomato and chili plants for precision farming.",
        highlights: [
          "Leaf disease classification with transfer learning CNN",
          "ExG and VARI vegetation indices for crop monitoring",
          "Next.js web and Flutter app on a Supabase + FastAPI backend",
        ],
      },
    },
  },
  {
    slug: "smart-city-traffic",
    name: "Smart City Traffic",
    glyph: "SCT",
    category: "ai",
    tone: "blue",
    year: "2026",
    featured: false,
    stack: ["Lambda Architecture", "Python", "Google Colab"],
    i18n: {
      id: {
        kind: "Big data · IoT",
        status: "Proyek kuliah",
        role: "Developer",
        overview: "Sistem pemantauan dan prediksi kemacetan lalu lintas kota berbasis IoT dan big data, untuk membantu perencana kota mengambil keputusan real-time.",
        highlights: [
          "Lambda Architecture untuk data batch dan real-time",
          "Model dilatih di Google Colab dengan dataset mobilitas smart city",
          "Diuji di dashboard web memakai video lalu lintas",
        ],
      },
      en: {
        kind: "Big data · IoT",
        status: "Course project",
        role: "Developer",
        overview: "An IoT and big data system that monitors and predicts city traffic congestion to support real-time decisions by city planners.",
        highlights: [
          "Lambda Architecture for batch and real-time data",
          "Model trained in Google Colab on a smart city mobility dataset",
          "Tested on a web dashboard using traffic video",
        ],
      },
    },
  },
  {
    slug: "mindra",
    name: "Mindra",
    glyph: "MD",
    category: "web",
    tone: "violet",
    year: "2026",
    featured: false,
    link: { href: "https://web-omega-one-69.vercel.app/beranda", label: "web-omega-one-69.vercel.app" },
    stack: ["Next.js", "Flutter"],
    i18n: {
      id: {
        kind: "Kesehatan mental · Web",
        status: "Proyek kuliah",
        role: "Ketua tim",
        overview: "Aplikasi kesehatan mental yang dibawa ke UINIC 8.0 Web Development Competition dalam versi web Next.js.",
        highlights: [
          "Versi web Next.js dari aplikasi Flutter",
          "Tim tiga orang, Argy sebagai ketua",
          "Lomba oleh HMPS Informatika UIN Sunan Kalijaga",
        ],
      },
      en: {
        kind: "Mental health · Web",
        status: "Course project",
        role: "Team lead",
        overview: "A mental health app entered in the UINIC 8.0 Web Development Competition as a Next.js web version.",
        highlights: [
          "Next.js web version of a Flutter app",
          "Three-person team, led by Argy",
          "Competition by HMPS Informatika, UIN Sunan Kalijaga",
        ],
      },
    },
  },
  {
    slug: "kontraku",
    name: "Kontraku",
    glyph: "KT",
    category: "mobile",
    tone: "gold",
    year: "2026",
    featured: false,
    link: { href: "https://kontraku.vercel.app", label: "kontraku.vercel.app" },
    stack: ["FastAPI", "PostgreSQL", "Railway"],
    i18n: {
      id: {
        kind: "Aplikasi mobile · SaaS",
        status: "Live",
        role: "Pembuat",
        overview: "Aplikasi pengingat untuk pemilik kontrakan: daftar properti, lokasi, dan foto, dengan pengingat jatuh tempo sewa, perpanjangan kontrak, dan perawatan.",
        highlights: [
          "Multi-user: tiap pemilik mengelola kontrakannya sendiri",
          "Desain \"Hangat & Jelas\" dengan kartu besar yang ramah lansia",
          "Direncanakan jadi SaaS untuk banyak pemilik",
        ],
      },
      en: {
        kind: "Mobile app · SaaS",
        status: "Live",
        role: "Creator",
        overview: "A reminder app for rental owners: properties, locations and photos, with reminders for rent due dates, contract renewals and maintenance.",
        highlights: [
          "Multi-user: each owner manages their own rentals",
          "\"Warm & Clear\" design with large, elderly-friendly cards",
          "Planned as a SaaS for many owners",
        ],
      },
    },
  },
];

export const projectCategories: ProjectCategory[] = ["web", "mobile", "ai", "3d", "biz"];

export interface GalleryShot {
  src: string;
  alt: Record<Locale, string>;
}

/** Screenshot dari web lama (argy-web-main/public/images/projekan). Proyek tanpa entri tampil placeholder. */
export const projectGallery: Partial<Record<string, GalleryShot[]>> = {
  "klik-pdpi": [
    { src: "/projects/klik-pdpi/home.png", alt: { id: "Beranda klikpdpi.com", en: "klikpdpi.com homepage" } },
    { src: "/projects/klik-pdpi/cabang.png", alt: { id: "Peta cabang PDPI", en: "PDPI branch map" } },
    { src: "/projects/klik-pdpi/library.png", alt: { id: "Perpustakaan ilmiah", en: "Scientific library" } },
    { src: "/projects/klik-pdpi/news.jpg", alt: { id: "Halaman berita", en: "News page" } },
  ],
  // Screenshot diambil dari aplikasi yang dijalankan lokal (halaman publik saja, tanpa data pribadi).
  kopaseba: [
    { src: "/projects/kopaseba/home.jpg", alt: { id: "Beranda Kopaseba", en: "Kopaseba homepage" } },
    { src: "/projects/kopaseba/unit-usaha.jpg", alt: { id: "Tiga pilar unit usaha", en: "The three business pillars" } },
    { src: "/projects/kopaseba/keanggotaan.jpg", alt: { id: "Syarat dan hak keanggotaan", en: "Membership requirements and rights" } },
  ],
  // Data demo lokal (akun dan transaksi contoh), bukan data nyata.
  confindant: [
    { src: "/projects/confindant/home.jpg", alt: { id: "Dasbor keuangan Confindant", en: "Confindant finance dashboard" } },
    { src: "/projects/confindant/transaksi.jpg", alt: { id: "Daftar transaksi dengan filter", en: "Transaction list with filters" } },
    { src: "/projects/confindant/analitik.jpg", alt: { id: "Analitik pengeluaran per kategori", en: "Spending analytics by category" } },
    { src: "/projects/confindant/wallet.jpg", alt: { id: "Dompet dan total saldo", en: "Wallets and total balance" } },
  ],
  "direktori-pdpi": [
    { src: "/projects/direktori-pdpi/home.png", alt: { id: "Beranda direktoripdpi.com", en: "direktoripdpi.com homepage" } },
    { src: "/projects/direktori-pdpi/anggota.png", alt: { id: "Tabel anggota", en: "Member table" } },
    { src: "/projects/direktori-pdpi/sebaran.png", alt: { id: "Peta sebaran anggota", en: "Member distribution map" } },
  ],
  // Screenshot diambil dari aplikasi yang dijalankan lokal (halaman publik saja).
  "direktori-ppds": [
    { src: "/projects/direktori-ppds/beranda.jpg", alt: { id: "Beranda Direktori PPDS", en: "PPDS Directory homepage" } },
  ],
  agrivision: [
    { src: "/projects/agrivision/login.jpg", alt: { id: "Halaman masuk AgriVision", en: "AgriVision sign-in page" } },
    { src: "/projects/agrivision/daftar.jpg", alt: { id: "Halaman daftar akun", en: "Sign-up page" } },
  ],
  "smart-city-traffic": [
    { src: "/projects/smart-city-traffic/ringkasan.jpg", alt: { id: "Ringkasan kota dengan peta 3D sensor", en: "City overview with a 3D sensor map" } },
    { src: "/projects/smart-city-traffic/kamera.jpg", alt: { id: "Kamera live dengan deteksi kendaraan", en: "Live camera with vehicle detection" } },
    { src: "/projects/smart-city-traffic/prediksi.jpg", alt: { id: "Prediksi kecepatan per sensor", en: "Per-sensor speed forecast" } },
    { src: "/projects/smart-city-traffic/analitik.jpg", alt: { id: "Analitik pola kemacetan", en: "Congestion pattern analytics" } },
  ],
  mindra: [
    { src: "/projects/mindra/home.jpg", alt: { id: "Beranda Mindra", en: "Mindra homepage" } },
    { src: "/projects/mindra/layanan.jpg", alt: { id: "Layanan kesehatan terdekat", en: "Nearby health services" } },
    { src: "/projects/mindra/tentang.jpg", alt: { id: "Halaman tentang Mindra", en: "About Mindra" } },
  ],
  kontraku: [
    { src: "/projects/kontraku/login.png", alt: { id: "Layar masuk Kontraku", en: "Kontraku sign-in screen" } },
    { src: "/projects/kontraku/icon.png", alt: { id: "Ikon aplikasi Kontraku", en: "Kontraku app icon" } },
  ],
};

/** Gambar sampul kartu = screenshot pertama di galeri (seperti kartu proyek di web lama). */
export function projectCover(slug: string): GalleryShot | undefined {
  return projectGallery[slug]?.[0];
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNeighbors(slug: string): { prev: Project; next: Project } {
  const i = Math.max(0, projects.findIndex((p) => p.slug === slug));
  const n = projects.length;
  return { prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] };
}

export const featuredProjects = projects.filter((p) => p.featured);

/** Nilai seperti "[tahun]" belum diketahui dan ditampilkan apa adanya. */
export function isPlaceholder(value: string): boolean {
  return value.startsWith("[") && value.endsWith("]");
}
