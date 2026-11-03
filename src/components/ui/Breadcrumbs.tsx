import { getTranslations } from "next-intl/server";
import { NavLink } from "@/components/ui/NavLink";
import type { ComponentProps } from "react";

type Href = ComponentProps<typeof NavLink>["href"];

export async function Breadcrumbs({ items }: { items: { label: string; href?: Href }[] }) {
  const t = await getTranslations("a11y");
  return (
    <nav aria-label={t("breadcrumb")}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-sm font-semibold text-muted">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="opacity-60">
                /
              </span>
            )}
            {item.href ? (
              <NavLink href={item.href} className="inline-flex min-h-8 items-center hover:text-accent">
                {item.label}
              </NavLink>
            ) : (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
