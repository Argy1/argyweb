import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { profile } from "@/content/profile";
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

/** Deskripsi meta ≤ 160 karakter, dipotong di batas kata (Google memotong ±155–160). */
export function trimDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 80)).replace(/[\s,.;:–-]+$/, "")}…`;
}

export const ogLocale: Record<AppLocale, string> = { id: "id_ID", en: "en_US" };

/**
 * Open Graph lengkap untuk halaman yang menimpa `openGraph` dari layout. Next tidak menggabungkan
 * objek ini, jadi siteName/locale/gambar harus ditulis ulang, kalau tidak pratinjau tautan kosong.
 * Gambar memakai kartu beranda per bahasa (`/[locale]/opengraph-image`).
 */
export function openGraphFor(
  locale: AppLocale,
  href: Href,
  { title, description, type = "website", withImage = true }: { title: string; description: string; type?: "website" | "profile" | "article"; withImage?: boolean },
): NonNullable<Metadata["openGraph"]> {
  return {
    type,
    title,
    description,
    url: localizedUrl(locale, href),
    siteName: profile.name,
    locale: ogLocale[locale],
    // withImage=false: biarkan gambar OG berbasis berkas milik segmen itu (mis. gambar per proyek).
    ...(withImage ? { images: [{ url: `${siteUrl}/${locale}/opengraph-image`, width: 1200, height: 630, alt: `${profile.name} · ${profile.role[locale]}` }] } : {}),
  };
}
