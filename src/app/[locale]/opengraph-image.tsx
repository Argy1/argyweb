import { getTranslations } from "next-intl/server";
import { profile } from "@/content/profile";
import { routing, type AppLocale } from "@/i18n/routing";
import { ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Argy Fawwaz Akbar · Full-stack developer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return renderOg({
    eyebrow: profile.role[locale],
    title: profile.name,
    subtitle: `${t("h1a")}${t("h1b")}${t("h1c")}${t("h1d")}${t("h1e")}`,
    glyph: "AF",
    tone: "blue",
    footer: "Web · Mobile · AI · 3D",
  });
}
