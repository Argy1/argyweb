import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { siteUrl } from "./chat-knowledge";

type Href = Parameters<typeof getPathname>[0]["href"];

export function localizedUrl(locale: AppLocale, href: Href): string {
  return `${siteUrl}${getPathname({ locale, href })}`;
}

/** canonical + hreflang untuk satu halaman di semua bahasa. */
export function alternatesFor(locale: AppLocale, href: Href): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localizedUrl(l, href);
  languages["x-default"] = localizedUrl(routing.defaultLocale, href);
  return { canonical: localizedUrl(locale, href), languages };
}

export const ogLocale: Record<AppLocale, string> = { id: "id_ID", en: "en_US" };
