import { profile } from "@/content/profile";
import { getProject, projects } from "@/content/projects";
import { routing, type AppLocale } from "@/i18n/routing";
import { ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Argy Fawwaz Akbar · project";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export default async function Image({ params }: { params: Promise<{ locale: AppLocale; slug: string }> }) {
  const { locale, slug } = await params;
  const project = getProject(slug) ?? projects[0];
  const c = project.i18n[locale];
  return renderOg({
    eyebrow: c.kind,
    title: project.name,
    subtitle: c.overview.length > 140 ? `${c.overview.slice(0, 137)}…` : c.overview,
    glyph: project.glyph,
    tone: project.tone,
    footer: `${profile.name} · ${project.stack.slice(0, 3).join(" · ")}`,
  });
}
