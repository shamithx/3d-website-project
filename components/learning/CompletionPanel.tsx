"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useProgress } from "@/components/providers/ProgressProvider";
import { ArrowRightIcon, CheckCircleIcon, StarIcon } from "@/components/shared/Icons";
import { storyFacts } from "@/content/stories/facts";
import type { Difficulty, MoralCategory } from "@/content/stories/types";
import type { MessageKey } from "@/lib/i18n";
import type { BadgeId } from "@/lib/progress";
import { starsForStory } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function CompletionPanel({
  slug,
  title,
  difficulty,
  categories,
  hasReader,
  nextSlug,
  nextTitle,
}: {
  slug: string;
  title: string;
  difficulty: Difficulty;
  categories: readonly MoralCategory[];
  hasReader: boolean;
  nextSlug?: string;
  nextTitle?: string;
}) {
  const { t } = useLocale();
  const { progress, hydrated, complete } = useProgress();
  const [earned, setEarned] = useState<BadgeId[]>([]);
  const entry = progress.stories[slug];
  const stars = starsForStory(entry);
  const completed = Boolean(entry?.completedAt);

  function markComplete() {
    const badges = complete(slug, storyFacts, entry?.quizBest);
    setEarned(badges);
  }

  return (
    <div className="relative overflow-hidden bg-forest-900 px-6 py-9 text-parchment-100 sm:px-9">
      <div className="pointer-events-none absolute -right-6 -top-8 opacity-10" aria-hidden="true">
        <StarIcon size={180} className="text-gold-300" />
      </div>

      <div className="relative">
        <p className="eyebrow text-gold-300">{t("learn.completionTitle")}</p>
        <h2 className="mt-3 max-w-lg text-display-sm text-parchment-50">
          {completed ? title : t("learn.completionBody", { title })}
        </h2>

        <div className="mt-6 flex items-center gap-2" aria-label={t("journey.stars")}>
          {[0, 1, 2].map((index) => (
            <StarIcon
              key={index}
              size={22}
              className={hydrated && index < stars ? "text-gold-300" : "text-parchment-200/20"}
            />
          ))}
          <span className="ml-2 text-[0.7rem] uppercase tracking-[0.12em] text-parchment-200/55">
            {hydrated ? t("common.stars", { n: stars }) : ""}
          </span>
        </div>

        {!hasReader ? (
          <p className="mt-5 max-w-xl text-[0.86rem] leading-relaxed text-parchment-200/65">
            {t("story.prepNote")}
          </p>
        ) : null}

        <div className="mt-7 flex flex-wrap gap-3">
          {hasReader ? (
            <button
              type="button"
              onClick={markComplete}
              disabled={completed}
              className={cn("btn btn-sm", completed ? "btn-ghost-dark" : "btn-on-dark")}
            >
              <CheckCircleIcon size={15} />
              {completed ? t("reader.completed") : t("reader.markComplete")}
            </button>
          ) : null}
          <Link href={`/stories/${slug}`} className="btn btn-ghost-dark btn-sm">
            {t("learn.backToStory")}
          </Link>
          {nextSlug ? (
            <Link href={`/stories/${nextSlug}`} className="btn btn-ghost-dark btn-sm">
              {t("learn.nextTale")}
              <ArrowRightIcon size={14} />
            </Link>
          ) : null}
        </div>

        {nextTitle ? (
          <p className="mt-3 text-[0.72rem] text-parchment-200/45">
            {t("learn.nextTale")}: {nextTitle}
          </p>
        ) : null}

        {earned.length > 0 ? (
          <div className="mt-6 border-t border-parchment-200/15 pt-5">
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-gold-300">{t("learn.badgeEarned")}</p>
            <ul className="mt-2 space-y-1">
              {earned.map((badge) => (
                <li key={badge} className="text-[0.88rem] text-parchment-100">
                  {t(`badges.${badge}` as MessageKey)}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-5 text-[0.68rem] leading-relaxed text-parchment-200/40">{t("learn.localOnly")}</p>
      </div>
    </div>
  );
}
