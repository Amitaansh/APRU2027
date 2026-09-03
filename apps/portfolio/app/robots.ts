import type { MetadataRoute } from "next";
import { NOINDEX, SITE_URL } from "@apru/content/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // See NOINDEX in @apru/content/seo: only one edition may be indexed.
  if (NOINDEX) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
