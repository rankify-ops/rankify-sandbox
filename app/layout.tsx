import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ExitIntent } from "@/components/ExitIntent";
import { QuoteModal } from "@/components/QuoteModal";
import { SiteJsonLd } from "@/components/SiteJsonLd";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { site } from "@/lib/site";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name}: Heat pump hot water, fixed-price installed`, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
  // Preview site: keep everything out of search results until launch.
  robots: { index: false, follow: false },
  openGraph: { siteName: site.name, locale: "en_AU", type: "website" },
};

export const viewport: Viewport = { themeColor: "#0b1b2b" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${jakarta.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteJsonLd />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <StickyMobileBar />
        <ExitIntent />
        <QuoteModal />
      </body>
    </html>
  );
}
