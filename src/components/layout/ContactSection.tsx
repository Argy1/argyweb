"use client";

import { useLocale, useTranslations } from "next-intl";
import { profile } from "@/content/profile";
import type { Locale } from "@/content/projects";
import { useUI } from "@/lib/uiStore";
import { usePathname } from "@/i18n/navigation";
import { NavLink } from "@/components/ui/NavLink";
import { ChipAnchor } from "@/components/ui/ChipAnchor";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { FxToggle } from "@/components/layout/FxToggle";
import { ArrowRightIcon, ExternalIcon, SparkIcon } from "@/components/ui/icons";

const pillLink =
  "inline-flex min-h-[58px] items-center gap-2 rounded-chip border-[1.5px] border-veil-35 bg-transparent px-[22px] text-[15.5px] font-bold text-on-dark transition-colors hover:border-on-dark hover:bg-on-dark hover:text-tile-ink";

function SiteFooter() {
  const tFoot = useTranslations("footer");
  return (
    <footer className="wrap flex flex-wrap items-start justify-between gap-x-6 gap-y-4 pt-[34px] pb-[120px] text-sm text-muted">
      <div className="flex flex-col gap-1">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>{tFoot("credit")}</span>
      </div>
      <FxToggle />
      <a href="#top" className="inline-flex min-h-11 items-center hover:text-ink">
        {tFoot("backTop")} ↑
      </a>
    </footer>
  );
}

/** Panel kontak di bawah setiap halaman; di halaman Kontak sendiri hanya footer yang tampil. */
export function ContactSection() {
  const t = useTranslations("contact");
  const tNav = useTranslations("nav");
  const locale = useLocale() as Locale;
  const openChat = useUI((s) => s.openChat);
  const pathname = usePathname();

  if (pathname === "/contact") return <SiteFooter />;

  return (
    <section
      id="kontak"
      data-chip-section="contact"
      aria-labelledby="kontak-title"
      className="relative scroll-mt-24 pt-20 md:pt-[max(120px,calc(14vw+28px))] lg:pt-[max(120px,calc(min(11vw,170px)+28px))]"
    >
      <div className="wrap">
        <ChipAnchor id="contact" className="absolute right-[max(16px,40px)] bottom-[calc(100%+14px)]" />
        <div className="relative overflow-hidden rounded-xl border border-tile-edge bg-navy bg-[linear-gradient(var(--glow-faint)_1px,transparent_1px),linear-gradient(90deg,var(--glow-faint)_1px,transparent_1px)] bg-size-[48px_48px] p-[clamp(22px,6vw,80px)] text-on-dark">
          <span className="eyebrow text-on-dark-muted before:bg-gold">{t("eyebrow")}</span>
          <h2
            id="kontak-title"
            className="my-[18px] max-w-[11ch] font-display text-[clamp(46px,8vw,120px)] leading-[0.92] font-black tracking-[-0.05em] text-balance"
          >
            {t("title")}
          </h2>
          <p className="mt-0 mb-[30px] max-w-[46ch] text-[18px] leading-[1.6] font-medium">{t("sub")}</p>
          <div className="flex flex-wrap items-center gap-3">
            <CopyEmail />
            {profile.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={pillLink}>
                {s.label}
                <ExternalIcon />
              </a>
            ))}
            <a href={profile.cv[locale]} download={profile.cvDownloadName} className={pillLink}>
              {t("cv")}
            </a>
            <button type="button" onClick={(e) => openChat({ returnFocus: e.currentTarget })} className={pillLink}>
              <SparkIcon size={17} />
              {tNav("askLabel")}
            </button>
            <NavLink href="/contact" className={pillLink}>
              {t("allOptions")}
              <ArrowRightIcon size={17} />
            </NavLink>
          </div>
        </div>
      </div>
      <SiteFooter />
    </section>
  );
}
