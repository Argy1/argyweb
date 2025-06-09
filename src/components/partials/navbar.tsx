// src/components/partials/footer.tsx
import Link from "next/link";
import { WhatsApp, Phone, Mail } from "@/components/icons/outline";

export default function Footer() {
  return (
    <footer
      className="
        bg-[var(--bg)]
        text-[var(--fg)]
        px-8 md:px-24 py-16
        border-t border-gray-200 dark:border-gray-700
      "
    >
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Personal Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Argy</h2>
          <p>
            Mahasiswa / Web Developer / Hobi Cosplay &amp; Otomotif.  
            Senang membuat UI interaktif dan belajar teknologi baru setiap hari.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="https://wa.me/6281380091046"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-500"
            >
              <WhatsApp className="w-6 h-6" />
            </a>
            <a href="tel:+6281380091046" className="hover:text-blue-500">
              <Phone className="w-6 h-6" />
            </a>
            <a
              href="mailto:tokichimikuni51@gmail.com"
              className="hover:text-blue-500"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-xl font-semibold">Navigasi</h3>
          <ul className="mt-4 space-y-2">
            {[
              { href: "/", label: "Home" },
              { href: "/profile", label: "Profile" },
              { href: "/academic", label: "Academic" },
              { href: "/hobbies", label: "Hobbies" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-blue-500">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-[var(--fg)]/70">
        © {new Date().getFullYear()} Argy.py. All rights reserved.
      </div>
    </footer>
  );
}
