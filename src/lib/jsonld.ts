import { profile } from "@/content/profile";
import type { Project } from "@/content/projects";
import type { AppLocale } from "@/i18n/routing";
import { siteUrl } from "./chat-knowledge";
import { stackGroups } from "@/content/stack";
import { localizedUrl } from "./seo";
import idMessages from "../../messages/id.json";
import enMessages from "../../messages/en.json";

const meta = { id: idMessages.meta, en: enMessages.meta };

/** Satu entitas orang yang konsisten di seluruh situs (dirujuk lewat @id dari WebSite dan ProfilePage). */
export const personId = `${siteUrl}/#person`;
export const websiteId = `${siteUrl}/#website`;

function person(locale: AppLocale) {
  return {
    "@type": "Person",
    "@id": personId,
    name: profile.name,
    alternateName: profile.alternateNames,
    description: meta[locale].homeDescription,
    jobTitle: profile.role[locale],
    url: localizedUrl(locale, "/"),
    image: `${siteUrl}${profile.photo}`,
    email: `mailto:${profile.email}`,
    sameAs: profile.socials.map((s) => s.href),
    knowsAbout: [...new Set(stackGroups.flatMap((g) => g.items))],
    knowsLanguage: ["id", "en"],
    alumniOf: { "@type": "CollegeOrUniversity", name: profile.university },
    affiliation: { "@type": "CollegeOrUniversity", name: profile.university },
  };
}

export function personJsonLd(locale: AppLocale) {
  return { "@context": "https://schema.org", ...person(locale) };
}

/** Beranda: WebSite (nama situs untuk hasil pencarian) + Person. */
export function homeJsonLd(locale: AppLocale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: profile.name,
        alternateName: [`${profile.name} Portfolio`, "argyweb"],
        description: meta[locale].homeDescription,
        inLanguage: ["id", "en"],
        publisher: { "@id": personId },
      },
      person(locale),
    ],
  };
}

/** Halaman Tentang: ProfilePage yang menjadikan Person sebagai entitas utama. */
export function profilePageJsonLd(locale: AppLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: localizedUrl(locale, "/about"),
    name: meta[locale].aboutTitle,
    description: meta[locale].aboutDescription,
    inLanguage: locale,
    isPartOf: { "@id": websiteId },
    mainEntity: person(locale),
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
