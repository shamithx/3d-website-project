import Link from "next/link";
import { StoryCover } from "@/components/art/StoryCover";
import { DailyWisdomCard } from "@/components/home/DailyWisdomCard";
import { ArrowRightIcon } from "@/components/shared/Icons";
import { ButtonLink } from "@/components/shared/ui";
import { storyOfTheDay } from "@/content/stories";
import { translate, type MessageKey } from "@/lib/i18n";
import type { Locale } from "@/content/stories/types";

export function DailySection({ locale }: { locale: Locale }) {
  const t = (key: MessageKey, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const story = storyOfTheDay();
  const href = story.reader ? `/stories/${story.slug}/read` : `/stories/${story.slug}`;

  return (
    <section id="today" className="section border-y border-forest-900/10 bg-parchment-200/45">
      <div className="shell">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">{t("home.daily.eyebrow")}</p>
            <h2 className="mt-4 text-display-md text-forest-900">{t("home.daily.title")}</h2>
          </div>
          <p className="max-w-xs text-[0.72rem] leading-relaxed text-ink-500/80">
            {t("home.daily.storyNote")}
          </p>
        </div>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
          <article>
            <Link href={href} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden bg-parchment-300 sm:aspect-[16/9]">
                <div className="absolute inset-0 transition-transform duration-[1400ms] ease-soft-out group-hover:scale-[1.03]">
                  <StoryCover
                    slug={story.slug}
                    scene={story.scene}
                    palette={story.palette}
                    animal={story.animal}
                    composition="wide"
                    alt={`${story.title[locale]} — illustration`}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-900/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-gold-300">
                    {t("home.daily.storyOfDay")}
                  </p>
                  <p className="si mt-2 text-[1.05rem] text-parchment-100/85">{story.title.si}</p>
                  <h3 className="display mt-1 text-[1.9rem] text-parchment-50 sm:text-[2.3rem]">
                    {story.title.en}
                  </h3>
                </div>
              </div>
            </Link>

            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-md">
                <p className="text-[0.9rem] leading-relaxed text-ink-500">{story.summary[locale]}</p>
                <p className="mt-3 border-l border-gold-500/50 pl-3 text-[0.84rem] italic text-forest-800/85">
                  {story.moral[locale]}
                </p>
              </div>
              <ButtonLink href={href} variant="primary" size="sm" className="shrink-0">
                {t("home.daily.read")}
                <ArrowRightIcon size={14} />
              </ButtonLink>
            </div>
          </article>

          <div>
            <h3 className="eyebrow-plain text-[0.64rem] text-forest-900">{t("home.daily.wisdom")}</h3>
            <div className="mt-4">
              <DailyWisdomCard
                quote={story.moral[locale]}
                sourceTitle={`${story.title[locale]} · ${t("story.moral")}`}
                attribution={t("home.daily.reflectionCredit")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
