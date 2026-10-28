import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryCover } from "@/components/art/StoryCover";
import { StoryReader } from "@/components/reader/StoryReader";
import { getStory } from "@/content/stories";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";
import { ArrowLeftIcon, FeatherIcon } from "@/components/shared/Icons";
import { ButtonLink } from "@/components/shared/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const story = getStory(slug);
  if (!story) return { title: "Story not found" };
  const mode = story.reader ? translate(locale, "common.readStory") : translate(locale, "common.comingSoon");
  return {
    title: `${story.title[locale]} — ${mode}`,
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
      <div className="shell py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl border border-forest-900/12 bg-parchment-50 p-6 sm:p-9">
          <div className="grid gap-9 lg:grid-cols-[0.7fr_1.3fr] lg:items-start lg:gap-12">
            <div className="relative mx-auto w-full max-w-[16rem] lg:mx-0 lg:max-w-none">
              <div
                className="absolute -left-2.5 -top-2.5 hidden h-full w-full border border-gold-500/30 sm:block"
                aria-hidden="true"
              />
              <div
                className={`relative aspect-[2/3] overflow-hidden bg-parchment-200 ${
                  story.composition === "arch" ? "arch-frame" : ""
                }`}
              >
                <StoryCover
                  slug={story.slug}
                  scene={story.scene}
                  palette={story.palette}
                  animal={story.animal}
                  composition={story.composition}
                  alt={`${story.title[locale]} — illustration`}
                  sizes="(max-width: 1024px) 60vw, 26vw"
                  priority
                  quality={86}
                />
              </div>
            </div>

            <div className="min-w-0">
              <p className="eyebrow text-gold-600">{t("common.comingSoon")}</p>
              <h1 className="mt-3 text-display-md text-forest-900">{story.title[locale]}</h1>
              <p className="mt-2 text-[0.98rem] italic text-forest-700">{story.tagline[locale]}</p>

              <div className="mt-6 border-l border-gold-500/50 pl-4">
                <p className="text-[0.6rem] uppercase tracking-[0.16em] text-gold-600">{t("story.teaserLabel")}</p>
                <p className={`mt-2 text-[0.95rem] leading-[1.85] text-ink-500 ${locale === "si" ? "si" : ""}`}>
                  {story.summary[locale]}
                </p>
              </div>

              <div className="mt-6 bg-forest-900 px-5 py-5 text-parchment-100">
                <p className="eyebrow text-gold-300">{t("story.moral")}</p>
                <p
                  className={`mt-2 text-[1.12rem] leading-snug text-parchment-50 ${
                    locale === "si" ? "si" : "display italic"
                  }`}
                >
                  {story.moral[locale]}
                </p>
              </div>

              <div className="mt-6 flex gap-3 border border-gold-500/35 bg-gold-300/10 px-4 py-4">
                <FeatherIcon size={18} className="mt-0.5 shrink-0 text-gold-600" />
                <div>
                  <p className="text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-forest-900">
                    {t("story.prepNoteTitle")}
                  </p>
                  <p className={`mt-1 text-[0.82rem] leading-relaxed text-ink-500 ${locale === "si" ? "si" : ""}`}>
                    {t("story.prepNote")}
                  </p>
                </div>
              </div>

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
        </div>
      </div>
    );
  }

  return <StoryReader story={story} />;
}
