"use client";

import { useEffect, useRef } from "react";

/**
 * The APRU halo: the mark itself, as a torus, whole and on screen.
 *
 * WHY THE PATTERN IS UNWRAPPED RATHER THAN COMPUTED. The icon looks like a
 * simple four-cycle gradient, and two earlier attempts treated it as one. It is
 * not. Measured off app/icon.png:
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
 * still leaves a third of the variance. So the pattern is taken from the
 * artwork directly, resampled into polar space: angle across the texture's
 * width, radial position across its height.
 *
 * THE CHOREOGRAPHY. The whole circle is visible, sized to fit inside the lane
 * Section reserves for it. It turns on three axes at once -- a full spin about
 * its own axis, a 55-degree rock about the horizontal, and a slower sway -- at
 * frequencies that do not divide into each other, so the motion never quite
 * repeats. It opens from 55 degrees on arrival and closes the same way.
 *
 * HOW IT CHANGES LANES WITHOUT CROSSING TYPE. Between two sections there is an
 * empty band: the bottom of one section's type to the top of the next one's.
 * The ring rides that band. As a crossing approaches it is drawn onto the band
 * and shrunk by exactly the factor that makes it fit -- `room / bound`, derived,
 * not guessed -- then it slides sideways while the band carries it up the
 * screen, and grows back on the far side. The band is measured live off the two
 * content boxes, so a sticky section (the curtain) reports the room it actually
 * has, and the fit is right at every viewport rather than at the one it was
 * tuned on.
 *
 * All of it is a pure function of scrollY, so scrolling back up retraces the
 * path exactly -- there is no eased state to get stranded in the wrong place.
 */

/**
 * Icon geometry, measured off app/icon.png at 512px.
 *
 * `inset` trims the antialiased edge on both sides of the band. Without it
 * ~1.5% of the unwrapped texels sample the white outside the annulus, which
 * shows on the torus as a pale fringe running around the tube.
 */
const ICON = { size: 512, cx: 256, cy: 257, rOuter: 144, band: 45, inset: 2.5 };

/** Polar unwrap resolution. Wide, because the seams run in the angular axis. */
const TEX_W = 2048;
const TEX_H = 128;

/** Torus mesh density. */
const SEG_U = 320;
const SEG_V = 48;

/** Tube radius as a fraction of ring radius. */
const TUBE = 0.2;

const TAU = Math.PI * 2;

/**
 * On a desktop the diameter is not a constant at all: the ring fills whatever
 * room sits beside that section's own content, measured off the grid. On a
 * phone there is no lane to fill, so it falls back to a fraction of the height.
 */
const DIA_SM = 0.3;

/** Rock about the horizontal axis. Centred on face-on, so it passes flat. */
const ROCK = (55 * Math.PI) / 180;
/** Sway about the vertical axis. */
const SWAY = (18 * Math.PI) / 180;
/** Vertical wander while parked, as a fraction of viewport height. */
const DRIFT = 0.06;
/** Scroll spent arriving and leaving, in viewports. Not a share of the page:
 *  a fraction of the span would make the entrance crawl on a long page. */
const ENTRY = 0.5;
/** How small it is when it first appears, out past the screen edge. */
const ENTRY_SCALE = 0.3;
/** Half the scroll spent riding a seam sideways, as a fraction of the viewport. */
const RIDE = 0.14;
/** Shortest ease out of a seam, as a multiple of the ride. The real one is
 *  derived from how far the full-size ring overhangs the band -- see draw(). */
