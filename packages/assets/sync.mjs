import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Mirrors the shared static assets into an app's own public/ directory.
 *
 * Next serves public/ from inside the app and offers no way to point it
 * elsewhere, so two apps would otherwise mean two copies of the same 2.6 MB of
 * artwork — and, sooner or later, two copies that disagree. This keeps one
 * source of truth in packages/assets and copies it in on predev and prebuild.
 * The mirrored directories are gitignored in each app; only this copy is
 * committed.
 *
 * Anything an app owns alone (the portfolio's halo plates, its Hedvig subset)
 * lives in that app's public/ and is left untouched: only the directories
 * listed below are mirrored.
 *
 *   node packages/assets/sync.mjs <target-public-dir>
 */

const SHARED = ["images", "og"];

const here = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(process.cwd(), process.argv[2] ?? "public");

await mkdir(target, { recursive: true });
for (const dir of SHARED) {
  await cp(path.join(here, "public", dir), path.join(target, dir), {
    recursive: true,
    force: true,
  });
}
console.log("assets: mirrored " + SHARED.join(", ") + " into " + path.relative(process.cwd(), target));
