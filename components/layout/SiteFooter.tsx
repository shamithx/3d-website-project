import Link from "next/link";
import { LocaleSwitch } from "@/components/layout/LocaleSwitch";
import { LotusMark, Wordmark } from "@/components/shared/ui";
import { CodeIcon, ExternalIcon } from "@/components/shared/Icons";
import { translate, type MessageKey } from "@/lib/i18n";
import type { Locale } from "@/content/stories/types";

const COLUMNS: { title: MessageKey; links: { href: string; label: MessageKey }[] }[] = [
  {
    title: "footer.explore",
    links: [
      { href: "/", label: "nav.home" },
      { href: "/stories", label: "nav.stories" },
      { href: "/#journey", label: "nav.journey" },
      { href: "/#today", label: "home.daily.title" },
      { href: "/progress", label: "nav.progress" },
    ],
  },
  {
    title: "footer.learn",
    links: [
      { href: "/teachers", label: "nav.teachers" },
      { href: "/stories/sasa-jataka/learn", label: "common.lesson" },
      { href: "/#vocabulary", label: "common.vocabulary" },
      { href: "/#quiz", label: "common.quiz" },
    ],
  },
];

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = (key: MessageKey) => translate(locale, key);
  const repo = process.env.NEXT_PUBLIC_REPO_URL;
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden bg-forest-900 text-parchment-200">
      <div
        className="pointer-events-none absolute -right-16 -top-24 opacity-[0.06]"
        aria-hidden="true"
      >
        <LotusMark size={340} className="text-parchment-100" />
      </div>

      <div className="shell relative py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Wordmark inverted />
            <p className="mt-6 max-w-xs text-[0.86rem] leading-relaxed text-parchment-200/70">
              {t("footer.credit")}
            </p>
            <p className="mt-5 max-w-xs text-[0.76rem] leading-relaxed text-parchment-200/50">
              {t("footer.privacy")}
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={t(column.title)}>
              <h3 className="eyebrow-plain text-[0.63rem] text-gold-400">{t(column.title)}</h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.86rem] text-parchment-200/75 transition-colors hover:text-parchment-50"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="eyebrow-plain text-[0.63rem] text-gold-400">{t("footer.about")}</h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-[0.86rem] text-parchment-200/75 transition-colors hover:text-parchment-50"
                >
                  {t("about.title")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about#sources"
                  className="text-[0.86rem] text-parchment-200/75 transition-colors hover:text-parchment-50"
                >
                  {t("footer.sources")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about#contact"
                  className="text-[0.86rem] text-parchment-200/75 transition-colors hover:text-parchment-50"
                >
                  {t("about.contactTitle")}
                </Link>
              </li>
              <li>
                {repo ? (
                  <a
                    href={repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[0.86rem] text-parchment-200/75 transition-colors hover:text-parchment-50"
                  >
                    <CodeIcon size={15} />
                    {t("footer.repo")}
                    <ExternalIcon size={13} className="opacity-60" />
                  </a>
                ) : (
                  <span
                    className="inline-flex cursor-default items-center gap-1.5 text-[0.86rem] text-parchment-200/40"
                    title={t("footer.repoPending")}
                  >
                    <CodeIcon size={15} />
                    {t("footer.repo")}
                  </span>
                )}
              </li>
            </ul>
            <div className="mt-7">
              <LocaleSwitch tone="dark" />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-parchment-200/12 pt-6 text-[0.72rem] text-parchment-200/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.rights").replace("{year}", String(year))}</p>
          <p className="max-w-md sm:text-right">{t("footer.offlineReady")}</p>
        </div>
      </div>
    </footer>
  );
}
