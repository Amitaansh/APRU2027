import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/**
 * Cuts each sponsor mark to its ink, beside the canvas the pipeline wrote.
 *
 *   node packages/assets/trim-sponsors.mjs
 *
 * `npm run imagery` writes every mark centred on one 640x400 canvas at a
 * matched optical area, which is what the portfolio's belt wants: equal boxes
 * that render as equal weight, with the beat of a dot between them. Laid out
 * still, in a row, the same files fail -- the visible gap between two marks
 * is the fixed gap plus each canvas's transparent margins, and those margins
 * are whatever was left after centring a tall mark or a wide one. Henning
 * Larsen's box is nearly all ink; Tierra's is a third. The client circled the
 * result: "reduce spacings and be consistent".
 *
 * So this writes a second file per mark, `<slug>-mark.{png,webp}`, trimmed to
 * the ink, and records the ink box in sponsors.json as `mark: { w, h }`.
 * Sponsors.tsx sizes each trimmed mark to equal area from that ratio, and a
 * fixed gap between ink edges is then the same gap everywhere.
 *
 * It reads the pipeline's PNG rather than the brand files, so it needs no EPS
 * delegate and no source folder: the grading is already done, and this is a
 * crop. Re-run after `npm run imagery`.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(here, "public", "images", "sponsors");
const DATA = path.join(here, "..", "content", "data", "sponsors.json");

const sponsors = JSON.parse(await readFile(DATA, "utf8"));

for (const sponsor of sponsors) {
  const source = path.join(DIR, sponsor.slug + ".png");
  const trimmed = await sharp(source).trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
  const { width, height } = trimmed.info;

  await sharp(trimmed.data)
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(path.join(DIR, sponsor.slug + "-mark.webp"));
  await sharp(trimmed.data)
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(DIR, sponsor.slug + "-mark.png"));

  sponsor.mark = { w: width, h: height };
  console.log("mark " + sponsor.slug + " " + width + "x" + height);
}

await writeFile(DATA, JSON.stringify(sponsors, null, 2) + "\n");
console.log("wrote " + path.relative(process.cwd(), DATA));
