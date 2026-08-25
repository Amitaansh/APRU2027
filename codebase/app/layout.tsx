import type { Metadata, Viewport } from "next";
import { Hedvig_Letters_Serif } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Halo } from "@/components/brand/Halo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/lib/content";
import { DEFAULT_DESCRIPTION, OG_IMAGE, SITE_URL } from "@/lib/seo";

/**
 * Two faces, both self-hosted, no runtime font requests.
 *
 * Hedvig Letters Serif carries an `opsz` axis; the display sizes on this site
 * run from 22 to 240px, so the axis is loaded rather than pinned and the browser
 * picks the right optical size at each one.
 */
const hedvig = Hedvig_Letters_Serif({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-hedvig",
  display: "swap",
});

/**
 * Switzer is not on Google Fonts. The variable file is vendored under app/fonts
 * (free for commercial use, Indian Type Foundry) and served from our own origin.
 */
const switzer = localFont({
  src: [
    { path: "./fonts/Switzer-Variable.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/Switzer-VariableItalic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-switzer",
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

/** One ground, one theme colour. The site does not follow the OS. */
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={hedvig.variable + " " + switzer.variable}>
      <head>
        {/*
         * Reveals start off-screen and are released by JavaScript, the loading
         * screen covers the page until JavaScript lifts it, and the hero is
         * clipped shut until the same moment. Without this the home page is a
         * blank white screen to a visitor with scripting disabled.
         */}
        <noscript>
          <style>{
            ".ln-mask > .ln, .ln-mask > .wd { transform: none !important }" +
            ".rise { opacity: 1 !important; transform: none !important }" +
            ".preload { display: none !important }" +
            ".hero-clip { clip-path: none !important }"
          }</style>
        </noscript>
      </head>
      <body>
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
            className="t-b2 sr-only focus:not-sr-only focus:fixed focus:left-[30rem] focus:top-[30rem] focus:z-[80] focus:bg-bk focus:px-[20rem] focus:py-[14rem] focus:text-wh"
          >
            Skip to content
          </a>
          {/*
           * One halo per page, on a fixed canvas above everything but the
           * header. Sections opt in with a lane via Section's `halo` prop, and
           * take the complementary columns for their own content, so the mark
           * and the type never occupy the same space. Pages that declare no
           * lane leave the canvas inert.
           */}
          <Halo />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
