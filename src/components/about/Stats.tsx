import { getLocale, getTranslations } from "next-intl/server";
import { certificates } from "@/content/certificates";
import { stats } from "@/content/profile";
import { projects } from "@/content/projects";
import type { AppLocale } from "@/i18n/routing";

export async function Stats({ withCertificates = false, className = "" }: { withCertificates?: boolean; className?: string }) {
  const t = await getTranslations("stats");
  const locale = (await getLocale()) as AppLocale;
  const items = [
    { value: stats.doctorProfiles[locale], label: t("doctors"), cls: "bg-gold" },
    { value: String(projects.length), label: t("projects"), cls: "bg-steel" },
    { value: String(stats.logicGates), label: t("gates"), cls: "bg-navy text-on-dark border-tile-edge!" },
  ];
  if (withCertificates) items.push({ value: String(certificates.length), label: t("certificates"), cls: "bg-lilac" });
  return (
    <ul className={`m-0 flex list-none flex-wrap gap-3.5 p-0 ${className}`}>
      {items.map((s) => (
        <li key={s.label} className={`stat flex-1 basis-[150px] ${s.cls}`}>
          <b>{s.value}</b>
          <span>{s.label}</span>
        </li>
      ))}
    </ul>
  );
}
