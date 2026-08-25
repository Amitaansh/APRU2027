import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * WCAG 2.1 AA guard on the design tokens (TRD §10).
 *
 * The palette is the thing most likely to drift — a designer nudges a shade and
 * the light theme quietly drops below 4.5:1. This parses the real token values
 * out of globals.css so the check cannot go stale.
 */

const css = readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");

function tokensFrom(selector: string): Record<string, string> {
  const block = new RegExp(selector + "\\s*\\{([^}]*)\\}").exec(css);
  if (!block) throw new Error("no token block for " + selector);
  const out: Record<string, string> = {};
  for (const [, name, value] of block[1].matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})/gi)) {
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

const light = tokensFrom(":root");
const dark = tokensFrom("\\.dark");
// The dark block only redefines what changes; the rest inherits from :root.
const darkFull = { ...light, ...dark };

describe.each([
  ["light", light],
  ["dark", darkFull],
])("%s theme meets WCAG AA", (_name, t) => {
  // 1.4.3 — normal text needs 4.5:1.
  it.each([
    ["body text on paper", "ink", "paper"],
    ["body text on surface", "ink", "surface"],
    ["muted and micro-labels on paper", "muted", "paper"],
    ["muted and micro-labels on surface", "muted", "surface"],
    ["accent text on paper", "accent", "paper"],
    ["accent text on surface", "accent", "surface"],
  ])("%s", (_label, fg, bg) => {
    expect(contrast(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5);
  });

  // 1.4.11 — control boundaries and focus indicators need 3:1.
  it.each([
    ["control border on paper", "line-strong", "paper"],
    ["control border on surface", "line-strong", "surface"],
    ["focus ring on paper", "ink", "paper"],
  ])("%s", (_label, fg, bg) => {
    expect(contrast(t[fg], t[bg])).toBeGreaterThanOrEqual(3);
  });

  it("keeps the CTA label legible on the orange fill", () => {
    expect(contrast("#0c0c0d", t.orange)).toBeGreaterThanOrEqual(4.5);
  });

  it("does not let brand orange be used as a text colour where it would fail", () => {
    // If this ever passes in light theme, the fill hex has been changed and the
    // separate --accent token may no longer be needed.
    if (_name === "light") {
      expect(contrast(t.orange, t.paper)).toBeLessThan(4.5);
    }
  });
});
