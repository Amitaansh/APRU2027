import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { workingGroupColour } from "./wg-colour";

/**
 * WCAG 2.1 AA guard on the design tokens (TRD §10).
 *
 * The palette is the thing most likely to drift — someone nudges a shade and a
 * value quietly drops below 4.5:1. This parses the real token values out of
 * globals.css so the check cannot go stale.
 *
 * The site has one ground and no theme toggle, but sections opt into a dark
 * ground with `[data-ground="dark"]`, so both directions still have to hold.
 */

/*
 * Resolved from this file rather than from the working directory: the palette
 * lives in @apru/styles now, and process.cwd() differs between a workspace run
 * and a run from inside the package.
 */
const css = readFileSync(
  path.join(import.meta.dirname, "..", "..", "styles", "base.css"),
  "utf8",
);

function tokensIn(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [, name, value] of block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)) {
    out[name] = value;
  }
  return out;
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => channel(parseInt(h.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// There are two `:root` blocks: the first carries only the fluid font-size, the
// second is the palette. Matching on `--wh`, which exists only in the palette,
// pins this to the right one however the file is reordered.
const paletteBlock = /:root\s*\{[^}]*--wh:[^}]*\}/.exec(css);
if (!paletteBlock) throw new Error("no palette block in base.css");
const t = tokensIn(paletteBlock[0]);

describe("palette tokens exist", () => {
  it.each(["wh", "bk", "gr", "gr2", "gr3", "ac", "orange"])("--%s is defined", (name) => {
    expect(t[name]).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

describe("light ground meets WCAG AA", () => {
  // 1.4.3 — normal text needs 4.5:1.
  it.each([
    ["body text on white", "bk", "wh"],
    ["secondary text on white", "gr3", "wh"],
    ["live state on white", "ac", "wh"],
  ])("%s", (_label, fg, bg) => {
    expect(contrast(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5);
  });
});

describe("dark ground meets WCAG AA", () => {
  it.each([
    ["body text on black", "wh", "bk"],
    ["secondary text on black", "gr3-dark", "bk"],
    // Dark sections swap the accent for the real brand orange, which only
    // clears AA on the dark ground — never use it as text on white.
    ["live state on black", "orange", "bk"],
  ])("%s", (_label, fg, bg) => {
    expect(contrast(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5);
  });

  it("the accent is swapped per ground, not reused", () => {
    // Why --ac exists at all: the brand hex fails badly on paper (1.9:1), so
    // the light ground gets a darkened orange and only the dark ground gets the
    // real one. These two rules are what enforce that.
    expect(contrast(t.orange, t.wh)).toBeLessThan(4.5);
    expect(css).toMatch(/[^\]]\s*\.live\s*\{\s*color:\s*var\(--ac\);/);
    expect(css).toMatch(/\[data-ground="dark"\]\s*\.live\s*\{\s*color:\s*var\(--orange\);/);
  });

  it("secondary text is swapped per ground too", () => {
    // #929292 is the reference's grey and only clears 3.1:1 on white.
    expect(contrast(t["gr3-dark"], t.wh)).toBeLessThan(4.5);
    expect(css).toMatch(/\[data-ground="dark"\]\s*\.dim\s*\{\s*color:\s*var\(--gr3-dark\);/);
  });
});

describe("non-text contrast (WCAG 1.4.11)", () => {
  it("hairlines are decorative, but control borders use currentColor", () => {
    // Buttons and links draw their rules in currentColor, so they inherit the
    // 21:1 of the ground they sit on rather than needing their own token.
    expect(css).toMatch(/\.btn\s*\{[^}]*border:\s*1px solid currentColor/);
    expect(css).toMatch(/\.rule-solid\s*\{[^}]*background-color:\s*currentColor/);
  });

  /*
   * The swatches render on the dark ground (Programme page), so that is the
   * ground they have to clear. They are also redundant — every group carries a
   * number and a title — so the colour is a second channel, never the only one.
   */
  it.each([0, 2, 5, 8, 10])("working-group swatch %i clears 3:1 on black", (i) => {
    expect(contrast(workingGroupColour(i, 11), t.bk)).toBeGreaterThanOrEqual(3);
  });
});
