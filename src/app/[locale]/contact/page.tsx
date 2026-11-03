import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { ContactForm } from "@/components/contact/ContactForm";
import { LiveClock } from "@/components/home/LiveClock";
import { AskAIButton } from "@/components/ui/AskAIButton";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ChipAnchor } from "@/components/ui/ChipAnchor";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { ArrowRightIcon, DownloadIcon, ExternalIcon, SparkIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { profile } from "@/content/profile";
import type { AppLocale } from "@/i18n/routing";
import { personJsonLd } from "@/lib/jsonld";
import { alternatesFor, openGraphFor } from "@/lib/seo";
import { Scramble } from "@/components/ui/Scramble";

type Props = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("contactTitle"),
    description: t("contactDescription"),
    alternates: alternatesFor(locale, "/contact"),
    openGraph: openGraphFor(locale, "/contact", { title: t("contactTitle"), description: t("contactDescription") }),
  };
}

const cardCls =
  "group flex h-full flex-col gap-2 rounded-[26px] border border-line bg-surface p-[22px] text-left hover-glow";

/** Handle singkat yang tampil di kartu (bagian akhir URL profil). */
function handle(href: string) {
  return href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");
  const tc = await getTranslations("contact");
  const tNav = await getTranslations("nav");
  const channels = [
    ...profile.socials.map((s) => ({ key: s.label, label: s.label, href: s.href, value: handle(s.href) })),
  ];

  return (
    <PageShell>
      <JsonLd data={personJsonLd(locale)} />
      <PageHero
        anchor="contact-hero"
        labelledBy="contact-title"
        crumbs={<Breadcrumbs items={[{ label: tNav("home"), href: "/" }, { label: tNav("contact") }]} />}
      >
        <span className="eyebrow">{t("eyebrow")}</span>
        <Scramble as="h1" id="contact-title" className="h-page">
          {t("titleA")}
          <span className="mark">{t("titleB")}</span>
          {t("titleC")}
        </Scramble>
        <p className="lead">{tc("sub")}</p>
        <div className="flex flex-wrap items-center gap-3">
          <a href={`mailto:${profile.email}`} className="btn btn-blue">
            {t("emailCta")}
            <ArrowRightIcon />
          </a>
          <AskAIButton className="btn btn-line">
            <SparkIcon size={17} />
            {tNav("askLabel")}
          </AskAIButton>
        </div>
        <div className="self-start">
          <CopyEmail variant="onLight" />
        </div>
      </PageHero>

      <section aria-labelledby="channels-title" className="pt-10 pb-5 lg:pt-16">
        <div className="wrap">
          <div className="mb-8">
            <span className="eyebrow">{t("channelsEyebrow")}</span>
            <Scramble as="h2" id="channels-title" className="h-section">
              {t("channelsTitle")}
            </Scramble>
          </div>
          <ul className="m-0 grid list-none grid-cols-1 gap-[18px] p-0 sm:grid-cols-2 lg:grid-cols-3">
            <li>
              <a href={`mailto:${profile.email}`} className={cardCls}>
                <span className="flex items-center justify-between">
                  <span className="font-display text-xl font-extrabold">Email</span>
                  <ArrowRightIcon size={17} className="text-muted" />
                </span>
                <span className="font-mono text-[13px] break-all text-accent">{profile.email}</span>
                <span className="text-[15px] leading-normal text-muted">{t("channels.email")}</span>
              </a>
            </li>
            {channels.map((c) => (
              <li key={c.key}>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className={cardCls}>
                  <span className="flex items-center justify-between">
                    <span className="font-display text-xl font-extrabold">{c.label}</span>
                    <ExternalIcon className="text-muted" />
                  </span>
                  <span className="font-mono text-[13px] break-all text-accent">{c.value}</span>
                  <span className="text-[15px] leading-normal text-muted">
                    {t(`channels.${c.key as "GitHub" | "LinkedIn" | "Instagram"}`)}
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a href={profile.cv[locale]} download={profile.cvDownloadName[locale]} className={cardCls}>
                <span className="flex items-center justify-between">
                  <span className="font-display text-xl font-extrabold">{t("cvLabel")}</span>
                  <DownloadIcon size={17} className="text-muted" />
                </span>
                <span className="font-mono text-[13px] text-accent">{profile.cvDownloadName[locale]}</span>
                <span className="text-[15px] leading-normal text-muted">{t("channels.cv")}</span>
              </a>
            </li>
            <li>
              <AskAIButton className={`${cardCls} w-full`}>
                <span className="flex w-full items-center justify-between">
                  <span className="font-display text-xl font-extrabold">{t("aiLabel")}</span>
                  <SparkIcon size={17} className="text-muted" />
                </span>
                <span className="font-mono text-[13px] text-accent">{tNav("askLabel")}</span>
                <span className="text-[15px] leading-normal text-muted">{t("channels.ai")}</span>
              </AskAIButton>
            </li>
          </ul>
        </div>
      </section>

      <section
        data-chip-section="contact-form"
        aria-labelledby="form-title"
        className="pt-20 pb-5 lg:pt-[120px]"
      >
        <div className="wrap grid items-start gap-7 nav:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <ChipAnchor id="contact-form" stage className="nav:col-span-2" />
          <div className="card">
            <span className="eyebrow">{t("formEyebrow")}</span>
            <Scramble as="h2" id="form-title" className="h-card mt-3">
              {t("formTitle")}
            </Scramble>
            <p className="mt-0 mb-6 max-w-[56ch] text-[15.5px] leading-[1.65] text-muted">{t("formSub")}</p>
            <ContactForm />
          </div>
          <aside className="flex flex-col gap-4">
            <ChipAnchor id="contact-form" className="self-end" />
            <div className="card">
              <Scramble as="h2" className="h-card">
                {t("infoTitle")}
              </Scramble>
              <dl className="m-0 flex flex-col">
                <div className="flex flex-col gap-[3px] border-b border-line py-3">
                  <dt className="text-xs font-bold tracking-[0.06em] text-muted uppercase">{t("location")}</dt>
                  <dd className="m-0 text-[15.5px] font-semibold">{t("basedValue")}</dd>
                </div>
                <div className="flex flex-col gap-[3px] py-3">
                  <dt className="text-xs font-bold tracking-[0.06em] text-muted uppercase">{t("localTime")}</dt>
                  <dd className="m-0 font-mono text-[15.5px] font-medium">
                    <LiveClock />
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
