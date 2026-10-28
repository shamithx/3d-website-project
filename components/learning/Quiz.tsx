"use client";

import { useRef, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useProgress } from "@/components/providers/ProgressProvider";
import { ArrowRightIcon, CheckIcon, CloseIcon, ResetIcon, StarIcon } from "@/components/shared/Icons";
import type { QuizQuestion } from "@/content/stories/types";
import { cn } from "@/lib/utils";

export function Quiz({ questions, slug }: { questions: readonly QuizQuestion[]; slug: string }) {
  const { locale, t } = useLocale();
  const { recordQuiz } = useProgress();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const recorded = useRef(false);

  const question = questions[index];
  if (!question) return null;
  const answered = selected !== null;
  const correct = selected === question.answer;
  const score = answers.filter(Boolean).length;

  function next() {
    const nextAnswers = [...answers, correct];
    setAnswers(nextAnswers);
    setSelected(null);
    if (index === questions.length - 1) {
      setFinished(true);
      if (!recorded.current) {
        recorded.current = true;
        recordQuiz(slug, nextAnswers.filter(Boolean).length, questions.length);
      }
    } else {
      setIndex(index + 1);
    }
  }

  function replay() {
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    recorded.current = false;
  }

  if (finished) {
    const praise = score >= questions.length - 1 ? t("learn.praiseHigh") : score >= Math.ceil(questions.length / 2) ? t("learn.praiseMid") : t("learn.praiseLow");
    return (
      <div className="border border-forest-900/12 bg-parchment-50 p-7 sm:p-9">
        <p className="eyebrow">{t("common.quiz")}</p>
        <div className="mt-5 flex items-baseline gap-3">
          <p className="display text-[3.2rem] leading-none text-forest-900">{score}</p>
          <p className="text-[0.9rem] text-ink-500">
            {t("common.of")} {questions.length}
          </p>
        </div>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-forest-800">{t("learn.scoreLine", { score, total: questions.length })}</p>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-500">{praise}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {questions.map((entry, entryIndex) => (
            <span
              key={entry.id}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-[0.7rem]",
                answers[entryIndex]
                  ? "border-emerald-600 bg-emerald-600/10 text-emerald-700"
                  : "border-forest-900/20 text-ink-500",
              )}
              aria-label={`${entryIndex + 1}: ${answers[entryIndex] ? t("learn.correct") : t("learn.incorrect")}`}
            >
              {answers[entryIndex] ? <CheckIcon size={14} /> : <CloseIcon size={12} />}
            </span>
          ))}
        </div>
        <button type="button" onClick={replay} className="btn btn-secondary btn-sm mt-6">
          <ResetIcon size={14} />
          {t("learn.replay")}
        </button>
      </div>
    );
  }

  return (
    <div className="border border-forest-900/12 bg-parchment-50 p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.62rem] uppercase tracking-[0.16em] text-gold-600">
          {t("learn.question", { n: index + 1, total: questions.length })}
        </p>
        <div className="flex items-center gap-1" aria-hidden="true">
          {answers.map((value, dotIndex) => (
            <StarIcon key={dotIndex} size={12} className={value ? "text-gold-500" : "text-forest-900/20"} />
          ))}
          {Array.from({ length: questions.length - answers.length }).map((_, dotIndex) => (
            <StarIcon key={`empty-${dotIndex}`} size={12} className="text-forest-900/15" />
          ))}
        </div>
      </div>

      <h3 className={cn("mt-4 text-[1.3rem] leading-snug text-forest-900", locale === "si" ? "si-heading" : "display")}>
        {question.prompt[locale]}
      </h3>

      <div className="mt-5 grid gap-2.5" role="group" aria-label={question.prompt[locale]}>
        {question.options.map((option, optionIndex) => {
          const chosen = selected === optionIndex;
          const isAnswer = optionIndex === question.answer;
          const state = !answered ? "idle" : isAnswer ? "correct" : chosen ? "wrong" : "muted";
          return (
            <button
              key={option.en}
              type="button"
              disabled={answered}
              onClick={() => setSelected(optionIndex)}
              className={cn(
                "flex items-start gap-3 border px-4 py-3 text-left text-[0.92rem] transition-colors",
                state === "idle" && "border-forest-900/15 text-forest-900 hover:border-gold-500/70 hover:bg-parchment-100",
                state === "correct" && "border-emerald-600/60 bg-emerald-600/8 text-forest-900",
                state === "wrong" && "border-sunset-500/60 bg-sunset-500/8 text-forest-900",
                state === "muted" && "border-forest-900/8 text-ink-500/55",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.6rem]",
                  state === "correct"
                    ? "border-emerald-600 bg-emerald-600 text-parchment-50"
                    : state === "wrong"
                      ? "border-sunset-500 text-sunset-600"
                      : "border-forest-900/25",
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
        <div role="status" className={cn("mt-5 border-l-2 pl-4", correct ? "border-emerald-600" : "border-sunset-500")}>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-forest-900">
            {correct ? t("learn.correct") : t("learn.incorrect")}
          </p>
          <p className="mt-1 text-[0.84rem] leading-relaxed text-ink-500">{question.explanation[locale]}</p>
        </div>
      ) : null}

      {answered ? (
        <button type="button" onClick={next} className="btn btn-primary btn-sm mt-6">
          {index === questions.length - 1 ? t("learn.results") : t("learn.nextQuestion")}
          <ArrowRightIcon size={14} />
        </button>
      ) : (
        <p className="mt-5 text-[0.72rem] text-ink-500/60">{t("learn.quizLead")}</p>
      )}
    </div>
  );
}
