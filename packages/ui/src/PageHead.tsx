import type { ReactNode } from "react";
import { MaskLines, Reveal } from "./Reveal";

/**
 * How every page other than the homepage opens.
 *
 * The top padding clears the fixed header, which has no background of its own
 * to push content down with. It is set by `.pg-head` rather than by utilities
 * here, because the two editions run different header heights and the client
 * asked for the space above the title to come down — see base.css for the
 * default and each app's globals.css for its own value. The title is authored
 * as separate lines because each one becomes its own mask — see MaskLines.
 *
 * The lede sits in the right-hand columns rather than under the title, so the
 * opening reads as a spread rather than as a stacked header.
 *
 * The rule underneath draws itself across once the masks have landed — the
 * delay is what makes it read as the close of the opening rather than as part
 * of it. Every page opens with this same component, so this is the one gesture
 * they all share.
 */
export function PageHead({
  label,
  title,
  lede,
}: {
  label: string;
  title: string[];
  lede?: ReactNode;
}) {
  return (
    <section className="pg-head">
      <div className="ctr">
        <Reveal className="rise pb-[40rem] max-md:pb-[24rem]">
          <p className="t-lbl dim">{label}</p>
        </Reveal>
        <div className="grd">
          <div style={{ gridColumn: "1 / span 9" }}>
            <MaskLines as="h1" immediate className="t-h1" lines={title} />
          </div>
          {lede && (
            <div style={{ gridColumn: "11 / span 5" }} className="max-md:mt-[40rem]">
              <Reveal>
                <div className="t-b1 rise max-w-[46ch]">{lede}</div>
              </Reveal>
            </div>
          )}
        </div>

        {/* Gated on the fonts like the title, not on the scroll — it is already
            on screen, and an observer would release it before the type. */}
        <Reveal immediate className="pt-[80rem] max-md:pt-[40rem]">
          <div className="rule-solid rule-draw" style={{ transitionDelay: "0.3s" }} />
        </Reveal>
      </div>
    </section>
  );
}
