"use client";

import { useTranslations } from "next-intl";
import { useRef, type RefObject } from "react";
import { NavLink } from "@/components/ui/NavLink";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { usePathname } from "@/i18n/navigation";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { activeKey, navItems } from "./navItems";

/** Tombol ☰/✕ di dalam kapsul navbar (hanya < 768px). */
export function MenuButton({
  open,
  onToggle,
  buttonRef,
}: {
  open: boolean;
  onToggle: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
}) {
  const t = useTranslations("nav");
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? t("menuClose") : t("menuOpen")}
      className="grid size-11 flex-none place-items-center rounded-full border border-line bg-surface transition-transform duration-200 max-[400px]:size-10 md:hidden"
    >
      {open ? <CloseIcon size={20} /> : <MenuIcon />}
    </button>
  );
}

/**
 * Panel link di bawah kapsul (hanya < 768px). Dirender di luar kapsul karena `backdrop-filter` pada kapsul
 * membuat elemen `fixed` di dalamnya terpotong. Fokus terkunci di panel, Esc menutup (useFocusTrap).
 */
export function MenuPanel({ onClose, onEscape }: { onClose: () => void; onEscape: () => void }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const active = activeKey(pathname);
  const ref = useRef<HTMLElement>(null);
  useFocusTrap(ref, true, onEscape);

  return (
    <>
      <div
        className="animate-fade-in pointer-events-auto fixed inset-0 z-0 bg-(--scrim) backdrop-blur-[4px] md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        ref={ref}
        id="mobile-menu"
        aria-label={t("menuLabel")}
        className="animate-pop-in pointer-events-auto relative z-10 mt-2 flex flex-col gap-1 rounded-[26px] border border-line bg-surface p-2 shadow-[0_18px_40px_-18px_var(--shadow)] md:hidden"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.key}
            href={item.href}
            onClick={onClose}
            className="nav-link min-h-[52px] justify-between px-4 text-[16px]"
            aria-current={active === item.key ? "page" : undefined}
          >
            {t(item.key)}
            {active === item.key && <span aria-hidden="true" className="size-2 rounded-full bg-gold" />}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
