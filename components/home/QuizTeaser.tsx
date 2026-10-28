"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ArrowRightIcon, CheckIcon, CloseIcon } from "@/components/shared/Icons";
import type { QuizQuestion } from "@/content/stories/types";
import { cn } from "@/lib/utils";

export function QuizTeaser({ questions }: { questions: readonly QuizQuestion[] }) {
  const { locale, t } = useLocale();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const question = questions[index];

  if (!question) return null;
  const answered = selected !== null;
  const correct = selected === question.answer;

  return (
    <section id="quiz" className="section-tight" aria-labelledby="quiz-title">
      <div className="shell">
        <div className="grid gap-10 border-y border-forest-900/12 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">{t("home.quiz.eyebrow")}</p>
            <h2 id="quiz-title" className="mt-4 text-display-sm text-forest-900">
              {t("home.quiz.title")}
            </h2>
            <p className="mt-4 max-w-sm text-[0.92rem] leading-relaxed text-ink-500">
              {t("home.quiz.lead")}
            </p>
            <div className="mt-6 flex items-center gap-2" aria-hidden="true">
              {questions.map((entry, dotIndex) => (
                <span
                  key={entry.id}
                  className={cn(
                    "h-1 w-8 transition-colors",
                    dotIndex === index ? "bg-gold-500" : dotIndex < index ? "bg-forest-900/40" : "bg-forest-900/12",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="bg-parchment-50 p-6 sm:p-8">
            <p className="text-[0.62rem] uppercase tracking-[0.16em] text-gold-600">
              {t("learn.question", { n: index + 1, total: questions.length })}
            </p>
            <h3 className={cn("mt-3 text-[1.35rem] leading-snug text-forest-900", locale === "si" ? "si-heading" : "display")}>
              {question.prompt[locale]}
            </h3>

            <div className="mt-5 grid gap-2.5">
              {question.options.map((option, optionIndex) => {
                const isChosen = selected === optionIndex;
                const isAnswer = optionIndex === question.answer;
                const state = !answered ? "idle" : isAnswer ? "correct" : isChosen ? "wrong" : "muted";
                return (
                  <button
                    key={option.en}
                    type="button"
                    disabled={answered}
                    onClick={() => setSelected(optionIndex)}
                    className={cn(
                      "flex items-start gap-3 border px-4 py-3 text-left text-[0.9rem] transition-colors",
                      state === "idle" && "border-forest-900/15 text-forest-900 hover:border-gold-500/70 hover:bg-parchment-100",
                      state === "correct" && "border-emerald-600/60 bg-emerald-600/8 text-forest-900",
                      state === "wrong" && "border-sunset-500/60 bg-sunset-500/8 text-forest-900",
                      state === "muted" && "border-forest-900/8 text-ink-500/60",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.6rem]",
                        state === "correct" ? "border-emerald-600 bg-emerald-600 text-parchment-50" : "border-forest-900/25",
                      )}
                    >
                      {state === "correct" ? <CheckIcon size={12} /> : state === "wrong" ? <CloseIcon size={11} /> : String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span className={locale === "si" ? "si" : undefined}>{option[locale]}</span>
                  </button>
                );
              })}
            </div>

            {answered ? (
              <div role="status" className="mt-5 border-l-2 border-gold-500 pl-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-forest-900">
                  {correct ? t("home.quiz.correct") : t("home.quiz.incorrect")}
                </p>
                <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-500">
                  {question.explanation[locale]}
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              {answered ? (
                index < questions.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setIndex(index + 1);
                      setSelected(null);
                    }}
                  >
                    {t("home.quiz.next")}
                    <ArrowRightIcon size={14} />
                  </button>
                ) : (
                  <Link href="/stories/sasa-jataka/learn#quiz" className="btn btn-primary btn-sm">
                    {t("home.quiz.cta")}
                    <ArrowRightIcon size={14} />
                  </Link>
                )
              ) : (
                <span className="text-[0.72rem] text-ink-500/70">{t("common.optional")}</span>
              )}
              <Link
                href="/stories/sasa-jataka/learn#quiz"
                className="text-[0.7rem] uppercase tracking-[0.12em] text-forest-900 underline decoration-gold-500/40 underline-offset-4"
              >
                {t("common.quiz")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
