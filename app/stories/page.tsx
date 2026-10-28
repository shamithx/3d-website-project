import type { Metadata } from "next";
import { StoryLibrary } from "@/components/stories/StoryLibrary";
import { stories } from "@/content/stories";
import { toCardData } from "@/content/stories/card";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";
import { LotusMark } from "@/components/shared/ui";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: translate(locale, "meta.stories.title"),
    description: translate(locale, "meta.stories.desc"),
    alternates: { canonical: "/stories" },
    openGraph: {
      title: `${translate(locale, "meta.stories.title")} · Jathaka Katha`,
      description: translate(locale, "meta.stories.desc"),
      url: "/stories",
      images: ["/og/og-default.png"],
    },
  };
}

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ value?: string }>;
}) {
  const [locale, params] = await Promise.all([getLocale(), searchParams]);
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <>
      <section className="border-b border-forest-900/10 bg-parchment-200/45 pb-10 pt-12 sm:pt-16">
        <div className="shell">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">{t("library.eyebrow")}</p>
              <h1 className="mt-4 text-display-lg text-forest-900">{t("library.title")}</h1>
              <p className="mt-5 lead">{t("library.lead")}</p>
            </div>

            <div className="flex items-center gap-5 border-t border-forest-900/15 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <LotusMark size={40} className="text-gold-500" />
              <div>
                <p className="display text-[2rem] leading-none text-forest-900">{stories.length}</p>
                <p className="mt-1 text-[0.64rem] uppercase tracking-[0.16em] text-ink-500">
                  {t("nav.stories")}
                </p>
                <p className="mt-2 text-[0.64rem] uppercase tracking-[0.16em] text-gold-600">
                  {t("common.bothLanguages")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="shell pb-20 pt-2">
        <StoryLibrary stories={stories.map(toCardData)} initialValue={params.value} />
      </div>
    </>
  );
}
