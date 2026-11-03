import type { Metadata, Viewport } from "next";
import { Figtree, Gabarito, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { FxNotice } from "@/components/layout/FxNotice";
import { Intro } from "@/components/intro/Intro";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/layout/Providers";
import { ProjectPeek } from "@/components/project/ProjectPeek";
import { CircuitBackground } from "@/components/background/CircuitBackground";
import { CursorFx } from "@/components/background/CursorFx";
import { ChipStage } from "@/components/three/ChipStage";
import { InlineScript } from "@/components/ui/InlineScript";
import { profile } from "@/content/profile";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/chat-knowledge";
import { alternatesFor, ogLocale } from "@/lib/seo";

const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
  variable: "--font-gabarito-face",
});
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-figtree-face",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-face",
});

// Menyembunyikan intro sebelum hydration bila sudah dilihat di sesi ini (tanpa kedipan).
// Juga memasang data-fx="lite" (pilihan tersimpan atau reduced-motion) sebelum paint supaya mode Ringan tanpa kedipan.
const introScript = `try{if(sessionStorage.getItem("argy-intro-seen")==="1")document.documentElement.dataset.intro="seen"}catch(e){}try{if(localStorage.getItem("argy-fx")==="lite"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.fx="lite"}catch(e){}`;

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EEF1F6" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0F1F" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("homeTitle"), template: `%s · ${t("siteName")}` },
    description: t("homeDescription"),
    applicationName: t("siteName"),
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    alternates: alternatesFor(locale, "/"),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      locale: ogLocale[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
    },
    twitter: { card: "summary_large_image" },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    // Verifikasi kepemilikan situs di Google Search Console / Bing Webmaster (isi lewat env, lihat docs/09-SEO.md).
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION?.trim() || profile.googleSiteVerification,
      other: process.env.BING_SITE_VERIFICATION?.trim() ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION.trim() } : undefined,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "a11y" });

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${gabarito.variable} ${figtree.variable} ${jetbrains.variable}`}
    >
      <head>
        <InlineScript html={introScript} />
        <noscript>
          <style>{`.intro{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="bg-circuit">
        <div id="top" />
        <Providers>
          <NextIntlClientProvider>
            <a
              href="#konten"
              className="fixed top-3 left-3 z-[200] -translate-y-24 rounded-chip bg-ink px-4 py-3 font-bold text-bg focus:translate-y-0"
            >
              {t("skipToContent")}
            </a>
            <CircuitBackground />
            <ChipStage />
            <Intro />
            <Navbar />
            <main id="konten" className="relative z-[2]">
              {children}
            </main>
            <ProjectPeek />
            <ChatWidget />
            <FxNotice />
            <CursorFx />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
