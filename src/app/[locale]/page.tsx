import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { FeaturedBento } from "@/components/home/FeaturedBento";
import { Hero } from "@/components/home/Hero";
import { PageShell } from "@/components/layout/PageShell";
import { Marquee } from "@/components/home/Marquee";
import { JsonLd } from "@/components/ui/JsonLd";
import type { AppLocale } from "@/i18n/routing";
import { homeJsonLd } from "@/lib/jsonld";
import { alternatesFor, openGraphFor } from "@/lib/seo";

type Props = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { absolute: t("homeTitle") },
    description: t("homeDescription"),
    alternates: alternatesFor(locale, "/"),
    openGraph: openGraphFor(locale, "/", { title: t("homeTitle"), description: t("homeDescription") }),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PageShell>
      <JsonLd data={homeJsonLd(locale)} />
      <Hero />
      <Marquee />
      <FeaturedBento />
      <AboutTeaser />
    </PageShell>
  );
}
