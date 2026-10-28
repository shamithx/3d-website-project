"use client";

import Link from "next/link";
import { useState } from "react";
import { StoryArt } from "@/components/art/StoryArt";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ArrowRightIcon } from "@/components/shared/Icons";
import { LotusMark } from "@/components/shared/ui";
import { MORAL_VALUES } from "@/content/values";
import type { AnimalKind, PaletteKey, SceneKind } from "@/content/stories/types";
import type { MessageKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STEPS: {
  title: MessageKey;
  body: MessageKey;
  scene: SceneKind;
  palette: PaletteKey;
  animal: AnimalKind;
  slug: string;
  storyTitle: { en: string; si: string };
}[] = [
  { title: "home.journey.step1", body: "home.journey.step1Body", scene: "village", palette: "gold", animal: "human", slug: "kuru-dhamma-jataka", storyTitle: { en: "Kuru Dhamma Jataka", si: "කුරු ධර්ම ජාතකය" } },
  { title: "home.journey.step2", body: "home.journey.step2Body", scene: "river", palette: "river", animal: "deer", slug: "ruru-jataka", storyTitle: { en: "Ruru Jataka", si: "රුරු ජාතකය" } },
  { title: "home.journey.step3", body: "home.journey.step3Body", scene: "forest", palette: "emerald", animal: "hare", slug: "sasa-jataka", storyTitle: { en: "Sasa Jataka", si: "සස ජාතකය" } },
  { title: "home.journey.step4", body: "home.journey.step4Body", scene: "cliff", palette: "dusk", animal: "monkey", slug: "mahakapi-jataka", storyTitle: { en: "Mahakapi Jataka", si: "මහාකපි ජාතකය" } },
  { title: "home.journey.step5", body: "home.journey.step5Body", scene: "night", palette: "night", animal: "hare", slug: "sasa-jataka", storyTitle: { en: "Sasa Jataka", si: "සස ජාතකය" } },
];

export function Journey({ locale }: { locale: "en" | "si" }) {
  const { t } = useLocale();
  const [active, setActive] = useState(2);
  const step = STEPS[active] ?? STEPS[0]!;
  const valueLabels = MORAL_VALUES.slice(0, 3).map((value) => value.label[locale]);

  return (
    <section id="journey" className="relative overflow-hidden bg-forest-900 py-20 text-parchment-100 md:py-28">
      <div className="pointer-events-none absolute -left-24 top-10 opacity-[0.05]" aria-hidden="true">
        <LotusMark size={420} />
      </div>

      <div className="shell relative">
        <div className="max-w-2xl">
          <p className="eyebrow text-gold-300">{t("home.journey.eyebrow")}</p>
          <h2 className="mt-4 text-display-md text-parchment-50">{t("home.journey.title")}</h2>
          <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-parchment-200/70">
            {t("home.journey.lead")}
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
          <div role="group" aria-label={t("home.journey.title")}>
            <ol className="border-t border-parchment-200/15">
              {STEPS.map((entry, index) => {
                const isActive = index === active;
                return (
                  <li key={entry.title} className="border-b border-parchment-200/15">
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      aria-pressed={isActive}
                      className="group flex w-full items-start gap-5 py-6 text-left"
                    >
                      <span
                        className={cn(
                          "mt-1 text-[0.62rem] tabular-nums tracking-[0.16em] transition-colors",
                          isActive ? "text-gold-300" : "text-parchment-200/40",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">
                        <span
                          className={cn(
                            "display block text-[1.55rem] leading-tight transition-colors sm:text-[1.85rem]",
                            isActive ? "text-parchment-50" : "text-parchment-200/55 group-hover:text-parchment-100",
                          )}
                        >
                          {t(entry.title)}
                        </span>
                        <span
                          className={cn(
                            "mt-2 block text-[0.86rem] leading-relaxed transition-all duration-300",
                            isActive ? "max-h-24 text-parchment-200/75 opacity-100" : "max-h-0 overflow-hidden opacity-0",
                          )}
                        >
                          {t(entry.body)}
                        </span>
                      </span>
                      <ArrowRightIcon
                        size={18}
                        className={cn(
                          "mt-2 shrink-0 transition-all duration-300",
                          isActive ? "translate-x-0 text-gold-300 opacity-100" : "-translate-x-2 text-parchment-200/40 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              {valueLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-parchment-200/20 px-3 py-1 text-[0.66rem] tracking-[0.06em] text-parchment-200/60"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-t-[999px] border border-parchment-200/15">
              <div className="aspect-[4/5]">
                <StoryArt
                  key={`${step.scene}-${step.palette}`}
                  slug={`journey-${active}`}
                  scene={step.scene}
                  palette={step.palette}
                  animal={step.animal}
                  composition="arch"
                  className="animate-fade-up"
                />
              </div>
            </div>
            <div className="mt-5 flex items-end justify-between gap-4 border-t border-parchment-200/15 pt-4">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-gold-300">
                  {t(step.title)}
                </p>
                <Link
                  href={`/stories/${step.slug}`}
                  className="group mt-2 inline-flex items-center gap-2 text-[0.9rem] text-parchment-100 underline decoration-gold-400/40 decoration-1 underline-offset-4 transition-colors hover:decoration-gold-300"
                >
                  {step.storyTitle[locale]}
                  <ArrowRightIcon size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <p className="text-[0.62rem] uppercase tracking-[0.14em] text-parchment-200/40">
                {t("home.journey.cta")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
