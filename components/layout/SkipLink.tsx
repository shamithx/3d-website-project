"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

export function SkipLink() {
  const { t } = useLocale();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-forest-900 focus:px-4 focus:py-2 focus:text-sm focus:text-parchment-50"
    >
      {t("nav.skip")}
    </a>
  );
}
