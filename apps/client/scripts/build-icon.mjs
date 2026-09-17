/**
 * The site icon's raster fallbacks.
 *
 * app/icon.svg is the conference lockup -- APRU-SCL / 2027 / SINGAPORE -- on
 * a white square, as supplied, and it is served exactly as it is: Next lists
 * it with sizes="any", which is what modern browsers take. This script only
 * rasterises that file for everything that cannot take an SVG:
 *
 *   icon.png          512, the raster fallback and the Android home-screen tile
 *   apple-icon.png    180, the iOS home-screen tile
 *   favicon.ico       16 + 32 + 48 as PNG-in-ICO, for anything that asks for
 *                     /favicon.ico by name rather than reading the <head>
 *
 * Re-run after replacing icon.svg:
 *
 *   npm run icon -w apps/client
 */
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../app");
const SOURCE = path.join(APP, "icon.svg");

const svg = await readFile(SOURCE, "utf8");
if (!/<svg[^>]*viewBox=/.test(svg)) throw new Error(SOURCE + " has no viewBox to scale from");
if (/<svg[^>]*\swidth=/.test(svg)) throw new Error(SOURCE + " declares a width; it should scale to sizes=\"any\"");

/** The SVG at px square. It carries no width or height of its own, so the size is set here. */
const rasterise = (px) => sharp(Buffer.from(svg.replace("<svg ", `<svg width="${px}" height="${px}" `)));
const png = (px) => rasterise(px).png({ compressionLevel: 9, palette: true }).toBuffer();
/*
 * The .ico entries stay RGBA rather than paletted: Next reads the file at build
 * time for its dimensions, and its decoder rejects a PNG-in-ICO in any other
 * layout ("The PNG is not in RGBA format").
 */
const pngRGBA = (px) => rasterise(px).ensureAlpha().png({ compressionLevel: 9 }).toBuffer();

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
  images.forEach(({ px, data }, i) => {
    const e = i * 16;
    dir.writeUInt8(px >= 256 ? 0 : px, e); // width, 0 meaning 256
    dir.writeUInt8(px >= 256 ? 0 : px, e + 1); // height
    dir.writeUInt8(0, e + 2); // palette size: none
    dir.writeUInt8(0, e + 3); // reserved
    dir.writeUInt16LE(1, e + 4); // colour planes
    dir.writeUInt16LE(32, e + 6); // bits per pixel
    dir.writeUInt32LE(data.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, dir, ...images.map((i) => i.data)]);
}

await writeFile(path.join(APP, "icon.png"), await png(512));
await writeFile(path.join(APP, "apple-icon.png"), await png(180));
await writeFile(
  path.join(APP, "favicon.ico"),
  ico(await Promise.all([16, 32, 48].map(async (px) => ({ px, data: await pngRGBA(px) })))),
);
console.log("icon: rasterised icon.svg -- icon.png 512, apple-icon.png 180, favicon.ico 16+32+48");
