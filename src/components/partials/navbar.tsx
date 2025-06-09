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

  // Tutup mobile menu ketika path berubah
  useEffect(() => setIsMenuOpen(false), [pathname]);

  return (
    // header selalu pakai var(--bg) sebagai background
    <header className="fixed top-0 w-full z-10 bg-[var(--bg)]">
      <div
        className="
          relative flex items-center justify-between
          px-6 py-4
          bg-[var(--bg)]/60      /* 60% opacity, ikut var saat light/dark */
          backdrop-blur          /* glassmorphism */
          border-b border-gray-200 dark:border-gray-700
        "
      >
        {/* Logo */}
        <Link
          href="/"
          className="uppercase font-bold text-xl text-blue-500"
        >
          Argy Fawwaz
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-sm">
          {[
            { href: "/", label: "Home" },
            { href: "/profile", label: "Profile" },
            { href: "/academic", label: "Academic" },
            { href: "/hobbies", label: "Hobbies" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <NavLink key={href} href={href} label={label} active={href} />
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-gray-300 dark:border-gray-600"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile slide-down */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="
              fixed inset-0 z-20
              bg-[var(--bg)]
              flex flex-col items-center pt-32 space-y-12 text-2xl
            "
          >
            {[
              { href: "/", label: "Home" },
              { href: "/profile", label: "Profile" },
              { href: "/academic", label: "Academic" },
              { href: "/hobbies", label: "Hobbies" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} active={href} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
