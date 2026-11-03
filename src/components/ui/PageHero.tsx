import type { ReactNode } from "react";
import { ChipAnchor, type ChipAnchorId } from "./ChipAnchor";

interface PageHeroProps {
  anchor: ChipAnchorId;
  crumbs: ReactNode;
  children: ReactNode;
  labelledBy: string;
}

/**
 * Hero halaman dalam: teks kiri, anchor chip di kolom kanan (desktop/tablet) atau di atas judul (mobile).
 */
export function PageHero({ anchor, crumbs, children, labelledBy }: PageHeroProps) {
  return (
    <section
      data-chip-section={anchor}
      aria-labelledby={labelledBy}
      className="flex items-center pt-[150px] pb-10 md:min-h-[62svh] nav:pt-[130px]"
    >
      <div className="wrap grid w-full items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10">
        <ChipAnchor id={anchor} fallback className="mx-auto md:order-2 md:mx-0" />
        <div className="flex max-w-[660px] flex-col gap-[22px]">
          {crumbs}
          {children}
        </div>
      </div>
    </section>
  );
}
