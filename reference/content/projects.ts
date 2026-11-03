// Data proyek siap pakai, diambil dari prototipe. Teks bilingual (id/en).
// Placeholder diapit [ ] WAJIB dicek dan diisi; jangan dikarang. Lihat docs/05-CONTENT.md.

export type Locale = 'id' | 'en';
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
    year: "[tahun]",
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
    slug: "tradematrix-ai",
    name: "TradeMatrix AI",
    glyph: "TM",
    category: "ai",
    tone: "navy",
    year: "2026",
    featured: true,
    stack: ["Next.js", "Flutter", "Supabase", "Railway", "Gemini API"],
    i18n: {
      id: {
        kind: "AI · Web & mobile",
        status: "Dalam pengembangan",
        role: "Pembuat & developer",
        overview: "Aplikasi prediksi arah harga crypto, naik atau turun, yang menggabungkan analisis sentimen LLM dengan indikator teknikal. Satu backend melayani web dan mobile.",
        highlights: [
          "Sentimen LLM (Gemini API) digabung dengan indikator teknikal",
          "Next.js untuk web, Flutter untuk mobile, satu backend bersama",
          "Database Supabase, backend di Railway",
        ],
      },
      en: {
        kind: "AI · Web & mobile",
        status: "In development",
        role: "Creator & developer",
        overview: "A crypto price-direction predictor, up or down, that combines LLM sentiment analysis with technical indicators. One backend serves web and mobile.",
        highlights: [
          "LLM sentiment (Gemini API) combined with technical indicators",
          "Next.js for web, Flutter for mobile, one shared backend",
          "Supabase database, backend on Railway",
        ],
      },
    },
  },
  {
    slug: "digitalpmo",
    name: "DigitalPMO",
    glyph: "PMO",
    category: "mobile",
    tone: "steel",
    year: "2026",
    featured: true,
    stack: ["Flutter", "FastAPI", "PostgreSQL", "Claude API"],
    i18n: {
      id: {
        kind: "Aplikasi mobile kesehatan",
        status: "Dalam pengembangan",
        role: "Pembuat & developer",
        overview: "Aplikasi untuk memantau kepatuhan minum obat pasien TB di Indonesia. Sebelumnya bernama TBCare.",
        highlights: [
          "Verifikasi foto minum obat berbasis AI",
          "Tiga peran: Pasien, Pegawai PMO, dan Dokter",
          "Kebutuhan klinis direvisi bersama dokter spesialis paru",
        ],
      },
      en: {
        kind: "Health mobile app",
        status: "In development",
        role: "Creator & developer",
        overview: "An app for monitoring TB treatment adherence in Indonesia. Previously called TBCare.",
        highlights: [
          "AI photo verification of medication intake",
          "Three roles: Patient, PMO staff and Doctor",
          "Clinical requirements revised with a pulmonologist",
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
    year: "[tahun]",
    featured: false,
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
    stack: ["Web app", "Data per kabupaten"],
    i18n: {
      id: {
        kind: "Direktori nasional",
        status: "Sedang dibangun",
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
        status: "In progress",
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
    stack: ["Lambda Architecture", "Python", "Google Colab", "Dashboard web"],
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
    stack: ["Next.js", "Flutter"],
    i18n: {
      id: {
        kind: "Kesehatan mental · Web",
        status: "Lomba UINIC 8.0",
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
        status: "UINIC 8.0 entry",
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
    stack: ["Mobile", "FastAPI", "PostgreSQL", "Railway"],
    i18n: {
      id: {
        kind: "Aplikasi mobile · SaaS",
        status: "Konsep & desain",
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
        status: "Concept & design",
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
  {
    slug: "driving-events",
    name: "Driving Events",
    glyph: "RF",
    category: "ai",
    tone: "steel",
    year: "2026",
    featured: false,
    stack: ["Python", "Random Forest", "XGBoost", "UAH-DriveSet"],
    i18n: {
      id: {
        kind: "Skripsi · Machine learning",
        status: "Proposal",
        role: "Peneliti",
        overview: "Penelitian untuk memprediksi pengereman mendadak dan akselerasi agresif dari sensor smartphone: akselerometer, giroskop, dan GPS.",
        highlights: [
          "Model Random Forest dan XGBoost",
          "Dataset UAH-DriveSet",
          "Metodologi mengikuti SDLC Prototype",
        ],
      },
      en: {
        kind: "Thesis · Machine learning",
        status: "Proposal",
        role: "Researcher",
        overview: "Research on predicting hard braking and aggressive acceleration from smartphone sensors: accelerometer, gyroscope and GPS.",
        highlights: [
          "Random Forest and XGBoost models",
          "UAH-DriveSet dataset",
          "Methodology follows the Prototype SDLC",
        ],
      },
    },
  },
  {
    slug: "magpad",
    name: "MAGPAD",
    glyph: "MP",
    category: "biz",
    tone: "navy",
    year: "2026",
    featured: false,
    stack: ["Business plan", "Agribisnis"],
    i18n: {
      id: {
        kind: "Business plan",
        status: "Presentasi final",
        role: "Anggota tim",
        overview: "Rencana bisnis food pad penyerap cairan antimikroba berbahan kitosan dari limbah maggot BSF, sebagai alternatif lokal kemasan daging, ikan, dan unggas segar.",
        highlights: [
          "EPIC 2026 Business Plan Competition, subtema Agribisnis",
          "Tim tiga orang",
          "Presentasi final via Zoom, 31 Oktober 2026",
        ],
      },
      en: {
        kind: "Business plan",
        status: "Final presentation",
        role: "Team member",
        overview: "Business plan for an antimicrobial absorbent food pad made from BSF maggot chitosan, a local alternative for fresh meat, fish and poultry packaging.",
        highlights: [
          "EPIC 2026 Business Plan Competition, Agribusiness subtheme",
          "Three-person team",
          "Final presentation via Zoom, 31 October 2026",
        ],
      },
    },
  },
  {
    slug: "logic-gates-3d",
    name: "Logic Gates 3D",
    glyph: "XOR",
    category: "3d",
    tone: "navy",
    year: "[tahun]",
    featured: false,
    stack: ["Blender", "Python", "STL"],
    i18n: {
      id: {
        kind: "Modeling 3D",
        status: "Selesai",
        role: "3D modeler",
        overview: "Set lengkap delapan gerbang logika yang dimodelkan di Blender dengan bahasa desain yang konsisten.",
        highlights: [
          "AND, OR, NOT, NAND, NOR, XOR, XNOR, dan BUFFER",
          "Setiap gerbang punya Python script Blender dan file STL",
          "Skema warna berbeda, aksen rim emas, dan bubble negasi",
        ],
      },
      en: {
        kind: "3D modeling",
        status: "Complete",
        role: "3D modeler",
        overview: "A complete set of eight logic gates modeled in Blender with one consistent design language.",
        highlights: [
          "AND, OR, NOT, NAND, NOR, XOR, XNOR and BUFFER",
          "Each gate ships as a Blender Python script and an STL file",
          "Distinct color schemes, gold rim details and negation bubbles",
        ],
      },
    },
  },
  {
    slug: "argyweb-v1",
    name: "argyweb v1",
    glyph: "V1",
    category: "3d",
    tone: "steel",
    year: "[tahun]",
    featured: false,
    link: { href: "https://argyweb.vercel.app", label: "argyweb.vercel.app" },
    stack: ["React", "TypeScript", "Tailwind", "Three.js"],
    i18n: {
      id: {
        kind: "Portofolio 3D lama",
        status: "Live",
        role: "Desainer & developer",
        overview: "Versi sebelumnya dari portofolio ini, dengan estetika \"Circuit-Glass\".",
        highlights: [
          "React, TypeScript, Tailwind, dan Three.js",
          "Canvas WebGL yang tetap aktif antar halaman",
          "Sistem token warna yang ketat",
        ],
      },
      en: {
        kind: "Previous 3D portfolio",
        status: "Live",
        role: "Designer & developer",
        overview: "The previous version of this portfolio, with a \"Circuit-Glass\" aesthetic.",
        highlights: [
          "React, TypeScript, Tailwind and Three.js",
          "A WebGL canvas that persists across pages",
          "A strict color token system",
        ],
      },
    },
  },
];

export interface TimelineItem { when: string; title: string; role: string; desc: string; tone: 'gold' | 'lilac' | 'steel' | 'sky'; }
export const timeline: Record<Locale, TimelineItem[]> = {
  id: [
    { when: "2026", title: "UINIC 8.0 Web Development", role: "Ketua tim · Mindra", desc: "Lomba pengembangan web oleh HMPS Informatika UIN Sunan Kalijaga.", tone: "gold" },
    { when: "2026", title: "EPIC 2026 Business Plan", role: "Anggota tim · MAGPAD", desc: "Sampai ke tahap presentasi final Business Plan Competition.", tone: "lilac" },
    { when: "[tahun]", title: "PDPI", role: "Full-stack developer", desc: "Membangun Klik PDPI dan direktori anggota yang mengelola 1.800+ profil dokter.", tone: "steel" },
    { when: "2024 – sekarang", title: "IPB University", role: "D4 Teknologi Rekayasa Perangkat Lunak", desc: "Sekolah Vokasi. Mata kuliah mencakup pengujian perangkat lunak, big data, dan computer vision.", tone: "sky" },
  ],
  en: [
    { when: "2026", title: "UINIC 8.0 Web Development", role: "Team lead · Mindra", desc: "Web development competition by HMPS Informatika, UIN Sunan Kalijaga.", tone: "gold" },
    { when: "2026", title: "EPIC 2026 Business Plan", role: "Team member · MAGPAD", desc: "Reached the final presentation stage of the Business Plan Competition.", tone: "lilac" },
    { when: "[year]", title: "PDPI", role: "Full-stack developer", desc: "Built Klik PDPI and the member directory that manages 1,800+ doctor profiles.", tone: "steel" },
    { when: "2024 – now", title: "IPB University", role: "D4 Software Engineering Technology", desc: "Vocational School. Coursework spans software testing, big data and computer vision.", tone: "sky" },
  ],
};

export const stackGroups = [
  { code: 'FE', tone: 'gold', title: 'Frontend', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'] },
  { code: 'BE', tone: 'steel', title: 'Backend', items: ['Laravel', 'FastAPI', 'Supabase', 'PostgreSQL', 'Railway'] },
  { code: 'MB', tone: 'lilac', title: 'Mobile', items: ['Flutter', 'Dart', 'REST API'] },
  { code: '3D', tone: 'sky', title: 'AI & 3D', items: ['Gemini API', 'Claude API', 'Python', 'Three.js', 'Blender'] },
] as const;
