"use client";

import { useEffect, useRef } from "react";

/**
 * The APRU halo: the mark itself, as a torus, larger than the frame and cropped
 * by it.
 *
 * WHY THE PATTERN IS SAMPLED RATHER THAN COMPUTED. The icon looks like a simple
 * four-cycle gradient, and two earlier attempts treated it as one. It is not.
 * Measured off the artwork:
 *
 *   - the annulus is uniform: inner 0.69 R, band 0.31 R at every angle;
 *   - the gradient does four cycles, but the four sectors are NOT identical --
 *     two of them ramp 75 to 162 in green and two ramp 113 to 204, so the mark
 *     is two crescents of 180 degrees each, not four of 90;
 *   - the seams spiral, sweeping ~71 degrees from the outer edge to the inner;
 *   - and there is a strong radial ramp on top of all that, independent of the
 *     angular one.
 *
 * A single linear gradient explains R^2 = 0.15 of it; a four-cycle spiral model
 * still leaves a third of the variance. So the pattern is taken from the artwork
 * directly, resampled into polar space -- angle across the texture's width,
 * radial position across its height -- and band-limited around the angle, which
 * discards the source JPEG's block noise and keeps the mark as drawn. That work
 * is done offline by scripts/build-imagery.mjs, where the reasoning and the
 * measured R^2 live; this file only uploads the result.
 *
 * HOW THE BAND WRAPS THE TUBE. `t = (1 + cos v) / 2`, and that is not a taste
 * decision. A point at minor angle v sits at ring-radius 1 + TUBE * cos v, which
 * under this orthographic projection lands in the annulus at exactly that
 * normalised radial position. The mapping is the inverse of the projection, so a
 * face-on torus reproduces the icon pixel for pixel -- and it is periodic in v,
 * so there is no seam anywhere on the object.
 *
 * The obvious mapping -- t = v, the band once around the tube -- is wrong twice
 * over, and both showed. It butts the band's inner edge against its outer at the
 * tube's OUTER equator, the most exposed line on the whole object, and measured
 * off the artwork those two colours are 171 apart out of a possible 441. And it
 * paints the INNER equator, the edge that borders the hole, with mid-band colour
 * instead of the inner edge's cyan, which is why the centre read as detached
 * from the ring.
 *
 * THE CHOREOGRAPHY. The ring is bigger than the frame and deliberately cropped
 * by it. Its radius is the whole width of the lane Section reserves, and its
 * centre sits on the screen edge, so half of it is on screen and it runs off
 * the top and bottom as well -- the page is a window onto something larger than
 * the page. That crop is exact rather than approximate: the lane's midpoint was
 * one old radius in from the edge, so doubling the radius and moving the centre
 * to the edge leaves the visible width precisely the lane, and the mark still
 * cannot touch type.
 *
 * ONE PHASE, NOT A PILE OF WINDOWS. Every quantity here is a smooth function of
 * a single monotone phase, Psi, and of nothing else. Psi is 0 at the centre of
 * the first lane section, 0.5 at the first seam, 1 at the centre of the next,
 * and so on -- anchors measured live off the sections themselves. Between two
 * anchors it eases with `hold`, which crawls at both ends without ever stopping.
 * Two more anchors sit at the ends of the halo's life, a whole half turn beyond
 * the first and last section centres, so the phase is still advancing while the
 * ring grows in and out instead of holding a pose. Both are a whole number of
 * half turns from a centre, so both ends are still exactly face-on.
 *
 * That shape is the choreography. At an integer Psi the ring is face-on and
 * barely turning: a big clear arc parked in its lane. At a half-integer it is
 * exactly edge-on and barely turning: a flat plate lying in the gap between two
 * sections. In between it hurries, so the face-on state -- where a torus shows
 * nothing but its texture going round -- is passed through rather than dwelt in.
 * The seams land on exactly 90 degrees and both ends of the page on a multiple
 * of 180 by arithmetic, not by tuning: the tilt IS pi * Psi.
 *
 * WHY IT IS BUILT THIS WAY. The previous version gave every crossing its own
 * window and combined them with `max`, picking the nearest one. Where two
 * windows overlapped -- which they did, because the windows were a fixed 0.9
 * screens and the sections are shorter than that -- the `max` put a corner in
 * the size curve and the nearest-crossing choice flipped at the same instant,
 * stepping the lateral progress from 1 to 0 and swapping which band the ring
 * was tied to. That was a visible snap, and no amount of tuning removes it: it
 * is what selecting by proximity does. A single monotone phase has no windows
 * to overlap and nothing to select.
 *
 * The same version clipped the band to the viewport. `room` is the denominator
 * of `fit`, so as a gap scrolled off the top of the screen `room` collapsed
 * towards zero and the ring's size stepped by several per cent in one frame.
 * The gap's height is a property of the two blocks of type; it is not measured
 * against the viewport any more.
 *
 * One branch remains -- which of the bands to measure -- and it is safe by
 * construction. It changes at integer Psi, and at integer Psi the ring is fully
 * parked: `bell` is zero, so the band has no pull on its height and no part in
 * its size; `commit` is zero, so the band does not constrain its fit; and `lat`
 * is hard at an endpoint, so the band has no say in where it sits. Every
 * quantity the choice feeds is stationary at the moment the choice is made.
 *
 * HOW IT CHANGES LANES WITHOUT CROSSING TYPE. Between two sections there is an
 * empty band, and the ring rides it: at the seam its centre is on the band
 * exactly, and it is edge-on there, which cuts its height to a sixth. That
 * sixth is what lets a ring this size pass through a gap this narrow. The band
 * is measured live off the two content boxes, so a sticky section (the curtain)
 * reports the room it actually has.
 *
 * The travel is concentrated in phase rather than in pixels -- a narrow window
 * of Psi around the seam, which is a generous window of scroll precisely
 * because Psi crawls there. So the ring is always thin while it is over type,
 * and the path it takes is a curve: it leaves its parked height, meets the
 * band, is carried up the screen with it, and settles again on the far side.
 *
 * All of it is a pure function of scrollY, so scrolling back up retraces the
 * path exactly -- there is no eased state to get stranded in the wrong place.
 */

