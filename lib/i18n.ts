import { en, type MessageKey } from "@/content/translations/en";
import { si } from "@/content/translations/si";
import type { Locale } from "@/content/stories/types";

export type { MessageKey };
export type { Locale };

export const LOCALE_COOKIE = "jk-locale";
export const locales: readonly Locale[] = ["en", "si"];

const dictionaries: Record<Locale, Record<MessageKey, string>> = { en, si };

export type Vars = Record<string, string | number>;

export function translate(locale: Locale, key: MessageKey, vars?: Vars): string {
  const dictionary = dictionaries[locale] ?? en;
  const template = dictionary[key] ?? en[key] ?? key;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  );
}

export type Translator = (key: MessageKey, vars?: Vars) => string;

export function createTranslator(locale: Locale): Translator {
  return (key, vars) => translate(locale, key, vars);
}

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "si";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "si" : "en";
}

/** BCP-47 tags used for speech synthesis and the <html lang> attribute. */
export function speechLang(locale: Locale): string {
  return locale === "si" ? "si-LK" : "en-US";
}
