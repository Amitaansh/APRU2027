import type { MetadataRoute } from "next";
import { allRoutes } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // allRoutes is the flattened nav, so submenu pages are indexed too — a child
  // route is a real page and has to be findable.
  return allRoutes.map((route) => ({
    url: new URL(route.endsWith("/") ? route : route + "/", SITE_URL).toString(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
