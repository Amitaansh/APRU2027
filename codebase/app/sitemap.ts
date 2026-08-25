import type { MetadataRoute } from "next";
import { nav } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return nav.map((item) => ({
    url: new URL(
      item.route.endsWith("/") ? item.route : item.route + "/",
      SITE_URL,
    ).toString(),
    changeFrequency: "monthly",
    priority: item.route === "/" ? 1 : 0.7,
  }));
}
