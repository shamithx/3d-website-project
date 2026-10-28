import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Noto_Sans_Sinhala } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SkipLink } from "@/components/layout/SkipLink";
import { PwaRegister } from "@/components/layout/PwaRegister";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { ProgressProvider } from "@/components/providers/ProgressProvider";
import { getLocale } from "@/lib/locale-server";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const sinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sinhala",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jathaka Katha — Ancient Wisdom. Living Stories.",
    template: "%s · Jathaka Katha",
  },
  description:
    "An immersive bilingual library of Sri Lankan Jataka tales for children, families and classrooms. Read, listen, learn and reflect.",
  applicationName: "Jathaka Katha",
  manifest: "/manifest.webmanifest",
  keywords: [
    "Jataka tales",
    "Jathaka Katha",
    "Sri Lankan stories",
    "Sinhala stories",
    "Buddhist stories for children",
    "Sasa Jataka",
    "ජාතක කතා",
    "ළමා කතා",
  ],
  authors: [{ name: "Jathaka Katha" }],
  creator: "Jathaka Katha",
  openGraph: {
    type: "website",
    siteName: "Jathaka Katha",
    locale: "en_LK",
    alternateLocale: ["si_LK"],
    title: "Jathaka Katha — Ancient Wisdom. Living Stories.",
    description:
      "Twelve Jataka tales, retold in Sinhala and English, with immersive reading scenes, quizzes and classroom material.",
    images: [
      {
        url: "/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "Jathaka Katha — an ancient forest at sunrise",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jathaka Katha — Ancient Wisdom. Living Stories.",
    description:
      "An immersive bilingual library of Sri Lankan Jataka tales for children, families and classrooms.",
    images: ["/og/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#1E3A2B",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${display.variable} ${body.variable} ${sinhala.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <LocaleProvider initialLocale={locale}>
          <ProgressProvider>
            <SkipLink />
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter locale={locale} />
            <PwaRegister />
          </ProgressProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
