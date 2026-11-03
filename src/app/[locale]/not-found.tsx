import { useTranslations } from "next-intl";
import { PageShell } from "@/components/layout/PageShell";
import { NavLink } from "@/components/ui/NavLink";
import { ChipAnchor } from "@/components/ui/ChipAnchor";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <PageShell>
    <section data-chip-section="work-head" className="flex min-h-[80svh] items-center pt-[150px] pb-10 nav:pt-[130px]">
      <div className="wrap grid w-full items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
        <ChipAnchor id="work-head" fallback className="mx-auto md:order-2 md:mx-0" />
        <div className="flex max-w-[640px] flex-col gap-[22px]">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h1 className="h-page">{t("title")}</h1>
          <p className="lead">{t("sub")}</p>
          <div>
            <NavLink href="/" direction="back" className="btn btn-blue">
              {t("home")}
            </NavLink>
          </div>
        </div>
      </div>
    </section>
    </PageShell>
  );
}
