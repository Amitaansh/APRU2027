import type { MetadataRoute } from "next";
import { allRoutes } from "@apru/content";
import { NOINDEX, SITE_URL } from "@apru/content/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  /*
   * allRoutes is the flattened nav, so submenu pages are indexed too — a child
   * route is a real page and has to be findable.
   *
   * The home page is prepended because it is no longer a nav item: the client's
   * sitemap drops "Home" and makes the wordmark the way back, which would
   * otherwise take "/" out of the index along with it.
   */
  // A de-indexed edition publishes no map of itself.
  if (NOINDEX) return [];

  const routes = Array.from(new Set(["/", ...allRoutes]));

  return routes.map((route) => ({
    url: new URL(route.endsWith("/") ? route : route + "/", SITE_URL).toString(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
