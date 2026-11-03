"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { projectCategories, type ProjectCategory } from "@/content/projects";
import { categoryParam, type AppLocale } from "@/i18n/routing";
import { ChipAnchor } from "@/components/ui/ChipAnchor";
import { WorkCard, type WorkCardData } from "./WorkCard";

type Filter = "all" | ProjectCategory;

function parseFilter(value: string | null): Filter {
  return value && (projectCategories as string[]).includes(value) ? (value as ProjectCategory) : "all";
}

export function WorkGridView({
  cards,
  filter,
  onPick,
}: {
  cards: WorkCardData[];
  filter: Filter;
  onPick?: (f: Filter) => void;
}) {
  const t = useTranslations("work");
  const counts = Object.fromEntries(projectCategories.map((c) => [c, cards.filter((p) => p.category === c).length]));
  const visible = filter === "all" ? cards : cards.filter((p) => p.category === filter);
  // Kategori tanpa proyek tidak ditampilkan.
  const options: Filter[] = ["all", ...projectCategories.filter((c) => counts[c] > 0)];

  return (
    <>
      <div className="mb-7 flex items-start justify-between gap-6">
        <div role="group" aria-label={t("filterLabel")} className="flex flex-wrap gap-2">
          {options.map((key) => (
            <button
              key={key}
              type="button"
              className="filter-chip"
              aria-pressed={filter === key}
              onClick={() => onPick?.(key)}
            >
              {t(`cats.${key}`)}
              <small>{key === "all" ? cards.length : counts[key]}</small>
            </button>
          ))}
        </div>
        <ChipAnchor id="work-grid" opacity={0.9} className="-mt-2" />
      </div>
      <p className="sr-only" aria-live="polite">
        {t("resultCount", { count: visible.length })}
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-5">
        {visible.map((p) => (
          <WorkCard key={`${filter}-${p.slug}`} p={p} />
        ))}
      </div>
    </>
  );
}

/** Filter kategori tersinkron ke query (?kategori=web / ?category=web) supaya bisa dibagikan. */
export function WorkBrowser({ cards }: { cards: WorkCardData[] }) {
  const locale = useLocale() as AppLocale;
  const key = categoryParam[locale];
  const searchParams = useSearchParams();
  const fromUrl = parseFilter(searchParams.get(key));
  // State lokal supaya klik langsung berefek; query URL hanya cermin yang bisa dibagikan.
  const [filter, setFilter] = useState<Filter>(fromUrl);
  const [seenUrl, setSeenUrl] = useState<Filter>(fromUrl);
  // Navigasi dari luar (tautan ?kategori=..., tombol Back) mengubah query → ikuti.
  if (fromUrl !== seenUrl) {
    setSeenUrl(fromUrl);
    setFilter(fromUrl);
  }

  function pick(next: Filter) {
    setFilter(next);
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete(key);
    else url.searchParams.set(key, next);
    window.history.replaceState(window.history.state, "", url);
  }

  return <WorkGridView cards={cards} filter={filter} onPick={pick} />;
}
