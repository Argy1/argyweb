// Kontak & profil, dari web lama (pages/Contact.tsx, pages/Index.tsx, public/).
import type { Locale } from "./projects";

export interface Social {
  label: string;
  href: string;
}

export const profile = {
  name: "Argy Fawwaz Akbar",
  // Variasi nama yang dipakai orang saat mencari (GitHub: Argy1, Instagram: argy.py).
  alternateNames: ["Argy Fawwaz", "Argy Akbar", "Argy1", "argy.py"],
  role: { id: "Full-stack developer", en: "Full-stack developer" } satisfies Record<Locale, string>,
  email: "tokichimikuni51@gmail.com",
  location: "Indonesia (WIB, UTC+7)",
  timeZone: "Asia/Jakarta",
  socials: [
    { label: "GitHub", href: "https://github.com/Argy1" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/argy-fawwaz-akbar-177217247/" },
    { label: "Instagram", href: "https://www.instagram.com/argy.py/" },
  ] satisfies Social[],
  // Web lama hanya punya satu CV (gambar JPG) untuk kedua bahasa.
  cv: { id: "/cv/cv-argy-fawwaz-akbar.jpg", en: "/cv/cv-argy-fawwaz-akbar.jpg" } satisfies Record<Locale, string>,
  cvDownloadName: "CV-Argy-Fawwaz-Akbar.jpg",
  photo: "/profile/argy-fawwaz-akbar.jpg",
  university: "IPB University",
};

/** Angka di bagian Tentang. Sumber: docs/05 "Fakta yang sudah pasti". */
export const stats = {
  doctorProfiles: { id: "1.800+", en: "1,800+" } satisfies Record<Locale, string>,
};
