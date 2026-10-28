"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useSpeech } from "@/hooks/useSpeech";
import { FeatherIcon, HeadphonesIcon } from "@/components/shared/Icons";
import type { VocabularyEntry } from "@/content/stories/types";
import { cn } from "@/lib/utils";

export function VocabularyBuilder({ words }: { words: readonly VocabularyEntry[] }) {
  const { locale, t } = useLocale();
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const speech = useSpeech();
  const entry = words[active];

  function pronounce() {
    if (!entry) return;
    if (!speech.supported) {
      setNotice(t("reader.ttsUnsupported"));
      return;
    }
    if (!speech.hasVoiceFor("si")) {
      setNotice(t("reader.ttsNoVoice"));
      return;
    }
    setNotice(null);
    speech.speak({ text: `${entry.word}. ${entry.exampleSi}`, lang: "si-LK" });
  }

  if (words.length === 0) {
    return (
      <div className="flex gap-3 border border-gold-500/35 bg-gold-300/10 px-5 py-6">
        <FeatherIcon size={18} className="mt-0.5 shrink-0 text-gold-600" />
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-forest-900">
            {t("common.readerComingSoon")}
          </p>
          <p className={cn("mt-1 text-[0.86rem] leading-relaxed text-ink-500", locale === "si" && "si")}>
            {t("learn.prepVocabulary")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
      <div role="group" aria-label={t("learn.vocabularyTitle")}>
        <ul className="divide-y divide-forest-900/10 border-y border-forest-900/10">
          {words.map((word, index) => (
            <li key={word.word}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={index === active}
                className={cn(
                  "flex w-full items-center justify-between gap-4 py-3 text-left transition-colors",
                  index === active ? "text-forest-900" : "text-ink-500 hover:text-forest-900",
                )}
              >
                <span className="flex items-baseline gap-3">
                  <span className="si text-[1.22rem]">{word.word}</span>
                  <span className="text-[0.62rem] uppercase tracking-[0.12em] text-gold-600">
                    {word.transliteration}
                  </span>
                </span>
                <span className="max-w-[45%] truncate text-right text-[0.76rem]">
                  {locale === "si" ? word.meaningSi : word.meaningEn}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {entry ? (
        <div className="bg-parchment-50 p-6 sm:p-7">
          <p className="si text-[2rem] leading-tight text-forest-900">{entry.word}</p>
          <p className="mt-1 text-[0.62rem] uppercase tracking-[0.14em] text-gold-600">{entry.transliteration}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-[0.58rem] uppercase tracking-[0.14em] text-ink-500">{t("common.sinhala")}</p>
              <p className="si mt-1 text-[0.86rem] leading-relaxed text-forest-900">{entry.meaningSi}</p>
            </div>
            <div>
              <p className="text-[0.58rem] uppercase tracking-[0.14em] text-ink-500">{t("common.english")}</p>
              <p className="mt-1 text-[0.86rem] leading-relaxed text-forest-900">{entry.meaningEn}</p>
            </div>
          </div>

          <div className="mt-5 border-t border-forest-900/10 pt-4">
            <p className="text-[0.58rem] uppercase tracking-[0.14em] text-ink-500">උදාහරණය · example</p>
            <p className="si mt-2 text-[0.9rem] leading-relaxed text-forest-900">{entry.exampleSi}</p>
            <p className="mt-1 text-[0.84rem] italic leading-relaxed text-ink-500">{entry.exampleEn}</p>
          </div>

          <button type="button" onClick={pronounce} className="btn btn-secondary btn-sm mt-5">
            <HeadphonesIcon size={15} />
            {t("reader.ttsPlay")}
          </button>
          {notice ? (
            <p role="status" className="mt-3 text-[0.74rem] leading-relaxed text-ink-500">
              {notice}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
