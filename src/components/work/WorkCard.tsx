import { NavLink } from "@/components/ui/NavLink";
import type { ProjectCategory, TileTone } from "@/content/projects";
import { ArrowRightIcon } from "@/components/ui/icons";
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
}

export function WorkCard({ p }: { p: WorkCardData }) {
  return (
    <NavLink
      href={{ pathname: "/work/[slug]", params: { slug: p.slug } }}
      className="group animate-fade-in flex flex-col overflow-hidden rounded-lg border border-line bg-surface text-left hover-glow"
    >
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
        <span className="font-display text-2xl font-extrabold tracking-[-0.025em]">{p.name}</span>
        <span className="text-sm font-semibold text-muted">
          {p.kind} · {p.year}
        </span>
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
    </NavLink>
  );
}
