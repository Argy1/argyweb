import { useTranslations } from "next-intl";
import { NavLink } from "@/components/ui/NavLink";
import type { ProjectCategory, TileTone } from "@/content/projects";
import { ArrowRightIcon, ExternalIcon } from "@/components/ui/icons";
import { ScreenFrame } from "@/components/ui/ScreenFrame";

export interface WorkCardData {
  slug: string;
  name: string;
  glyph: string;
  tone: TileTone;
  idx: string;
  status: string;
  kind: string;
  year: string;
  category: ProjectCategory;
  stack: string[];
  cover?: { src: string; alt: string };
  /** Situs yang sudah live: tampil sebagai tombol terpisah di kartu (bukti proyek benar-benar jalan). */
  link?: { href: string; label: string };
}

/**
 * Kartu proyek. Seluruh kartu bisa diklik lewat tautan nama (stretched link), sedangkan tombol situs live
 * berdiri sendiri di atasnya (z-10) supaya tidak ada tautan di dalam tautan.
 */
export function WorkCard({ p }: { p: WorkCardData }) {
  const t = useTranslations("project");
  return (
    <article className="group animate-fade-in relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface text-left hover-glow has-[:focus-visible]:shadow-[0_0_0_3px_var(--glow)]">
      <span
        className={`tone-${p.tone} relative flex ${p.cover ? "h-[220px]" : "h-[170px]"} items-start justify-between overflow-hidden p-[18px]`}
      >
        <span className="glyph bottom-[-26px] text-[130px] opacity-[0.22]" data-glyph={p.glyph} aria-hidden="true" />
        <span className="idx relative">{p.idx}</span>
        <span className="status-pill relative">{p.status}</span>
        {p.cover && (
          <ScreenFrame
            src={p.cover.src}
            alt={p.cover.alt}
            sizes="(max-width: 700px) 90vw, 360px"
            className="absolute inset-x-[18px] top-[60px] -bottom-3 transition-transform duration-500 group-hover:-translate-y-1.5"
          />
        )}
      </span>
      <span className="flex flex-1 flex-col gap-2.5 px-5 pt-5 pb-[22px]">
        <NavLink
          href={{ pathname: "/work/[slug]", params: { slug: p.slug } }}
          className="font-display text-2xl font-extrabold tracking-[-0.025em] outline-none after:absolute after:inset-0 after:content-['']"
        >
          {p.name}
        </NavLink>
        <span className="text-sm font-semibold text-muted">
          {p.kind} · {p.year}
        </span>
        {p.link && (
          <a
            href={p.link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("visit", { label: p.link.label })}
            className="relative z-10 mt-1 inline-flex min-h-11 w-fit max-w-full items-center gap-2.5 rounded-chip border border-line bg-surface-2 py-1 pr-3.5 pl-3.5 font-mono text-[13px] font-medium text-ink transition-[transform,border-color,background-color,color] duration-200 hover:-translate-y-0.5 hover:border-blue hover:bg-blue hover:text-on-dark"
          >
            <span aria-hidden="true" className="size-2 flex-none rounded-full bg-ok shadow-[0_0_0_4px_var(--ok-ring)]" />
            <span className="truncate">{p.link.label}</span>
            <ExternalIcon size={14} className="flex-none" />
          </a>
        )}
        <span className="mt-auto flex items-center justify-between gap-2.5 pt-2">
          <span className="chips">
            {p.stack.slice(0, 3).map((s) => (
              <span key={s}>{s}</span>
            ))}
          </span>
          <span className="arrow size-10! bg-surface-2! text-ink!">
            <ArrowRightIcon size={16} />
          </span>
        </span>
      </span>
    </article>
  );
}
