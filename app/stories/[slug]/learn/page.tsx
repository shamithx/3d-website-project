import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompletionPanel } from "@/components/learning/CompletionPanel";
import { Quiz } from "@/components/learning/Quiz";
import { Reflection } from "@/components/learning/Reflection";
import { VocabularyBuilder } from "@/components/learning/VocabularyBuilder";
import { getStory, stories } from "@/content/stories";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";
import { ArrowLeftIcon, ArrowRightIcon, BookIcon, InfoIcon } from "@/components/shared/Icons";
import { GoldRule, SectionHeading } from "@/components/shared/ui";
import type { Localized } from "@/content/stories/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const story = getStory(slug);
  if (!story) return { title: "Story not found" };
  return {
    title: `${translate(locale, "learn.title")} — ${story.title[locale]}`,
    description: story.moral[locale],
    alternates: { canonical: `/stories/${story.slug}/learn` },
  };
}

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const story = getStory(slug);
  if (!story) notFound();

  const t = (key: Parameters<typeof translate>[1], vars?: Parameters<typeof translate>[2]) =>
    translate(locale, key, vars);
  const reader = story.reader;
  const reflectionQuestions: readonly Localized[] =
    reader?.reflection ??
    (["learn.genericReflect1", "learn.genericReflect2", "learn.genericReflect3"] as const).map(
      (key) => ({ en: translate("en", key), si: translate("si", key) }),
    );

  const objectives: readonly Localized[] =
    reader?.objectives ??
    (["learn.genericObj1", "learn.genericObj2", "learn.genericObj3"] as const).map((key) => ({
      en: translate("en", key),
      si: translate("si", key),
    }));

  const currentIndex = stories.findIndex((entry) => entry.slug === story.slug);
  const nextStory = stories[currentIndex + 1] ?? stories[0];

  return (
    <div className="pb-24">
      <header className="border-b border-forest-900/10 bg-parchment-200/45 py-10 sm:py-14">
        <div className="shell">
          <Link
            href={`/stories/${story.slug}`}
            className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.1em] text-forest-900 transition-colors hover:text-gold-600"
          >
            <ArrowLeftIcon size={15} />
            {t("reader.backToStory")}
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <p className="eyebrow">{t("learn.eyebrow")}</p>
              <h1 className="mt-4 text-display-lg text-forest-900">{t("learn.title")}</h1>
              <p className="mt-4 text-[1.05rem] text-forest-800">
                {story.title[locale]}
                <span className="mx-2 text-gold-500" aria-hidden="true">·</span>
                <span className="si text-[0.95rem] text-ink-500">
                  {locale === "si" ? story.title.en : story.title.si}
                </span>
              </p>
            </div>

            <div className="border-l-2 border-gold-500 pl-5">
              <p className="text-[0.6rem] uppercase tracking-[0.16em] text-gold-600">{t("learn.moral")}</p>
              <p className={`mt-2 text-[1.1rem] leading-snug text-forest-900 ${locale === "si" ? "si" : "display italic"}`}>
                {story.moral[locale]}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="shell grid gap-14 py-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
        <div className="min-w-0 space-y-16">
          <section aria-labelledby="understanding">
            <SectionHeading title={t("learn.understanding")} id="understanding" />
            {story.learning ? (
              <div className="mt-8 grid gap-px overflow-hidden border border-forest-900/12 bg-forest-900/12 sm:grid-cols-2">
                {(
                  [
                    ["learn.whatHappened", story.learning.happened],
                    ["learn.keyDecision", story.learning.keyDecision],
                    ["learn.whatLearned", story.learning.learned],
                    ["learn.everyday", story.learning.everyday],
                  ] as const
                ).map(([key, body]) => (
                  <div key={key} className="bg-parchment-50 p-5">
                    <p className="text-[0.6rem] uppercase tracking-[0.16em] text-gold-600">{t(key)}</p>
                    <p className={`mt-2 text-[0.9rem] leading-[1.8] text-ink-700 ${locale === "si" ? "si" : ""}`}>
                      {body[locale]}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-8 space-y-5">
                {story.beats.map((beat, index) => (
                  <div key={index} className="flex gap-4">
                    <span className="mt-1 text-[0.62rem] tabular-nums tracking-[0.16em] text-gold-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className={`border-l border-forest-900/12 pl-4 text-[0.95rem] leading-[1.85] text-ink-700 ${locale === "si" ? "si" : ""}`}>
                      {beat[locale]}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <GoldRule />

          <section id="quiz" aria-labelledby="quiz-heading" className="scroll-mt-24">
            <SectionHeading eyebrow={t("common.quiz")} title={t("learn.quizTitle")} lead={t("learn.quizLead")} id="quiz-heading" />
            <div className="mt-8">
              {reader && reader.quiz.length > 0 ? (
                <Quiz questions={reader.quiz} slug={story.slug} />
              ) : (
                <div className="flex gap-3 border border-dashed border-forest-900/20 px-5 py-6">
                  <InfoIcon size={18} className="mt-0.5 shrink-0 text-gold-600" />
                  <p className="text-[0.86rem] leading-relaxed text-ink-500">{t("learn.prepQuiz")}</p>
                </div>
              )}
            </div>
          </section>

          <GoldRule />

          <section id="vocabulary" aria-labelledby="vocab-heading" className="scroll-mt-24">
            <SectionHeading
              eyebrow={t("common.vocabulary")}
              title={t("learn.vocabularyTitle")}
              lead={t("learn.vocabularyLead")}
              id="vocab-heading"
            />
            <div className="mt-8">
              <VocabularyBuilder words={reader?.vocabulary ?? []} />
            </div>
          </section>

          <GoldRule />

          <section id="reflection" aria-labelledby="reflection-heading" className="scroll-mt-24">
            <SectionHeading
              eyebrow={t("common.reflection")}
              title={t("learn.reflectionTitle")}
              lead={t("learn.reflectionLead")}
              id="reflection-heading"
            />
            <div className="mt-8">
              <Reflection questions={reflectionQuestions} slug={story.slug} storyTitle={story.title[locale]} />
            </div>
          </section>

          <GoldRule />

          <section aria-labelledby="completion-heading">
            <h2 id="completion-heading" className="sr-only">
              {t("learn.completionTitle")}
            </h2>
            <CompletionPanel
              slug={story.slug}
              title={story.title[locale]}
              difficulty={story.difficulty}
              categories={story.moralCategories}
              hasReader={Boolean(reader)}
              nextSlug={nextStory?.slug}
              nextTitle={nextStory?.title[locale]}
            />
          </section>
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="border border-forest-900/12 bg-parchment-50 p-6">
            <p className="text-[0.6rem] uppercase tracking-[0.16em] text-gold-600">{t("learn.objectives")}</p>
            <ul className="mt-4 space-y-3">
              {objectives.map((objective) => (
                <li key={objective.en} className={`flex gap-3 text-[0.85rem] leading-relaxed text-ink-700 ${locale === "si" ? "si" : ""}`}>
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
                  {objective[locale]}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-forest-900/12 p-6">
            <p className="text-[0.6rem] uppercase tracking-[0.16em] text-gold-600">{t("story.sourceNote")}</p>
            <p className="mt-3 text-[0.84rem] text-forest-900">{story.source.collection}</p>
            <p className="mt-1 text-[0.78rem] text-ink-500">{story.source.attribution}</p>
            <p className="mt-3 text-[0.76rem] leading-relaxed text-ink-500/85">{story.source.note[locale]}</p>
            <Link
              href={`/stories/${story.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.1em] text-forest-900 underline decoration-gold-500/40 underline-offset-4"
            >
              <BookIcon size={13} />
              {t("story.aboutTale")}
            </Link>
          </div>

          <div className="bg-forest-900 p-6 text-parchment-100">
            <p className="text-[0.6rem] uppercase tracking-[0.16em] text-gold-300">{t("teachers.worksheets")}</p>
            <p className="mt-3 text-[0.84rem] leading-relaxed text-parchment-200/75">{t("teachers.note")}</p>
            <Link
              href={`/teachers/worksheets/${story.slug}`}
              className="mt-4 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-parchment-50 underline decoration-gold-400/50 underline-offset-4"
            >
              {t("teachers.download")}
              <ArrowRightIcon size={14} />
            </Link>
          </div>

          {reader ? (
            <Link
              href={`/stories/${story.slug}/read`}
              className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.1em] text-forest-900"
            >
              <ArrowLeftIcon size={14} />
              {t("reader.backToStory")}
            </Link>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
