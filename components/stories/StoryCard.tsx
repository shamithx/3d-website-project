"use client";

import Link from "next/link";
import { StoryCover } from "@/components/art/StoryCover";
import { StoryAtmosphere } from "@/components/stories/StoryAtmosphere";
import { ArrowRightIcon, CheckCircleIcon, FeatherIcon, PlayIcon, StarIcon } from "@/components/shared/Icons";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useProgress } from "@/components/providers/ProgressProvider";
import type { StoryCardData } from "@/content/stories/card";
import { getMoralValue } from "@/content/values";
import { cn } from "@/lib/utils";

type Variant = "grid" | "feature" | "compact";

export function StoryCard({
  story,
  variant = "grid",
  className,
  headingLevel = "h3",
}: {
  story: StoryCardData;
  variant?: Variant;
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const { locale, t } = useLocale();
  const { progress, hydrated } = useProgress();
  const entry = progress.stories[story.slug];
  const completed = Boolean(entry?.completedAt);
  const Heading = headingLevel;

  const aspect =
    variant === "feature"
      ? "aspect-[4/5] sm:aspect-[5/6]"
      : variant === "compact"
        ? "aspect-[3/2]"
        : "aspect-[4/5]";
  const frame = story.composition === "arch" ? "arch-frame" : "rounded-none";

  const primaryTitle = locale === "si" ? story.title.si : story.title.en;
  const secondaryTitle = locale === "si" ? story.title.en : story.title.si;

  return (
    <article className={cn("story-card group relative flex flex-col", className)}>
      <Link
        href={`/stories/${story.slug}`}
        className="flex h-full flex-col focus-visible:outline-none"
        aria-label={`${primaryTitle} — ${story.hasReader ? t("common.readStory") : t("common.comingSoon")}`}
      >
        <div className={cn("story-art relative", aspect)}>
          <div className={cn("!absolute inset-0 overflow-hidden bg-parchment-200", frame)}>
            <div className="story-art-hover absolute inset-0">
              <StoryCover
                slug={story.slug}
                scene={story.scene}
                palette={story.palette}
                animal={story.animal}
                composition={story.composition}
                alt=""
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                imageClassName="story-art-breathe"
              />
            </div>

            <StoryAtmosphere slug={story.slug} scene={story.scene} palette={story.palette} />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-900/60 via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
              <span className="text-[0.6rem] uppercase tracking-[0.16em] text-parchment-100/85">
                {getMoralValue(story.moralCategories[0] ?? "kindness").label[locale]}
              </span>
              {hydrated && entry?.quizBest ? (
                <span className="inline-flex items-center gap-0.5 text-gold-300">
                  <StarIcon size={11} />
                  <span className="text-[0.62rem] tabular-nums text-parchment-100/90">
                    {entry.quizBest}/{story.quizLength || 6}
                  </span>
                </span>
              ) : null}
            </div>
          </div>

          <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
            {story.jatakaNumber ? (
              <span className="rounded-sm bg-parchment-50/92 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-forest-900">
                {t("common.jatakaNo", { n: story.jatakaNumber })}
              </span>
            ) : null}
            {story.hasReader ? (
              <span className="inline-flex items-center gap-1 rounded-sm bg-forest-900/80 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-parchment-100">
                <PlayIcon size={9} />
                {t("library.readerReady")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-sm bg-parchment-50/92 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-forest-900">
                <FeatherIcon size={9} className="text-gold-600" />
                {t("common.comingSoon")}
              </span>
            )}
          </div>

          {hydrated && completed ? (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-parchment-50/92 px-2 py-1 text-[0.6rem] font-semibold text-forest-900">
              <CheckCircleIcon size={13} className="text-emerald-600" />
              {t("common.completed")}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col pt-5">
          <p className={cn("text-gold-600", locale === "si" ? "display text-[0.92rem] italic" : "si text-[0.98rem]")}>
            {secondaryTitle}
          </p>
          <Heading
            className={cn(
              "mt-1.5 text-forest-900 transition-colors group-hover:text-emerald-700",
              variant === "feature" ? "text-[1.9rem] sm:text-[2.15rem]" : "text-[1.45rem]",
              locale === "si" && "si-heading",
            )}
          >
            {primaryTitle}
          </Heading>

          <p className="mt-3 line-clamp-4 text-[0.88rem] leading-relaxed text-ink-500">
            {story.summary[locale]}
          </p>

          <p className="mt-4 border-l border-gold-500/50 pl-3 text-[0.82rem] italic leading-relaxed text-forest-800/80">
            {story.moral[locale]}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-5 text-[0.68rem] uppercase tracking-[0.1em] text-ink-500">
            <span>{t("common.minShort", { n: story.minutes })}</span>
            <span aria-hidden="true" className="text-gold-500">·</span>
            <span>{t("common.agesShort", { min: story.ageRange[0], max: story.ageRange[1] })}</span>
            <span aria-hidden="true" className="text-gold-500">·</span>
            <span>{t(`common.difficulty.${story.difficulty}`)}</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-forest-900/10 pt-4">
            <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-forest-900">
              {story.hasReader ? t("common.readStory") : t("common.comingSoon")}
              <ArrowRightIcon size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            {!story.hasReader ? (
              <span className="max-w-[11rem] text-right text-[0.62rem] leading-snug tracking-[0.02em] text-ink-500/75">
                {t("common.readerComingSoon")}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
