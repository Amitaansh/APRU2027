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
import { mkdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

sharp.cache(false);

const SOURCE = process.env.HERO_SOURCE ?? "D:/APRU/DOA-APRU-MainImage.jpg";
const ICON_SOURCE = process.env.ICON_SOURCE ?? "D:/APRU/apru-icon.jpg";
const OUT = path.join(process.cwd(), "public", "images");
const APP = path.join(process.cwd(), "app");
const PUB = path.join(process.cwd(), "public");

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
  if (!process.env.SKIP_HERO) await buildHero();
  await buildOG();
  await buildIcons();
  await buildHaloTexture();
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
