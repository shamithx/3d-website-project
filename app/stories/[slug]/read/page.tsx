import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryReader } from "@/components/reader/StoryReader";
import { getStory } from "@/content/stories";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";
import { ArrowLeftIcon, InfoIcon } from "@/components/shared/Icons";
import { ButtonLink } from "@/components/shared/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const story = getStory(slug);
  if (!story) return { title: "Story not found" };
  return {
    title: `${story.title[locale]} — ${translate(locale, "common.readStory")}`,
    description: story.summary[locale],
    alternates: { canonical: `/stories/${story.slug}/read` },
    openGraph: {
      title: `${story.title.en} · Jathaka Katha`,
      description: story.summary[locale],
      url: `/stories/${story.slug}/read`,
      images: ["/og/og-default.png"],
    },
  };
}

export default async function ReadPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const story = getStory(slug);
  if (!story) notFound();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  if (!story.reader) {
    return (
      <div className="shell py-20">
        <div className="mx-auto max-w-xl border border-forest-900/15 bg-parchment-50 p-8">
          <InfoIcon size={24} className="text-gold-600" />
          <h1 className="mt-4 text-display-sm text-forest-900">{t("story.prepNoteTitle")}</h1>
          <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-500">{t("story.prepNote")}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href={`/stories/${story.slug}`} variant="primary">
              <ArrowLeftIcon size={15} />
              {t("reader.backToStory")}
            </ButtonLink>
            <ButtonLink href={`/stories/${story.slug}/learn`} variant="secondary">
              {t("story.learnCta")}
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return <StoryReader story={story} />;
}
