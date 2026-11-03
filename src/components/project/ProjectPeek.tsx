"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
import { getProject, projectCover, projects, type Locale } from "@/content/projects";
import { getPathname, useRouter } from "@/i18n/navigation";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { useUI } from "@/lib/uiStore";
import { ArrowRightIcon, CloseIcon, ExternalIcon } from "@/components/ui/icons";
import { signalNavigation } from "@/components/ui/NavLink";
import { runNavTransition } from "@/lib/pageTransition";
import { ScreenFrame } from "@/components/ui/ScreenFrame";

/**
 * Drawer "panel intip" di Beranda. URL sudah diganti ke /karya/[slug] oleh PeekLink (pushState);
 * tombol Back menutupnya, refresh membuka halaman penuh.
 */
export function ProjectPeek() {
  const t = useTranslations("project");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const slug = useUI((s) => s.peekSlug);
  const setPeek = useUI((s) => s.setPeek);
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const project = slug ? getProject(slug) : undefined;

  const close = useCallback(() => {
    if (window.history.state?.argyPeek) window.history.back();
    else setPeek(null);
  }, [setPeek]);

  useFocusTrap(panelRef, Boolean(project), close, closeRef);

  // Tombol Back/Forward browser.
  useEffect(() => {
    function onPop() {
      const state = window.history.state as { argyPeek?: string } | null;
      setPeek(state?.argyPeek ?? null);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [setPeek]);

  useEffect(() => {
    if (!project) {
      returnFocus.current?.focus({ preventScroll: true });
      returnFocus.current = null;
      return;
    }
    returnFocus.current ??= document.activeElement as HTMLElement;
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = overflow;
    };
  }, [project]);

  if (!project) return null;
  const c = project.i18n[locale];
  const href = { pathname: "/work/[slug]" as const, params: { slug: project.slug } };
  const index = projects.indexOf(project) + 1;
  const cover = projectCover(project.slug);

  return (
    <>
      <div className="animate-fade-in fixed inset-0 z-[65] bg-(--scrim) backdrop-blur-[4px]" onClick={close} aria-hidden="true" />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="peek-title"
        className="animate-slide-in-right fixed inset-y-0 right-0 z-[66] flex w-[min(500px,100vw)] flex-col overflow-y-auto bg-surface shadow-[-30px_0_70px_-30px_var(--shadow)]"
      >
        <div
          className={`tone-${project.tone} relative flex min-h-[250px] flex-col justify-end overflow-hidden px-6 pt-[calc(env(safe-area-inset-top,0px)+24px)] pb-7`}
        >
          <span className="glyph opacity-20" data-glyph={project.glyph} aria-hidden="true" />
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="absolute top-[calc(env(safe-area-inset-top,0px)+16px)] right-4 z-[1] grid size-11 place-items-center rounded-full bg-veil-75 text-tile-ink"
          >
            <CloseIcon />
          </button>
          <span className="idx relative">
            {String(index).padStart(2, "0")} · {c.kind}
          </span>
          <h2
            id="peek-title"
            className="relative mt-2 font-display text-[40px] leading-[1.05] font-extrabold tracking-[-0.03em]"
          >
            {project.name}
          </h2>
        </div>
        <div className="flex flex-1 flex-col gap-[18px] p-6">
          {cover && (
            <ScreenFrame src={cover.src} alt={cover.alt[locale]} sizes="460px" className="aspect-[16/10] w-full" />
          )}
          <p className="m-0 text-[16.5px] leading-[1.7] text-muted">{c.overview}</p>
          <div className="chips" aria-label={t("stack")}>
            {project.stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          {project.link && (
            <a href={project.link.href} target="_blank" rel="noopener noreferrer" className="btn btn-line w-full">
              <span aria-hidden="true" className="size-2 rounded-full bg-ok shadow-[0_0_0_4px_var(--ok-ring)]" />
              {t("visit", { label: project.link.label })}
              <ExternalIcon />
            </a>
          )}
          <a
            href={getPathname({ locale, href })}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault();
              signalNavigation(e);
              setPeek(null);
              // Ganti entri riwayat panel dengan halaman penuh; Back tetap kembali ke Beranda.
              runNavTransition("forward", () => router.replace(href));
            }}
            className="btn btn-blue w-full"
          >
            {t("openFull")}
            <ArrowRightIcon />
          </a>
          <p className="m-0 rounded-sm bg-surface-2 px-3 py-2.5 font-mono text-xs leading-normal text-muted">
            {t("peekNote")}
          </p>
        </div>
      </aside>
    </>
  );
}
