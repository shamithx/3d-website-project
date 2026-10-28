import type { Metadata } from "next";
import Link from "next/link";
import { StoryCover } from "@/components/art/StoryCover";
import { stories } from "@/content/stories";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";
import { LotusMark } from "@/components/shared/ui";
import { ArrowRightIcon, ExternalIcon, LockIcon } from "@/components/shared/Icons";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: translate(locale, "meta.about.title"),
    description: translate(locale, "meta.about.desc"),
    alternates: { canonical: "/about" },
    openGraph: {
      title: `${translate(locale, "meta.about.title")} · Jathaka Katha`,
      description: translate(locale, "meta.about.desc"),
      url: "/about",
      images: ["/og/og-default.png"],
    },
  };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  const sections = [
    { id: "why", title: "about.whyTitle", body: "about.whyBody" },
    { id: "handling", title: "about.howTitle", body: "about.howBody" },
    { id: "context", title: "about.contextTitle", body: "about.contextBody" },
    { id: "sources", title: "footer.sources", body: "teachers.sourceVsAdaptationBody" },
    { id: "privacy", title: "about.privacyTitle", body: "about.privacyBody" },
    { id: "tech", title: "about.techTitle", body: "about.techBody" },
    { id: "open", title: "about.openTitle", body: "about.openBody" },
    { id: "credits", title: "about.creditsTitle", body: "about.creditsBody" },
    { id: "contact", title: "about.contactTitle", body: "about.contactBody" },
  ] as const;

  return (
    <div className="pb-24">
      <section className="relative border-b border-forest-900/10">
        <div className="absolute inset-0">
          <StoryCover
            slug="sasa-jataka"
            scene="forest"
            palette="dawn"
            animal="hare"
            composition="wide"
            alt=""
            sizes="100vw"
            imageClassName="object-[50%_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-parchment-100 via-parchment-100/85 to-parchment-100/40" />
        </div>
        <div className="shell relative py-16 sm:py-24">
          <p className="eyebrow">{t("home.about.eyebrow")}</p>
          <h1 className="mt-4 max-w-2xl text-display-lg text-forest-900">{t("about.title")}</h1>
          <p className="mt-5 max-w-xl lead">{t("about.lead")}</p>
        </div>
      </section>

      <div className="shell grid gap-12 py-14 lg:grid-cols-[0.3fr_0.7fr] lg:gap-20">
        <nav aria-label={t("about.title")} className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-[0.6rem] uppercase tracking-[0.18em] text-gold-600">{t("footer.about")}</p>
          <ul className="mt-4 space-y-2">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="group flex items-baseline gap-3 text-[0.82rem] text-ink-500 transition-colors hover:text-forest-900"
                >
                  <span className="text-[0.58rem] tabular-nums tracking-[0.1em] text-gold-600/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {t(section.title)}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 hidden items-center gap-2 text-[0.68rem] text-ink-500/70 lg:flex">
            <LockIcon size={14} />
            {t("footer.privacy")}
          </div>
        </nav>

        <div className="min-w-0">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-24 border-t border-forest-900/12 py-9 first:border-t-0 first:pt-0">
              <div className="flex items-center gap-3">
                <span className="text-[0.6rem] tabular-nums tracking-[0.14em] text-gold-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className={`text-display-sm text-forest-900 ${locale === "si" ? "si-heading" : ""}`}>
                  {t(section.title)}
                </h2>
              </div>
              <p className={`mt-4 max-w-2xl text-[0.98rem] leading-[1.85] text-ink-700 ${locale === "si" ? "si" : ""}`}>
                {t(section.body)}
              </p>

              {section.id === "sources" ? (
                <div className="mt-7 overflow-x-auto">
                  <table className="w-full min-w-[32rem] border-collapse text-left">
                    <caption className="sr-only">{t("footer.sources")}</caption>
                    <thead>
                      <tr className="border-b border-forest-900/20 text-[0.6rem] uppercase tracking-[0.12em] text-ink-500">
                        <th scope="col" className="py-2 pr-4 font-semibold">Tale</th>
                        <th scope="col" className="py-2 pr-4 font-semibold">Collection</th>
                        <th scope="col" className="py-2 pr-4 font-semibold">No.</th>
                        <th scope="col" className="py-2 font-semibold">Attribution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stories.map((story) => (
                        <tr key={story.slug} className="border-b border-forest-900/8 align-top text-[0.78rem]">
                          <th scope="row" className="py-2.5 pr-4 font-normal text-forest-900">
                            <Link href={`/stories/${story.slug}`} className="hover:text-gold-600">
                              {story.title.en}
                            </Link>
                            <span className="si block text-[0.72rem] text-ink-500">{story.title.si}</span>
                          </th>
                          <td className="py-2.5 pr-4 text-ink-500">{story.source.collection}</td>
                          <td className="py-2.5 pr-4 tabular-nums text-ink-500">{story.source.jatakaNumber ?? "—"}</td>
                          <td className="py-2.5 text-ink-500">{story.source.attribution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {section.id === "credits" ? (
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <LotusMark size={34} className="text-gold-500" />
                  <a
                    href="https://suttacentral.net/ja316/en/francis-neil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[0.74rem] uppercase tracking-[0.1em] text-forest-900 underline decoration-gold-500/40 underline-offset-4"
                  >
                    SuttaCentral · Ja 316
                    <ExternalIcon size={13} />
                  </a>
                </div>
              ) : null}

              {section.id === "contact" ? (
                <Link
                  href="/teachers"
                  className="mt-6 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-forest-900"
                >
                  {t("nav.teachers")}
                  <ArrowRightIcon size={15} />
                </Link>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
