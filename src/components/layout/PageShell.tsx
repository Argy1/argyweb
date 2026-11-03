import type { ReactNode } from "react";
import { ContactSection } from "./ContactSection";

/**
 * Pembungkus tiap halaman: isi halaman + panel kontak sebagai satu kelompok transisi bernama "page"
 * (lihat view-transition-name di globals.css dan lib/pageTransition.ts). Navbar, tombol chat, kanvas chip
 * dan kanvas latar punya nama sendiri sehingga tetap diam saat halaman berganti.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="page-vt">
      {children}
      <ContactSection />
    </div>
  );
}
