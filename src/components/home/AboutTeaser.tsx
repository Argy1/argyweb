import { getTranslations } from "next-intl/server";
import { NavLink } from "@/components/ui/NavLink";
import { Stats } from "@/components/about/Stats";
import { ChipAnchor } from "@/components/ui/ChipAnchor";

export async function AboutTeaser() {
  const t = await getTranslations("home");
  const tAbout = await getTranslations("about");
  return (
    <section data-chip-section="home-about" aria-labelledby="about-teaser" className="pt-20 pb-5 lg:pt-[120px]">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-14">
        <ChipAnchor id="home-about" className="mx-auto lg:mx-0" />
        <div>
          <span className="eyebrow" id="about-teaser">
            {t("aboutEyebrow")}
          </span>
          <p className="mt-3.5 mb-[22px] font-display text-[clamp(28px,3.4vw,44px)] leading-[1.12] font-bold tracking-[-0.03em] text-balance">
            {t("quote")}
          </p>
          <div className="prose-body">
            <p>{tAbout("bio1")}</p>
          </div>
          <Stats className="mt-[26px]" />
          <div className="mt-[30px]">
            <NavLink href="/about" className="btn btn-line">
              {t("moreAbout")} →
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}
