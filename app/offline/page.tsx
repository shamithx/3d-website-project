import type { Metadata } from "next";
import Link from "next/link";
import { LotusMark } from "@/components/shared/ui";
import { ArrowRightIcon, BookIcon } from "@/components/shared/Icons";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: translate(locale, "offline.title"),
    robots: { index: false, follow: false },
  };
}

export default async function OfflinePage() {
  const locale = await getLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <div className="shell flex min-h-[70svh] flex-col items-center justify-center py-20 text-center">
      <LotusMark size={56} className="text-gold-500" />
      <h1 className="mt-6 text-display-md text-forest-900">{t("offline.title")}</h1>
      <p className="mt-4 max-w-md text-[0.96rem] leading-relaxed text-ink-500">{t("offline.body")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary btn-sm">
          {t("offline.cta")}
          <ArrowRightIcon size={14} />
        </Link>
        <Link href="/stories" className="btn btn-secondary btn-sm">
          <BookIcon size={14} />
          {t("nav.stories")}
        </Link>
      </div>
    </div>
  );
}
