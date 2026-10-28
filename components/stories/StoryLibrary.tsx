"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useProgress } from "@/components/providers/ProgressProvider";
import { StoryCard } from "@/components/stories/StoryCard";
import { CloseIcon, SearchIcon } from "@/components/shared/Icons";
import { LotusMark } from "@/components/shared/ui";
import type { StoryCardData } from "@/content/stories/card";
import type { MoralCategory } from "@/content/stories/types";
import { MORAL_VALUES, isMoralCategory } from "@/content/values";
import { cn } from "@/lib/utils";

type SortKey = "default" | "short" | "young";

export function StoryLibrary({
  stories,
  initialValue,
}: {
  stories: readonly StoryCardData[];
  initialValue?: string;
}) {
  const { locale, t } = useLocale();
  const { progress } = useProgress();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [value, setValue] = useState<MoralCategory | "all">(
    isMoralCategory(initialValue) ? initialValue : "all",
  );
  const [sort, setSort] = useState<SortKey>("default");

  const index = useMemo(() => {
    const map = new Map<string, string>();
    for (const story of stories) {
      const categories = story.moralCategories
        .map((id) => {
          const entry = MORAL_VALUES.find((item) => item.id === id);
          return entry ? `${entry.label.en} ${entry.label.si}` : id;
        })
        .join(" ");
      map.set(
        story.slug,
        [
          story.title.en,
          story.title.si,
          story.summary.en,
          story.summary.si,
          story.moral.en,
          story.moral.si,
          story.tagline.en,
          story.tagline.si,
          categories,
          story.jatakaNumber ? `jataka ${story.jatakaNumber}` : "",
          story.animal,
        ]
          .join(" ")
          .toLowerCase(),
      );
    }
    return map;
  }, [stories]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = stories.filter((story) => {
      const matchesValue = value === "all" || story.moralCategories.includes(value);
      if (!matchesValue) return false;
      if (!needle) return true;
      return (index.get(story.slug) ?? "").includes(needle);
    });

    if (sort === "short") return [...result].sort((a, b) => a.minutes - b.minutes);
    if (sort === "young") return [...result].sort((a, b) => a.ageRange[0] - b.ageRange[0]);
    return result;
  }, [stories, query, value, sort, index]);

  function chooseValue(next: MoralCategory | "all") {
    setValue(next);
    const target = next === "all" ? pathname : `${pathname}?value=${next}`;
    router.replace(target, { scroll: false });
  }

  const completedCount = stories.filter((story) => progress.stories[story.slug]?.completedAt).length;

  return (
    <div>
      <div className="sticky top-[var(--header-h)] z-30 -mx-[var(--gutter)] border-y border-forest-900/10 bg-parchment-100/95 px-[var(--gutter)] py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-page flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative flex flex-1 items-center gap-2 border-b border-forest-900/25 pb-2 focus-within:border-gold-500">
              <SearchIcon size={17} className="shrink-0 text-ink-500" />
              <span className="sr-only">{t("library.searchLabel")}</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("library.searchPlaceholder")}
                className="w-full bg-transparent text-[0.92rem] text-forest-900 outline-none placeholder:text-ink-500/55"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="shrink-0 text-ink-500 hover:text-forest-900"
                  aria-label={t("common.clear")}
                >
                  <CloseIcon size={15} />
                </button>
              ) : null}
            </label>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <label className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.12em] text-ink-500">
                {t("library.sortLabel")}
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortKey)}
                  className="border border-forest-900/20 bg-parchment-50 px-2 py-1.5 text-[0.72rem] normal-case tracking-normal text-forest-900"
                >
                  <option value="default">{t("library.sortDefault")}</option>
                  <option value="short">{t("library.sortShort")}</option>
                  <option value="young">{t("library.sortYoung")}</option>
                </select>
              </label>
              <p className="whitespace-nowrap text-[0.68rem] uppercase tracking-[0.12em] text-ink-500">
                {t("library.results", { n: filtered.length })}
                {completedCount > 0 ? (
                  <span className="ml-2 hidden text-emerald-700 sm:inline">
                    · {completedCount}/{stories.length}
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          <div
            className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
            role="group"
            aria-label={t("library.filterLabel")}
          >
            <button
              type="button"
              onClick={() => chooseValue("all")}
              aria-pressed={value === "all"}
              className="chip shrink-0 whitespace-nowrap text-[0.74rem]"
            >
              {t("common.all")}
            </button>
            {MORAL_VALUES.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => chooseValue(entry.id)}
                aria-pressed={value === entry.id}
                className="chip shrink-0 whitespace-nowrap text-[0.74rem]"
              >
                <span className={locale === "si" ? "si" : undefined}>{entry.label[locale]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {t("library.resultsAnnounce", { n: filtered.length })}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center border border-dashed border-forest-900/20 px-6 py-16 text-center">
          <LotusMark size={40} className="text-gold-500/60" />
          <p className="mt-5 display text-[1.5rem] text-forest-900">{t("library.noResults")}</p>
          <p className="mt-2 max-w-sm text-[0.88rem] text-ink-500">{t("library.noResultsHint")}</p>
          <button
            type="button"
            className={cn("btn btn-secondary btn-sm mt-6")}
            onClick={() => {
              setQuery("");
              chooseValue("all");
            }}
          >
            {t("library.clearFilters")}
          </button>
        </div>
      )}
    </div>
  );
}
