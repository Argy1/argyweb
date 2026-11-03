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
  // Dua CV PDF, satu per bahasa (public/cv/).
  cv: { id: "/cv/cv-argy-fawwaz-akbar-id.pdf", en: "/cv/cv-argy-fawwaz-akbar-en.pdf" } satisfies Record<Locale, string>,
  // Nama berkas hasil unduhan dibedakan per bahasa supaya dua CV tidak tertukar di folder Unduhan.
  cvDownloadName: { id: "CV-Argy-Fawwaz-Akbar-ID.pdf", en: "CV-Argy-Fawwaz-Akbar-EN.pdf" } satisfies Record<Locale, string>,
  photo: "/profile/argy-fawwaz-akbar.jpg",
  university: "IPB University",
  // Token verifikasi Google Search Console (properti Awalan URL https://argyweb.vercel.app/). Bukan rahasia:
  // memang tampil di HTML publik. Jangan dihapus, Google memeriksanya berkala. Env GOOGLE_SITE_VERIFICATION menimpanya.
  googleSiteVerification: "LDhy3FEX_Jc7a8XSlteHhNDUEpnnW8PFXTgbRCP_KeY",
};

/** Angka di bagian Tentang. Sumber: docs/05 "Fakta yang sudah pasti". */
export const stats = {
  doctorProfiles: { id: "1.800+", en: "1,800+" } satisfies Record<Locale, string>,
};
