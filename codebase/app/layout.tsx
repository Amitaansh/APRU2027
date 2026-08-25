import type { Metadata, Viewport } from "next";
import { Archivo, Space_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTA } from "@/components/layout/FloatingCTA";
import { site } from "@/lib/content";
import { DEFAULT_DESCRIPTION, OG_IMAGE, SITE_URL } from "@/lib/seo";

/**
 * Archivo carries a variable `wdth` axis — 125% is Archivo Expanded, which the
 * Design Brief uses for display type. One self-hosted family, two voices.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: site.name + " · " + site.seriesName,
    template: "%s · " + site.name,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: site.name,
  keywords: [
    "APRU",
    "Sustainable Cities and Landscapes",
    "conference",
    "Singapore",
    "NUS",
    "urban resilience",
    "landscape architecture",
    "Pacific Rim",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_SG",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f2ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={archivo.variable + " " + spaceMono.variable}>
      <body className="min-h-screen bg-paper text-ink antialiased">
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.outbound-links.tagged-events.js"
            strategy="afterInteractive"
          />
        ) : null}
        <Providers>
          <a
            href="#main"
            className="label-mono sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-3 focus:text-ink"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="min-h-[60vh]">
            {children}
          </main>
          <Footer />
          <FloatingCTA />
        </Providers>
      </body>
    </html>
  );
}
