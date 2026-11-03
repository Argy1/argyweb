import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageHero } from "@/components/ui/PageHero";
import { WorkBrowser, WorkGridView } from "@/components/work/WorkBrowser";
import type { WorkCardData } from "@/components/work/WorkCard";
import { projectCover, projects } from "@/content/projects";
import type { AppLocale } from "@/i18n/routing";
import { alternatesFor, openGraphFor } from "@/lib/seo";
import { Scramble } from "@/components/ui/Scramble";

type Props = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("workTitle"),
    description: t("workDescription"),
    alternates: alternatesFor(locale, "/work"),
    openGraph: openGraphFor(locale, "/work", { title: t("workTitle"), description: t("workDescription") }),
  };
}

export default async function WorkPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");
  const tNav = await getTranslations("nav");

  const cards: WorkCardData[] = projects.map((p, i) => {
    const c = p.i18n[locale];
    const cover = projectCover(p.slug);
    return {
      slug: p.slug,
      name: p.name,
      glyph: p.glyph,
      tone: p.tone,
      idx: String(i + 1).padStart(2, "0"),
      status: c.status,
      kind: c.kind,
      year: p.year,
      category: p.category,
      stack: p.stack,
      cover: cover ? { src: cover.src, alt: cover.alt[locale] } : undefined,
      link: p.link,
    };
  });

  return (
    <PageShell>
      <PageHero
        anchor="work-head"
        labelledBy="work-page-title"
        crumbs={<Breadcrumbs items={[{ label: tNav("home"), href: "/" }, { label: tNav("work") }]} />}
      >
        <Scramble as="h1" id="work-page-title" className="h-page">
          {t("pageA")}
          <span className="mark">{t("pageB")}</span>
        </Scramble>
        <p className="lead">{t("pageSub")}</p>
      </PageHero>
      <section data-chip-section="work-grid" aria-label={t("filterLabel")} className="pt-2.5 pb-5">
        <div className="wrap">
          <Suspense fallback={<WorkGridView cards={cards} filter="all" />}>
            <WorkBrowser cards={cards} />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
