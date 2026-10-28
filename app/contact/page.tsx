import type { Metadata } from "next";
import Link from "next/link";
import { StoryCover } from "@/components/art/StoryCover";
import { ArrowRightIcon, FeatherIcon } from "@/components/shared/Icons";
import { ButtonLink } from "@/components/shared/ui";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: translate(locale, "meta.contact.title"),
    description: translate(locale, "meta.contact.desc"),
    alternates: { canonical: "/contact" },
    openGraph: {
      title: `${translate(locale, "meta.contact.title")} · Jathaka Katha`,
      description: translate(locale, "meta.contact.desc"),
      url: "/contact",
      images: ["/og/og-default.png"],
    },
  };
}

export default async function ContactPage() {
  const locale = await getLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <article className="pb-24">
      <section className="relative border-b border-forest-900/10">
        <div className="absolute inset-0">
          <StoryCover
            slug="sasa-jataka"
            scene="hermitage"
            palette="emerald"
            animal="hare"
            composition="wide"
            alt=""
            sizes="100vw"
            imageClassName="object-[50%_38%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-parchment-100 via-parchment-100/85 to-parchment-100/45" />
        </div>
        <div className="shell relative py-16 sm:py-24">
          <p className="eyebrow">{t("contact.eyebrow")}</p>
          <h1 className="mt-4 max-w-2xl text-display-lg text-forest-900">{t("contact.title")}</h1>
          <p className="mt-5 max-w-xl lead">{t("contact.lead")}</p>
        </div>
      </section>

      <div className="shell grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
        <section className="border border-forest-900/12 bg-parchment-50 p-7 sm:p-10">
          <p className="text-[0.6rem] uppercase tracking-[0.18em] text-gold-600">{t("contact.emailLabel")}</p>
          <a
            href="mailto:shamithchamod@gmail.com"
            className="mt-4 block break-words font-display text-[clamp(1.7rem,4.2vw,2.7rem)] leading-tight text-forest-900 underline decoration-gold-500/45 decoration-1 underline-offset-8 transition-colors hover:text-emerald-700"
          >
            shamithchamod@gmail.com
          </a>
          <p className="mt-5 max-w-lg text-[0.96rem] leading-[1.85] text-ink-700">{t("contact.emailNote")}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="mailto:shamithchamod@gmail.com" className="btn btn-primary btn-sm">
              <FeatherIcon size={15} />
              {t("contact.emailLabel")}
            </a>
            <ButtonLink href="/teachers" variant="secondary" size="sm">
              {t("nav.teachers")}
              <ArrowRightIcon size={14} />
            </ButtonLink>
          </div>

          <p className="mt-7 border-t border-forest-900/10 pt-5 text-[0.78rem] leading-relaxed text-ink-500">
            {t("contact.replyNote")}
          </p>
        </section>

        <div className="space-y-6">
          <section className="border-t border-forest-900/12 pt-6">
            <h2 className="text-display-sm text-forest-900">{t("contact.teachersTitle")}</h2>
            <p className="mt-3 text-[0.94rem] leading-[1.85] text-ink-700">{t("contact.teachersBody")}</p>
          </section>

          <section className="border-t border-forest-900/12 pt-6">
            <h2 className="text-display-sm text-forest-900">{t("contact.correctionsTitle")}</h2>
            <p className="mt-3 text-[0.94rem] leading-[1.85] text-ink-700">{t("contact.correctionsBody")}</p>
            <Link
              href="/about#sources"
              className="mt-4 inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.12em] text-forest-900 underline decoration-gold-500/40 underline-offset-4"
            >
              {t("footer.sources")}
              <ArrowRightIcon size={14} />
            </Link>
          </section>

          <section className="border-t border-forest-900/12 pt-6">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.12em] text-forest-900 underline decoration-gold-500/40 underline-offset-4"
            >
              {t("contact.backAbout")}
              <ArrowRightIcon size={14} />
            </Link>
          </section>
        </div>
      </div>
    </article>
  );
}
