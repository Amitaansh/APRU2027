"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { SectionGrid, type HaloLane } from "@/components/ui/Section";

/**
 * The section where the site goes dark.
 *
 * The section is 200vh with a pinned 100vh inner, so the screen holds still
 * while black rises from the bottom edge and covers it, then releases into the
 * dark half of the page. That is the reference's own construction — a tall
 * section with `position: sticky` inside it — with a wipe in place of its
 * 300ms background crossfade.
 *
 *   --wipe  100% -> 0%  across the section's 100vh of sticky travel
 *
 * Because the wipe is a pure function of scroll position it reverses exactly on
 * the way back up; there is no trigger to get stuck in the wrong state.
 *
 * WHY A DUPLICATED LAYER. A white overlay under `mix-blend-mode: difference`
 * would invert the page for free and need no duplicate — but it inverts every
 * colour, so the accent (#c2410c) would come out cyan and the brand orange
 * would come out blue. The palette discipline is the point of this design, so
 * the dark copy is rendered honestly with the dark tokens instead.
 *
 * The duplicate is decorative only: `aria-hidden`, `pointer-events: none`, and
 * the light copy underneath stays the real DOM the whole time. Once the wipe
 * completes, the duplicate is dropped and the section itself takes
 * `data-ground="dark"` — so links, focus rings and screen readers are always
 * working against one live copy, never the overlay.
 */
export function Curtain({
  id,
  label,
  halo,
  height,
  children,
}: {
  id?: string;
  label?: string;
  halo?: HaloLane;
  /**
   * Total scroll length of the section, default 200vh. The wipe is measured
   * against `rect.height - innerHeight`, so shortening this shortens the hold
   * and the wipe together and nothing else has to be told. Anything at or below
   * 100vh has no travel to wipe across and the section is simply dark.
   */
  height?: string;
  children: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const overlay = overlayRef.current;
    if (!section || !overlay) return;

    // Reduced motion, or no room to pin: the section is simply dark.
    const collapse =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth < 768;
    if (collapse) {
      section.dataset.ground = "dark";
      overlay.hidden = true;
      return;
    }

    let done = false;
    let frame = 0;

    const tick = () => {
      // Measured off the rect rather than offsetTop, which is relative to the
      // offset parent and would be wrong the moment anything above is
      // positioned.
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.max(0, Math.min(1, -rect.top / travel)) : 0;

      section.style.setProperty("--wipe", (1 - progress) * 100 + "%");

      // Hand over to the real section once the screen is covered, so the live
      // copy is the one being read and focused from then on.
      const covered = progress > 0.995;
      if (covered !== done) {
        done = covered;
        overlay.hidden = covered;
        if (covered) section.dataset.ground = "dark";
        else delete section.dataset.ground;
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      data-halo-lane={halo}
      className="curtain"
      style={height ? ({ "--curtain-h": height } as CSSProperties) : undefined}
    >
      <div className="curtain-pin">
        <div className="curtain-face">
          <div className="ctr">
            <SectionGrid label={label} halo={halo}>
              {children}
            </SectionGrid>
          </div>
        </div>

        <div
          ref={overlayRef}
          aria-hidden="true"
          data-ground="dark"
          className="curtain-face curtain-veil"
        >
          <div className="ctr">
            <SectionGrid label={label} halo={halo}>
              {children}
            </SectionGrid>
          </div>
        </div>
      </div>
    </section>
  );
}
