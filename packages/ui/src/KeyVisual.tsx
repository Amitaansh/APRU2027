import { site } from "@apru/content";

/**
 * The key visual: the designer's frame, assembled here rather than shipped flat.
 *
 * WHAT THIS REPLACES. The home page used to be the comp as a picture — a single
 * JPEG with "Bridging Resilience(s)", the series line, the dates and both
 * institutional lockups drawn into the pixels. Type inside an image is invisible
 * to a screen reader, to a search engine and to anyone who blocks images; it
 * cannot be selected, translated or restyled; and it is resampled at every width
 * instead of being drawn at the one it is displayed at.
 *
 * So the frame is split in two. The artwork stays an image, and takes alt=""
 * because it no longer says anything — every word it used to carry is in the
 * markup below. Everything that does carry meaning is rebuilt: the title and
 * dates as live text in Atlas Grotesk, the two lockups as linked SVG.
 *
 * The geometry is in @apru/styles/key-visual.css, measured off the comp's vector
 * master rather than judged by eye, and verified by rendering this component
 * headless and diffing the type against the comp — `npm run verify:kv`.
 *
 * THREE BLOCKS. The markup is the three things the client's layout puts at
 * three heights: the title, the date line, the lockups. They are siblings so
 * the stylesheet can space them as blocks — the date line in the middle of the
 * room between the other two — rather than as lines of one paragraph.
 *
 * THE LOCKUPS STAY VECTOR. The NUS mark carries "Department of Architecture /
 * College of Design and Engineering" inside the lockup as outlines. That line is
 * type carrying meaning, so by the same rule it ought to be re-set here — but an
 * institutional lockup is a fixed asset with its own clearance rules, and
 * re-typesetting it in the conference's face would be redrawing someone else's
 * mark. It keeps its meaning through alt text instead, which is what that rule
 * is actually for.
 */

/**
 * Split "The 10th ..." so the ordinal can be set as an ordinal.
 *
 * The comp raises "th" to 0.583 of the parent em on a 0.333em baseline shift,
 * both measured off its ink box. `sup`'s defaults are a browser guess — roughly
 * 0.83em and a `super` shift — and miss it by about 4px each way at display
 * size, so the suffix is marked up explicitly and sized in CSS.
 */
function withOrdinal(text: string) {
  const m = /^(.*?)(\d+)(st|nd|rd|th)\b(.*)$/.exec(text);
  if (!m) return text;
  const [, before, digits, suffix, after] = m;
  return (
    <>
      {before}
      {digits}
      <span className="kv-ord">{suffix}</span>
      {after}
    </>
  );
}

/**
 * The series line, with the break the client's mobile layout puts in it.
 *
 * The 4:5 reference sets "The 10th Sustainable Cities" over "and Landscapes
 * Conference": the line splits before its "and". That is a <br> the stylesheet
 * hides in landscape, where the line is the comp's one measured line, and shows
 * in portrait. A break rather than a second span so that landscape still
 * renders one run of text and the geometry check can measure it as one.
 */
function seriesLine(text: string) {
  const i = text.indexOf(" and ");
  if (i < 0) return withOrdinal(text);
  return (
    <>
      {withOrdinal(text.slice(0, i))} <br className="kv-br" />
      {text.slice(i + 1)}
    </>
  );
}

export function KeyVisual() {
  return (
    <div className="kv">
      {/*
       * Per-ORIENTATION sources, not just per-width. A phone asking the 16:9
       * landscape frame to cover a 2:3 box drives it about 3x and the dither
       * turns to mush, so portrait gets its own cut of the plate — see
       * buildHome in scripts/build-imagery.mjs.
       */}
      <picture>
        <source
          media="(orientation: portrait)"
          type="image/avif"
          sizes="100vw"
          srcSet="/images/home-portrait-1440.avif 1440w, /images/home-portrait-1080.avif 1080w, /images/home-portrait-768.avif 768w, /images/home-portrait-480.avif 480w"
        />
        <source
          media="(orientation: portrait)"
          type="image/webp"
          sizes="100vw"
          srcSet="/images/home-portrait-1440.webp 1440w, /images/home-portrait-1080.webp 1080w, /images/home-portrait-768.webp 768w, /images/home-portrait-480.webp 480w"
        />
        <source
          type="image/avif"
          sizes="100vw"
          srcSet="/images/home-2560.avif 2560w, /images/home-1920.avif 1920w, /images/home-1280.avif 1280w, /images/home-768.avif 768w"
        />
        <img
          className="kv-art"
          src="/images/home-1280.webp"
          srcSet="/images/home-1920.webp 1920w, /images/home-1280.webp 1280w, /images/home-768.webp 768w"
          sizes="100vw"
          alt=""
          width={2560}
          height={1440}
          fetchPriority="high"
        />
      </picture>

      <hgroup className="kv-type">
        <h1>
          <span className="kv-line">{site.name}:</span>
          <span className="kv-line">{withOrdinal(site.subtitle)}</span>
        </h1>
        {/*
         * The dates carry an EM dash, which is what the comp is set with: the
         * measured ink is 53.03px against 52.07 predicted for an em at this
         * size and 28.70 for an en. It comes from the content layer so the rest
         * of the site says it the same way.
         *
         * This is the second of the frame's three blocks, not the title's third
         * line: the stylesheet sets it in the middle of the room between the
         * title and the lockups, in both orientations, as the client's layout
         * has it.
         *
         * Two spans, not one string: the client's mobile layout sets the place
         * on a line of its own under the dates, and the comma stays with the
         * dates on both. Landscape renders them inline.
         */}
        <p className="kv-line kv-meta">
          <span className="kv-date">{site.dates},</span> <span className="kv-place">{site.location}</span>
        </p>
      </hgroup>

      <div className="kv-marks">
        <img className="kv-mark kv-apru" src="/images/apru-white.svg" alt="APRU" width={330} height={102} />
        <img
          className="kv-mark kv-nus"
          src="/images/nus-doa-white.svg"
          alt="National University of Singapore — Department of Architecture, College of Design and Engineering"
          width={690}
          height={93}
        />
      </div>
    </div>
  );
}
