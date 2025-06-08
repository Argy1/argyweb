// src/components/partials/footer.tsx
import Link from "next/link";
import { WhatsApp, Phone, Mail } from "@/components/icons/outline";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 px-8 md:px-24 py-16 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Personal Info */}
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <h2 className="text-2xl font-semibold">Argy</h2>
          <p>
            Mahasiswa / Web Developer / Hobi Cosplay & Otomotif.  
            Senang membuat UI interaktif dan belajar teknologi baru setiap hari.
          </p>
          <div className="flex items-center space-x-4">
            <a href="https://wa.me/6281380091046" target="_blank" rel="noreferrer" className="hover:text-blue-500">
              <WhatsApp />
            </a>
            <a href="tel:+6281380091046" className="hover:text-blue-500">
              <Phone />
            </a>
            <a href="mailto:tokichimikuni51@gmail.com" className="hover:text-blue-500">
              <Mail />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Navigasi</h3>
          <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <Link href="/" className="hover:text-blue-500">Home</Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-blue-500">Profile</Link>
            </li>
            <li>
              <Link href="/academic" className="hover:text-blue-500">Academic</Link>
            </li>
            <li>
              <Link href="/hobbies" className="hover:text-blue-500">Hobbies</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-500">About</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-500">Contact</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-600">
        © {new Date().getFullYear()} Argy.py. All rights reserved.
      </div>
    </footer>
  );
}
