import { getLocale, getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { NavLink } from "@/components/ui/NavLink";
import type { AppLocale } from "@/i18n/routing";
import { featuredProjects, projectCover, projects } from "@/content/projects";
import { ChipAnchor } from "@/components/ui/ChipAnchor";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ScreenFrame } from "@/components/ui/ScreenFrame";
import { PeekLink } from "./PeekLink";

const tileBase =
  "group relative flex flex-col justify-between overflow-hidden rounded-[30px] border border-tile-edge p-6 text-left shadow-[0_18px_40px_-26px_var(--shadow)] hover-glow";

const spans = [
  "min-h-[340px] sm:col-span-2 sm:row-span-2 lg:col-span-4 lg:row-span-2",
  "min-h-[220px] lg:col-span-2",
  "min-h-[220px] lg:col-span-2",
];

export async function FeaturedBento() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as AppLocale;

  return (
    <section data-chip-section="home-work" aria-labelledby="work-title" className="pt-20 pb-5 lg:pt-[120px]">
      <div className="wrap">
        <div className="mb-9 grid items-end gap-x-[30px] gap-y-4 md:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <span className="eyebrow">{t("workEyebrow")}</span>
            <h2 id="work-title" className="h-section">
              {t("workTitle")}
            </h2>
          </div>
          <div className="flex items-end gap-6">
            <p className="m-0 max-w-[36ch] text-[17px] leading-[1.6] text-muted">{t("workSub")}</p>
            <ChipAnchor id="home-work" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 sm:auto-rows-[230px] lg:grid-cols-6">
          {featuredProjects.map((p, i) => {
            const c = p.i18n[locale];
            const href = getPathname({ locale, href: { pathname: "/work/[slug]", params: { slug: p.slug } } });
            const big = i === 0;
            // Tile besar menampilkan screenshot (mobile: di alur; ≥640px: kolom kanan, teks di kiri).
            const cover = big ? projectCover(p.slug) : undefined;
            return (
              <PeekLink
                key={p.slug}
                slug={p.slug}
                href={href}
                className={`${tileBase} tone-${p.tone} ${spans[i]}`}
              >
                <span aria-hidden="true" data-glyph={p.glyph} className={`glyph ${big ? "text-[min(340px,30vw)]" : ""}`} />
                <span className="relative flex items-center justify-between gap-2.5">
                  <span className="idx">{String(projects.indexOf(p) + 1).padStart(2, "0")}</span>
                  <span className="status-pill">{c.status}</span>
                </span>
                {cover && (
                  <ScreenFrame
                    src={cover.src}
                    alt={cover.alt[locale]}
                    sizes="(max-width: 640px) 90vw, 480px"
                    className="relative my-5 aspect-[16/10] w-full transition-transform duration-500 group-hover:-translate-y-1.5 sm:absolute sm:top-[72px] sm:right-6 sm:my-0 sm:w-[50%] lg:w-[52%]"
                  />
                )}
                <span className="relative flex items-end justify-between gap-3.5">
                  <span className={`block min-w-0 ${cover ? "sm:max-w-[44%] lg:max-w-[42%]" : ""}`}>
                    <span
                      className={`block font-display leading-[1.05] font-extrabold tracking-[-0.03em] ${big ? "text-[clamp(36px,4.4vw,58px)]" : "text-[28px]"}`}
                    >
                      {p.name}
                    </span>
                    <span className="mt-1.5 block text-[14.5px] font-semibold">{c.kind}</span>
                    {big && (
                      <span className="mt-3.5 block max-w-[44ch] text-[17px] leading-[1.55]">{c.overview}</span>
                    )}
                  </span>
                  <span className="arrow">
                    <ArrowRightIcon />
                  </span>
                </span>
              </PeekLink>
            );
          })}
          <NavLink
            href="/work"
            className="group relative flex min-h-[150px] items-center justify-between gap-5 overflow-hidden rounded-[30px] bg-ink p-6 text-bg shadow-[0_18px_40px_-26px_var(--shadow)] hover-glow sm:col-span-2 sm:min-h-0 lg:col-span-6"
          >
            <span>
              <span className="block font-display text-[clamp(26px,3vw,40px)] leading-[1.05] font-extrabold tracking-[-0.03em]">
                {t("allWork", { count: projects.length })}
              </span>
              <span className="mt-1.5 block text-[14.5px] font-semibold">{t("allWorkSub")}</span>
            </span>
            <span className="arrow bg-gold!">
              <ArrowRightIcon />
            </span>
          </NavLink>
        </div>
      </div>
    </section>
  );
}
