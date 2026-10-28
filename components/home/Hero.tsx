import { ForestStage } from "@/components/three/ForestStage";
import { ArrowRightIcon, BookIcon } from "@/components/shared/Icons";
import { ButtonLink } from "@/components/shared/ui";
import { translate } from "@/lib/i18n";
import type { Locale } from "@/content/stories/types";

export function Hero({ locale }: { locale: Locale }) {
  const t = (key: Parameters<typeof translate>[1], vars?: Parameters<typeof translate>[2]) =>
    translate(locale, key, vars);
  const secondaryLead =
    locale === "si"
      ? "Discover the wisdom hidden within every story."
      : "සෑම කතාවකම සැඟවුණු නුවණ සොයා යන්න.";

  return (
    <section className="relative isolate min-h-[680px] overflow-hidden bg-forest-900 sm:min-h-[760px] lg:min-h-[92svh]">
      <ForestStage
        mode="hero"
        light="dawn"
        label={t("home.hero.sceneAria")}
        className="absolute inset-0 h-full w-full"
      />

      <div className="relative z-10 flex min-h-[680px] flex-col justify-end pb-24 pt-28 sm:min-h-[760px] lg:min-h-[92svh] lg:justify-center lg:pb-32">
        <div className="shell w-full">
          <div className="max-w-4xl">
            <p className="flex items-center gap-3 text-[0.64rem] uppercase tracking-[0.26em] text-parchment-200/80">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" />
              {t("home.hero.eyebrow")}
            </p>

            <h1 className="si mt-6 whitespace-nowrap text-[clamp(2.9rem,8.6vw,7rem)] font-medium leading-[1.05] tracking-[0.01em] text-parchment-50 text-shadow-soft">
              ජාතක කතා
            </h1>

            <div className="mt-3 flex items-center gap-4 sm:mt-4">
              <span className="hidden h-px w-14 bg-gold-400/70 sm:block" aria-hidden="true" />
              <p className="display text-[clamp(1.55rem,3.4vw,2.6rem)] italic tracking-[0.02em] text-parchment-100 text-shadow-soft">
                Jathaka Katha
              </p>
            </div>

            <div className="mt-8 max-w-xl border-l border-gold-400/40 pl-5 sm:mt-10">
              <p className="text-[1.02rem] leading-relaxed text-parchment-50/95 sm:text-[1.12rem]">
                {t("home.hero.lead")}
              </p>
              <p className={locale === "si" ? "mt-2 text-[0.94rem] text-parchment-100/70" : "si mt-2 text-[0.98rem] text-parchment-100/75"}>
                {secondaryLead}
              </p>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/stories/sasa-jataka/read" variant="onDark" size="lg">
                {t("home.hero.ctaPrimary")}
                <ArrowRightIcon size={17} />
              </ButtonLink>
              <ButtonLink href="/stories" variant="ghostDark" size="lg">
                <BookIcon size={16} />
                {t("home.hero.ctaSecondary")}
              </ButtonLink>
            </div>

            <p className="mt-8 text-[0.68rem] uppercase tracking-[0.18em] text-parchment-200/55">
              {t("home.hero.stats")}
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-b from-transparent to-parchment-100" />

      <div className="absolute inset-x-0 bottom-5 z-20 hidden flex-col items-center gap-3 sm:flex">
        <span className="text-[0.58rem] uppercase tracking-[0.24em] text-parchment-100/60">
          {t("home.hero.scroll")}
        </span>
        <span className="relative h-10 w-px bg-parchment-100/25" aria-hidden="true">
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 animate-drift-down rounded-full bg-gold-300" />
        </span>
      </div>
    </section>
  );
}
