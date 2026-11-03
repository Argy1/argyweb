import { profile } from "@/content/profile";
import type { Project } from "@/content/projects";
import type { AppLocale } from "@/i18n/routing";
import { siteUrl } from "./chat-knowledge";
import { localizedUrl } from "./seo";

export function personJsonLd(locale: AppLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role[locale],
    url: localizedUrl(locale, "/"),
    image: `${siteUrl}${profile.photo}`,
    email: `mailto:${profile.email}`,
    sameAs: profile.socials.map((s) => s.href),
    affiliation: { "@type": "CollegeOrUniversity", name: profile.university },
  };
}

export function projectJsonLd(locale: AppLocale, project: Project) {
  const c = project.i18n[locale];
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: c.overview,
    genre: c.kind,
    inLanguage: locale,
    url: localizedUrl(locale, { pathname: "/work/[slug]", params: { slug: project.slug } }),
    ...(/^\d{4}$/.test(project.year) ? { dateCreated: project.year } : {}),
    keywords: project.stack.join(", "),
    creator: { "@type": "Person", name: profile.name, url: localizedUrl(locale, "/") },
    ...(project.link ? { sameAs: project.link.href } : {}),
  };
}
