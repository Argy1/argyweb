// Perjalanan: PDPI + pendidikan dari web lama (Academic.tsx). Item lomba (UINIC 8.0, EPIC 2026) dihapus atas permintaan Argy.
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
      when: "2024 – sekarang",
      title: "IPB University",
      role: "D4 Teknologi Rekayasa Perangkat Lunak",
      desc: "Sekolah Vokasi. Mata kuliah mencakup pengujian perangkat lunak, big data, dan computer vision.",
      tone: "sky",
    },
    {
      when: "2023 – 2024",
      title: "Universitas Indonesia",
      role: "Mahasiswa",
      desc: "Belajar aljabar linear elementer dan gerbang logika.",
      tone: "lilac",
    },
    {
      when: "2020 – 2023",
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
      when: "2024 – now",
      title: "IPB University",
      role: "D4 Software Engineering Technology",
      desc: "Vocational School. Coursework spans software testing, big data and computer vision.",
      tone: "sky",
    },
    {
      when: "2023 – 2024",
      title: "Universitas Indonesia",
      role: "Student",
      desc: "Studied elementary linear algebra and logic gates.",
      tone: "lilac",
    },
    {
      when: "2020 – 2023",
      title: "SMA Negeri 2 Tambun Selatan",
      role: "High school student",
      desc: "Learned HTML and CSS, and served as vice-chair of the computer extracurricular (ICT).",
      tone: "gold",
    },
  ],
};
