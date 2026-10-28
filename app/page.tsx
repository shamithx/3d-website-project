import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { DailySection } from "@/components/home/DailySection";
import { Journey } from "@/components/home/Journey";
import { QuizTeaser } from "@/components/home/QuizTeaser";
import { VocabTeaser } from "@/components/home/VocabTeaser";
import {
  AboutSection,
  FeaturedTales,
  LivesSection,
  TeachersSection,
  ValuesGrid,
} from "@/components/home/StaticSections";
import { sasaJataka } from "@/content/stories/sasa";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: { absolute: translate(locale, "meta.home.title") },
    description: translate(locale, "meta.home.desc"),
    alternates: { canonical: "/" },
    openGraph: {
      title: translate(locale, "meta.home.title"),
      description: translate(locale, "meta.home.desc"),
      url: "/",
      images: ["/og/og-default.png"],
    },
  };
}

export default async function HomePage() {
  const locale = await getLocale();

  return (
    <>
      <Hero locale={locale} />
      <FeaturedTales locale={locale} />
      <ValuesGrid locale={locale} />
      <Journey locale={locale} />
      <LivesSection locale={locale} />
      <DailySection locale={locale} />
      <VocabTeaser words={sasaJataka.reader?.vocabulary.slice(0, 6) ?? []} />
      <QuizTeaser questions={sasaJataka.reader?.quiz.slice(0, 3) ?? []} />
      <TeachersSection locale={locale} />
      <AboutSection locale={locale} />
    </>
  );
}
