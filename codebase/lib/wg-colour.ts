/**
 * Working-group colour coding — the only place on the site where colour carries
 * information rather than being part of the artwork.
 *
 * The ramp runs from the halo's deep royal blue to the key art's orange, so the
 * eleven groups are distinguished by a spectrum the conference already owns
 * rather than by an arbitrary categorical palette. Interpolation is through
 * OKLCH-ish territory via simple sRGB mixing, which is fine here because the two
 * endpoints are far apart in hue and the swatches are small.
 *
 * Swatches are decoration adjacent to a text label, never the only carrier of
 * meaning: every group is also numbered and named, so the coding adds a second
 * channel rather than replacing the first (WCAG 1.4.1).
 */

/**
 * #03c5fa — the halo's BRIGHT end, not its deep royal.
 *
 * The swatches sit on the dark ground, where #1d35cc manages only 2:1 and would
 * disappear. The cyan end of the same gradient clears 10:1 there, so the ramp
 * runs cyan to orange and both ends stay legible on black.
 */
const FROM = [0x03, 0xc5, 0xfa];
/** #f89c2c — the key art's orange. */
const TO = [0xf8, 0x9c, 0x2c];

export function workingGroupColour(index: number, total: number): string {
  const k = total <= 1 ? 0 : index / (total - 1);
  const channels = FROM.map((from, i) => Math.round(from + (TO[i] - from) * k));
  return "#" + channels.map((c) => c.toString(16).padStart(2, "0")).join("");
}
