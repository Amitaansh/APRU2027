/**
 * The site icon, built from the conference lockup.
 *
 * The header sets the designer's APRU-SCL / 2027 / SINGAPORE lockup, and the
 * tab icon should read as the same mark, not as the APRU institutional ring
 * the portfolio edition keeps (its Halo is derived from that ring, so it stays
 * there). The lockup is landscape and three lines of type; a favicon is a
 * square that is 32 pixels across on a good day and 16 on a bad one. Set whole
 * it is a smudge at those sizes, so this takes the lockup's own glyph paths,
 * its two inks and its left-aligned stack, and drops only the APRU- prefix of
 * the first line so the other two lines set the width:
 *
 *   SCL         blue, at the size 2027 sets
 *   2027        blue, full width
 *   SINGAPORE   orange, full width -- smaller type, as in the lockup
 *
 * The line gaps are tighter than the lockup's, because the square forces it.
 *
 * Nothing about the glyphs is declared here. The paths are read out of the
 * lockup SVG, the lines are found by clustering their ink boxes on y, and the
 * hyphen is the one glyph on the first line under half the line's height, so a
 * re-exported lockup needs no constants changed. Outputs, all into app/, where
 * Next's file conventions pick them up:
 *
 *   icon.svg          the mark itself, sizes="any" -- what modern browsers use
 *   icon.png          512, the raster fallback and the Android home-screen tile
 *   apple-icon.png    180, the iOS home-screen tile
 *   favicon.ico       16 + 32 + 48 as PNG-in-ICO, for anything that asks for
 *                     /favicon.ico by name rather than reading the <head>
 *
 *   npm run icon -w apps/client
 */
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.resolve(here, "../../../packages/assets/public/images/apru-lockup.svg");
const APP = path.resolve(here, "../app");

/** The square, in its own units, and the margin the type keeps from its edge. */
const SIZE = 100;
const MARGIN = 8;
/** Line gaps as a fraction of the blue lines' height. The lockup's own are 0.57 and 0.65. */
const GAP_1 = 0.3;
const GAP_2 = 0.36;

