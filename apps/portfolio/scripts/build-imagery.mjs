/**
 * Imagery pipeline (Design Brief §05).
 *
 * Static export disables Next's image optimizer, so every asset has to arrive
 * pre-optimized.
 *
 * The hero is the supplied key art and nothing else — see buildHero. The dither
 * below is still what draws the Open Graph card, where the art is a ground for
 * type rather than the statement itself: a grainy two-colour threshold, orange
 * over blue, from an ordered Bayer matrix rather than a smooth gradient.
 *
 *   npm run imagery
 *
 * Re-run it when the final art lands; nothing else in the build changes.
 */
import sharp from "sharp";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

sharp.cache(false);

const SOURCE = process.env.HERO_SOURCE ?? "D:/APRU/DOA-APRU-MainImage.jpg";
const ICON_SOURCE = process.env.ICON_SOURCE ?? "D:/APRU/apru-icon.jpg";
/*
 * Derivatives are written to the shared asset package, not into this app: both
 * editions serve the same artwork, and packages/assets/sync.mjs mirrors it into
 * each app's public/ at build time.
 */
const OUT = path.join(process.cwd(), "..", "..", "packages", "assets", "public", "images");
const APP = path.join(process.cwd(), "app");
/** The halo plates are the portfolio edition's alone, so they stay app-local. */
const PUB = path.join(process.cwd(), "public");

const PORTRAIT_SOURCE = process.env.PORTRAIT_SOURCE ?? "D:/APRU/committee-source";

const WIDTHS = [768, 1280, 1920];
/*
 * The home key art (3 Sep drop). Two forms of the same 2320x1305 frame:
 *
 *   HOME_SOURCE is a 231 MB SVG -- an 11811x7874 base64 PNG drawn at scale(.2)
 *   with the type set in vector over it. It is the better master, because the
 *   type stays resolution-independent and the raster is oversampled 5x against
 *   the artboard, so it survives a 2560 render that the flatten cannot.
 *
 *   HOME_FLAT is the designer's own 2321x1305 CMYK flatten of that file. It is
 *   the fallback if librsvg cannot hold the 372 MB decode. Measured against the
 *   vector render it agrees to within 6/255 per channel, so nothing is lost but
 *   the headroom above 1920.
 *
 * Neither is in the repo -- see .gitignore. Point HOME_SOURCE elsewhere, or let
 * both go missing, and this step skips rather than failing the run.
 */
const HOME_DROP = "D:/APRU/wetransfer_doa-apru-files-3-september_2026-09-03_0357";
const HOME_SOURCE = process.env.HOME_SOURCE ?? HOME_DROP + "/SVG/SVG/SVG/Asset 1.svg";
const HOME_FLAT = process.env.HOME_FLAT ?? HOME_DROP + "/SVG/1x/Asset 1-100.jpg";
/*
 * One rung above the hero's ladder. The hero is a band; this frame is full
 * viewport and carries type, so it is the one image on the site where a 2x
 * laptop display can actually resolve the extra pixels.
 */
const HOME_WIDTHS = [768, 1280, 1920, 2560];
const HOME_PORTRAIT_WIDTHS = [480, 768, 1080, 1440];
/** The SVG artboard, which is what `density` is reckoned against. */
const HOME_ARTBOARD = 2320;
/** Committee portraits: 4:5, one size, big enough for the 110rem box at 4x. */
const PORTRAIT = { w: 440, h: 550 };
/**
 * The portraits are desaturated to match the page they sit on. Set to false and
 * re-run to publish them in colour.
 */
const PORTRAIT_MONO = true;
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

/**
 * The hero: the supplied art, resized and encoded, and nothing else.
 *
 * It used to run through the dither, which cost it its colour. The key art is
 * already a two-colour piece; greyscaling it threw that away and the Bayer map
 * then re-derived a palette of its own — a deep navy under a muted orange, in
 * place of the cerulean and saffron actually drawn. So no treatment here.
 *
 * The source is a CMYK JPEG carrying a 640 KB profile; sharp transforms through
 * it on the way to sRGB. The 3:2 frame gives up 11% of its height to 16:9, and
 * that band is taken from the centre rather than by `position: "attention"` —
 * entropy picks a different crop whenever the art is redrawn, and this image has
 * no subject for it to find.
 *
 * Encoded from one decode: the source is 134 MB, so it is read and resized once
 * and both formats are written off the result.
 */
