import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryCover } from "@/components/art/StoryCover";
import { StoryCard } from "@/components/stories/StoryCard";
import { toCardData } from "@/content/stories/card";
import { getStory, stories } from "@/content/stories";
import { ArrowRightIcon, ExternalIcon, InfoIcon, PlayIcon } from "@/components/shared/Icons";
import { ButtonLink, GoldRule, Tag } from "@/components/shared/ui";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";
import { getMoralValue } from "@/content/values";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const story = getStory(slug);
  if (!story) return { title: "Story not found" };
  const title = `${story.title.en} — ${story.title.si}`;
  return {
    title,
    description: story.summary[locale],
    alternates: { canonical: `/stories/${story.slug}` },
    openGraph: {
      title,
      description: story.summary[locale],
      url: `/stories/${story.slug}`,
      type: "article",
      images: ["/og/og-default.png"],
    },
    other: {
      "story:jataka-number": story.source.jatakaNumber ? String(story.source.jatakaNumber) : "",
    },
  };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const story = getStory(slug);
  if (!story) notFound();

  const t = (key: Parameters<typeof translate>[1], vars?: Parameters<typeof translate>[2]) =>
    translate(locale, key, vars);
  const readHref = `/stories/${story.slug}/read`;
  const learnHref = `/stories/${story.slug}/learn`;
  const secondaryTitle = locale === "si" ? story.title.en : story.title.si;

  const related = stories
    .filter((entry) => entry.slug !== story.slug)
    .sort((a, b) => {
      const score = (entry: typeof a) =>
        entry.moralCategories.filter((category) => story.moralCategories.includes(category)).length;
      return score(b) - score(a);
    })
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${story.title.en} (${story.title.si})`,
    description: story.summary.en,
    inLanguage: ["en", "si"],
    isPartOf: { "@type": "WebSite", name: "Jathaka Katha" },
    about: story.moralCategories.map((category) => getMoralValue(category).label.en),
    citation: story.source.attribution,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="shell pt-8">
        <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-[0.12em] text-ink-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-forest-900">
                {t("nav.home")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/stories" className="hover:text-forest-900">
                {t("nav.stories")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-forest-900">{story.title[locale]}</li>
          </ol>
        </nav>
      </div>

      <section className="shell grid items-center gap-10 pb-14 pt-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:pb-20 lg:pt-12">
        <div className="relative">
          <div className="absolute -left-3 -top-3 hidden h-full w-full border border-gold-500/30 sm:block" aria-hidden="true" />
          <div
            className={`relative overflow-hidden bg-parchment-200 ${
              story.composition === "arch" ? "arch-frame aspect-[2/3] max-h-[78svh]" : "aspect-[2/3] max-h-[78svh]"
            }`}
          >
            <StoryCover
              slug={story.slug}
              scene={story.scene}
              palette={story.palette}
              animal={story.animal}
              composition={story.composition}
              alt={`${story.title[locale]} — illustration`}
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
              quality={88}
            />
          </div>
          <p className="mt-3 text-[0.62rem] uppercase tracking-[0.16em] text-ink-500/70">
            {t("common.adaptation")} · {t("common.bothLanguages")}
          </p>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {story.source.jatakaNumber ? (
              <Tag className="border-gold-500/40 text-gold-600">
                {t("common.jatakaNo", { n: story.source.jatakaNumber })}
              </Tag>
            ) : null}
            <Tag>{story.source.collection}</Tag>
            <Tag>
              {story.languages.map((lang) => (lang === "si" ? "සිං" : "EN")).join(" · ")}
            </Tag>
          </div>

          <p className={locale === "si" ? "display mt-6 text-[1.1rem] italic text-gold-600" : "si mt-6 text-[1.15rem] text-gold-600"}>
            {secondaryTitle}
          </p>
          <h1 className="mt-2 text-display-lg text-forest-900">{story.title[locale]}</h1>
          <p className="mt-3 text-[1rem] italic text-forest-700">{story.tagline[locale]}</p>

          <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-ink-500">{story.summary[locale]}</p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-forest-900/12 py-5 sm:grid-cols-4">
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.14em] text-ink-500">{t("story.metaReading")}</dt>
              <dd className="mt-1 text-[0.88rem] text-forest-900">{t("common.minShort", { n: story.minutes })}</dd>
            </div>
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.14em] text-ink-500">{t("story.metaAge")}</dt>
              <dd className="mt-1 text-[0.88rem] text-forest-900">
                {t("common.ages", { min: story.ageRange[0], max: story.ageRange[1] })}
              </dd>
            </div>
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.14em] text-ink-500">{t("story.metaLevel")}</dt>
              <dd className="mt-1 text-[0.88rem] text-forest-900">{t(`common.difficulty.${story.difficulty}`)}</dd>
            </div>
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.14em] text-ink-500">{t("story.metaLanguages")}</dt>
              <dd className="mt-1 text-[0.88rem] text-forest-900">සිංහල · English</dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href={story.reader ? readHref : learnHref} variant="primary" size="lg">
              {story.reader ? (
                <>
                  <PlayIcon size={15} />
                  {t("story.readerCta")}
                </>
              ) : (
                <>
                  {t("story.overviewCta")}
                  <ArrowRightIcon size={16} />
                </>
              )}
            </ButtonLink>
            {story.reader ? (
              <ButtonLink href={learnHref} variant="secondary" size="lg">
                {t("story.learnCta")}
              </ButtonLink>
            ) : story.source.url ? (
              <ButtonLink href={story.source.url} variant="secondary" size="lg" external>
                {t("reader.openSource")}
                <ExternalIcon size={15} />
              </ButtonLink>
            ) : null}
          </div>

          {!story.reader ? (
            <div className="mt-6 flex gap-3 border border-gold-500/35 bg-gold-300/10 px-4 py-4">
              <InfoIcon size={18} className="mt-0.5 shrink-0 text-gold-600" />
              <div>
                <p className="text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-forest-900">
                  {t("story.prepNoteTitle")}
                </p>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-ink-500">{t("story.prepNote")}</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <GoldRule className="shell" />

      <section className="shell grid gap-12 py-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20 lg:py-20">
        <div>
          <h2 className="text-display-sm text-forest-900">{t("story.overview")}</h2>
          <div className="mt-7 space-y-6">
            {story.beats.map((beat, index) => (
              <div key={index} className="flex gap-5">
                <span className="mt-1 shrink-0 text-[0.62rem] tabular-nums tracking-[0.16em] text-gold-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className={`border-l border-forest-900/12 pl-5 text-[0.98rem] leading-[1.85] text-ink-700 ${locale === "si" ? "si" : ""}`}>
                  {beat[locale]}
                </p>
              </div>
            ))}
          </div>

          {story.characters && story.characters.length > 0 ? (
            <div className="mt-14">
              <h2 className="text-display-sm text-forest-900">{t("story.characters")}</h2>
              <ul className="mt-6 grid gap-px overflow-hidden border border-forest-900/12 bg-forest-900/12 sm:grid-cols-2">
                {story.characters.map((character) => (
                  <li key={character.name.en} className="bg-parchment-50 px-5 py-4">
                    <p className="text-[0.95rem] text-forest-900">{character.name[locale]}</p>
                    <p className="si mt-0.5 text-[0.76rem] text-gold-600">
                      {locale === "si" ? character.name.en : character.name.si}
                    </p>
                    <p className={`mt-2 text-[0.82rem] leading-relaxed text-ink-500 ${locale === "si" ? "si" : ""}`}>
                      {character.role[locale]}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <aside className="space-y-8">
          <div className="bg-forest-900 px-6 py-7 text-parchment-100">
            <p className="eyebrow text-gold-300">{t("story.moral")}</p>
            <p className={`mt-4 text-[1.35rem] leading-snug text-parchment-50 ${locale === "si" ? "si" : "display italic"}`}>
              {story.moral[locale]}
            </p>
            <p className={`mt-4 text-[0.92rem] leading-relaxed text-parchment-200/65 ${locale === "si" ? "" : "si"}`}>
              {story.moral[locale === "si" ? "en" : "si"]}
            </p>
          </div>

          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.16em] text-gold-600">{t("home.values.eyebrow")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {story.moralCategories.map((category) => {
                const value = getMoralValue(category);
                return (
                  <Link
                    key={category}
                    href={`/stories?value=${category}`}
                    className="chip text-[0.74rem] hover:border-gold-500"
                  >
                    {value.label[locale]}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-t border-forest-900/12 pt-6" id="sources">
            <p className="text-[0.62rem] uppercase tracking-[0.16em] text-gold-600">{t("story.sourceNote")}</p>
            <p className="mt-3 text-[0.86rem] text-forest-900">{story.source.collection}</p>
            <p className="mt-1 text-[0.8rem] text-ink-500">{story.source.attribution}</p>
            <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-500/90">{story.source.note[locale]}</p>
            {story.source.url ? (
              <a
                href={story.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.1em] text-forest-900 underline decoration-gold-500/40 underline-offset-4"
              >
                {t("reader.openSource")}
                <ExternalIcon size={13} />
                <span className="sr-only">({t("a11y.external")})</span>
              </a>
            ) : null}
          </div>
        </aside>
      </section>

      <section className="border-t border-forest-900/10 bg-parchment-200/35 py-14">
        <div className="shell">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-display-sm text-forest-900">{t("story.moreStories")}</h2>
            <Link
              href="/stories"
              className="text-[0.7rem] uppercase tracking-[0.12em] text-forest-900 underline decoration-gold-500/40 underline-offset-4"
            >
              {t("common.viewAll")}
            </Link>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((entry) => (
              <StoryCard key={entry.slug} story={toCardData(entry)} />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
