/**
 * Verify the key visual against the comp.
 *
 *   node scripts/verify-key-visual.mjs [baseUrl]     (default http://localhost:3111/)
 *
 * The composition on the home page is set to geometry measured off the comp's
 * vector master — see packages/styles/key-visual.css for where each number came
 * from. This renders that composition in headless Chrome at a range of widths
 * and checks it still lands where the comp puts it.
 *
 * WHY IT RENDERS RATHER THAN READS THE CSS. Half of what can go wrong here does
 * not show up in a stylesheet: a fallback face re-shaping a line, a container
 * query resolving against the wrong box, text-box-trim silently not applying,
 * a token edited in one branch and not the other. The only honest check is what
 * the browser actually draws.
 *
 * HARNESS NOTES, all of them learned the hard way:
 *   - The frame renders inside a fixed-size iframe, never by resizing the
 *     window. Chrome clamps a window to about 500px wide, so a "390px" viewport
 *     is really a 504px layout cropped to 390 — a different composition,
 *     photographed badly.
 *   - Headless viewport height is not reliable either, so nothing here reads
 *     innerHeight; the frame is forced through the iframe and measured back out
 *     of the DOM.
 *   - The lockups are read as element boxes rather than segmented out of the
 *     picture: they sit on a dithered ground that throws near-white specks, and
 *     both SVGs are drawn to their own ink, so the element box IS the artwork.
 *   - prefers-reduced-motion is forced, or an entrance animation is caught
 *     mid-fade and a half-opacity line measures as a thinner one.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3111/';
const TOL = 1.0; // px

/* The comp, in its own 2320x1305 space, as a fraction of the frame width. */
const D = 2320;
const SPEC = {
  'apru left': [102.530 / D, g => g.apru.left],
  'apru width': [329.740 / D, g => g.apru.w],
  'apru above foot': [101.613 / D, g => g.apru.fromFoot],
  'nus left': [517.520 / D, g => g.nus.left],
  'nus width': [689.700 / D, g => g.nus.w],
  'nus above foot': [100.190 / D, g => g.nus.fromFoot],
  'line 1 cap-line': [105.374 / D, g => g.l1.top],
  /* The text ORIGIN, not the ink edge: the comp's first glyph starts at 102.29
   * and B carries a 77/1000 left sidebearing, so the pen starts at 96.669. */
  'text origin': [96.669 / D, g => g.l1.left],
  'line 2 cap-line': [196.574 / D, g => g.l2.top],
  'line 3 cap-line': [287.476 / D, g => g.l3.top],
  /*
   * Line 2's advance width is the tracking guard. It is the width the verified
   * build lands on rather than a figure derived offline, because the browser
   * kerns and an offline sum of advances does not — that gap is about 7px
   * across this line, which is what makes tracking a thing you solve against a
   * render. If a token or a face changes, this moves.
   */
  'line 2 advance width': [2114.453 / D, g => g.l2w],
};
/* Display size is 73px on a 2320 frame; the date line is 68. */
const SIZE = { display: 73 / D, meta: 68 / D };

const browser = await chromium.launch({
  channel: 'chrome',
  args: ['--force-prefers-reduced-motion', '--font-render-hinting=none'],
});

async function measure(W, H) {
  const page = await browser.newPage({ viewport: { width: Math.max(W + 80, 1200), height: H + 400 } });
  await page.setContent(
    `<body style="margin:0"><iframe id="f" src="${BASE}" style="width:${W}px;height:${H}px;border:0;display:block"></iframe></body>`,
  );
  await page.frameLocator('#f').locator('.kv').waitFor({ state: 'attached', timeout: 60000 });
  const f = page.frames().find(fr => fr.url().startsWith(BASE.slice(0, 20)));
  await f.addStyleTag({ content: `.kv{height:${H}px !important} nextjs-portal{display:none !important}` });
  await f.evaluate(() => document.fonts.ready);
  const g = await f.evaluate(() => {
    const kv = document.querySelector('.kv').getBoundingClientRect();
    const rel = sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        left: r.left - kv.left, right: r.right - kv.left, top: r.top - kv.top,
        w: r.width, h: r.height, fromFoot: kv.bottom - r.bottom,
      };
    };
    const lines = [...document.querySelectorAll('.kv-line')];
    const cs = getComputedStyle(lines[0]);
    const meta = getComputedStyle(document.querySelector('.kv-meta'));
    return {
      frame: { w: kv.width, h: kv.height },
      apru: rel('.kv-apru'), nus: rel('.kv-nus'),
      l1: rel('.kv-line'), l2: rel('.kv-line + .kv-line'), l3: rel('.kv-meta'),
      l2w: (() => {
        const rg = document.createRange();
        rg.selectNodeContents(lines[1]);
        return rg.getBoundingClientRect().width;
      })(),
      display: parseFloat(cs.fontSize), meta: parseFloat(meta.fontSize),
      trimmed: cs.textBoxTrim ?? cs.getPropertyValue('text-box-trim'),
      family: cs.fontFamily,
    };
  });
  await page.close();
  return g;
}

let failures = 0;
console.log(`\n  key visual — geometry against the comp (tolerance ${TOL}px)\n`);
for (const [W, H] of [[2320, 1305], [1920, 1080], [1280, 720], [768, 432]]) {
  const g = await measure(W, H);
  const bad = [];
  for (const [name, [frac, get]] of Object.entries(SPEC)) {
    const got = get(g);
    if (got == null) { bad.push(`${name}: MISSING`); continue; }
    const d = got - frac * W;
    if (Math.abs(d) > TOL) bad.push(`${name} ${d >= 0 ? '+' : ''}${d.toFixed(2)}px`);
  }
  for (const [k, frac] of Object.entries(SIZE)) {
    const d = g[k] - frac * W;
    if (Math.abs(d) > TOL) bad.push(`${k} size ${d >= 0 ? '+' : ''}${d.toFixed(2)}px`);
  }
  if (!g.trimmed || g.trimmed === 'none') bad.push('text-box-trim is not applying');
  if (/Fallback/.test(g.family.split(',')[0])) bad.push('rendered in the fallback face');
  const ok = bad.length === 0;
  if (!ok) failures++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${String(W).padStart(4)}x${String(H).padEnd(4)}  ` +
    `display ${g.display.toFixed(2)}px  meta ${g.meta.toFixed(2)}px` + (ok ? '' : `\n          ${bad.join('\n          ')}`));
}
await browser.close();
console.log(failures ? `\n  ${failures} width(s) out of tolerance\n` : '\n  all widths within tolerance\n');
process.exit(failures ? 1 : 0);