async function buildHero() {
  for (const width of WIDTHS) {
    const height = Math.round(width / HERO_RATIO);
    const { data, info } = await sharp(SOURCE, { limitInputPixels: false })
      .resize(width, height, { fit: "cover", position: "centre" })
      .toColourspace("srgb")
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const raw = { raw: { width: info.width, height: info.height, channels: info.channels } };

    // Quality measured rather than guessed. The art is dense speckle, which is
    // the worst case for a transform codec: at 1920 the AVIF runs 433 KB at q45,
    // 684 KB at q55 and 1.29 MB at q72. q55 holds the fine grain against q72 at
    // half the bytes; q45 visibly thins the orange flecks in the blue field.
    await sharp(data, raw)
      .avif({ quality: 55, effort: 6 })
      .toFile(path.join(OUT, "hero-" + width + ".avif"));
    await sharp(data, raw)
      .webp({ quality: 80 })
      .toFile(path.join(OUT, "hero-" + width + ".webp"));
    console.log("hero " + width + "px written");
  }
}

/**
 * The home key visual, as imagery only.
 *
 * WHAT CHANGED. This used to write the designer's finished poster: the title,
 * the series line, the dates and both lockups flattened into the pixels. The
 * page assembles that composition in the browser now -- live text in Atlas
 * Grotesk over linked SVG lockups -- so what this writes is the artwork alone,
 * carrying nothing that means anything. The type lives in
 * packages/ui/src/KeyVisual.tsx, set to the geometry in
 * packages/styles/key-visual.css.
 *
 * WHICH CROP -- not a guess, and not the centre. The master SVG places this
 * raster with its own transform:
 *
 *   <image width="11811" height="7874" transform="translate(-15.45 -188.61) scale(.2)">
 *
 * inside a 2320x1305 viewBox, so the window the comp actually shows is exactly
 * (77.25, 943.05) 11600x6525 of the plate, which is 16:9 to four decimals.
 * Against the whole plate that reads as object-position 36.6% 69.9%. It is
 * baked into the crop here rather than set in CSS, because shipping the window
 * is fewer bytes than shipping the plate and then positioning it.
 *
 * WHICH SOURCE -- the sRGB raster embedded in the master, not the CMYK print
 * file. They are the same artwork, but landing-elements/DOA-APRU-MainImage.jpg
 * is FOGRA39, and even a correct transform through its embedded profile lands a
 * mean 9.5/255 away from the designer's own blue, worst case 42. That file is
 * the fallback, with that shift, when the master is not to hand.
 */

/** The raster's size as the master declares it, which is what the crop is in. */
const HOME_PLATE_BOX = { w: 11811, h: 7874 };
/** The master's own placement of it: viewBox, scale and translate. */
const HOME_VIEW = { w: 2320, h: 1305, scale: 0.2, tx: -15.45, ty: -188.61 };
/** Extracted once from the 231 MB master and kept, because it is a 174 MB decode. */
const HOME_PLATE_CACHE = path.join(process.cwd(), ".cache", "home-plate.png");
const HOME_PLATE_FALLBACK = process.env.HOME_PLATE ?? "D:/APRU/landing-elements/DOA-APRU-MainImage.jpg";

/*
 * QUALITY -- measured, not chosen.
 *
 * The artwork is a two-colour dither whose grain lives almost entirely in R and
 * B: high-pass std-dev 30.8 and 26.7 against 9.0 for G, because orange over
 * blue is an R-against-B swing with G nearly constant. That makes it a chroma
 * texture, and chroma is the first thing a codec spends.
 *
 *   AVIF at 1920   q50  75% of the grain kept   534 KB
 *                  q55  80%                     661 KB
 *                  q60  88%                     872 KB   <- the knee
 *                  q65  90%                     998 KB
 *                  q70  94%                    1180 KB
 *
 * The slope below the knee is +16 points of grain per 10 quality; above it, +4.
 * So q60. Under it this texture goes suddenly rather than gradually, which is
 * the failure mode a dither has and a photograph does not.
 *
 * WebP gets a different rule because it has a different ceiling. Its lossy mode
 * is always YUV 4:2:0, so it halves precisely the chroma this image is made of:
 * it keeps ~40% of the R/B grain at q55 and ~41% at q93, for 498 KB against
 * 1177 KB. Quality buys almost no fidelity here, so it is set at the cheap end
 * of its own flat curve instead of at a number that reads as generous.
 * (smartSubsample lifts it to 51% for 841 KB; lossless is 4.4 MB.) It is there
 * for browsers that cannot decode AVIF, and for those the grain is gone
 * whatever we spend on it.
 */
const HOME_AVIF_Q = 60;
const HOME_WEBP_Q = 70;
/*
 * The 2560 rung is the exception. It is only ever fetched by a 2x display, where
 * a device pixel is about half the size it is on the rungs below — so the grain
 * that q60 is buying there is being drawn at a scale the eye is not resolving.
 * Measured that way (both reference and encode reduced by two before the grain
 * is counted, as a stand-in for the smaller pixel) the curve is flat from q50:
 *
 *   q40  586 KB   92.5 / 96.2 % of the grain      q55 1167 KB  97.9 / 97.4 %
 *   q45  749 KB   95.5 / 97.9 %                   q60 1509 KB  97.4 / 97.1 %
 *   q50  950 KB   97.3 / 99.1 %   <- flat past here
 *
 * So q60 at this width costs 559 KB and returns nothing. This is a perceptual
 * argument rather than a full-resolution one — at 1:1 the extra grain is really
 * there — but it is the scale the rung is actually looked at.
 */
