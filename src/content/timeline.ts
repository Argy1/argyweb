// Perjalanan: PDPI + pendidikan. Tahun, jurusan, dan IPK pendidikan mengikuti CV terbaru Argy (2026-11-03); deskripsi tiap item dari web lama (Academic.tsx). Item lomba (UINIC 8.0, EPIC 2026) dihapus atas permintaan Argy.
// "[tahun]" / "[year]" = belum diketahui, jangan ditebak.
import type { Locale } from "./projects";

export type TimelineTone = "gold" | "lilac" | "steel" | "sky";

export interface TimelineItem {
  when: string;
  title: string;
  role: string;
  desc: string;
  tone: TimelineTone;
}

export const timeline: Record<Locale, TimelineItem[]> = {
  id: [
    {
      when: "2025 – 2026",
      title: "PDPI",
      role: "Full-stack developer",
      desc: "Membangun Klik PDPI dan direktori anggota yang mengelola 1.800+ profil dokter.",
      tone: "steel",
    },
    {
      when: "2024 – 2028",
      title: "IPB University",
      role: "D4 Teknologi Rekayasa Perangkat Lunak",
      desc: "Sekolah Vokasi. IPK 3,69 / 4,00. Mata kuliah mencakup pengujian perangkat lunak, big data, dan computer vision.",
      tone: "sky",
    },
    {
      when: "2022 – 2024",
      title: "Universitas Indonesia",
      role: "Mahasiswa Program Studi Fisika, FMIPA",
      desc: "Belajar aljabar linear elementer dan gerbang logika.",
      tone: "lilac",
    },
    {
      when: "2019 – 2022",
      title: "SMA Negeri 2 Tambun Selatan",
      role: "Siswa",
      desc: "Belajar HTML dan CSS, serta menjadi wakil ketua ekskul komputer (ICT).",
      tone: "gold",
    },
  ],
  en: [
    {
      when: "2025 – 2026",
      title: "PDPI",
      role: "Full-stack developer",
      desc: "Built Klik PDPI and the member directory that manages 1,800+ doctor profiles.",
      tone: "steel",
    },
    {
      when: "2024 – 2028",
      title: "IPB University",
      role: "D4 Software Engineering Technology",
      desc: "Vocational School. GPA 3.69 / 4.00. Coursework spans software testing, big data and computer vision.",
      tone: "sky",
    },
    {
      when: "2022 – 2024",
      title: "Universitas Indonesia",
      role: "Physics student, Faculty of Mathematics and Natural Sciences (FMIPA)",
      desc: "Studied elementary linear algebra and logic gates.",
      tone: "lilac",
    },
    {
      when: "2019 – 2022",
      title: "SMA Negeri 2 Tambun Selatan",
      role: "High school student",
      desc: "Learned HTML and CSS, and served as vice-chair of the computer extracurricular (ICT).",
      tone: "gold",
    },
  ],
};
