import type { NextConfig } from "next";

/**
 * Static export (TRD §1): all 8 routes pre-rendered to HTML, no server runtime.
 * `images.unoptimized` is mandatory under `output: 'export'` — assets are
 * pre-optimized by scripts/build-imagery.mjs instead.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    /**
     * Stamped at build time and inlined into the bundle, so the static HTML and
     * the first client render resolve the same phase. usePhase() reconciles
     * against the visitor's clock on mount (see lib/phase.ts).
     */
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().slice(0, 10),
  },
};

export default nextConfig;