const HOME_AVIF_Q_2X = 50;

/**
 * Pull the plate out of the master SVG, once.
 *
 * The master is a 231 MB file that is one base64 data URI and a few hundred
 * vector paths. Reading it into a string to run a regex over would cost about
 * half a gigabyte before decoding starts, so this streams it: skip to the
 * payload, decode in 4-character-aligned chunks, stop at the closing quote.
 */
async function extractHomePlate() {
  const { createWriteStream, createReadStream } = await import("node:fs");
  const { open } = await import("node:fs/promises");
  const marker = Buffer.from("base64,");
  const fh = await open(HOME_SOURCE, "r");
  try {
    const head = Buffer.alloc(4096);
    await fh.read(head, 0, 4096, 0);
    const at = head.indexOf(marker);
    if (at < 0) return null;
    await mkdir(path.dirname(HOME_PLATE_CACHE), { recursive: true });
    const out = createWriteStream(HOME_PLATE_CACHE);
    const src = createReadStream(HOME_SOURCE, { start: at + marker.length });
    let carry = "";
    let done = false;
    for await (const chunk of src) {
      if (done) break;
      let text = carry + chunk.toString("latin1");
      const quote = text.indexOf('"');
      if (quote >= 0) {
        text = text.slice(0, quote);
        done = true;
      }
      const usable = done ? text.length - (text.length % 4) : text.length - (text.length % 4);
      carry = text.slice(usable);
      out.write(Buffer.from(text.slice(0, usable), "base64"));
    }
    await new Promise((res, rej) => out.end((err) => (err ? rej(err) : res())));
    return HOME_PLATE_CACHE;
  } finally {
    await fh.close();
  }
}

/** The plate in the designer's own sRGB, or the print file if that is all there is. */
async function homePlate() {
  if (existsSync(HOME_PLATE_CACHE)) return { src: HOME_PLATE_CACHE, master: true };
  if (existsSync(HOME_SOURCE)) {
    try {
      const got = await extractHomePlate();
      if (got) return { src: got, master: true };
    } catch (error) {
      console.log("home: could not read the master (" + error.message + ")");
    }
  }
  if (existsSync(HOME_PLATE_FALLBACK)) {
    console.log("home: using the CMYK print plate — colours run ~9/255 warm of the master");
    return { src: HOME_PLATE_FALLBACK, master: false };
  }
  return null;
}

/** The comp's window on the plate, in the plate's real pixels. */
function homeCrops(width, height) {
  const kx = width / HOME_PLATE_BOX.w;
  const ky = height / HOME_PLATE_BOX.h;
  const { scale: s, tx, ty, w: vw, h: vh } = HOME_VIEW;
  const landscape = {
    left: Math.round((-tx / s) * kx),
    top: Math.round((-ty / s) * ky),
    width: Math.round((vw / s) * kx),
    height: Math.round((vh / s) * ky),
  };
  /*
   * Portrait is its own cut of the plate, never an upscale of the landscape
   * one: a phone asking a 16:9 source to cover a 2:3 box drives it about 3x and
   * the grain turns to mush. 2:3, the full height of the plate, centred on the
   * landscape window so the two read as the same piece of artwork.
   */
  const pw = Math.round(height * (2 / 3));
  const portrait = {
    left: Math.max(0, Math.min(width - pw, Math.round(landscape.left + landscape.width / 2 - pw / 2))),
    top: 0,
    width: pw,
    height,
  };
  return { landscape, portrait };
}