const svgText = await readFile(SOURCE, "utf8");
const fills = Object.fromEntries(
  [...svgText.matchAll(/\.(cls-\d+)\s*\{\s*fill:\s*(#[0-9a-fA-F]{3,6})/g)].map((m) => [m[1], m[2]]),
);
const glyphs = [...svgText.matchAll(/<(path|polygon) class="(cls-\d+)" (?:d|points)="([^"]+)"\/>/g)].map(
  (m) => ({ tag: m[1], fill: fills[m[2]], data: m[3] }),
);
if (glyphs.length === 0) throw new Error("no glyph paths found in " + SOURCE);

const draw = (g, fill) =>
  g.tag === "path"
    ? `<path fill="${fill ?? g.fill}" d="${g.data}"/>`
    : `<polygon fill="${fill ?? g.fill}" points="${g.data}"/>`;

/** The ink box of a set of glyphs, in the lockup's units, measured off a render. */
async function inkBox(list) {
  const D = 40; // pixels per unit -- fine enough that the box is exact to 1/40
  const [, , vw, vh] = svgText.match(/viewBox="([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vw} ${vh}" width="${vw * D}" height="${vh * D}">` +
    list.map((g) => draw(g, "#000")).join("") +
    `</svg>`;
  const { info } = await sharp(Buffer.from(svg)).ensureAlpha().trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  return { x: -info.trimOffsetLeft / D, y: -info.trimOffsetTop / D, w: info.width / D, h: info.height / D };
}

for (const g of glyphs) g.box = await inkBox([g]);

// Lines: glyphs whose ink boxes overlap on y belong to the same line.
const lines = [];
for (const g of [...glyphs].sort((a, b) => a.box.y - b.box.y)) {
  const line = lines.find((l) => g.box.y < l.bottom && g.box.y + g.box.h > l.top);
  if (line) {
    line.glyphs.push(g);
    line.top = Math.min(line.top, g.box.y);
    line.bottom = Math.max(line.bottom, g.box.y + g.box.h);
  } else {
    lines.push({ glyphs: [g], top: g.box.y, bottom: g.box.y + g.box.h });
  }
}
if (lines.length !== 3) throw new Error("expected three lines in the lockup, found " + lines.length);
for (const l of lines) l.glyphs.sort((a, b) => a.box.x - b.box.x);

const [first, year, city] = lines;
const hyphen = first.glyphs.findIndex((g) => g.box.h < (first.bottom - first.top) / 2);
if (hyphen < 0) throw new Error("no hyphen on the first line of the lockup");
const scl = first.glyphs.slice(hyphen + 1);

/** Places glyphs so their ink box lands at (x, y) at the given scale. */
async function place(list, x, y, scale) {
  const box = await inkBox(list);
  return (
    `<g transform="translate(${r(x)} ${r(y)}) scale(${r(scale)}) translate(${r(-box.x)} ${r(-box.y)})">` +
    list.map((g) => draw(g)).join("") +
    `</g>`
  );
}
const r = (n) => Math.round(n * 1000) / 1000;

const width = SIZE - 2 * MARGIN;
const yearBox = await inkBox(year.glyphs);
const cityBox = await inkBox(city.glyphs);
const blue = width / yearBox.w;
const orange = width / cityBox.w;
const blueH = yearBox.h * blue;
const orangeH = cityBox.h * orange;
const gap1 = blueH * GAP_1;
const gap2 = blueH * GAP_2;
const stack = blueH + gap1 + blueH + gap2 + orangeH;
const top = (SIZE - stack) / 2;

const mark =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">` +
  `<rect width="${SIZE}" height="${SIZE}" fill="#fff"/>` +
  (await place(scl, MARGIN, top, blue)) +
  (await place(year.glyphs, MARGIN, top + blueH + gap1, blue)) +
  (await place(city.glyphs, MARGIN, top + blueH + gap1 + blueH + gap2, orange)) +
  `</svg>`;

const rasterise = (px) => sharp(Buffer.from(mark.replace("<svg ", `<svg width="${px}" height="${px}" `)));
const raster = (px) => rasterise(px).png({ compressionLevel: 9, palette: true }).toBuffer();
/*
 * The .ico entries stay RGBA rather than paletted: Next reads the file at build
 * time for its dimensions, and its decoder rejects a PNG-in-ICO in any other
 * layout ("The PNG is not in RGBA format").
 */
const rasterRGBA = (px) => rasterise(px).ensureAlpha().png({ compressionLevel: 9 }).toBuffer();

/**
 * An .ico is a 6-byte header, a 16-byte directory entry per image, then the
 * images. Since Vista the images may be whole PNG files, which every browser
 * reads, so there is no BMP to assemble.
 */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);
  const dir = Buffer.alloc(16 * images.length);
  let offset = header.length + dir.length;
  images.forEach(({ px, png }, i) => {
    const e = i * 16;
    dir.writeUInt8(px >= 256 ? 0 : px, e); // width, 0 meaning 256
    dir.writeUInt8(px >= 256 ? 0 : px, e + 1); // height
    dir.writeUInt8(0, e + 2); // palette size: none
    dir.writeUInt8(0, e + 3); // reserved
    dir.writeUInt16LE(1, e + 4); // colour planes
    dir.writeUInt16LE(32, e + 6); // bits per pixel
    dir.writeUInt32LE(png.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  return Buffer.concat([header, dir, ...images.map((i) => i.png)]);
}

await writeFile(path.join(APP, "icon.svg"), mark + "\n");
await writeFile(path.join(APP, "icon.png"), await raster(512));
await writeFile(path.join(APP, "apple-icon.png"), await raster(180));
await writeFile(
  path.join(APP, "favicon.ico"),
  ico(await Promise.all([16, 32, 48].map(async (px) => ({ px, png: await rasterRGBA(px) })))),
);
console.log(
  "icon: " + scl.length + " glyphs over " + year.glyphs.length + " over " + city.glyphs.length +
    ", stack " + r(stack) + "/" + SIZE + " -- icon.svg, icon.png 512, apple-icon.png 180, favicon.ico 16+32+48",
);
