import type { Metadata } from "next";
import { TeacherRoom, type TeacherStory } from "@/components/teachers/TeacherRoom";
import { stories } from "@/content/stories";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";
import { LotusMark, SectionHeading } from "@/components/shared/ui";
import { BookIcon, InfoIcon, UsersIcon } from "@/components/shared/Icons";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: translate(locale, "meta.teachers.title"),
    description: translate(locale, "meta.teachers.desc"),
    alternates: { canonical: "/teachers" },
    openGraph: {
      title: `${translate(locale, "meta.teachers.title")} · Jathaka Katha`,
      description: translate(locale, "meta.teachers.desc"),
      url: "/teachers",
      images: ["/og/og-default.png"],
    },
  };
}

const GENERIC_OBJECTIVES = ["learn.genericObj1", "learn.genericObj2", "learn.genericObj3"] as const;

export default async function TeachersPage() {
  const locale = await getLocale();
  const t = (key: Parameters<typeof translate>[1], vars?: Parameters<typeof translate>[2]) =>
    translate(locale, key, vars);

  const teacherStories: TeacherStory[] = stories.map((story) => ({
    slug: story.slug,
    title: story.title,
    ageRange: story.ageRange,
    minutes: story.minutes,
    objectives:
      story.reader?.objectives ??
      GENERIC_OBJECTIVES.map((key) => ({ en: translate("en", key), si: translate("si", key) })),
    character: story.characters?.[0]?.name ?? {
      en: "the main character",
      si: "ප්‍රධාන චරිතය",
    },
    quiz: story.reader?.quiz ?? [],
    hasReader: Boolean(story.reader),
  }));

  return (
    <div className="pb-24">
      <header className="border-b border-forest-900/10 bg-parchment-200/45 py-12 sm:py-16">
        <div className="shell">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">{t("teachers.eyebrow")}</p>
              <h1 className="mt-4 text-display-lg text-forest-900">{t("teachers.title")}</h1>
              <p className="mt-5 lead">{t("teachers.lead")}</p>
            </div>
            <div className="flex items-center gap-4 border-t border-forest-900/15 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <LotusMark size={42} className="text-gold-500" />
              <div className="text-[0.64rem] uppercase leading-relaxed tracking-[0.14em] text-ink-500">
                <p>{stories.length} {t("nav.stories")}</p>
                <p className="mt-1 text-gold-600">{t("teachers.worksheets")}</p>
              </div>
            </div>
          </div>

          <p className="mt-8 max-w-3xl border-l-2 border-gold-500 pl-4 text-[0.84rem] leading-relaxed text-ink-500">
            {t("teachers.note")}
          </p>
        </div>
      </header>

      <div className="shell py-12">
        <TeacherRoom stories={teacherStories} />
      </div>

      <div className="shell">
        <div className="grid gap-px overflow-hidden border border-forest-900/12 bg-forest-900/12 md:grid-cols-3">
          <div className="bg-parchment-50 p-6">
            <InfoIcon size={20} className="text-gold-600" />
            <h2 className="mt-3 text-[1.1rem] text-forest-900">{t("teachers.sourceVsAdaptation")}</h2>
            <p className={`mt-2 text-[0.84rem] leading-relaxed text-ink-500 ${locale === "si" ? "si" : ""}`}>
              {t("teachers.sourceVsAdaptationBody")}
            </p>
          </div>
          <div className="bg-parchment-50 p-6">
            <BookIcon size={20} className="text-gold-600" />
            <h2 className="mt-3 text-[1.1rem] text-forest-900">{t("teachers.curriculum")}</h2>
            <p className={`mt-2 text-[0.84rem] leading-relaxed text-ink-500 ${locale === "si" ? "si" : ""}`}>
              {t("teachers.curriculumBody")}
            </p>
          </div>
          <div className="bg-parchment-50 p-6">
            <UsersIcon size={20} className="text-gold-600" />
            <h2 className="mt-3 text-[1.1rem] text-forest-900">{t("teachers.materials")}</h2>
            <p className={`mt-2 text-[0.84rem] leading-relaxed text-ink-500 ${locale === "si" ? "si" : ""}`}>
              {t("teachers.materialsList")}
            </p>
          </div>
        </div>

        <div className="mt-14 rounded-sm border border-forest-900/10 bg-parchment-200/40 p-6 sm:p-8 print:hidden">
          <SectionHeading eyebrow={t("footer.sources")} title={t("story.sourceNote")} />
          <div className="mt-5 grid gap-4 text-[0.8rem] leading-relaxed text-ink-500 sm:grid-cols-2">
            <p>
              E. B. Cowell (ed.), <em>The Jātaka, or Stories of the Buddha’s Former Births</em>, Pali Text
              Society, 1895–1907. Public domain.
            </p>
            <p>
              H. T. Francis &amp; R. A. Neil, <em>The Jātaka</em>, Vol. III, 1897. Public domain. SuttaCentral
              edition used for the Sasa Jataka source text.
            </p>
          </div>
          <p className="mt-4 text-[0.76rem] italic text-ink-500/80">
            {t("teachers.sourceVsAdaptationBody")}
          </p>
        </div>
      </div>
    </div>
  );
}
