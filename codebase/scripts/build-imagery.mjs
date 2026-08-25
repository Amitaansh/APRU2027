/**
 * Imagery pipeline (Design Brief §05).
 *
 * Static export disables Next's image optimizer, so every asset has to arrive
 * pre-optimized. This script also applies the signature treatment: satellite /
 * terrain imagery as a grainy two-colour dither, orange over blue. The grain is
 * the point — it comes from an ordered Bayer threshold, not a smooth gradient.
 *
 *   npm run imagery
 *
 * Re-run it when the final art lands; nothing else in the build changes.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

sharp.cache(false);

const SOURCE = process.env.HERO_SOURCE ?? "D:/APRU/DOA-APRU-MainImage.jpg";
const ICON_SOURCE = process.env.ICON_SOURCE ?? "D:/APRU/apru-icon.jpg";
const OUT = path.join(process.cwd(), "public", "images");
const APP = path.join(process.cwd(), "app");

const WIDTHS = [768, 1280, 1920];
const HERO_RATIO = 16 / 9;

// Duotone pair — orange ink over a deep brand blue.
const INK = [0xf8, 0x9c, 0x2c];
const GROUND = [0x14, 0x3a, 0x5c];

// Ordered 8x8 Bayer matrix. Ordered dithering keeps a regular grain that
// survives AVIF/WebP compression far better than error diffusion does.
const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

/** Greyscale raw buffer to a two-colour dithered RGB buffer. */
function dither(grey, width, height) {
  const rgb = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const value = grey[y * width + x];
      const threshold = ((BAYER[y % 8][x % 8] + 0.5) / 64) * 255;
      const colour = value > threshold ? INK : GROUND;
      const i = (y * width + x) * 3;
      rgb[i] = colour[0];
      rgb[i + 1] = colour[1];
      rgb[i + 2] = colour[2];
    }
  }
  return rgb;
}

async function duotone(width) {
  const height = Math.round(width / HERO_RATIO);
  const { data, info } = await sharp(SOURCE, { limitInputPixels: false })
    .resize(width, height, { fit: "cover", position: "attention" })
    .greyscale()
    // Lift contrast before thresholding, or the dither turns to mud.
    .normalise()
    .linear(1.15, -12)
    .raw()
    .toBuffer({ resolveWithObject: true });

  return sharp(dither(data, info.width, info.height), {
    raw: { width: info.width, height: info.height, channels: 3 },
  });
}

async function buildHero() {
  for (const width of WIDTHS) {
    const image = await duotone(width);
    await image
      .clone()
      .avif({ quality: 58, effort: 6 })
      .toFile(path.join(OUT, "hero-" + width + ".avif"));
    await image
      .clone()
      .webp({ quality: 62 })
      .toFile(path.join(OUT, "hero-" + width + ".webp"));
    console.log("hero " + width + "px written");
  }
}

/**
 * Open Graph card. The type is drawn as SVG over the duotone art — the card is
 * the first impression when a link is shared across institutions, so it has to
 * carry the brand rather than fall back to a bare screenshot.
 *
 * Note: SVG text renders with whatever font the host has. Archivo is not
 * installed system-wide here, so this falls back to a bold grotesque. Install
 * Archivo (or hand off final art) and re-run for an exact match.
 */
async function buildOG() {
  const W = 1200;
  const H = 630;
  const height = Math.round(W / HERO_RATIO);
  const { data, info } = await sharp(SOURCE, { limitInputPixels: false })
    .resize(W, height, { fit: "cover", position: "attention" })
    .greyscale()
    .normalise()
    .linear(1.15, -12)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const art = await sharp(dither(data, info.width, info.height), {
    raw: { width: info.width, height: info.height, channels: 3 },
  })
    .resize(W, H, { fit: "cover" })
    .png()
    .toBuffer();

  const overlay = Buffer.from(
    [
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '">',
      '<rect width="' + W + '" height="' + H + '" fill="#0c0c0d" opacity="0.55"/>',
      '<rect x="0" y="0" width="' + W + '" height="8" fill="#f89c2c"/>',
      '<text x="64" y="150" fill="#f4f2ec" font-family="Archivo, Arial Black, Helvetica, sans-serif" font-size="26" letter-spacing="4">THE 10TH CONFERENCE OF APRU-SCL</text>',
      '<text x="64" y="330" fill="#f4f2ec" font-family="Archivo, Arial Black, Helvetica, sans-serif" font-weight="900" font-size="132" letter-spacing="-2">BRIDGING</text>',
      '<text x="64" y="460" fill="#f4f2ec" font-family="Archivo, Arial Black, Helvetica, sans-serif" font-weight="900" font-size="132" letter-spacing="-2">RESILIENCE<tspan fill="#f89c2c">(S)</tspan></text>',
      '<text x="64" y="560" fill="#f89c2c" font-family="Archivo, Arial, sans-serif" font-size="28" letter-spacing="3">21-23 MAY 2027 &#183; SINGAPORE &#183; NUS</text>',
      "</svg>",
    ].join(""),
  );

  await sharp(art)
    .composite([{ input: overlay }])
    .png({ quality: 90 })
    .toFile(path.join(OUT, "..", "og", "default.png"));
  console.log("og card written");
}

async function buildIcons() {
  if (!existsSync(ICON_SOURCE)) {
    console.log("no icon source at " + ICON_SOURCE + " — skipping icons");
    return;
  }
  await sharp(ICON_SOURCE).resize(512, 512, { fit: "cover" }).png().toFile(path.join(APP, "icon.png"));
  await sharp(ICON_SOURCE).resize(180, 180, { fit: "cover" }).png().toFile(path.join(APP, "apple-icon.png"));
  console.log("icons written");
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir(path.join(OUT, "..", "og"), { recursive: true });
  if (!process.env.SKIP_HERO) await buildHero();
  await buildOG();
  await buildIcons();
  await writeFile(
    path.join(OUT, "SOURCE.md"),
    [
      "# Generated imagery",
      "",
      "Everything in this folder is produced by `npm run imagery`. Do not hand-edit.",
      "",
      "- Source: " + SOURCE,
      "- Treatment: greyscale, contrast lift, ordered 8x8 Bayer dither, two-colour map (#f89c2c over #143a5c) — Design Brief §05.",
      "- Widths: " + WIDTHS.join(", ") + " (AVIF + WebP), OG card 1200x630 PNG.",
      "",
      "Re-run after final art is supplied.",
      "",
    ].join("\n"),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