const EASE = 1.35;

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
 * Blinn-Phong over the unwrapped artwork. The lighting multiplies the sampled
 * colour rather than adding to it, so no hue enters that the icon does not
 * already have -- only the specular term brightens, and only narrowly.
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
  vec3 col = base * (0.55 + 0.62 * diff) + vec3(spec * 0.35);
  gl_FragColor = vec4(col, uAlpha);
}
`;

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const smooth = (t: number) => t * t * (3 - 2 * t);
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

/** Resample the icon from (x, y) into (angle, radial position). */
function unwrap(source: HTMLImageElement): Uint8Array {
  const scratch = document.createElement("canvas");
  scratch.width = ICON.size;
  scratch.height = ICON.size;
  const sctx = scratch.getContext("2d", { willReadFrequently: true });
  if (!sctx) throw new Error("no 2d context");
  sctx.drawImage(source, 0, 0, ICON.size, ICON.size);
  const src = sctx.getImageData(0, 0, ICON.size, ICON.size).data;

  const out = new Uint8Array(TEX_W * TEX_H * 4);
  const rInner = ICON.rOuter - ICON.band + ICON.inset;
  const usable = ICON.band - ICON.inset * 2;

  for (let j = 0; j < TEX_H; j++) {
    // t runs across the band: 0 at the inner edge, 1 at the outer.
    const r = rInner + ((j + 0.5) / TEX_H) * usable;
    for (let i = 0; i < TEX_W; i++) {
      const a = ((i + 0.5) / TEX_W) * Math.PI * 2;
      const x = ICON.cx + Math.cos(a) * r;
      const y = ICON.cy + Math.sin(a) * r;

      // Bilinear, so the seams stay smooth rather than stair-stepping.
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const fx = x - x0;
      const fy = y - y0;
      const o = (j * TEX_W + i) * 4;
      for (let c = 0; c < 3; c++) {
        const p = (px: number, py: number) =>
          src[(Math.min(ICON.size - 1, Math.max(0, py)) * ICON.size +
            Math.min(ICON.size - 1, Math.max(0, px))) * 4 + c];
        const top = p(x0, y0) * (1 - fx) + p(x0 + 1, y0) * fx;
        const bot = p(x0, y0 + 1) * (1 - fx) + p(x0 + 1, y0 + 1) * fx;
        out[o + c] = Math.round(top * (1 - fy) + bot * fy);
      }
      out[o + 3] = 255;
    }
  }
  return out;
}

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
      uv.push(u, v);
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
      try {
        const pixels = unwrap(image);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D, 0, gl.RGBA, TEX_W, TEX_H, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels,
        );
        // Repeat on both axes: the band wraps the tube once, and the join where
        // its inner edge meets its outer is the seam that falls on the far side.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        ready = true;
      } catch {
        ready = false;
      }
    };
    image.src = "/icon.png";

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
      const gap = parseFloat(getComputedStyle(grd).columnGap) || 0;
      let left = Infinity;
      let right = -Infinity;
      for (const child of Array.from(grd.children)) {
        const r = child.getBoundingClientRect();
        if (r.width <= 0) continue;
        left = Math.min(left, r.left);
        right = Math.max(right, r.right);
      }
      if (!Number.isFinite(left)) return null;
      // Inner edge one grid gap clear of the type, outer edge flush to the
      // screen. Below 768px the grid is a block stack and the children run the
      // full width, so this comes out empty and the caller falls back.
      const x0 = lane === "right" ? right + gap : 0;
      const x1 = lane === "right" ? width : left - gap;
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
      // Which end of its life this is -- and so which edge it came in through.
      const endLane = centre - first.top <= last.bottom - centre ? first.lane : last.lane;

      // Three axes at frequencies that do not divide into each other, so the
      // compound motion never quite repeats: one full spin per section, one
      // rock per two, and a sway slower than the page itself. Both sinusoids
      // are zero at p = 0 and p = 1, so the opening lerp below has nothing to
      // jump over.
      const n = stops.length;
      const spin = p * TAU * n;
      const rock = Math.sin(p * TAU * n * 0.5) * ROCK;
      const sway = Math.sin(p * TAU * n * 0.31) * SWAY;
      const tilt = lerp(ROCK, rock, arrive);

      const air = h * 0.02;
      /**
       * Bounding radius of the whole torus, for one section. Under an
       * orthographic projection a rotation can only shrink the projected extent,
       * never push it past this, so fitting the bound inside the section's free
       * space is a guarantee rather than a measurement that happens to hold at
       * one viewport size.
       *
       * The cap is not a taste decision -- it is what keeps the whole circle on
       * screen once the vertical drift is spent. At 16:9 it never binds.
       */
      const boundOf = (s: Stop) =>
        Math.min(
          !small && s.slot ? s.slot.half : (DIA_SM * h) / 2,
          h / 2 - air - DRIFT * h,
        );
      const centreOf = (s: Stop) => (!small && s.slot ? s.slot.c : w / 2);

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
      let near: Cross | null = null;
      for (const c of crossings) {
        if (!near || Math.abs(centre - c.at) < Math.abs(centre - near.at)) near = c;
      }

      const W = RIDE * h;
      let dip = 0;
      let k = 0;
      let seamY = 0;
      let room = 0;
      let a = 0;
      if (near) {
        const off = centre - near.at;
        a = Math.abs(off);
        k = smooth(clamp01((off + W) / (2 * W)));
        // Clipped to the viewport first. A band that runs off the bottom of the
        // screen would otherwise drag the ring off with it -- the clipped band
        // is a subset of the real one, so staying inside it still clears the
        // type, and the ring stays whole and on screen.
        const ar = near.from.content.getBoundingClientRect();
        const br = near.to.content.getBoundingClientRect();
        const lo = Math.max(ar.bottom, 0);
        const hi = Math.min(br.top, h);
        seamY = (lo + hi) / 2;
        room = Math.max(0, (hi - lo) / 2);
      }

      // Each section is a different size, because each leaves a different
      // amount of room beside its own type. The resize rides the lane change on
      // the same k as the sideways travel, so there is never a bare resize --
      // the ring only ever changes size while it is already moving.
      const from = near ? near.from : stops[0];
      const to = near ? near.to : from;
      const travel = near ? k : 0;
      const grown = lerp(ENTRY_SCALE, 1, arrive);
      const bound = lerp(boundOf(from), boundOf(to), travel) * grown;

      if (near) {
        // How far out of the band the ring hangs at full size is exactly how
        // much room it needs to get back to full size, so the ease is derived
        // rather than picked: it releases at `bound - room` from the seam and
        // no later. A fixed fraction of the viewport was the wrong shape --
        // these sections are two thirds of a screen tall, so a 0.45h ease
        // never released at all and the ring never reached its own size.
        // Where the band is already generous this collapses to the floor and
        // the ring does not shrink at any point.
        const E = Math.max(W * EASE, bound - room);
        // A plateau, not a peak: the ring is fully committed to the band for
        // the whole of the sideways travel, which is what makes the clearance
        // below hold across the entire crossing instead of at one instant.
        dip = small || a <= W ? 1 : smooth(clamp01(1 - (a - W) / (E - W)));
      }

      // Shrink by exactly the factor that fits the band, and no more. Where the
      // band is generous -- the curtain, whose content is pinned and centred --
      // this is 1 and the ring does not shrink at all.
      const fit = room > 0 ? Math.min(1, room / bound) : 1;
      let half = bound * lerp(1, fit, dip);

      let y = h / 2 + Math.sin(p * TAU * 1.3) * DRIFT * h;
      if (near) {
        // A seam has two sides, and only one of them binds at a time until the
        // ring is actually between lanes. Before the crossing it sits in
        // `from`'s lane -- empty for `from`, but part of `to`'s content columns
        // -- so only its lower edge is at risk. After the crossing it is the
        // other way round. Both bind together only during the sideways travel,
        // and there the ring is already fitted to the band, so they meet at
        // exactly one point and it rides the seam.
        //
        // These are hard, not eased. A soft pull left the vertical drift free
        // to push the ring past the band by up to 30px near a seam, which is
        // precisely where there is no room to spare.
        if (k < 1) y = Math.min(y, seamY + room - half);
        if (k > 0) y = Math.max(y, seamY - room + half);
      }

      // One vertical interval, from two sources: the type at either end of the
      // halo's life, whose sections are not lane sections at all and run the
      // full width, and the screen edges themselves less a little air. Taking
      // them together means they can never fight -- if what is left is too
      // short for the ring, the ring is what gives.
      const above = guards.above ? guards.above.getBoundingClientRect().bottom : -Infinity;
      const below = guards.below ? guards.below.getBoundingClientRect().top : Infinity;
      const lo = Math.max(above, air);
      const hi = Math.min(below, h - air);
      if (hi - lo < half * 2) half = Math.max(0, (hi - lo) / 2);
      y = clampTo(y, lo + half, hi - half);

      // Sideways: between the two sections' slots while crossing, and from out
      // past the screen edge while arriving or leaving. It enters and leaves
      // through the edge its own lane sits against, so neither end crosses type.
      const parked = lerp(centreOf(from), centreOf(to), travel);
      const offscreen = endLane === "right" ? w + half : -half;
      const x = lerp(offscreen, parked, arrive);

      // No fade on a desktop: going off the edge is the whole entrance. On a
      // phone there is no lane to leave through, so the ring belongs to the gaps
      // between sections and arrives and leaves with each one.
      let alpha = 1;
      if (small) {
        alpha = near ? smooth(clamp01(1 - Math.abs(seamY - h / 2) / (0.55 * h))) : 0;
      }
      if (alpha < 0.004 || half <= 0) return;
      // Entirely past an edge: cheaper to skip than to rasterise out of frame.
      if (x - half >= w || x + half <= 0) return;

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
