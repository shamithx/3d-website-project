"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

export function LocaleSwitch({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border p-0.5",
        tone === "dark" ? "border-parchment-200/25" : "border-forest-900/15",
      )}
      role="group"
      aria-label={t("a11y.languageSwitch")}
    >
      {(["en", "si"] as const).map((option) => {
        const active = locale === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => {
              if (!active) setLocale(option);
            }}
            aria-pressed={active}
            className={cn(
              "rounded-full px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.08em] transition-colors",
              active
                ? tone === "dark"
                  ? "bg-parchment-100 text-forest-900"
                  : "bg-forest-900 text-parchment-50"
                : tone === "dark"
                  ? "text-parchment-200/70 hover:text-parchment-100"
                  : "text-ink-500 hover:text-forest-900",
              option === "si" && "si text-[0.78rem] tracking-normal",
            )}
            lang={option === "si" ? "si" : "en"}
          >
            {option === "en" ? "EN" : "සිං"}
          </button>
        );
      })}
    </div>
  );
}
