import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@apru/content";
import { DEFAULT_DESCRIPTION, NOINDEX, OG_IMAGE, SITE_URL } from "@apru/content/seo";

/**
 * One face, self-hosted, no runtime font requests.
 *
 * The client asked for a single font style throughout, so there is no display
 * pairing here — the same family carries every role and weight does the work
 * the serif used to do. It is exposed as `--font-brand`, which globals.css
 * assigns to both the display and the text classes.
 *
 * TODO(brand): this is still Switzer, which the portfolio edition already
 * vendors. Drop the designer's .woff2 files into ./fonts and point this at
 * them; nothing else in the app refers to a family by name.
 */
const brand = localFont({
  src: [
    { path: "./fonts/Switzer-Variable.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/Switzer-VariableItalic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-brand",
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
  robots: NOINDEX ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/**
 * No Providers wrapper: there is no smooth-scroll runtime and no custom cursor
 * in this edition, and there was never a theme provider. No Halo either. What
 * is left is a header, the page, and a footer.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={brand.variable}>
      <body>
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.outbound-links.tagged-events.js"
            strategy="afterInteractive"
          />
        ) : null}
        <a
          href="#main"
          className="t-b2 sr-only focus:not-sr-only focus:fixed focus:left-[30rem] focus:top-[30rem] focus:z-[80] focus:bg-bk focus:px-[20rem] focus:py-[14rem] focus:text-wh"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
