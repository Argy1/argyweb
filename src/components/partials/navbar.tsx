// src/components/partials/navbar.tsx
import Link from "next/link";
import NavLink from "../nav-link";
import { useRouter } from "next/router";
import { Menu, X, Sun, Moon } from "@/components/icons/outline";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const pathname = useRouter().pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Tutup mobile menu ketika pindah halaman
  useEffect(() => setIsMenuOpen(false), [pathname]);

  return (
    <>
      <header className="fixed top-0 w-full z-10">
        <div className="relative flex items-center justify-between px-6 py-4
+                 bg-white/50 backdrop-blur border-b border-gray-100
+                 dark:bg-gray-800/50 dark:border-gray-700">
          {/* Logo / Nama */}
          <Link href="/" className="uppercase font-bold text-xl text-blue-500 dark:text-blue-300">
            Argy Fawwaz
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/profile", label: "Profile" },
              { href: "/academic", label: "Academic" },
              { href: "/hobbies", label: "Hobbies" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => (
              <NavLink key={href} href={href} active={href} label={label} />
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "light" ? <Moon /> : <Sun />}
            </button>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-0 z-20 bg-white dark:bg-gray-900
                       flex flex-col items-center pt-32 space-y-12 text-2xl"
          >
            {[
              { href: "/", label: "Home" },
              { href: "/profile", label: "Profile" },
              { href: "/academic", label: "Academic" },
              { href: "/hobbies", label: "Hobbies" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => (
              <NavLink key={href} href={href} active={href} label={label} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
