import { getTranslations } from "next-intl/server";
import { NavLink } from "@/components/ui/NavLink";
import { AskAIButton } from "@/components/ui/AskAIButton";
import { ChipAnchor } from "@/components/ui/ChipAnchor";
import { ArrowRightIcon } from "@/components/ui/icons";
import { LiveClock } from "./LiveClock";

const sticker =
  "inline-flex min-h-[38px] items-center gap-2 rounded-[12px] px-3.5 font-mono text-[13px] font-medium shadow-[0_10px_22px_-16px_var(--shadow)] transition-[transform,box-shadow] duration-250 hover:-translate-y-0.5 hover:shadow-[0_0_0_1.5px_var(--glow),0_12px_24px_-14px_var(--blue-shadow)]";

export async function Hero() {
  const t = await getTranslations("hero");
  return (
    <section
      data-chip-section="home-hero"
      aria-labelledby="hero-title"
      className="flex min-h-svh items-center pt-[150px] pb-[70px] nav:pt-[120px]"
    >
      <div className="wrap grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        {/* Di layar lebar anchor boleh masuk ke gutter kanan supaya judul cukup lebar untuk 3 baris. */}
        <ChipAnchor
          id="home-hero"
          fallback
          className="mx-auto lg:order-2 lg:mx-0 lg:mr-[min(0px,calc((1200px_-_100vw)/2))]"
        />
        <div className="flex max-w-[800px] flex-col gap-[26px]">
          <span className="inline-flex min-h-10 items-center gap-2.5 self-start rounded-chip border border-line bg-surface py-1 pr-4 pl-1.5 text-[14.5px] font-semibold">
            <span
              aria-hidden="true"
              className="grid size-[30px] place-items-center rounded-full bg-blue font-display text-[13px] font-extrabold text-on-dark"
            >
              AF
            </span>
            {t("hello")}
            <span aria-hidden="true" className="size-2 rounded-full bg-ok shadow-[0_0_0_4px_var(--ok-ring)]" />
          </span>
          <h1 id="hero-title" className="h-display">
            {t("h1a")}
            <span className="mark">{t("h1b")}</span>
            {t("h1c")}
            <span className="text-accent">{t("h1d")}</span>
            {t("h1e")}
          </h1>
          <p className="lead">{t("lead")}</p>
          <div className="flex flex-wrap gap-3">
            <NavLink href="/work" className="btn btn-blue">
              {t("ctaWork")}
              <ArrowRightIcon />
            </NavLink>
            <AskAIButton className="btn btn-line">{t("ctaAsk")}</AskAIButton>
          </div>
          <ul aria-label={t("stickersLabel")} className="mt-1.5 flex flex-wrap gap-2.5">
            <li className={`${sticker} bg-gold text-tile-ink`}>Next.js</li>
            <li className={`${sticker} bg-steel text-tile-ink`}>Flutter</li>
            <li className={`${sticker} border border-tile-edge bg-navy text-on-dark`}>Three.js</li>
            <li className={`${sticker} border border-line bg-surface text-ink`}>
              <LiveClock />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
