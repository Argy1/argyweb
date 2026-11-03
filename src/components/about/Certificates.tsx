"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { certificates, type Certificate } from "@/content/certificates";
import type { Locale } from "@/content/projects";
import { FileIcon } from "@/components/ui/icons";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";

const fileTones = ["tone-navy", "tone-blue", "tone-violet", "tone-steel"];

export function Certificates() {
  const t = useTranslations("about");
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState<LightboxItem | null>(null);

  function show(c: Certificate) {
    setOpen({
      title: c.title[locale],
      subtitle: `${c.issuer} · ${c.date}`,
      image: c.image,
      file: c.file,
      extra: c.credentialUrl ? (
        <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-accent">
          {t("certCredential")} ↗
        </a>
      ) : undefined,
    });
  }

  return (
    <>
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-[18px] p-0">
        {certificates.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => show(c)}
              aria-haspopup="dialog"
              className="group flex h-full w-full flex-col overflow-hidden rounded-[26px] border border-line bg-surface text-left hover-glow"
            >
              <span className="relative block aspect-[16/10] w-full overflow-hidden bg-surface-2">
                {c.image ? (
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 380px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span className={`${fileTones[i % fileTones.length]} absolute inset-0 flex flex-col justify-between p-[18px]`}>
                    <span className="glyph text-[110px] opacity-20" data-glyph="PDF" aria-hidden="true" />
                    <FileIcon className="relative" />
                  </span>
                )}
              </span>
              <span className="flex flex-1 flex-col gap-2 p-5">
                <span className="flex flex-wrap items-center gap-2">
                  {c.result && (
                    <span className="inline-flex min-h-7 items-center rounded-chip bg-gold px-2.5 text-[12.5px] font-bold text-tile-ink">
                      {c.result[locale]}
                    </span>
                  )}
                  {c.category && (
                    <span className="font-mono text-[11.5px] tracking-[0.06em] text-muted uppercase">
                      {t(`certCats.${c.category}`)} · {c.date.slice(0, 4)}
                    </span>
                  )}
                </span>
                <span className="font-display text-[19px] leading-[1.2] font-extrabold tracking-[-0.02em]">
                  {c.title[locale]}
                </span>
                <span className="text-sm leading-normal text-muted">{c.issuer}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox item={open} onClose={() => setOpen(null)} openFileLabel={t("certOpenFile")} />
    </>
  );
}
