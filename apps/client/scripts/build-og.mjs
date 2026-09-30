/**
 * The Open Graph card: the home key visual, photographed at 1200x630.
 *
 *   npm run dev -- -p 3111        (in another terminal)
 *   npm run og                    [baseUrl, default http://localhost:3111/]
 *
 * WHY A PHOTOGRAPH OF THE PAGE. The card used to be drawn by the imagery
 * script: the old hero art greyscaled into an orange-on-navy Bayer dither, the
 * type set in SVG in whatever bold grotesque the machine had, and the lot
 * written as a PNG that sharp quantised to a 30-colour palette. It matched
 * nothing the site now shows. Worse, a dither is a pattern of single orange
 * and navy pixels, and every messenger shrinks the card before it shows it --
 * KakaoTalk to about 500px -- so the dots averaged out to a muddy brown. The
 * key visual is the site's own first impression, set in Atlas Grotesk and
 * already verified against the comp, so the card is that, not a second
 * drawing of it.
 *
 * Rendered at 2x and reduced, so the type is anti-aliased from a finer grid
 * than the card's own. Written as a JPEG: the art is full colour, and a PNG of
 * this much grain is several megabytes, over what some crawlers will fetch.
 * 4:2:0 at q82 keeps it near 230 KB, under WhatsApp's ~300 KB ceiling for a
 * preview; 4:4:4 doubles that for grain no messenger thumbnail can show, and
 * the type is white, which lives in luma and loses nothing to the subsampling.
 *
 * KakaoTalk shows the card at 2:1, trimming 15px off the top and bottom of a
 * 1200x630 image; the key visual's type and lockups sit well inside that.
 *
 * The file is written to packages/assets/public/og, which sync.mjs mirrors into
 * both apps. A new name, not an overwrite: messengers cache a card by its URL.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.argv[2] ?? "http://localhost:3111/";
const W = 1200;
const H = 630;
const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, "..", "..", "..", "packages", "assets", "public", "og", "card.jpg");

const browser = await chromium.launch({ channel: "chrome", args: ["--force-prefers-reduced-motion"] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await page.goto(BASE, { waitUntil: "networkidle" });
/* The frame alone: no header over it, no dev overlay, held to the card's height. */
await page.addStyleTag({
  content: `header{display:none !important} nextjs-portal{display:none !important} .kv{height:${H}px !important}`,
});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
const shot = await page.locator(".kv").screenshot();
await browser.close();

const info = await sharp(shot)
  .resize(W, H, { fit: "cover", kernel: "lanczos3" })
  .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:2:0" })
  .toFile(OUT);
console.log("og card " + info.width + "x" + info.height + ", " + Math.round(info.size / 1024) + " KB -> " + path.relative(process.cwd(), OUT));
