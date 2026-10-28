"use client";

import { useMemo, type CSSProperties } from "react";
import type { VocabularyEntry } from "@/content/stories/types";
import { cn } from "@/lib/utils";

type ReaderTextProps = {
  text: string;
  locale: "en" | "si";
  vocabulary: readonly VocabularyEntry[];
  activeChar: number | null;
  scale: number;
  leading: number;
  onVocabulary: (entry: VocabularyEntry) => void;
  className?: string;
};

type Token = {
  value: string;
  start: number;
  vocab?: VocabularyEntry;
};

export function ReaderText({
  text,
  locale,
  vocabulary,
  activeChar,
  scale,
  leading,
  onVocabulary,
  className,
}: ReaderTextProps) {
  const tokens = useMemo<Token[]>(() => {
    const result: Token[] = [];
    const parts = text.split(/(\s+)/);
    let cursor = 0;
    for (const part of parts) {
      if (part.trim().length === 0) {
        cursor += part.length;
        continue;
      }
      const stripped = part.replace(/[.,!?;:“”"'’()—–]/g, "");
      const vocab =
        locale === "si"
          ? vocabulary.find((entry) => stripped === entry.word || stripped.startsWith(entry.word))
          : undefined;
      result.push({ value: part, start: cursor, vocab });
      cursor += part.length;
    }
    return result;
  }, [text, locale, vocabulary]);

  const activeIndex = useMemo(() => {
    if (activeChar === null) return -1;
    let index = -1;
    tokens.forEach((token, tokenIndex) => {
      if (token.start <= activeChar) index = tokenIndex;
    });
    return index;
  }, [activeChar, tokens]);

  return (
    <p
      className={cn("story-prose", locale === "si" && "si", className)}
      lang={locale}
      style={{ "--reader-scale": scale, "--reader-leading": leading } as CSSProperties}
    >
      {tokens.map((token, index) => (
        <span key={`${token.start}-${index}`}>
          {token.vocab ? (
            <button
              type="button"
              className="vocab-mark"
              onClick={() => onVocabulary(token.vocab as VocabularyEntry)}
              aria-label={`${token.value} — ${token.vocab.meaningEn}`}
            >
              {token.value}
            </button>
          ) : (
            <span className={index === activeIndex ? "rounded-sm bg-gold-300/45" : undefined}>
              {token.value}
            </span>
          )}{" "}
        </span>
      ))}
    </p>
  );
}
