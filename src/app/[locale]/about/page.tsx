import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Certificates } from "@/components/about/Certificates";
import { Stats } from "@/components/about/Stats";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ChipAnchor } from "@/components/ui/ChipAnchor";
import { DownloadIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { profile } from "@/content/profile";
import { stackGroups } from "@/content/stack";
import { timeline } from "@/content/timeline";
import { NavLink } from "@/components/ui/NavLink";
import type { AppLocale } from "@/i18n/routing";
import { personJsonLd } from "@/lib/jsonld";
import { alternatesFor } from "@/lib/seo";

type Props = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("aboutTitle"),
    description: t("aboutDescription"),
    alternates: alternatesFor(locale, "/about"),
    openGraph: { title: t("aboutTitle"), description: t("aboutDescription"), type: "profile" },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tNav = await getTranslations("nav");
  const tHero = await getTranslations("hero");
  const facts = t.raw("facts") as { k: string; v: string }[];

  return (
    <PageShell>
      <JsonLd data={personJsonLd(locale)} />
      <PageHero
        anchor="about-hero"
        labelledBy="about-title"
        crumbs={<Breadcrumbs items={[{ label: tNav("home"), href: "/" }, { label: tNav("about") }]} />}
      >
        <h1 id="about-title" className="h-page">
          {t("pageA")}
          <span className="mark">{t("pageB")}</span>
        </h1>
        <p className="lead">{t("lead")}</p>
        <div className="flex flex-wrap gap-3">
          <a href={profile.cv[locale]} download={profile.cvDownloadName} className="btn btn-blue">
            <DownloadIcon />
            {t("cv")}
          </a>
          <NavLink href="/work" className="btn btn-line">
            {tHero("ctaWork")}
          </NavLink>
        </div>
      </PageHero>

      <section aria-label={t("pageB")} className="pt-2.5 pb-5">
        <div className="wrap">
          <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="relative min-h-[340px] overflow-hidden rounded-lg bg-blue md:row-span-2 lg:row-span-1">
              <Image
                src={profile.photo}
                alt={t("photoAlt")}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px"
                className="object-cover"
                priority
              />
            </div>
            <div className="card prose-body">
              <p>{t("bio1")}</p>
              <p>{t("bio2")}</p>
              <p>{t("bio3")}</p>
            </div>
            <div className="card">
              <dl className="m-0 flex flex-col">
                {facts.map((f) => (
                  <div key={f.k} className="flex flex-col gap-[3px] border-b border-line py-3 last:border-b-0">
                    <dt className="text-xs font-bold tracking-[0.06em] text-muted uppercase">{f.k}</dt>
                    <dd className="m-0 text-[15.5px] font-semibold">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Stats withCertificates className="mt-[34px]" />
        </div>
      </section>

      <section data-chip-section="about-stack" aria-labelledby="stack-title" className="pt-20 pb-5 lg:pt-[120px]">
        <div className="wrap">
          <ChipAnchor id="about-stack" stage />
          <div className="mb-9 flex items-end justify-between gap-6">
            <ChipAnchor id="about-stack" className="-ml-[5vw]" />
            <div className="ml-auto text-right">
              <span className="eyebrow">{t("stackEyebrow")}</span>
              <h2 id="stack-title" className="h-section ml-auto">
                {t("stackTitle")}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-[18px]">
            {stackGroups.map((g) => (
              <div key={g.code} className="rounded-[26px] border border-line bg-surface p-[22px]">
                <div className="mb-4 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`swatch-${g.tone} grid size-[42px] place-items-center rounded-sm font-display text-[15px] font-black text-tile-ink`}
                  >
                    {g.code}
                  </span>
                  <h3 className="m-0 font-display text-xl font-extrabold tracking-[-0.02em]">{g.title}</h3>
                </div>
                <ul className="chips m-0 list-none p-0">
                  {g.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-chip-section="about-journey" aria-labelledby="journey-title" className="pt-20 pb-5 lg:pt-[120px]">
        <div className="wrap">
          <ChipAnchor id="about-journey" stage />
          <div className="mb-9 flex items-end justify-between gap-6">
            <div>
              <span className="eyebrow">{t("journeyEyebrow")}</span>
              <h2 id="journey-title" className="h-section">
                {t("journeyTitle")}
              </h2>
            </div>
            <ChipAnchor id="about-journey" className="-mr-[5vw]" />
          </div>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-[18px] p-0">
            {timeline[locale].map((e) => (
              <li key={e.title} className="flex flex-col gap-2.5 rounded-[26px] border border-line bg-surface p-[22px]">
                <span
                  className={`swatch-${e.tone} inline-flex min-h-8 items-center self-start rounded-chip px-3 font-mono text-[12.5px] font-medium text-tile-ink`}
                >
                  {e.when}
                </span>
                <h3 className="mt-1 mb-0 font-display text-[21px] leading-[1.15] font-extrabold tracking-[-0.02em]">
                  {e.title}
                </h3>
                <p className="m-0 text-sm font-bold text-accent">{e.role}</p>
                <p className="m-0 text-[15px] leading-[1.6] text-muted">{e.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="sertifikat" aria-labelledby="cert-title" className="pt-20 pb-5 lg:pt-[120px]">
        <div className="wrap">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-x-[30px] gap-y-4">
            <div>
              <span className="eyebrow">{t("certEyebrow")}</span>
              <h2 id="cert-title" className="h-section">
                {t("certTitle")}
              </h2>
            </div>
            <p className="m-0 max-w-[40ch] text-[17px] leading-[1.6] text-muted">{t("certSub")}</p>
          </div>
          <Certificates />
        </div>
      </section>
    </PageShell>
  );
}
