import Link from "next/link";
import { StoryCover } from "@/components/art/StoryCover";
import { StoryCard } from "@/components/stories/StoryCard";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading, ButtonLink, LotusMark } from "@/components/shared/ui";
import {
  ArrowRightIcon,
  DownloadIcon,
  FeatherIcon,
  StarIcon,
  UsersIcon,
} from "@/components/shared/Icons";
import { categoryCount, featuredStories, lives } from "@/content/stories";
import { toCardData } from "@/content/stories/card";
import { MORAL_VALUES } from "@/content/values";
import { translate, type MessageKey } from "@/lib/i18n";
import type { Locale } from "@/content/stories/types";

type T = (key: MessageKey, vars?: Record<string, string | number>) => string;

function translator(locale: Locale): T {
  return (key, vars) => translate(locale, key, vars);
}

export function FeaturedTales({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <section className="section" aria-labelledby="featured-title">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow={t("home.featured.eyebrow")}
            title={t("home.featured.title")}
            lead={t("home.featured.lead")}
            id="featured-title"
            action={
              <Link
                href="/stories"
                className="group inline-flex items-center gap-2 border-b border-gold-500/50 pb-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-forest-900 transition-colors hover:border-gold-500"
              >
                {t("common.viewAll")}
                <ArrowRightIcon size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-x-7 gap-y-14 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-8">
          {featuredStories.map((story, index) => (
            <Reveal
              key={story.slug}
              delay={index * 90}
              className={index === 1 ? "lg:mt-16" : index === 2 ? "lg:mt-8" : undefined}
            >
              <StoryCard story={toCardData(story)} variant={index === 0 ? "feature" : "grid"} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ValuesGrid({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <section className="section-tight" aria-labelledby="values-title">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow={t("home.values.eyebrow")}
            title={t("home.values.title")}
            lead={t("home.values.lead")}
            id="values-title"
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-forest-900/12 bg-forest-900/12 sm:grid-cols-2 lg:grid-cols-3">
          {MORAL_VALUES.map((value, index) => (
            <Reveal key={value.id} delay={index * 40}>
              <Link
                href={`/stories?value=${value.id}`}
                className="group flex h-full flex-col justify-between gap-5 bg-parchment-50 p-6 transition-colors duration-300 hover:bg-forest-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="si block text-[1.28rem] leading-tight text-forest-900 transition-colors group-hover:text-parchment-50">
                      {value.label.si}
                    </span>
                    <span className="mt-1 block text-[0.66rem] uppercase tracking-[0.2em] text-gold-600 transition-colors group-hover:text-gold-300">
                      {value.label.en}
                    </span>
                  </div>
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-1 shrink-0 text-gold-500 transition-colors group-hover:text-gold-300"
                    aria-hidden="true"
                  >
                    <path d={value.glyph} />
                  </svg>
                </div>

                <div>
                  <p className="text-[0.82rem] leading-relaxed text-ink-500 transition-colors group-hover:text-parchment-200/70">
                    {value.blurb[locale]}
                  </p>
                  <p className="mt-4 flex items-center justify-between text-[0.64rem] uppercase tracking-[0.14em] text-ink-500/80 transition-colors group-hover:text-parchment-200/60">
                    {t("home.values.count", { n: categoryCount(value.id) })}
                    <ArrowRightIcon
                      size={14}
                      className="text-forest-900 transition-all group-hover:translate-x-1 group-hover:text-gold-300"
                    />
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-[0.72rem] italic text-ink-500/80">{t("home.values.hint")}</p>
      </div>
    </section>
  );
}

export function LivesSection({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <section className="section-tight" aria-labelledby="lives-title">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow={t("home.lives.eyebrow")}
            title={t("home.lives.title")}
            lead={t("home.lives.lead")}
            id="lives-title"
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lives.map((group, index) => {
            const first = group.stories[0];
            if (!first) return null;
            return (
              <Reveal key={group.animal} delay={index * 60}>
                <div className="flex h-full items-stretch gap-4 border border-forest-900/12 bg-parchment-50/70 p-3 transition-colors hover:border-gold-500/45">
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-sm bg-parchment-200">
                    <StoryCover
                      slug={first.slug}
                      scene={first.scene}
                      palette={first.palette}
                      animal={group.animal}
                      composition="column"
                      alt=""
                      sizes="120px"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
                    <p className={locale === "si" ? "display text-[1.1rem] text-forest-900" : "si text-[0.98rem] text-forest-900"}>
                      {group.life.si}
                    </p>
                    <p className="mt-0.5 text-[0.62rem] uppercase tracking-[0.16em] text-gold-600">
                      {group.life.en}
                    </p>
                    <p className="mt-2 text-[0.68rem] uppercase tracking-[0.1em] text-ink-500">
                      {t("home.lives.count", { n: group.stories.length })}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {group.stories.slice(0, 3).map((story) => (
                        <Link
                          key={story.slug}
                          href={`/stories/${story.slug}`}
                          className="text-[0.76rem] text-forest-800 underline decoration-gold-500/40 decoration-1 underline-offset-4 transition-colors hover:text-gold-600"
                        >
                          {story.title[locale]}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function TeachersSection({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <section className="section" aria-labelledby="teachers-teaser">
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">{t("home.teachers.eyebrow")}</p>
            <h2 id="teachers-teaser" className="mt-4 max-w-xl text-display-md text-forest-900">
              {t("home.teachers.title")}
            </h2>
            <p className="mt-5 max-w-xl lead">{t("home.teachers.lead")}</p>

            <ul className="mt-8 space-y-4">
              {(["home.teachers.bullet1", "home.teachers.bullet2", "home.teachers.bullet3"] as MessageKey[]).map(
                (key) => (
                  <li key={key} className="flex items-start gap-3 text-[0.92rem] text-forest-800">
                    <FeatherIcon size={17} className="mt-1 shrink-0 text-gold-500" />
                    <span>{t(key)}</span>
                  </li>
                ),
              )}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/teachers" variant="primary">
                {t("home.teachers.cta")}
                <ArrowRightIcon size={16} />
              </ButtonLink>
              <ButtonLink href="/teachers/worksheets/sasa-jataka" variant="secondary">
                <DownloadIcon size={16} />
                {t("teachers.download")}
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative mx-auto max-w-md">
              <div className="absolute -left-3 -top-3 h-full w-full border border-gold-500/30" aria-hidden="true" />
              <div className="relative bg-parchment-50 px-7 py-8 shadow-lift">
                <div className="flex items-center justify-between border-b border-forest-900/10 pb-4">
                  <div className="flex items-center gap-2 text-forest-900">
                    <LotusMark size={20} className="text-gold-500" />
                    <span className="text-[0.62rem] uppercase tracking-[0.18em]">Jathaka Katha · Worksheet</span>
                  </div>
                  <span className="text-[0.58rem] uppercase tracking-[0.14em] text-ink-500">01</span>
                </div>
                <p className="mt-6 text-[0.62rem] uppercase tracking-[0.16em] text-gold-600">
                  {t("teachers.worksheetTitle", { title: "Sasa Jataka" })}
                </p>
                <p className="si mt-3 text-[1.35rem] text-forest-900">මිතුරන් සිව්දෙනා</p>
                <p className="mt-3 text-[0.82rem] leading-relaxed text-ink-500">{t("teachers.worksheetIntro")}</p>

                <div className="mt-6 space-y-4">
                  {[0, 1, 2].map((row) => (
                    <div key={row}>
                      <div className="h-px w-full bg-forest-900/15" />
                      <div className="mt-2 h-px w-4/5 bg-forest-900/10" />
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex items-center justify-between text-[0.6rem] uppercase tracking-[0.14em] text-ink-500/80">
                  <span>{t("teachers.name")} ______________</span>
                  <span>{t("teachers.date")} __________</span>
                </div>

                <div className="absolute -bottom-4 right-6 flex h-16 w-16 rotate-[-8deg] items-center justify-center rounded-full border border-gold-500/50 text-center text-[0.48rem] uppercase leading-tight tracking-[0.12em] text-gold-600">
                  Classroom
                  <br />
                  ready
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function AboutSection({ locale }: { locale: Locale }) {
  const t = translator(locale);

  const stats = [
    { value: "12", label: t("nav.stories") },
    { value: "2", label: locale === "si" ? "භාෂා" : "languages" },
    { value: "0", label: locale === "si" ? "ගිණුම්" : "accounts" },
  ];

  return (
    <section className="pb-20" aria-labelledby="about-strip">
      <div className="shell">
        <Reveal>
          <div className="relative overflow-hidden bg-forest-900 px-6 py-12 text-parchment-100 sm:px-10 sm:py-16 lg:px-16">
            <div className="pointer-events-none absolute -right-10 -top-16 opacity-[0.07]" aria-hidden="true">
              <LotusMark size={320} />
            </div>
            <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <p className="eyebrow text-gold-300">{t("home.about.eyebrow")}</p>
                <h2 id="about-strip" className="mt-4 max-w-xl text-display-sm text-parchment-50">
                  {t("home.about.title")}
                </h2>
                <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-parchment-200/70">
                  {t("home.about.lead")}
                </p>
                <Link
                  href="/about"
                  className="group mt-7 inline-flex items-center gap-2 border-b border-gold-400/50 pb-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-parchment-100 transition-colors hover:border-gold-300"
                >
                  {t("home.about.cta")}
                  <ArrowRightIcon size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <dl className="grid grid-cols-3 gap-4 border-t border-parchment-200/15 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-[0.58rem] uppercase leading-tight tracking-[0.14em] text-parchment-200/50">
                      {stat.label}
                    </dt>
                    <dd className="display mt-2 text-3xl text-gold-300">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-parchment-200/12 pt-6 text-[0.68rem] uppercase tracking-[0.12em] text-parchment-200/50">
              <span className="inline-flex items-center gap-2">
                <StarIcon size={13} className="text-gold-400" />
                {t("common.stars", { n: 3 })}
              </span>
              <span className="inline-flex items-center gap-2">
                <UsersIcon size={14} />
                {t("nav.teachers")}
              </span>
              <span className="inline-flex items-center gap-2">
                <FeatherIcon size={14} />
                {t("footer.offlineReady")}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
