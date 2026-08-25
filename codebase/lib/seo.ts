import type { Metadata } from "next";
import { site } from "@/lib/content";

/**
 * Per-page metadata (TRD §8). The social card is the first impression for this
 * audience — a shared link that renders badly costs the click.
 */

export const OG_IMAGE = {
  url: "/og/default.png",
  width: 1200,
  height: 630,
  alt: "Bridging Resilience(s) — the 10th Conference of APRU-SCL, 21-23 May 2027, Singapore",
};

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://apru-scl2027.org";

export const DEFAULT_DESCRIPTION =
  site.name +
  " — " +
  site.seriesName +
  ", " +
  site.dates +
  ", " +
  site.location +
  ". Hosted by the " +
  site.host +
  ".";

interface PageMetaInput {
  title: string;
  description?: string;
  path: string;
}

export function pageMetadata({ title, description, path }: PageMetaInput): Metadata {
  // next.config sets trailingSlash, so canonicals must carry it too or the
  // canonical and the served URL disagree.
  const url = new URL(path.endsWith("/") ? path : path + "/", SITE_URL).toString();
  const desc = description ?? DEFAULT_DESCRIPTION;
  const fullTitle = path === "/" ? site.name + " · " + site.seriesName : title + " · " + site.name;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: fullTitle,
      description: desc,
      url,
      locale: "en_SG",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [OG_IMAGE.url],
    },
  };
}
