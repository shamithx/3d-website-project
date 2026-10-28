"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useSpeech } from "@/hooks/useSpeech";
import { HeadphonesIcon } from "@/components/shared/Icons";
import type { VocabularyEntry } from "@/content/stories/types";
import { cn } from "@/lib/utils";

export function VocabTeaser({ words }: { words: readonly VocabularyEntry[] }) {
  const { locale, t } = useLocale();
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const speech = useSpeech();
  const word = words[active];

  function pronounce() {
    if (!word) return;
    if (!speech.supported) {
      setNotice(t("reader.ttsUnsupported"));
      return;
    }
    if (!speech.hasVoiceFor("si")) {
      setNotice(t("reader.ttsNoVoice"));
      return;
    }
    setNotice(null);
    speech.speak({ text: `${word.word}. ${word.exampleSi}`, lang: "si-LK" });
  }

  return (
    <section id="vocabulary" className="section" aria-labelledby="vocab-title">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow">{t("home.vocab.eyebrow")}</p>
            <h2 id="vocab-title" className="mt-4 text-display-md text-forest-900">
              {t("home.vocab.title")}
            </h2>
            <p className="mt-4 lead">{t("home.vocab.lead")}</p>
            <a
              href="/stories/sasa-jataka/learn#vocabulary"
              className="group mt-7 inline-flex items-center gap-2 border-b border-gold-500/50 pb-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-forest-900"
            >
              {t("home.vocab.cta")}
            </a>
            {notice ? (
              <p role="status" className="mt-4 max-w-sm text-[0.74rem] leading-relaxed text-ink-500">
                {notice}
              </p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {words.map((entry, index) => {
              const isActive = index === active;
              return (
                <div
                  key={entry.word}
                  className={cn(
                    "border p-5 transition-colors",
                    isActive ? "border-gold-500/60 bg-parchment-50" : "border-forest-900/12 bg-transparent hover:border-forest-900/25",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setActive(isActive ? -1 : index)}
                    aria-expanded={isActive}
                    className="w-full text-left"
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="si text-[1.5rem] leading-tight text-forest-900">{entry.word}</span>
                      <span className="text-[0.62rem] uppercase tracking-[0.14em] text-gold-600">
                        {entry.transliteration}
                      </span>
                    </span>
                    <span className="mt-2 block text-[0.8rem] leading-relaxed text-ink-500">
                      {locale === "si" ? entry.meaningSi : entry.meaningEn}
                    </span>
                  </button>

                  {isActive ? (
                    <div className="mt-4 border-t border-forest-900/10 pt-4">
                      <p className={cn("text-[0.84rem] leading-relaxed text-forest-800", locale === "si" ? "si" : "")}>
                        {locale === "si" ? entry.exampleSi : entry.exampleEn}
                      </p>
                      <button
                        type="button"
                        onClick={pronounce}
                        className="mt-3 inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.12em] text-forest-900 transition-colors hover:text-gold-600"
                      >
                        <HeadphonesIcon size={15} />
                        {t("reader.tts")}
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
