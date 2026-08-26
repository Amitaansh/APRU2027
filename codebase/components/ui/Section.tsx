import type { ReactNode } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * A section of the page, on the fifteen-column grid.
 *
 * `ground="dark"` paints it black; nothing inside needs to know, because every
 * rule, underline and border on the site is drawn in `currentColor`.
 *
 * `halo` names the lane the halo occupies while this section owns the viewport,
 * and is the ONLY thing that has to be said. The content columns are derived
 * from it as the complement, so the mark and the type can never collide — the
 * old API took four separate props and guaranteed nothing.
 *
 *   halo="right"  halo in cols 11-15, label + content in 1-10
 *   halo="left"   halo in cols 1-5,   label + content in 6-15
 *
 * `flow` drops the top padding so a section reads as a continuation of the one
 * above it rather than paying the full rhythm twice at the seam.
 */

export type HaloLane = "left" | "right";

/** Where the label and the body sit, given the lane the halo has taken. */
const COLUMNS: Record<"none" | HaloLane, { label: string; body: string }> = {
  none: { label: "1 / span 3", body: "4 / span 12" },
  right: { label: "1 / span 2", body: "3 / span 8" },
  left: { label: "6 / span 2", body: "8 / span 8" },
};

/**
 * The label-and-body grid, without the surrounding <section>.
 *
 * Curtain renders this twice — once light, once dark — so it has to be sharable
 * or the two copies would drift apart and the wipe would show a seam.
 */
export function SectionGrid({
  label,
  halo,
  spine = false,
  children,
}: {
  label?: string;
  halo?: HaloLane;
  /**
   * Sticks the label to the top of the viewport for the length of the section
   * — see `.sec-spine`. Section opts in; Curtain deliberately does not, because
   * its face is already pinned.
   */
  spine?: boolean;
  children: ReactNode;
}) {
  const columns = COLUMNS[halo ?? "none"];

  if (!label && !halo) return <>{children}</>;

  return (
    <div className="grd">
      {label && (
        <div
          className={"max-md:mb-[24rem]" + (spine ? " sec-spine" : "")}
          style={{ gridColumn: columns.label }}
        >
          <SectionLabel>{label}</SectionLabel>
        </div>
      )}
      <div style={{ gridColumn: columns.body }}>{children}</div>
    </div>
  );
}

export function Section({
  id,
  label,
  children,
  ground,
  halo,
  flow = false,
  className = "",
}: {
  id?: string;
  label?: string;
  children: ReactNode;
  ground?: "dark";
  halo?: HaloLane;
  flow?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-ground={ground}
      data-halo-lane={halo}
      className={"pad " + (flow ? "pad-flow " : "") + className}
    >
      <div className="ctr">
        <SectionGrid label={label} halo={halo} spine>
          {children}
        </SectionGrid>
      </div>
    </section>
  );
}