async function buildHome() {
  const plate = await homePlate();
  if (!plate) {
    console.log("no home plate (set HOME_SOURCE or HOME_PLATE) — skipping home");
    return;
  }
  const meta = await sharp(plate.src, { limitInputPixels: false, unlimited: true }).metadata();
  const { landscape, portrait } = homeCrops(meta.width, meta.height);
  console.log("home plate " + meta.width + "x" + meta.height + (plate.master ? " (master)" : " (print file)"));

  const cut = async (box, widths, ratio, stem) => {
    for (const width of widths) {
      const height = Math.round(width / ratio);
      const { data, info } = await sharp(plate.src, { limitInputPixels: false, unlimited: true })
        .extract(box)
        .resize(width, height, { fit: "fill" })
        .toColourspace("srgb")
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const raw = { raw: { width: info.width, height: info.height, channels: info.channels } };
      await sharp(data, raw)
        .avif({ quality: width >= 2560 ? HOME_AVIF_Q_2X : HOME_AVIF_Q, effort: 6 })
        .toFile(path.join(OUT, stem + width + ".avif"));
      /*
       * No WebP above 1920. It is the fallback for browsers that cannot decode
       * AVIF, and a browser that old is not driving a 2560 display; writing it
       * anyway ships a megabyte nothing ever asks for.
       */
      if (width <= 1920) {
        await sharp(data, raw)
          .webp({ quality: HOME_WEBP_Q })
          .toFile(path.join(OUT, stem + width + ".webp"));
      }
      console.log("  " + stem + width + " (" + info.width + "x" + info.height + ")");
    }
  };

  await cut(landscape, HOME_WIDTHS, HERO_RATIO, "home-");
  await cut(portrait, HOME_PORTRAIT_WIDTHS, 2 / 3, "home-portrait-");
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

/**
 * Committee portraits.
 *
 * The nine sources are the DOA staff studio set: vertical, dark-ground, shot at
 * wildly different sizes (207px wide to 1772px). Three things follow from that.
 *
 * TOP-ANCHORED. Every source is a seated or standing three-quarter portrait with
 * the head in the upper third, so a square-ish crop taken from the top lands the
 * face between a quarter and a third of the way down in all nine — measured, not
 * assumed. `position: "attention"` was the alternative and is rejected for the
 * same reason it is on the hero: it re-picks a different crop per image, and here
 * that means nine faces sitting at nine different heights.
 *
 * ONE OUTPUT SIZE. The box is 110rem wide, so 440px covers it to 4x and there is
 * no srcset to carry. The narrowest source enlarges about 2x to reach it, which
 * is why the resize is followed by a light sharpen — at this display size that
 * reads as crisp rather than as upscaled.
 *
 * DESATURATED. Six studio setups, six colour temperatures; the page below the
 * hero is monochrome anyway (see components/home/Hero.tsx). Greyscale makes the
 * set look like one commission and lets the monogram tiles that stand in for the
 * three members with no staff photo sit beside them without clashing.
 */
async function buildPortraits() {
  if (!existsSync(PORTRAIT_SOURCE)) {
    console.log("no portrait source at " + PORTRAIT_SOURCE + " — skipping portraits");
    return;
  }
  const dir = path.join(OUT, "committee");
  await mkdir(dir, { recursive: true });
  const sources = (await readdir(PORTRAIT_SOURCE)).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
  for (const file of sources) {
    const slug = file.replace(/\.[^.]+$/, "");
    let pipe = sharp(path.join(PORTRAIT_SOURCE, file))
      .resize(PORTRAIT.w, PORTRAIT.h, { fit: "cover", position: "top" })
      .sharpen({ sigma: 0.6 });
    if (PORTRAIT_MONO) pipe = pipe.greyscale();
    const { data, info } = await pipe.toColourspace("srgb").raw().toBuffer({ resolveWithObject: true });
    const raw = { raw: { width: info.width, height: info.height, channels: info.channels } };
    await sharp(data, raw).avif({ quality: 60, effort: 6 }).toFile(path.join(dir, slug + ".avif"));
    await sharp(data, raw).webp({ quality: 82 }).toFile(path.join(dir, slug + ".webp"));
    console.log("portrait " + slug + " written");
  }
  return sources.length;
}

/**
 * Sponsor and partner logos.
 *
 * Five marks from five brand teams, in five formats, at five aspect ratios.
 * They have to arrive on the page looking like one set, which needs two things
 * doing to them.
 *
 * MONOCHROME, BY CURVE, NOT BY SILHOUETTE. Flattening each mark to a solid
 * black shape via its alpha would be simpler and would destroy JTC, whose
 * wordmark is white knocked out of a solid blob — the letters would go black on
 * black. So the ink is pushed toward black with a gamma curve on luminance
 * instead: the JTC blob and the SingHealth brushstroke land near-black, while
 * every knockout and speckle stays white. White stays white at any gamma, which
 * is the property that makes this safe.
 *
 * EQUAL AREA, NOT EQUAL HEIGHT. The marks run from 3.1:1 (Henning Larsen) to
 * 0.68:1 (Tierra). Matching heights would make the wide one enormous and the
 * tall one a stamp; matching areas is what reads as "the same size" to the eye.
 * The caps then stop a very wide or very tall mark from running away.
 */
const SPONSOR_SOURCE =
  process.env.SPONSOR_SOURCE ??
  "C:/Users/amita/National University of Singapore/Chee Qian Ning - APRU 2027/Sponsor and Partners Logo";

/**
 * Every mark is written onto a canvas of IDENTICAL size, scaled to a matched
 * optical area within it and centred. That is what lets the page render the set
 * with one box size and still have them look evenly weighted — sizing by height
 * in CSS would throw the area matching away and make the wide marks huge.
 */
const SPONSOR_CANVAS_W = 640;
const SPONSOR_CANVAS_H = 400;
/** Geometric mean each trimmed mark is scaled to, before the caps apply. */
const SPONSOR_SIZE = 300;
const SPONSOR_MAX_W = 580;
const SPONSOR_MAX_H = 360;
/** Pushes mid-tone brand colour to near-black and leaves white untouched. */
const SPONSOR_GAMMA = 3.9;

const SPONSORS = [
  { slug: "ground-up-initiative", name: "Ground-Up Initiative", file: "GUI/GUI Logo 1C-01.png" },
  { slug: "henning-larsen", name: "Henning Larsen", file: "Henning Larsen/HL Logo Black RGB.png" },
  { slug: "jtc", name: "JTC", file: "JTC/JTC Logo_Tagline_RGB for Digital.png" },
  // EPS: libvips has no PostScript delegate here, so the mark comes from the
  // TIFF preview Illustrator embeds in the file. 448x332, which is enough for a
  // logo row but is the reason this one is the least sharp of the five — ask
  // the brand team for a PNG or SVG if it ever needs to run larger.
  { slug: "singhealth", name: "SingHealth", file: "SingHealth/SingHealth_logo_CMYK.eps", eps: true },
  // No alpha channel: black line art on a white JPEG ground. Its coverage is
  // derived from luminance below rather than read from the file.
  { slug: "tierra-design", name: "Tierra Design", file: "Tierra Design/Tierra Design_Black (HighRes).jpg", flat: true },
];

/** Pull the TIFF preview out of a DOS-header (C5D0D3C6) binary EPS. */
async function epsPreview(file) {
  const buffer = await readFile(file);
  if (buffer.readUInt32LE(0) !== 0xc6d3d0c5) {
    throw new Error("not a binary EPS with a DOS header: " + file);
  }
  const offset = buffer.readUInt32LE(20);
  const length = buffer.readUInt32LE(24);
  if (!offset || !length) throw new Error("EPS carries no TIFF preview: " + file);
  return buffer.subarray(offset, offset + length);
}

async function buildSponsors() {
  if (!existsSync(SPONSOR_SOURCE)) {
    console.log("no sponsor source at " + SPONSOR_SOURCE + " — skipping sponsors");
    return 0;
  }
  const dir = path.join(OUT, "sponsors");
  await mkdir(dir, { recursive: true });

  // out = 255 * (in/255)^gamma, precomputed.
  const curve = new Uint8Array(256);
  for (let i = 0; i < 256; i += 1) {
    curve[i] = Math.round(255 * Math.pow(i / 255, SPONSOR_GAMMA));
  }

  let written = 0;
  for (const sponsor of SPONSORS) {
    const source = sponsor.eps
      ? await epsPreview(path.join(SPONSOR_SOURCE, sponsor.file))
      : path.join(SPONSOR_SOURCE, sponsor.file);

    // failOn:'none' — the embedded previews carry warning-level TIFF tags that
    // would otherwise abort the read.
    const { data, info } = await sharp(source, { failOn: "none" })
      .ensureAlpha()
      .toColourspace("srgb")
      .raw()
      .toBuffer({ resolveWithObject: true });

    const px = info.width * info.height;
    const out = Buffer.alloc(px * 4);
    for (let i = 0; i < px; i += 1) {
      const s = i * info.channels;
      const luma = Math.round(
        0.2126 * data[s] + 0.7152 * data[s + 1] + 0.0722 * data[s + 2],
      );
      const ink = curve[luma];
      out[i * 4] = ink;
      out[i * 4 + 1] = ink;
      out[i * 4 + 2] = ink;
      // A flat source has no alpha worth reading: white is the page, so
      // coverage is the inverse of luminance and the ink itself is black.
      out[i * 4 + 3] = sponsor.flat ? 255 - luma : data[s + 3];
    }

    const trimmed = await sharp(out, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .trim({ threshold: 1 })
      .toBuffer({ resolveWithObject: true });

    const { width: tw, height: th } = trimmed.info;
    const ratio = tw / th;
    let w = Math.round(Math.sqrt(SPONSOR_SIZE * SPONSOR_SIZE * ratio));
    let h = Math.round(w / ratio);
    if (h > SPONSOR_MAX_H) {
      h = SPONSOR_MAX_H;
      w = Math.round(h * ratio);
    }
    if (w > SPONSOR_MAX_W) {
      w = SPONSOR_MAX_W;
      h = Math.round(w / ratio);
    }

    const scaled = await sharp(trimmed.data, {
      raw: {
        width: trimmed.info.width,
        height: trimmed.info.height,
        channels: trimmed.info.channels,
      },
    })
      .resize(w, h, { fit: "fill" })
      .png()
      .toBuffer();

    const canvas = sharp({
      create: {
        width: SPONSOR_CANVAS_W,
        height: SPONSOR_CANVAS_H,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    }).composite([{ input: scaled, gravity: "centre" }]);

    const flat = await canvas.png().toBuffer();
    // WebP first, PNG as the fallback source — the marks are flat black on
    // transparency, where PNG stays honest and small.
    await sharp(flat).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(dir, sponsor.slug + ".webp"));
    await sharp(flat)
      .png({ compressionLevel: 9, palette: true })
      .toFile(path.join(dir, sponsor.slug + ".png"));

    console.log(
      "sponsor " + sponsor.slug + " mark " + w + "x" + h +
        " on " + SPONSOR_CANVAS_W + "x" + SPONSOR_CANVAS_H,
    );
    written += 1;
  }
  return written;
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

/**
 * THE HALO'S TEXTURE.
 *
 * The mark resampled out of (x, y) into (angle, radial position), reconstructed,
 * and written as a ready-to-upload texture. components/brand/Halo.tsx used to do
 * the resample itself, in the browser, at every page load; it is done here now
 * for two reasons.
 *
 * The first is quality. The only artwork of the mark that exists is the icon
 * source at 447px, whose annulus runs from r=89 to r=126 -- a band 37 pixels
 * wide. The halo magnifies that band roughly eight times, and the JPEG's block
 * noise with it. So reconstruct rather than resample: take the DFT of each
 * radial shell, keep HARMONICS of it, and resynthesise. Measured against the
 * source, 64 harmonics recover R^2 = 0.994 -- what is discarded is compression
 * noise, and what is kept is the mark as drawn, evaluable at any resolution.
 *
 * Note which axis is smoothed. Smoothing AROUND the band reaches 0.994;
 * smoothing ACROSS it with a radial polynomial caps out at 0.959 even at order
 * eight, because the radial ramp carries real structure that a low-order model
 * flattens. So the angular axis is band-limited hard and the radial axis gets a
 * three-tap kernel and nothing more.
 *
 * The second reason is that the fit is far too expensive for the main thread,
 * and moving it here also removes the 786k bilinear samples the component used
 * to run at load.
 *
 * The geometry is measured off the source rather than declared, so a new icon
 * needs no constants changed here.
 */
const HALO_TEX = { w: 2048, h: 512 };
const HARMONICS = 64;
const SHELLS = 64;
const RAYS = 2048;
/** Trims the antialiased edge on both sides of the band, in source pixels. */
const EDGE_INSET = 2;

/** Where the annulus is: its centre, and the two radii that bound it. */
function measureAnnulus(data, size, channels) {
  const lum = (x, y) => {
    const i = (y * size + x) * channels;
    return (data[i] + data[i + 1] + data[i + 2]) / 3;
  };
  let sx = 0;
  let sy = 0;
  let n = 0;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (lum(x, y) < 200) {
        sx += x;
        sy += y;
        n += 1;
      }
    }
  }
  if (n === 0) throw new Error("no mark found in the icon source");
  const cx = sx / n;
  const cy = sy / n;

  // Walk out from the centre and take the shells that are dark all the way
  // round. That is the annulus, and it is exact wherever the mark is centred.
  let inner = null;
  let outer = null;
  const steps = 360;
  for (let r = 1; r < size / 2; r += 1) {
    let dark = 0;
    for (let k = 0; k < steps; k += 1) {
      const a = (k / steps) * Math.PI * 2;
      const x = Math.round(cx + Math.cos(a) * r);
      const y = Math.round(cy + Math.sin(a) * r);
      if (x < 0 || y < 0 || x >= size || y >= size) continue;
      if (lum(x, y) < 200) dark += 1;
    }
    const frac = dark / steps;
    if (inner === null && frac > 0.9) inner = r;
    if (inner !== null && frac < 0.5) {
      outer = r;
      break;
    }
  }
  if (inner === null || outer === null) throw new Error("could not measure the annulus");
  return { cx, cy, inner, outer };
}

async function buildHaloTexture() {
  if (!existsSync(ICON_SOURCE)) {
    console.log("no icon source at " + ICON_SOURCE + " - skipping the halo texture");
    return;
  }
  const { data, info } = await sharp(ICON_SOURCE)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const size = info.width;
  const ch = info.channels;
  if (info.height !== size) throw new Error("the icon source must be square");

  const ring = measureAnnulus(data, size, ch);
  const rIn = ring.inner + EDGE_INSET;
  const rOut = ring.outer - EDGE_INSET;
  console.log(
    "halo texture: centre " + ring.cx.toFixed(1) + "," + ring.cy.toFixed(1) +
      "  r " + ring.inner + ".." + ring.outer +
      "  band " + (ring.outer - ring.inner) + "px",
  );

  const sample = (x, y, c) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = x - x0;
    const fy = y - y0;
    const g = (a, b) =>
      data[
        (Math.min(size - 1, Math.max(0, b)) * size + Math.min(size - 1, Math.max(0, a))) * ch + c
      ];
    const top = g(x0, y0) * (1 - fx) + g(x0 + 1, y0) * fx;
    const bot = g(x0, y0 + 1) * (1 - fx) + g(x0 + 1, y0 + 1) * fx;
    return top * (1 - fy) + bot * fy;
  };

  // 1. The annulus in polar space.
  const polar = [];
  for (let r = 0; r < SHELLS; r += 1) {
    const rad = rIn + ((r + 0.5) / SHELLS) * (rOut - rIn);
    const row = [];
    for (let i = 0; i < RAYS; i += 1) {
      const a = (i / RAYS) * Math.PI * 2;
      const x = ring.cx + Math.cos(a) * rad;
      const y = ring.cy + Math.sin(a) * rad;
      row.push([sample(x, y, 0), sample(x, y, 1), sample(x, y, 2)]);
    }
    polar.push(row);
  }

  // 2. Band-limit each shell around the angle. Coefficients rather than pixels:
  //    they are what gets smoothed radially and resynthesised at any width.
  const cosT = [];
  const sinT = [];
  for (let k = 0; k <= HARMONICS; k += 1) {
    const ck = new Float64Array(RAYS);
    const sk = new Float64Array(RAYS);
    for (let i = 0; i < RAYS; i += 1) {
      const a = (i / RAYS) * Math.PI * 2 * k;
      ck[i] = Math.cos(a);
      sk[i] = Math.sin(a);
    }
    cosT.push(ck);
    sinT.push(sk);
  }
  const coefA = [];
  const coefB = [];
  for (let c = 0; c < 3; c += 1) {
    const A = [];
    const B = [];
    for (let k = 0; k <= HARMONICS; k += 1) {
      A.push(new Float64Array(SHELLS));
      B.push(new Float64Array(SHELLS));
    }
    for (let r = 0; r < SHELLS; r += 1) {
      for (let k = 0; k <= HARMONICS; k += 1) {
        let ac = 0;
        let as = 0;
        const ck = cosT[k];
        const sk = sinT[k];
        for (let i = 0; i < RAYS; i += 1) {
          const v = polar[r][i][c];
          ac += v * ck[i];
          as += v * sk[i];
        }
        A[k][r] = k === 0 ? ac / RAYS : (ac * 2) / RAYS;
        B[k][r] = k === 0 ? 0 : (as * 2) / RAYS;
      }
    }
    coefA.push(A);
    coefB.push(B);
  }

  // 3. Radially: a three-tap kernel and nothing more. Enough to take the edge
  //    off the block noise, not enough to touch the ramp.
  const smoothShells = (arr) => {
    const out = new Float64Array(SHELLS);
    for (let r = 0; r < SHELLS; r += 1) {
      const a = arr[Math.max(0, r - 1)];
      const b = arr[r];
      const d = arr[Math.min(SHELLS - 1, r + 1)];
      out[r] = (a + 2 * b + d) / 4;
    }
    return out;
  };
  for (let c = 0; c < 3; c += 1) {
    for (let k = 0; k <= HARMONICS; k += 1) {
      coefA[c][k] = smoothShells(coefA[c][k]);
      coefB[c][k] = smoothShells(coefB[c][k]);
    }
  }

  // 4. Resynthesise at the output width, then resample radially with
  //    Catmull-Rom. Row j is band position j / (h - 1), spanning the band
  //    exactly: the sampler clamps this axis rather than wrapping it, so there
  //    is no half-texel convention to carry.
  const shellRows = [];
  for (let r = 0; r < SHELLS; r += 1) {
    const row = new Float64Array(HALO_TEX.w * 3);
    for (let c = 0; c < 3; c += 1) {
      for (let i = 0; i < HALO_TEX.w; i += 1) {
        const a = (i / HALO_TEX.w) * Math.PI * 2;
        let v = coefA[c][0][r];
        for (let k = 1; k <= HARMONICS; k += 1) {
          v += coefA[c][k][r] * Math.cos(k * a) + coefB[c][k][r] * Math.sin(k * a);
        }
        row[i * 3 + c] = v;
      }
    }
    shellRows.push(row);
  }

  const catmull = (p0, p1, p2, p3, t) =>
    0.5 *
    (2 * p1 +
      (p2 - p0) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);

  const out = Buffer.alloc(HALO_TEX.w * HALO_TEX.h * 3);
  for (let j = 0; j < HALO_TEX.h; j += 1) {
    const t = j / (HALO_TEX.h - 1);
    const f = t * SHELLS - 0.5;
    const i1 = Math.floor(f);
    const ft = f - i1;
    const shell = (n) => shellRows[Math.min(SHELLS - 1, Math.max(0, n))];
    const r0 = shell(i1 - 1);
    const r1 = shell(i1);
    const r2 = shell(i1 + 1);
    const r3 = shell(i1 + 2);
    for (let i = 0; i < HALO_TEX.w * 3; i += 1) {
      const v = catmull(r0[i], r1[i], r2[i], r3[i], ft);
      out[j * HALO_TEX.w * 3 + i] = Math.max(0, Math.min(255, Math.round(v)));
    }
  }

  // 5. How much of the source survived. This is the number that says the
  //    reconstruction is faithful rather than invented.
  let ssTot = 0;
  let ssRes = 0;
  for (let c = 0; c < 3; c += 1) {
    let mean = 0;
    for (let r = 0; r < SHELLS; r += 1) for (let i = 0; i < RAYS; i += 1) mean += polar[r][i][c];
    mean /= SHELLS * RAYS;
    for (let r = 0; r < SHELLS; r += 1) {
      const t = (r + 0.5) / SHELLS;
      const j = Math.min(HALO_TEX.h - 1, Math.round(t * (HALO_TEX.h - 1)));
      for (let i = 0; i < RAYS; i += 1) {
        const x = Math.min(HALO_TEX.w - 1, Math.round((i / RAYS) * HALO_TEX.w));
        const rec = out[(j * HALO_TEX.w + x) * 3 + c];
        ssTot += (polar[r][i][c] - mean) ** 2;
        ssRes += (polar[r][i][c] - rec) ** 2;
      }
    }
  }
  console.log("halo texture: R^2 against the source = " + (1 - ssRes / ssTot).toFixed(5));

  // AVIF at 4:4:4, because the mark is a saturated cyan-to-blue ramp and
  // chroma subsampling is exactly the wrong thing to do to it. Measured on this
  // image: PNG 698 KB, lossless WebP 235 KB, AVIF q80 15 KB at R^2 = 0.99994
  // against the PNG -- two orders of magnitude more faithful than the
  // reconstruction it is encoding, so the encoder is not the weak link.
  //
  // WebP behind it for the browsers that cannot decode AVIF. The component asks
  // for the AVIF and falls back on error.
  const raw = { raw: { width: HALO_TEX.w, height: HALO_TEX.h, channels: 3 } };
  const avif = path.join(PUB, "halo.avif");
  const webp = path.join(PUB, "halo.webp");
  await sharp(out, raw).avif({ quality: 80, chromaSubsampling: "4:4:4", effort: 6 }).toFile(avif);
  await sharp(out, raw).webp({ quality: 95, effort: 6 }).toFile(webp);
  const a = await stat(avif);
  const w = await stat(webp);
  console.log(
    "halo texture written: " + HALO_TEX.w + "x" + HALO_TEX.h +
      ", avif " + Math.round(a.size / 1024) + " KB" +
      ", webp " + Math.round(w.size / 1024) + " KB",
  );
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir(path.join(OUT, "..", "og"), { recursive: true });
  /* The key visual alone, for iterating on it without re-encoding the site. */
  if (process.env.ONLY_HOME) return void (await buildHome());
  if (!process.env.SKIP_HERO) await buildHero();
  if (!process.env.SKIP_HOME) await buildHome();
  await buildOG();
  await buildIcons();
  await buildPortraits();
  await buildSponsors();
  await buildHaloTexture();
  await writeFile(
    path.join(OUT, "SOURCE.md"),
    [
      "# Generated imagery",
      "",
      "Everything in this folder is produced by `npm run imagery`. Do not hand-edit.",
      "",
      "- Source: " + SOURCE,
      "- Hero: the source as supplied — resized to 16:9 from the centre, CMYK transformed to sRGB, no treatment.",
      "- Home key art: " + HOME_SOURCE,
      "- Home: the artwork alone. The title, series line, dates and both lockups are live text and SVG in the page, not pixels — see packages/ui/src/KeyVisual.tsx.",
      "- Home crop: (77.25, 943.05) 11600x6525 of the plate, read off the master's own image transform — object-position 36.6% 69.9%, baked in.",
      "- Home widths: " + HOME_WIDTHS.join(", ") + " landscape, " + HOME_PORTRAIT_WIDTHS.join(", ") + " portrait (2:3, its own cut of the plate). AVIF q" + HOME_AVIF_Q + " — the measured grain knee — with WebP q" + HOME_WEBP_Q + " to 1920 as the no-AVIF fallback.",
      "- OG card: greyscale, contrast lift, ordered 8x8 Bayer dither, two-colour map (#f89c2c over #143a5c) — Design Brief §05.",
      "- Widths: " + WIDTHS.join(", ") + " (AVIF + WebP), OG card 1200x630 PNG.",
      "- Committee portraits: " + PORTRAIT_SOURCE + " — 4:5 crop from the top, " +
        (PORTRAIT_MONO ? "greyscale, " : "") +
        PORTRAIT.w + "x" + PORTRAIT.h + " (AVIF + WebP) in ./committee.",
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
