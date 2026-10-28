"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useProgress } from "@/components/providers/ProgressProvider";
import { DownloadIcon, LockIcon } from "@/components/shared/Icons";
import type { Localized } from "@/content/stories/types";
import { downloadTextFile } from "@/lib/utils";

export function Reflection({
  questions,
  slug,
  storyTitle,
}: {
  questions: readonly Localized[];
  slug: string;
  storyTitle: string;
}) {
  const { locale, t } = useLocale();
  const { progress, hydrated, saveReflection } = useProgress();
  const [values, setValues] = useState<string[]>(() => questions.map(() => ""));
  const [saved, setSaved] = useState(false);
  const initialised = useRef(false);

  useEffect(() => {
    if (!hydrated || initialised.current) return;
    initialised.current = true;
    const stored = progress.reflections[slug] ?? {};
    setValues(questions.map((_, index) => stored[index] ?? ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  function save() {
    questions.forEach((_, index) => saveReflection(slug, index, values[index] ?? ""));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  }

  function exportText() {
    const body = questions
      .map((question, index) => `${index + 1}. ${question[locale]}\n${values[index] ?? ""}`)
      .join("\n\n");
    downloadTextFile(
      `${slug}-reflection.txt`,
      `Jathaka Katha — ${storyTitle}\n\n${body}\n\n— Saved from the device, not uploaded.\n`,
    );
  }

  return (
    <div>
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index}>
            <label
              htmlFor={`reflection-${index}`}
              className={`block text-[0.98rem] leading-snug text-forest-900 ${locale === "si" ? "si" : ""}`}
            >
              {question[locale]}
            </label>
            <textarea
              id={`reflection-${index}`}
              value={values[index] ?? ""}
              onChange={(event) => {
                const next = [...values];
                next[index] = event.target.value;
                setValues(next);
              }}
              rows={3}
              className={`mt-2 w-full resize-y border border-forest-900/20 bg-parchment-50 px-4 py-3 text-[0.92rem] leading-relaxed text-forest-900 outline-none transition-colors focus:border-gold-500 ${locale === "si" ? "si" : ""}`}
              placeholder={locale === "si" ? "ඔබේ සිතුවිලි මෙහි ලියන්න…" : "Write your thoughts here…"}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} className="btn btn-primary btn-sm">
          {t("learn.saveReflection")}
        </button>
        <button type="button" onClick={exportText} className="btn btn-secondary btn-sm">
          <DownloadIcon size={14} />
          {t("learn.exportReflection")}
        </button>
        {saved ? (
          <span role="status" className="text-[0.74rem] text-emerald-700">
            {t("learn.reflectionSaved")}
          </span>
        ) : null}
      </div>

      <p className="mt-3 inline-flex items-start gap-2 text-[0.72rem] leading-relaxed text-ink-500/80">
        <LockIcon size={13} className="mt-0.5 shrink-0" />
        {t("learn.reflectionNote")}
      </p>
    </div>
  );
}
