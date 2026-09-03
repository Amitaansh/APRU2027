import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * The suites live with what they test — the phase engine in @apru/content, the
 * palette guard in @apru/ui. This config stays so the app can grow its own.
 */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: { include: ["**/*.test.ts"], exclude: ["node_modules/**", "out/**", ".next/**"] },
});
