import { Reveal } from "./Reveal";

/**
 * The section's name, set large in the serif and turned to read bottom-to-top
 * up the left column.
 *
 * `writing-mode: vertical-rl` alone reads top-to-bottom; the 180 turn in
 * `.sec-label` is what gets it the other way round, which is the convention for
 * a spine. It falls back to horizontal under 768px, where there is no spare
 * column to give it.
 */
export function SectionLabel({ children }: { children: string }) {
  return (
    <Reveal className="rise">
      <span className="sec-label block">{children}</span>
    </Reveal>
  );
}
