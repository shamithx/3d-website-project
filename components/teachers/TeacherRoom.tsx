"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ArrowRightIcon, DownloadIcon, PrinterIcon } from "@/components/shared/Icons";
import type { Localized, QuizQuestion } from "@/content/stories/types";
import { cn } from "@/lib/utils";

export type TeacherStory = {
  slug: string;
  title: Localized;
  ageRange: readonly [number, number];
  minutes: number;
  objectives: readonly Localized[];
  character: Localized;
  quiz: readonly QuizQuestion[];
  hasReader: boolean;
};

export function TeacherRoom({ stories }: { stories: readonly TeacherStory[] }) {
  const { locale, t } = useLocale();
  const [active, setActive] = useState(0);
  const [showKey, setShowKey] = useState(false);
  const story = stories[active];

  if (!story) return null;

  const character = story.character[locale];
  const questions = [
    t("teachers.question1", { character }),
    t("teachers.question2"),
    t("teachers.question3"),
    t("teachers.question4"),
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-[0.6rem] uppercase tracking-[0.18em] text-gold-600">{t("nav.stories")}</p>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
          {stories.map((entry, index) => (
            <button
              key={entry.slug}
              type="button"
              onClick={() => {
                setActive(index);
                setShowKey(false);
              }}
              aria-pressed={index === active}
              className={cn(
                "flex min-w-[13rem] items-baseline justify-between gap-3 border px-3 py-2.5 text-left transition-colors lg:min-w-0",
                index === active
                  ? "border-forest-900 bg-forest-900 text-parchment-50"
                  : "border-forest-900/12 text-forest-900 hover:border-gold-500/60",
              )}
            >
              <span className="flex flex-col">
                <span className={cn("text-[0.88rem] leading-tight", locale === "si" && "si")}>
                  {entry.title[locale]}
                </span>
                <span
                  className={cn(
                    "mt-1 text-[0.6rem] uppercase tracking-[0.1em]",
                    index === active ? "text-parchment-200/60" : "text-ink-500",
                  )}
                >
                  {t("common.agesShort", { min: entry.ageRange[0], max: entry.ageRange[1] })}
                  {" · "}
                  {t("common.minShort", { n: entry.minutes })}
                </span>
              </span>
              <ArrowRightIcon size={13} className="shrink-0 opacity-60" />
            </button>
          ))}
        </div>

        <div className="mt-6 border-t border-forest-900/12 pt-5">
          <button type="button" onClick={() => window.print()} className="btn btn-secondary btn-sm w-full">
            <PrinterIcon size={15} />
            {t("teachers.print")}
          </button>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-[0.6rem] uppercase tracking-[0.14em] text-ink-500">
          <span className="border border-forest-900/15 px-2 py-1">
            {t("teachers.ageBand")}: {story.ageRange[0]}–{story.ageRange[1]}
          </span>
          <span className="border border-forest-900/15 px-2 py-1">
            {t("teachers.duration")}: {t("common.minShort", { n: story.minutes })}
          </span>
          {!story.hasReader ? (
            <span className="border border-gold-500/40 px-2 py-1 text-gold-600">{t("common.inPreparation")}</span>
          ) : null}
        </div>

        <h2 className={cn("mt-5 text-display-md text-forest-900", locale === "si" && "si-heading")}>
          {story.title[locale]}
        </h2>

        <section className="mt-8">
          <h3 className="text-[0.62rem] uppercase tracking-[0.18em] text-gold-600">{t("teachers.objectives")}</h3>
          <ul className="mt-3 space-y-2.5">
            {story.objectives.map((objective) => (
              <li key={objective.en} className={`flex gap-3 text-[0.92rem] leading-relaxed text-ink-700 ${locale === "si" ? "si" : ""}`}>
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
                {objective[locale]}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-9">
          <h3 className="text-[0.62rem] uppercase tracking-[0.18em] text-gold-600">{t("teachers.discussion")}</h3>
          <ol className="mt-3 space-y-3">
            {questions.map((question, index) => (
              <li key={index} className="flex gap-3 border-b border-forest-900/10 pb-3 text-[0.92rem] leading-relaxed text-ink-700 last:border-0">
                <span className="text-[0.62rem] tabular-nums tracking-[0.12em] text-gold-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={locale === "si" ? "si" : undefined}>{question}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-9 grid gap-px overflow-hidden border border-forest-900/12 bg-forest-900/12 sm:grid-cols-3">
          {(
            [
              ["teachers.groupActivity", "teachers.groupActivityBody"],
              ["teachers.individualActivity", "teachers.individualActivityBody"],
              ["teachers.creativeActivity", "teachers.creativeActivityBody"],
            ] as const
          ).map(([title, body]) => (
            <div key={title} className="bg-parchment-50 p-4">
              <p className="text-[0.58rem] uppercase tracking-[0.14em] text-gold-600">{t(title)}</p>
              <p className={`mt-2 text-[0.8rem] leading-relaxed text-ink-500 ${locale === "si" ? "si" : ""}`}>
                {t(body)}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-9 border border-gold-500/35 bg-gold-300/10 p-5">
          <p className="text-[0.62rem] uppercase tracking-[0.16em] text-forest-900">{t("teachers.classroomTip")}</p>
          <p className={`mt-2 text-[0.86rem] leading-relaxed text-ink-600 ${locale === "si" ? "si" : ""}`}>
            {t("teachers.classroomTipBody")}
          </p>
        </section>

        <section className="mt-9">
          <h3 className="text-[0.62rem] uppercase tracking-[0.18em] text-gold-600">{t("teachers.worksheets")}</h3>
          <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-500">{t("teachers.downloadHint")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`/teachers/worksheets/${story.slug}?lang=${locale}`}
              className="btn btn-primary btn-sm"
              download
            >
              <DownloadIcon size={15} />
              {t("teachers.download")}
            </a>
            <a
              href={`/teachers/worksheets/${story.slug}?lang=${locale}&key=1`}
              className="btn btn-secondary btn-sm"
              download
            >
              <DownloadIcon size={15} />
              {t("teachers.answerKey")}
            </a>
            <a href={`/stories/${story.slug}`} className="btn btn-sm border-forest-900/20 text-forest-900">
              {t("common.openStory")}
            </a>
          </div>
        </section>

        <section className="mt-9 border-t border-forest-900/12 pt-6">
          <button
            type="button"
            onClick={() => setShowKey((value) => !value)}
            aria-expanded={showKey}
            className="flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.16em] text-gold-600"
          >
            {t("teachers.answerKey")}
            <span aria-hidden="true">{showKey ? "−" : "+"}</span>
          </button>
          {showKey ? (
            story.quiz.length > 0 ? (
              <div className="mt-4">
                <p className="text-[0.74rem] leading-relaxed text-ink-500">{t("teachers.answerKeyNote")}</p>
                <ol className="mt-4 space-y-4">
                  {story.quiz.map((question, index) => (
                    <li key={question.id} className="border-l-2 border-gold-500/50 pl-4">
                      <p className={`text-[0.9rem] leading-relaxed text-forest-900 ${locale === "si" ? "si" : ""}`}>
                        {index + 1}. {question.prompt[locale]}
                      </p>
                      <p className={`mt-1 text-[0.84rem] text-emerald-700 ${locale === "si" ? "si" : ""}`}>
                        {question.options[question.answer]?.[locale]}
                      </p>
                      <p className={`mt-1 text-[0.78rem] leading-relaxed text-ink-500 ${locale === "si" ? "si" : ""}`}>
                        {question.explanation[locale]}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <p className="mt-3 text-[0.82rem] leading-relaxed text-ink-500">{t("learn.prepQuiz")}</p>
            )
          ) : null}
        </section>
      </div>
    </div>
  );
}
