"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";

export interface GalleryItem {
  src: string;
  alt: string;
}

export function Gallery({ items, projectName }: { items: GalleryItem[]; projectName: string }) {
  const t = useTranslations("project");
  const [open, setOpen] = useState<LightboxItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
        {[1, 2].map((n) => (
          <div
            key={n}
            className="grid aspect-[16/10] place-items-center rounded-[24px] border-2 border-dashed border-line bg-surface p-4 text-center font-mono text-[13px] text-muted"
          >
            {t("shotPlaceholder", { n, name: projectName })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <ul className="m-0 grid list-none grid-cols-1 gap-[18px] p-0 sm:grid-cols-2">
        {items.map((shot, i) => (
          <li key={shot.src} className={items.length % 2 === 1 && i === 0 ? "sm:col-span-2" : undefined}>
            <button
              type="button"
              onClick={() => setOpen({ title: shot.alt, subtitle: projectName, image: shot.src })}
              aria-label={t("enlarge", { alt: shot.alt })}
              className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[24px] border border-line bg-surface-2 hover-glow"
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 560px"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox item={open} onClose={() => setOpen(null)} />
    </>
  );
}
