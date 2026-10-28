import Link from "next/link";
import { StoryArt } from "@/components/art/StoryArt";
import { ArrowLeftIcon } from "@/components/shared/Icons";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <div className="relative flex min-h-[80svh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <StoryArt slug="not-found" scene="forest" palette="night" animal="hare" composition="wide" />
        <div className="absolute inset-0 bg-gradient-to-r from-parchment-100 via-parchment-100/90 to-parchment-100/30" />
      </div>

      <div className="shell relative py-20">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 max-w-xl text-display-lg text-forest-900">{t("notFound.title")}</h1>
        <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-ink-500">{t("notFound.body")}</p>
        <Link href="/" className="btn btn-primary mt-8">
          <ArrowLeftIcon size={15} />
          {t("notFound.cta")}
        </Link>
      </div>
    </div>
  );
}
