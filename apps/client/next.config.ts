import type { NextConfig } from "next";

/**
 * The client edition. Same static export as the portfolio, same workspace
 * packages — the two builds differ in which stylesheets they import and how
 * each page composes the shared components, not in their machinery.
 */
const nextConfig: NextConfig = {
  output: "export",
  /** The workspace packages ship TS/TSX source rather than a build step. */
  transpilePackages: ["@apru/content", "@apru/ui", "@apru/styles"],
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().slice(0, 10),
  },
};

export default nextConfig;
