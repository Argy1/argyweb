"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { NavLink } from "@/components/ui/NavLink";
import { routing, type AppLocale } from "@/i18n/routing";
import { useUI } from "@/lib/uiStore";
import { SparkIcon } from "@/components/ui/icons";

type NavKey = "home" | "work" | "about" | "contact";

function activeKey(pathname: string): NavKey | null {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/work")) return "work";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/contact")) return "contact";
  return null;
}

function NavLinks({ className }: { className: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const active = activeKey(pathname);
  const items = [
    { key: "home", href: "/" },
    { key: "work", href: "/work" },
    { key: "about", href: "/about" },
    { key: "contact", href: "/contact" },
  ] as const;
  return (
    <nav aria-label={t("label")} className={className}>
      {items.map((item) => (
        <NavLink
          key={item.key}
          href={item.href}
          className="nav-link"
          aria-current={active === item.key ? "page" : undefined}
        >
          {t(item.key)}
        </NavLink>
      ))}
    </nav>
  );
}

function LangSwitch() {
  const t = useTranslations("nav");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [pending, startTransition] = useTransition();

  function switchTo(next: AppLocale) {
    if (next === locale) return;
    startTransition(() => {
      // Pathname template + params supaya tetap di halaman yang sama (/id/karya/x ↔ /en/work/x).
      router.replace(
        // @ts-expect-error -- pathname & params selalu cocok untuk rute saat ini
        { pathname, params },
        { locale: next, scroll: false },
      );
    });
  }

  return (
    <div role="group" aria-label={t("langLabel")} className="flex rounded-chip bg-surface-2 p-[3px]" aria-busy={pending}>
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-pressed={l === locale}
          lang={l}
          className="min-h-[38px] min-w-[42px] rounded-chip text-[13px] font-bold text-muted uppercase aria-pressed:bg-surface aria-pressed:text-ink aria-pressed:shadow-[0_2px_6px_var(--shadow)]"
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function ThemeToggle() {
  const t = useTranslations("nav");
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={t("themeLabel")}
      className="grid size-11 flex-none place-items-center rounded-full border border-line bg-surface transition-transform duration-200 hover:-rotate-12"
    >
      <svg
        className="dark:hidden"
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a7 7 0 0 0 10.7 10.7z" />
      </svg>
      <svg
        className="hidden dark:block"
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
      </svg>
    </button>
  );
}

export function Navbar() {
  const t = useTranslations("nav");
  const openChat = useUI((s) => s.openChat);
  const chatOpen = useUI((s) => s.chatOpen);

  return (
    <header className="site-header pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+14px)] z-30">
      <div className="wrap">
        <div className="pointer-events-auto flex h-[62px] items-center justify-between gap-2.5 rounded-chip border border-line bg-nav-bg pr-2 pl-3.5 shadow-[0_10px_30px_-14px_var(--shadow)] backdrop-blur-[14px] sm:pl-[18px]">
          <NavLink
            href="/"
            aria-label={t("logoLabel")}
            className="font-display text-[22px] font-black tracking-[-0.03em]"
          >
            argy<span className="text-blue">.</span>
          </NavLink>
          <NavLinks className="hidden gap-1 nav:flex" />
          <div className="flex items-center gap-1.5">
            <LangSwitch />
            <ThemeToggle />
            <button
              type="button"
              onClick={(e) => openChat({ returnFocus: e.currentTarget })}
              aria-expanded={chatOpen}
              aria-label={t("askLabel")}
              className="flex h-[46px] w-[46px] items-center justify-center gap-2 rounded-chip bg-gold text-[14.5px] font-bold text-tile-ink transition-transform duration-200 hover:-translate-y-0.5 min-[480px]:w-auto min-[480px]:px-[18px]"
            >
              <SparkIcon />
              <span className="hidden min-[480px]:inline">{t("askLabel")}</span>
            </button>
          </div>
        </div>
        <NavLinks className="pointer-events-auto mt-2 flex justify-center gap-1.5 nav:hidden [&_.nav-link]:border [&_.nav-link]:border-line [&_.nav-link]:bg-nav-bg [&_.nav-link]:px-3.5 [&_.nav-link]:backdrop-blur-[10px] [&_.nav-link[aria-current=page]]:bg-ink" />
      </div>
    </header>
  );
}