/**
 * Torus mesh density. At the cropped size the ring's outline runs some 4000px,
 * so 320 segments put a visible flat every 13px; these two numbers are what
 * keep the silhouette a curve. ~49k vertices, which is nothing.
 */
const SEG_U = 512;
const SEG_V = 96;

/** Tube radius as a fraction of ring radius. */
const TUBE = 0.2;

const TAU = Math.PI * 2;

/**
 * On a desktop the diameter is not a constant at all: the ring fills whatever
 * room sits beside that section's own content, measured off the grid. On a
 * phone there is no lane to fill, so it falls back to a fraction of the height.
 */
const DIA_SM = 0.3;

/** Sway about the vertical axis: the second live axis, running at a frequency
 *  that does not divide into the phase, so the parked ring is never turning on
 *  one axis alone. Narrower on a phone, which keeps its old treatment. */
const SWAY = (45 * Math.PI) / 180;
const SWAY_SM = (30 * Math.PI) / 180;
/** Vertical wander while parked, as a fraction of viewport height. Wide enough
 *  to slide the crop up and down the arc, now that the ring overruns the frame. */
const DRIFT = 0.15;
const DRIFT_SM = 0.06;
/** Scroll spent arriving and leaving, in viewports. Not a share of the page:
 *  a fraction of the span would make the entrance crawl on a long page. */
const ENTRY = 0.5;
/** How small it is when it first appears, out past the screen edge. */
const ENTRY_SCALE = 0.3;
/** How much of the phase easing is smoothstep and how much is linear. The
 *  linear remainder is what keeps the crawl at each anchor from becoming a
 *  stop: at 0.85 the rate there is 15% of the average, never zero. */
const HOLD = 0.85;
/** Size at the bottom of the dip, on the seam. */
const SEAM_SCALE = 0.65;
/** The sideways travel, as a span of phase centred on the seam. Small in phase
 *  is generous in scroll -- the phase crawls through the seam -- and it is
 *  phase that decides how thin the ring is, which is what has to be true while
 *  it is over type. */
