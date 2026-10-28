import type { Metadata } from "next";
import { JourneyBoard } from "@/components/progress/JourneyBoard";
import { stories } from "@/content/stories";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";
import { LotusMark } from "@/components/shared/ui";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: translate(locale, "meta.progress.title"),
    description: translate(locale, "meta.progress.desc"),
    alternates: { canonical: "/progress" },
    robots: { index: false, follow: true },
  };
}

export default async function ProgressPage() {
  const locale = await getLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <div className="pb-24">
      <header className="border-b border-forest-900/10 bg-parchment-200/45 py-12 sm:py-16">
        <div className="shell flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">{t("nav.progress")}</p>
            <h1 className="mt-4 text-display-lg text-forest-900">{t("journey.title")}</h1>
            <p className="mt-4 max-w-xl lead">{t("journey.lead")}</p>
          </div>
          <LotusMark size={56} className="hidden text-gold-500/70 sm:block" />
        </div>
      </header>

      <div className="shell py-12">
        <JourneyBoard
          stories={stories.map((story) => ({
            slug: story.slug,
            title: story.title,
            hasReader: Boolean(story.reader),
          }))}
        />
      </div>
    </div>
  );
}
