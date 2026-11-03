import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Gallery } from "@/components/project/Gallery";
import { AskAIButton } from "@/components/ui/AskAIButton";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ChipAnchor } from "@/components/ui/ChipAnchor";
import { ExternalIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { getNeighbors, getProject, projectGallery, projects } from "@/content/projects";
import { ScreenFrame } from "@/components/ui/ScreenFrame";
import { NavLink } from "@/components/ui/NavLink";
import type { AppLocale } from "@/i18n/routing";
import { projectJsonLd } from "@/lib/jsonld";
import { alternatesFor } from "@/lib/seo";

type Props = { params: Promise<{ locale: AppLocale; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const c = project.i18n[locale];
  return {
    title: project.name,
    description: c.overview,
    alternates: alternatesFor(locale, { pathname: "/work/[slug]", params: { slug } }),
    openGraph: { title: project.name, description: c.overview, type: "article" },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations("project");
  const tNav = await getTranslations("nav");
  const tWork = await getTranslations("work");
  const c = project.i18n[locale];
  const { prev, next } = getNeighbors(slug);
  const shots = (projectGallery[slug] ?? []).map((g) => ({ src: g.src, alt: g.alt[locale] }));
  // Screenshot pertama jadi cover; sisanya di galeri. Tanpa screenshot sama sekali → placeholder.
  const cover = shots[0];
  const gallery = shots.slice(1);
  const ask = t("askPrompt", { name: project.name });
  const meta = [
    { k: t("role"), v: c.role },
    { k: t("year"), v: project.year },
    { k: t("status"), v: c.status },
    { k: t("category"), v: tWork(`cats.${project.category}`) },
  ];

  return (
    <PageShell>
      <JsonLd data={projectJsonLd(locale, project)} />
      <PageHero
        anchor="project-hero"
        labelledBy="project-title"
        crumbs={
          <Breadcrumbs
            items={[
              { label: tNav("home"), href: "/" },
              { label: tNav("work"), href: "/work" },
              { label: project.name },
            ]}
          />
        }
      >
        <span className="eyebrow">{c.kind}</span>
        <h1 id="project-title" className="h-page">
          {project.name}
        </h1>
        <p className="lead">{c.overview}</p>
        <div className="flex flex-wrap gap-3">
          {project.link && (
            <a href={project.link.href} target="_blank" rel="noopener noreferrer" className="btn btn-blue">
              {t("visit", { label: project.link.label })}
              <ExternalIcon />
            </a>
          )}
          <AskAIButton question={ask} className="btn btn-line">
            {t("askProject")}
          </AskAIButton>
        </div>
      </PageHero>

      <section aria-labelledby="highlights-title" className="pt-2.5 pb-5">
        <div className="wrap">
          <div
            className={`tone-${project.tone} relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[36px] border border-tile-edge p-[clamp(22px,4vw,40px)] shadow-[0_24px_50px_-30px_var(--shadow)]`}
          >
            <span className="glyph right-2.5 bottom-[-40px] text-[min(360px,34vw)] opacity-20" data-glyph={project.glyph} aria-hidden="true" />
            {cover && (
              <ScreenFrame
                src={cover.src}
                alt={cover.alt}
                priority
                sizes="(max-width: 1200px) 92vw, 1040px"
                className="relative mb-[clamp(18px,3vw,28px)] aspect-[16/10] w-full md:aspect-[16/9]"
              />
            )}
            <dl className="relative m-0 grid grid-cols-2 gap-3 md:grid-cols-4">
              {meta.map((m) => (
                <div key={m.k} className="rounded-[18px] bg-veil-55 px-3.5 py-3 text-tile-ink">
                  <dt className="text-[11.5px] font-bold tracking-[0.06em] uppercase opacity-80">{m.k}</dt>
                  <dd className="m-0 mt-1 text-[15px] font-bold">{m.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div data-chip-section="project-body">
            <div className="mt-7 grid items-stretch gap-7 nav:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <div className="card h-full">
                <h2 id="highlights-title" className="h-card">
                  {t("highlights")}
                </h2>
                <ol className="m-0 flex list-none flex-col gap-3 p-0">
                  {c.highlights.map((h, i) => (
                    <li key={h} className="grid grid-cols-[30px_minmax(0,1fr)] items-start gap-3 text-[16.5px] leading-[1.55] font-medium">
                      <span
                        aria-hidden="true"
                        className="grid size-[30px] place-items-center rounded-[10px] bg-gold font-mono text-xs font-medium text-tile-ink"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <aside className="flex flex-col gap-4">
                <div className="card flex-1">
                  <h2 className="h-card">{t("stack")}</h2>
                  <ul className="chips m-0 list-none p-0">
                    {project.stack.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <AskAIButton question={ask} className="btn btn-gold w-full">
                  {t("askProject")}
                </AskAIButton>
              </aside>
            </div>
            <ChipAnchor id="project-body" className="ml-auto" />

            {(gallery.length > 0 || !cover) && (
              <>
                <h2 className="sr-only">{t("gallery")}</h2>
                <div className="mt-7">
                  <Gallery items={gallery} projectName={project.name} />
                </div>
              </>
            )}

            <nav aria-label={`${t("prev")} / ${t("next")}`} className="mt-10 grid grid-cols-1 gap-[18px] sm:grid-cols-2">
              <NavLink
                direction="back"
                href={{ pathname: "/work/[slug]", params: { slug: prev.slug } }}
                className="flex flex-col gap-1.5 rounded-[26px] border border-line bg-surface p-[22px] hover-glow"
              >
                <small className="font-mono text-xs tracking-[0.08em] text-muted uppercase">← {t("prev")}</small>
                <b className="font-display text-2xl font-extrabold tracking-[-0.02em]">{prev.name}</b>
              </NavLink>
              <NavLink
                direction="forward"
                href={{ pathname: "/work/[slug]", params: { slug: next.slug } }}
                className="flex flex-col gap-1.5 rounded-[26px] border border-line bg-surface p-[22px] text-right hover-glow"
              >
                <small className="font-mono text-xs tracking-[0.08em] text-muted uppercase">{t("next")} →</small>
                <b className="font-display text-2xl font-extrabold tracking-[-0.02em]">{next.name}</b>
              </NavLink>
            </nav>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