const LAT = 0.3;
/** How far either side of the seam the band still constrains the fit. Wider
 *  than the travel, so the constraint is a plateau with a shoulder rather than
 *  a spike; short of 0.5, so it is spent before the phase reaches the anchor
 *  where the band being measured changes. */
const LAT_OUT = 0.42;

const MOBILE = 768;

const VERT = `
attribute vec3 aPos;
attribute vec3 aNormal;
attribute vec2 aUv;
uniform mat4 uModel;
uniform mat4 uProj;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
void main() {
  vec4 world = uModel * vec4(aPos, 1.0);
  vNormal = mat3(uModel) * aNormal;
  vPos = world.xyz;
  vUv = aUv;
  gl_Position = uProj * world;
}
`;

/**
 * Blinn-Phong over the unwrapped artwork, with a fresnel rim. The lighting
 * multiplies the sampled colour rather than adding to it, so no hue enters that
 * the icon does not already have -- the specular and the rim are the only terms
 * that add, and both add white, narrowly.
 *
 * The rim is brightest where the tube turns away from the eye, which on a
 * face-on ring is its inner and outer edges -- the same two places the corrected
 * UV mapping puts the band's own edges. It reads as the ring defining its own
 * boundary. The 0.45 is the dial.
 */
const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform float uAlpha;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
void main() {
  vec3 base = texture2D(uTex, vUv).rgb;
  vec3 n = normalize(vNormal);
  vec3 lightDir = normalize(vec3(-0.45, 0.72, 0.62));
  vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
  float diff = max(dot(n, lightDir), 0.0);
  vec3 half3 = normalize(lightDir + viewDir);
  float spec = pow(max(dot(n, half3), 0.0), 28.0);
  float fres = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
  vec3 col = base * (0.55 + 0.62 * diff + 0.45 * fres) + vec3(spec * 0.35 + fres * 0.10);
  gl_FragColor = vec4(col, uAlpha);
}
`;

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const smooth = (t: number) => t * t * (3 - 2 * t);
/** Smoothstep that never quite stops. See HOLD. */
const hold = (t: number) => lerp(t, smooth(t), HOLD);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const clampTo = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Row-major 3x3 helpers. Composing beats hand-expanding: three chained
// rotations written out by hand is where sign errors hide.
type M3 = number[];

function mul3(a: M3, b: M3): M3 {
  const out = new Array(9).fill(0);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let s = 0;
      for (let k = 0; k < 3; k++) s += a[i * 3 + k] * b[k * 3 + j];
      out[i * 3 + j] = s;
    }
  }
  return out;
}

const rotX = (t: number): M3 => {
  const c = Math.cos(t);
  const s = Math.sin(t);
  return [1, 0, 0, 0, c, -s, 0, s, c];
};

const rotY = (t: number): M3 => {
  const c = Math.cos(t);
  const s = Math.sin(t);
  return [c, 0, s, 0, 1, 0, -s, 0, c];
};

const rotZ = (t: number): M3 => {
  const c = Math.cos(t);
  const s = Math.sin(t);
  return [c, -s, 0, s, c, 0, 0, 0, 1];
};

type Lane = "left" | "right";
/** The free space beside a section's content: where the ring goes, and how big. */
type Box = { c: number; half: number };
type Node = { el: HTMLElement; content: HTMLElement; lane: Lane; slot: Box | null };
type Stop = Node & { top: number; bottom: number };
type Cross = { at: number; from: Stop; to: Stop };

function buildTorus() {
  const pos: number[] = [];
  const nor: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];

  for (let i = 0; i <= SEG_U; i++) {
    const u = i / SEG_U;
    const ua = u * Math.PI * 2;
    const cu = Math.cos(ua);
    const su = Math.sin(ua);
    for (let j = 0; j <= SEG_V; j++) {
      const v = j / SEG_V;
      const va = v * Math.PI * 2;
      const cv = Math.cos(va);
      const sv = Math.sin(va);
      // Ring radius 1, tube TUBE. Scaled to pixels by the model matrix.
      pos.push((1 + TUBE * cv) * cu, (1 + TUBE * cv) * su, TUBE * sv);
      nor.push(cv * cu, cv * su, sv);
      // The band's radial axis, mapped by the inverse of the projection. See
      // HOW THE BAND WRAPS THE TUBE at the top of the file: this one expression
      // is what removes the seam and reattaches the hole to the gradient.
      uv.push(u, (1 + cv) / 2);
    }
  }
  for (let i = 0; i < SEG_U; i++) {
    for (let j = 0; j < SEG_V; j++) {
      const a = i * (SEG_V + 1) + j;
      const b = a + SEG_V + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  return {
    pos: new Float32Array(pos),
    nor: new Float32Array(nor),
    uv: new Float32Array(uv),
    idx: new Uint32Array(idx),
  };
}

export function Halo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false }) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    // No WebGL: the halo is decorative and every page reads without it.
    if (!gl) return;
    const ext = gl.getExtension("OES_element_index_uint");
    if (!ext) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const mesh = buildTorus();
    const bind = (data: Float32Array, name: string, size: number) => {
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    bind(mesh.pos, "aPos", 3);
    bind(mesh.nor, "aNormal", 3);
    bind(mesh.uv, "aUv", 2);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.idx, gl.STATIC_DRAW);

    const uModel = gl.getUniformLocation(program, "uModel");
    const uProj = gl.getUniformLocation(program, "uProj");
    const uAlpha = gl.getUniformLocation(program, "uAlpha");

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let ready = false;
    const texture = gl.createTexture();
    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      // The angular axis wraps; the radial one does not. Clamping T is what
      // stops the coarsest mip levels averaging the band's outer edge into its
      // inner one -- they are the two ends of one gradient and nothing should
      // ever mix them.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      // The ring is 30% of its size on arrival and a thin sliver at every seam,
      // and a 2048-wide texture minified that far shimmers without mipmaps.
      // Both dimensions are powers of two, so this is legal.
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

      // The tube is seen at a grazing angle nearly everywhere and edge-on at
      // every crossing, which is the case isotropic filtering handles worst.
      // Asked for rather than assumed -- it is not universal.
      const aniso =
        gl.getExtension("EXT_texture_filter_anisotropic") ??
        gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
      if (aniso) {
        const most = gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number;
        gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(16, most));
      }
      ready = true;
    };
    // 15KB of AVIF against 698KB of the equivalent PNG, with WebP behind it for
    // anything that cannot decode AVIF. Both are written by `npm run imagery`.
    image.onerror = () => {
      image.onerror = null;
      image.src = "/halo.webp";
    };
    image.src = "/halo.avif";

    let nodes: Node[] = [];
    /** The type immediately before the halo's first lane and after its last. */
    let guards: { above: HTMLElement | null; below: HTMLElement | null } = {
      above: null,
      below: null,
    };
    let width = 0;
    let height = 0;
    let small = false;
    /** Budget for re-measuring a grid that was not laid out yet. */
    let retry = 3;

    /**
     * The room beside this section's content -- from where its type ends to the
     * screen edge -- taken from the grid's own children rather than from column
     * arithmetic.
     *
     * This has to be per section, because the sections do not agree on where
     * their content stops. A labelled section spends two columns on the label;
     * an unlabelled left-lane one starts its body at column 8 and leaves seven
     * columns free rather than five. Measuring the rendered boxes makes all of
     * that fall out for free, and it is exact where re-deriving the gutter is
     * not: the page gutter is 30rem against a clamped root font size, so any
     * arithmetic version is wrong below 1728px and above 2304px.
     *
     * Grid items fill their area, so a child's rect is its column span exactly;
     * the max-width on descendants does not pull it in.
     */
    const readSlot = (el: HTMLElement, lane: Lane): Box | null => {
      const grd = el.querySelector<HTMLElement>(".grd");
      if (!grd) return null;
      let left = Infinity;
      let right = -Infinity;
      for (const child of Array.from(grd.children)) {
        const r = child.getBoundingClientRect();
        if (r.width <= 0) continue;
        left = Math.min(left, r.left);
        right = Math.max(right, r.right);
      }
      if (!Number.isFinite(left)) return null;
      // Inner edge flush to the type's own column, outer edge flush to the
      // screen, so the ring fills the lane exactly. It meets that boundary at
      // the single point of its own widest span, which is why the grid gap is
      // not needed as a margin here. Below 768px the grid is a block stack and
      // the children run the full width, so this comes out empty and the caller
      // falls back.
      const x0 = lane === "right" ? right : 0;
      const x1 = lane === "right" ? width : left;
      if (x1 - x0 <= 0) return null;
      return { c: (x0 + x1) / 2, half: (x1 - x0) / 2 };
    };

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      small = width < MOBILE;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);

      nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-halo-lane]")).map((el) => {
        const lane = (el.dataset.haloLane === "left" ? "left" : "right") as Lane;
        return {
          el,
          lane,
          content: el.querySelector<HTMLElement>(".ctr") ?? el,
          slot: readSlot(el, lane),
        };
      });

      // Walk out of <main> if need be: on About the last lane section is the
      // last child, and the thing underneath it is the footer.
      const step = (el: Element | null | undefined, back: boolean): HTMLElement | null => {
        let cur = (el ?? null) as Element | null;
        while (cur && cur !== document.body) {
          const sib = back ? cur.previousElementSibling : cur.nextElementSibling;
          if (sib) return sib.querySelector<HTMLElement>(".ctr") ?? (sib as HTMLElement);
          cur = cur.parentElement;
        }
        return null;
      };
      guards = {
        above: step(nodes[0]?.el, true),
        below: step(nodes[nodes.length - 1]?.el, false),
      };

      // A slot only comes back empty on a desktop viewport if the grid had not
      // been laid out yet. Take one more look next frame rather than sit on the
      // fallback until something happens to resize the window -- the fallback
      // is the phone treatment, and it parks the ring in the middle of the type.
      if (!small && retry > 0 && nodes.some((node) => !node.slot)) {
        retry -= 1;
        requestAnimationFrame(measure);
      }
    };

    const draw = () => {
      // Depth writes are switched off during the colour pass below, so they have
      // to be switched back on or this clear silently does nothing.
      gl.depthMask(true);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (!ready || nodes.length === 0) return;

      const scroll = window.scrollY;
      const h = height;
      const w = width;

      // Rects are read live rather than cached: they self-correct after a font
      // swap or a reflow, and they are the only honest source for a sticky
      // section, whose document position says nothing about where it is drawn.
      const stops: Stop[] = nodes.map((node) => {
        const r = node.el.getBoundingClientRect();
        return { ...node, top: r.top + scroll, bottom: r.bottom + scroll };
      });

      const centre = scroll + h / 2;
      const first = stops[0];
      const last = stops[stops.length - 1];
      const span = Math.max(1, last.bottom - first.top);
      const p = clamp01((centre - first.top) / span);

      // Arrival and departure, both measured in viewports of scroll rather than
      // in shares of the page, so they run at the same speed however long the
      // page is. `arrive` is 0 out past the screen edge and 1 once in place.
      const entryPx = ENTRY * h;
      const arrive = smooth(
        Math.min(clamp01((centre - first.top) / entryPx), clamp01((last.bottom - centre) / entryPx)),
      );
      if (arrive <= 0) return;

      // Two axes while parked, at frequencies that do not divide into each
      // other so the compound motion never quite repeats: two full spins per
      // section, and a sway slower than the page itself. The sway is zero at
      // p = 0 and p = 1, so the ring is square to the viewer at both ends of
      // its life without anything having to ease it there.
      const n = stops.length;
      const spin = p * TAU * n * 2;
      const sway = Math.sin(p * TAU * n * 0.31) * (small ? SWAY_SM : SWAY);

      /**
       * Bounding radius of the whole torus, for one section: the FULL width of
       * the free space beside that section's type, not half of it. Paired with
       * a centre on the screen edge below, that puts exactly one radius of ring
       * on screen -- which is exactly the lane, since the lane's midpoint was
       * one of the old radii in from the edge. The mark doubles and its
       * footprint does not move.
       *
       * There is no cap. An earlier one held the whole circle on screen; the
       * ring is meant to overrun the frame now, top and bottom included.
       */
      const boundOf = (s: Stop) => (!small && s.slot ? s.slot.half * 2 : (DIA_SM * h) / 2);
      /** The screen edge its lane sits against -- the centre is off-frame. */
      const centreOf = (s: Stop) =>
        !small && s.slot ? (s.lane === "right" ? w : 0) : w / 2;

      // A crossing is a seam where the lane actually changes; a seam that does
      // not move the ring needs no choreography. On a phone there are no lanes,
      // so every seam counts -- the gaps are the only place the ring can live.
      const crossings: Cross[] = [];
      for (let i = 0; i < stops.length - 1; i++) {
        if (small || stops[i].lane !== stops[i + 1].lane) {
          crossings.push({
            at: (stops[i].bottom + stops[i + 1].top) / 2,
            from: stops[i],
            to: stops[i + 1],
          });
        }
      }
      // The anchors the phase is pinned to, in document coordinates: a section's
      // centre, then the seam below it, then the next section's centre. Only
      // the first crossing contributes a `from` anchor -- every later one's
      // `from` is the previous one's `to`, and pushing it twice would put two
      // anchors on the same scroll position.
      const mid = (s: Stop) => (s.top + s.bottom) / 2;
      const anchors: { at: number; v: number }[] = [];
      if (crossings.length > 0) {
        // A whole half turn before the first section's centre and another after
        // the last, so the phase is still advancing through the arrival and the
        // departure instead of sitting frozen while the ring grows. Both are a
        // whole number of half turns from a section centre, so both ends of the
        // halo's life are still exactly face-on -- it turns its way in and out
        // rather than holding a pose.
        anchors.push({ at: first.top, v: -1 });
        anchors.push({ at: mid(crossings[0].from), v: 0 });
        crossings.forEach((c, i) => {
          anchors.push({ at: c.at, v: i + 0.5 });
          anchors.push({ at: mid(c.to), v: i + 1 });
        });
        anchors.push({ at: last.bottom, v: crossings.length + 1 });
      }

      // Psi: monotone, continuous, and the only thing anything downstream reads.
      // Flat at the value of the nearer end outside the anchors, which is what
      // makes the entrance and the exit face-on without a special case -- both
      // ends are integers.
      let psi = 0;
      if (anchors.length > 0) {
        const head = anchors[0];
        const tailA = anchors[anchors.length - 1];
        if (centre <= head.at) psi = head.v;
        else if (centre >= tailA.at) psi = tailA.v;
        else {
          for (let i = 0; i < anchors.length - 1; i++) {
            const a = anchors[i];
            const b = anchors[i + 1];
            if (centre >= a.at && centre <= b.at) {
              psi = a.v + (b.v - a.v) * hold((centre - a.at) / Math.max(1, b.at - a.at));
              break;
            }
          }
        }
      }

      // Which crossing the phase is inside, and how far through it. The choice
      // changes at integer psi, where everything it feeds is stationary -- see
      // the note at the top of the file. A phone keeps the old nearest-gap
      // choice, because there the gap drives a fade rather than a lane change
      // and the two switch in different places.
      const j = crossings.length
        ? Math.min(crossings.length - 1, Math.max(0, Math.floor(psi)))
        : 0;
      const phi = psi - j;
      let near: Cross | null = null;
      for (const c of crossings) {
        if (!near || Math.abs(centre - c.at) < Math.abs(centre - near.at)) near = c;
      }
      const active: Cross | null = small ? near : (crossings[j] ?? null);

      // Every degree of tilt the ring has, and nothing else contributes. Not on
      // a phone: there are no lanes to change there.
      const tilt = small ? 0 : Math.PI * psi;

      // Zero at every section centre, one at every seam, with zero slope at
      // both -- so the dip and the vertical path meet the parked state
      // smoothly, and are spent exactly where the band being measured changes.
      // Zero outside the run of crossings as well: the phase keeps advancing
      // through the arrival and the departure, but there is no band out there
      // to dip toward. sin is already zero at both ends, so this is continuous.
      const bell =
        small || psi <= 0 || psi >= crossings.length
          ? 0
          : Math.sin(Math.PI * psi) ** 2;
      // Sideways travel, and the band's hold on the fit. The fit is a plateau
      // with a shoulder rather than a spike, because it has to hold for as long
      // as the ring's width is over a type column, not just at one instant.
      const lat = smooth(clamp01((phi - 0.5) / LAT + 0.5));
      const commit = small
        ? 1
        : smooth(clamp01((LAT_OUT - Math.abs(phi - 0.5)) / (LAT_OUT - LAT / 2)));
      // How far the ring has left its parked height for the band. A phone rides
      // the gap outright, as it always has.
      const ride = active ? (small ? 1 : bell) : 0;

      // Orthographic extents of the rotated torus, exactly, as multiples of the
      // ring radius. A full torus's outline is unchanged by a spin about its
      // own axis, so only the tilt and the sway enter, and both fall out in
      // closed form: the ring contributes its radius foreshortened, the tube
      // contributes TUBE in every direction.
      //
      // Worth deriving rather than bounding. Edge-on the ring is a sixth as
      // tall as it is wide, and that sixth is the whole reason it can cross a
      // narrow band at nearly full size instead of shrinking to fit.
      const kY = (Math.abs(Math.cos(tilt)) + TUBE) / (1 + TUBE);
      const kX =
        (Math.hypot(Math.cos(sway), Math.sin(sway) * Math.sin(tilt)) + TUBE) / (1 + TUBE);

      let seamY = 0;
      let room = 0;
      if (active) {
        // Unclipped, both of them. An earlier version clipped this band to the
        // viewport, and `room` is the denominator of `fit` -- so as the gap
        // scrolled off the top of the screen, `room` collapsed towards zero and
        // the ring's size stepped by several per cent in a single frame. That
        // was a snap, and no weighting in front of it removed one.
        //
        // The height of the gap is a property of the two blocks of type, not of
        // where the page happens to be scrolled. The ring's pull toward it is
        // already weighted by `ride`, which falls off far faster than the band
        // runs away, so an off-screen band cannot drag the ring after it.
        const ar = active.from.content.getBoundingClientRect();
        const br = active.to.content.getBoundingClientRect();
        seamY = (ar.bottom + br.top) / 2;
        room = Math.max(0, (br.top - ar.bottom) / 2);
      }

      // Each section is a different size, because each leaves a different amount
      // of room beside its own type. The handoff rides the same travel as the
      // sideways move, so there is never a bare resize -- the ring only ever
      // changes size while it is already moving. The dip rides on top of that:
      // deepest on the seam, spent by the anchors either side of it.
      const from = active ? active.from : stops[0];
      const to = active ? active.to : from;
      const grown = lerp(ENTRY_SCALE, 1, arrive);
      const dip = 1 - (1 - SEAM_SCALE) * bell;
      const bound = lerp(boundOf(from), boundOf(to), lat) * grown * dip;

      // A backstop, not the gesture: shrink by whatever further factor the band
      // demands, measured against the ring's real height rather than against a
      // worst-case radius. Turning edge-on does most of the work -- it cuts the
      // height to a sixth -- so this bites only on the shoulders of the travel,
      // where the ring is half turned and still near full size. On a phone
      // there is no flip and the ring stays face-on, so there this is the whole
      // of the fit and it applies everywhere.
      const fit = room > 0 ? Math.min(1, room / (bound * kY)) : 1;
      let half = bound * lerp(1, fit, commit);
      let halfY = half * kY;
      let halfX = half * kX;

      // The vertical path: off its parked height, onto the band, and back. At
      // the seam `ride` is 1 and the centre is on the band exactly, so the ring
      // is carried up the screen with the gap rather than sliding across it.
      const parkedY = h / 2 + Math.sin(p * TAU * 1.3) * (small ? DRIFT_SM : DRIFT) * h;
      let y = lerp(parkedY, seamY, ride);

      // The type at either end of the halo's life, whose sections are not lane
      // sections at all and run the full width. Nothing else bounds the ring
      // vertically now -- it is meant to overrun the frame -- so these are the
      // guard rails alone, and they go to infinity once their type is well off
      // screen. If what is left between them is too short, the ring is what
      // gives.
      const above = guards.above ? guards.above.getBoundingClientRect().bottom : -Infinity;
      const below = guards.below ? guards.below.getBoundingClientRect().top : Infinity;
      if (halfY > 0 && below - above < halfY * 2) {
        const squeeze = Math.max(0, (below - above) / 2) / halfY;
        half *= squeeze;
        halfX *= squeeze;
        halfY *= squeeze;
      }
      y = clampTo(y, above + halfY, below - halfY);

      // Sideways: between the two lanes' edges, on the same travel as the size.
      // There is no flight in from off-screen any more -- the ring already
      // lives off the edge, so it arrives by growing where it stands.
      const x = lerp(centreOf(from), centreOf(to), lat);

      // Half of the ring is off-frame from its first frame, so growing in from
      // ENTRY_SCALE would pop. Fade the first and last sliver of the arrival.
      // On a phone there is no lane to leave through, so the ring belongs to
      // the gaps between sections and arrives and leaves with each one.
      let alpha = smooth(clamp01(arrive / 0.15));
      if (small) {
        alpha = active ? smooth(clamp01(1 - Math.abs(seamY - h / 2) / (0.55 * h))) : 0;
      }
      if (alpha < 0.004 || half <= 0) return;
      // Entirely past an edge: cheaper to skip than to rasterise out of frame.
      if (x - halfX >= w || x + halfX <= 0) return;

      const S = half / (1 + TUBE);

      // Orthographic, in pixels: screen placement is then exact, which is what
      // makes the clearance guarantee above hold at every viewport size.
      const proj = new Float32Array([
        2 / w, 0, 0, 0,
        0, -2 / h, 0, 0,
        0, 0, -1 / (S * 4), 0,
        -1, 1, 0, 1,
      ]);

      // Composed rather than hand-expanded -- expanding three rotations by hand
      // is exactly where sign errors hide.
      const rot = mul3(mul3(rotY(sway), rotX(tilt)), rotZ(spin));

      // Column-major, with the ring radius folded into the basis vectors.
      const model = new Float32Array([
        rot[0] * S, rot[3] * S, rot[6] * S, 0,
        rot[1] * S, rot[4] * S, rot[7] * S, 0,
        rot[2] * S, rot[5] * S, rot[8] * S, 0,
        x, y, 0, 1,
      ]);

      gl.uniformMatrix4fv(uModel, false, model);
      gl.uniformMatrix4fv(uProj, false, proj);
      gl.uniform1f(uAlpha, alpha);
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Depth prepass. Without it the far wall of the tube blends through the
      // near one while alpha < 1, so the ring goes muddy exactly when it is
      // fading -- which, now that it fades on arrival and departure, is when it
      // is most on show.
      gl.colorMask(false, false, false, false);
      gl.depthFunc(gl.LESS);
      gl.drawElements(gl.TRIANGLES, mesh.idx.length, gl.UNSIGNED_INT, 0);
      gl.colorMask(true, true, true, true);
      gl.depthMask(false);
      gl.depthFunc(gl.LEQUAL);
      gl.drawElements(gl.TRIANGLES, mesh.idx.length, gl.UNSIGNED_INT, 0);
    };

    measure();

    if (reduced) {
      const render = () => {
        measure();
        draw();
      };
      image.addEventListener("load", render);
      window.addEventListener("resize", render);
      return () => {
        image.removeEventListener("load", render);
        window.removeEventListener("resize", render);
      };
    }

    let frame = requestAnimationFrame(function loop() {
      draw();
      frame = requestAnimationFrame(loop);
    });
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(measure);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="halo-layer" />;
}
