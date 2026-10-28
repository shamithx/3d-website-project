"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useProgress } from "@/components/providers/ProgressProvider";
import {
  ArrowRightIcon,
  BookmarkIcon,
  CheckCircleIcon,
  CompassIcon,
  FeatherIcon,
  HeartIcon,
  ResetIcon,
  SparkleIcon,
  StarIcon,
} from "@/components/shared/Icons";
import { LotusMark } from "@/components/shared/ui";
import type { Localized } from "@/content/stories/types";
import type { MessageKey } from "@/lib/i18n";
import type { BadgeId } from "@/lib/progress";
import { BADGE_RULES, starsForStory } from "@/lib/progress";

export type JourneyStory = {
  slug: string;
  title: Localized;
  hasReader: boolean;
};

const BADGE_ICONS: Record<BadgeId, typeof StarIcon> = {
  kindHeart: HeartIcon,
  wiseThinker: SparkleIcon,
  braveExplorer: CompassIcon,
  masterStoryteller: FeatherIcon,
  keeperOfWisdom: StarIcon,
};

export function JourneyBoard({ stories }: { stories: readonly JourneyStory[] }) {
  const { locale, t } = useLocale();
  const { progress, badges, stars, hydrated, reset } = useProgress();

  const completed = stories.filter((story) => progress.stories[story.slug]?.completedAt);
  const started = stories.filter(
    (story) => (progress.stories[story.slug]?.scenesRead.length ?? 0) > 0 && !progress.stories[story.slug]?.completedAt,
  );
  const bookmarks = Object.entries(progress.bookmarks);
  const hasActivity = completed.length > 0 || started.length > 0 || stars > 0;

  const stats = [
    { label: t("journey.stars"), value: hydrated ? stars : 0, icon: StarIcon },
    { label: t("journey.storiesRead"), value: hydrated ? completed.length : 0, icon: CheckCircleIcon },
    { label: t("journey.quizzes"), value: hydrated ? progress.quizzesTaken : 0, icon: SparkleIcon },
    { label: t("journey.streak"), value: hydrated ? progress.streak.count : 0, icon: FeatherIcon },
  ];

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-2 gap-px overflow-hidden border border-forest-900/12 bg-forest-900/12 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-parchment-50 px-4 py-6">
              <Icon size={18} className="text-gold-500" />
              <p className="display mt-3 text-[2.1rem] leading-none text-forest-900 tabular-nums">
                {hydrated ? stat.value : "—"}
              </p>
              <p className="mt-2 text-[0.6rem] uppercase leading-tight tracking-[0.12em] text-ink-500">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {!hasActivity && hydrated ? (
        <div className="flex flex-col items-center border border-dashed border-forest-900/20 px-6 py-14 text-center">
          <LotusMark size={42} className="text-gold-500/60" />
          <p className="mt-5 display text-[1.5rem] text-forest-900">{t("journey.empty")}</p>
          <Link href="/stories/sasa-jataka/read" className="btn btn-primary btn-sm mt-5">
            {t("journey.emptyCta")}
            <ArrowRightIcon size={14} />
          </Link>
        </div>
      ) : null}

      <section aria-labelledby="badges-title">
        <div className="flex items-end justify-between gap-4">
          <h2 id="badges-title" className="text-display-sm text-forest-900">
            {t("journey.badges")}
          </h2>
          <p className="text-[0.68rem] uppercase tracking-[0.12em] text-ink-500">
            {hydrated ? `${badges.length} / ${BADGE_RULES.length}` : ""}
          </p>
        </div>
        <div className="mt-6 grid gap-px overflow-hidden border border-forest-900/12 bg-forest-900/12 sm:grid-cols-2 lg:grid-cols-3">
          {BADGE_RULES.map((rule) => {
            const Icon = BADGE_ICONS[rule.id];
            const earned = hydrated && badges.includes(rule.id);
            return (
              <div key={rule.id} className={`bg-parchment-50 p-5 ${earned ? "" : "opacity-70"}`}>
                <div className="flex items-center justify-between">
                  <Icon size={20} className={earned ? "text-gold-500" : "text-ink-500/40"} />
                  {earned ? (
                    <span className="text-[0.56rem] uppercase tracking-[0.14em] text-emerald-700">
                      {t("learn.badgeEarned")}
                    </span>
                  ) : null}
                </div>
                <p className={`mt-3 text-[1rem] text-forest-900 ${locale === "si" ? "si" : ""}`}>
                  {t(`badges.${rule.id}` as MessageKey)}
                </p>
                <p className={`mt-1 text-[0.78rem] leading-relaxed text-ink-500 ${locale === "si" ? "si" : ""}`}>
                  {t(`badges.${rule.id}Desc` as MessageKey)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="collection-title">
        <div className="flex items-end justify-between gap-4">
          <h2 id="collection-title" className="text-display-sm text-forest-900">
            {t("journey.collection")}
          </h2>
          <p className="text-[0.68rem] uppercase tracking-[0.12em] text-ink-500">
            {hydrated ? t("journey.progressOf", { done: completed.length, total: stories.length }) : ""}
          </p>
        </div>
        <ul className="mt-6 divide-y divide-forest-900/10 border-y border-forest-900/10">
          {stories.map((story) => {
            const entry = progress.stories[story.slug];
            const done = Boolean(entry?.completedAt);
            const storyStars = starsForStory(entry);
            const scenes = entry?.scenesRead.length ?? 0;
            return (
              <li key={story.slug} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                <div className="flex min-w-0 items-baseline gap-3">
                  <span className="w-5 shrink-0 text-[0.6rem] tabular-nums text-gold-600">
                    {done ? "✓" : scenes > 0 ? "·" : "—"}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={story.hasReader ? `/stories/${story.slug}/read` : `/stories/${story.slug}`}
                      className="text-[0.92rem] text-forest-900 underline decoration-transparent decoration-1 underline-offset-4 transition-colors hover:decoration-gold-500"
                    >
                      {story.title[locale]}
                    </Link>
                    <p className="text-[0.62rem] uppercase tracking-[0.12em] text-ink-500">
                      {done
                        ? t("common.completed")
                        : scenes > 0
                          ? `${scenes} ${t("reader.sceneProgress")}`
                          : t("common.notStarted")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((index) => (
                    <StarIcon
                      key={index}
                      size={14}
                      className={hydrated && index < storyStars ? "text-gold-500" : "text-forest-900/15"}
                    />
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="bookmarks-title">
        <h2 id="bookmarks-title" className="text-display-sm text-forest-900">
          {t("journey.bookmarks")}
        </h2>
        {bookmarks.length === 0 ? (
          <p className="mt-3 text-[0.86rem] text-ink-500">{t("journey.noBookmarks")}</p>
        ) : (
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {bookmarks.map(([slug, bookmark]) => {
              const story = stories.find((entry) => entry.slug === slug);
              if (!story) return null;
              return (
                <li key={slug}>
                  <Link
                    href={`/stories/${slug}/read?scene=${bookmark.sceneIndex + 1}`}
                    className="flex items-center gap-3 border border-forest-900/12 px-4 py-3 transition-colors hover:border-gold-500/60"
                  >
                    <BookmarkIcon size={15} className="shrink-0 text-gold-500" filled />
                    <span className="min-w-0">
                      <span className="block truncate text-[0.88rem] text-forest-900">{story.title[locale]}</span>
                      <span className="text-[0.64rem] uppercase tracking-[0.1em] text-ink-500">
                        {t("reader.bookmarkAt", { n: bookmark.sceneIndex + 1 })}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="flex flex-col gap-4 border-t border-forest-900/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-[0.72rem] leading-relaxed text-ink-500">{t("journey.localOnly")}</p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(t("journey.resetConfirm"))) reset();
          }}
          className="btn btn-sm border-forest-900/20 text-forest-900"
        >
          <ResetIcon size={14} />
          {t("journey.reset")}
        </button>
      </div>
    </div>
  );
}
