import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { routing } from "@/i18n/routing";
import { localizedUrl } from "@/lib/seo";

type Href = Parameters<typeof localizedUrl>[1];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { href: Href; priority: number }[] = [
    { href: "/", priority: 1 },
    { href: "/work", priority: 0.9 },
    { href: "/about", priority: 0.8 },
    { href: "/contact", priority: 0.7 },
    ...projects.map((p) => ({
      href: { pathname: "/work/[slug]" as const, params: { slug: p.slug } },
      priority: p.featured ? 0.8 : 0.6,
    })),
  ];

  const lastModified = new Date();
  return pages.flatMap(({ href, priority }) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, href),
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, href)])),
      },
    })),
  );
}
