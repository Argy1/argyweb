// Sertifikat & penghargaan dari web lama (pages/Academic.tsx: achievements + certifications).
import type { Locale } from "./projects";

export type CertificateCategory = "course" | "competition" | "organization" | "other";

export interface Certificate {
  id: string;
  title: Record<Locale, string>;
  issuer: string;
  date: string; // 'YYYY-MM' atau 'YYYY'
  category?: CertificateCategory;
  result?: Record<Locale, string>;
  desc?: Record<Locale, string>;
  /** Gambar untuk kartu dan lightbox. Untuk sertifikat PDF: render halaman pertama ke JPG (pdftoppm). */
  image?: string;
  /** PDF asli; dibuka di tab baru lewat tombol di lightbox. */
  file?: string;
  credentialUrl?: string;
}

export const certificates: Certificate[] = [
  {
    id: "gemini-certified-student",
    title: { id: "Gemini Certified Student (Universitas)", en: "Gemini Certified Student (University)" },
    issuer: "Google for Education",
    date: "2026-09",
    category: "course",
    result: { id: "Berlaku 23/09/2026 – 23/09/2029", en: "Valid 23/09/2026 – 23/09/2029" },
    desc: {
      id: "Kualifikasi dari Google for Education yang menunjukkan pengetahuan, keterampilan, dan kompetensi dasar dalam menggunakan AI Google di lingkungan pendidikan.",
      en: "A Google for Education qualification demonstrating foundational knowledge, skills, and competence in using Google AI in educational settings.",
    },
    image: "/certificates/gemini-certified-student-2026.jpg",
    file: "/certificates/gemini-certified-student-2026.pdf",
  },
  {
    id: "uad-indonesian-counseling-competition",
    title: {
      id: "Indonesian Counseling Competition · Lomba Essay",
      en: "Indonesian Counseling Competition · Essay",
    },
    issuer: "HMPS Bimbingan dan Konseling, Universitas Ahmad Dahlan",
    date: "2026",
    category: "competition",
    result: { id: "Harapan 1", en: "1st Runner-Up" },
    desc: {
      id: "Meraih Harapan 1 pada kategori Lomba Essay dalam Indonesian Counseling Competition, periode 2026/2027.",
      en: "Won 1st Runner-Up in the Essay Competition category of the Indonesian Counseling Competition, 2026/2027 period.",
    },
    image: "/certificates/uad-indonesian-counseling-competition-2026.jpg",
    file: "/certificates/uad-indonesian-counseling-competition-2026.pdf",
  },
  {
    id: "tax-center-sv-ipb",
    title: { id: "Website Developer · Tax Center SV IPB", en: "Website Developer · Tax Center SV IPB" },
    issuer: "Tax Center Sekolah Vokasi IPB University",
    date: "2026",
    category: "organization",
    result: { id: "Sertifikat Apresiasi", en: "Appreciation Certificate" },
    desc: {
      id: "Penghargaan atas kontribusi sebagai Website Developer dalam mengembangkan dan mengelola website resmi Tax Center SV IPB.",
      en: "Recognition for contributions as a Website Developer in building and maintaining the official Tax Center SV IPB website.",
    },
    image: "/certificates/tax-center-sv-ipb-2026.jpg",
    file: "/certificates/tax-center-sv-ipb-2026.pdf",
  },
  {
    id: "pdpi-direktori-anggota",
    title: { id: "Penghargaan PDPI · Direktori Anggota", en: "PDPI Award · Member Directory" },
    issuer: "Pengurus Pusat Perhimpunan Dokter Paru Indonesia",
    date: "2025",
    category: "organization",
    result: { id: "Apresiasi Karya", en: "Recognition Award" },
    desc: {
      id: 'Penghargaan atas penciptaan aplikasi web "Direktori Anggota Perhimpunan Dokter Paru Indonesia" yang membantu masyarakat mengakses profil dokter spesialis paru di seluruh Indonesia.',
      en: 'Recognition for creating the "Indonesian Pulmonology Association Member Directory" web app, which helps the public look up pulmonologist profiles across Indonesia.',
    },
    image: "/certificates/pdpi-direktori-2025.jpg",
    file: "/certificates/pdpi-direktori-2025.pdf",
  },
  {
    id: "itfest-uiux",
    title: { id: "ITFest · UI/UX Design", en: "ITFest · UI/UX Design" },
    issuer: "ITFest",
    date: "2025",
    category: "competition",
    result: { id: "Top 10 Finalis", en: "Top 10 Finalist" },
    desc: {
      id: "Merancang Nutriscan, aplikasi web (Next.js & Laravel) yang memakai AI (computer vision & NLP) untuk mengenali makanan dari foto, mengestimasi nilai gizi, dan memberi rekomendasi pola makan.",
      en: "Designed Nutriscan, a web app (Next.js & Laravel) that uses AI (computer vision & NLP) to identify food from photos, estimate nutrition and recommend eating patterns.",
    },
    image: "/certificates/itfest-top10-2025.png",
  },
  {
    id: "farmers-english-competition",
    title: { id: "Farmers English Competition · Essay", en: "Farmers English Competition · Essay" },
    issuer: "Farmers English Competition",
    date: "2025",
    category: "competition",
    result: { id: "Juara 1", en: "1st Place" },
    desc: {
      id: "Essay tentang peran pemuda mengurangi polusi udara dalam ruangan lewat tanaman Sansevieria, sekaligus peluang wirausaha hijau.",
      en: "An essay on how youth can reduce indoor air pollution with Sansevieria plants, while opening green entrepreneurship opportunities.",
    },
    image: "/certificates/farmers-english-competition-2025.jpg",
  },
];
