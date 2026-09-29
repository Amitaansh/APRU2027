import { Social } from "@apru/ui";
import { site } from "@apru/content";

/**
 * "Remove the APRU at the bottom, keep footer simple."
 *
 * The portfolio edition ends every page with four serif capitals running gutter
 * to gutter and the halo turning behind them. This is what is left when that
 * goes: who we are, how to reach us, and one line of small print.
 *
 * It is also light rather than dark. The portfolio's footer is the site's one
 * permanently black surface, which is why every page there has to arrive at it
 * already dark through a curtain. With no curtain in this edition there is
 * nothing to arrive from, and a black band under a white page would be a
 * decorative event on a site that asked for none.
 *
 * THE MARKS ARE THE OFFICIAL FILES NOW, not the typographic stand-ins in
 * Logos.tsx. The designer's package supplies both lockups, and the client asked
 * for APRU, the Department of Architecture and NUS CDE — which is those two
 * files, since the NUS lockup already carries the department and the college
 * beside the shield.
 *
 * THE APRU MARK IS THE NETWORK'S SCL LOCKUP -- ring, APRU, and "Sustainable
 * Cities and Landscapes" -- supplied black, so it sits on this white ground as
 * it comes. It replaced the ring-and-wordmark the key visual still carries.
 *
 * The NUS lockup is supplied WHITE, for the key visual, where it sits on the
 * artwork. Here it is inverted rather than re-drawn: the file is a single
 * `fill: #fff` throughout, so invert(1) is exactly black and nothing else in
 * it moves. A second, black copy would be one more asset to keep in step with
 * the brand package for no gain.
 *
 * THE ADDRESS IS THE DEPARTMENT'S, not the conference venue's. This is SDE1,
 * where the Department of Architecture sits; the conference itself is in SDE3,
 * which /visitors carries. Both are on Architecture Drive, which is exactly why
 * they are worth keeping apart. The unit number and the switchboard that used to
 * be here are gone: the client set the format for this block line by line, and
 * neither is in it.
 *
 * THE TWO MARKS ARE ONE HEIGHT. They were sized to sit at the same cap height,
 * which put the NUS lockup a hair shorter than the APRU wordmark; the client
 * drew them level -- "NUS logo should be the same size as APRU logo" -- so the
 * boxes are now the same height and the shield stands as tall as the ring.
 *
 * THE SMALL PRINT IS THE COPYRIGHT LINE ALONE. The sentence used to open with
 * the conference name and dates; the client struck that clause. What is left
 * is the notice itself. The location went with the clause: "Singapore (c)
 * National University of Singapore" read as a sentence with a word missing,
 * and the address block above already says where.
 *
 * The social glyphs are the classic filled marks -- "use a more classic
 * icon?" -- see `glyphs` on Social.
 *
 * ON A PHONE THE TWO MARKS SHARE A ROW. At 34rem they are far wider than a
 * phone's measure, so the NUS lockup wrapped under the APRU one; the client
 * asked for them "in a row" there and only there. With the wider SCL lockup,
 * 25rem on a 16rem gap is 338rem, inside the 345 a phone holds, and since rem
 * tracks the viewport below `md` that fits at every phone width.
 *
 * And on a tablet. The pair is 462rem at 34rem tall, wider than the seven
 * columns it starts in until about 1000px, and wrapped there. It no longer
 * wraps anywhere: the row runs on into the two empty columns between it and
 * the contact block, and still ends clear of that block at 768 (443px
 * against 466).
 *
 * THE CONTACT BLOCK SITS HARD RIGHT on a wide screen -- "align to far right"
 * -- so the footer reads as two ends, who we are and how to reach us. On a
 * phone it stacks under the address and keeps the left edge.
 */

/*
 * THE MARKS CARRY THE LINKS -- "embed link in logo". The ring goes to the
 * APRU-SCL programme page and the NUS lockup to the department, which is why
 * the department's line in the address below is no longer a link of its own:
 * "remove the link for DOA". The college and the university keep theirs.
 */
const MARKS = [
  {
    src: "/images/apru-scl-black.png",
    alt: "APRU Sustainable Cities and Landscapes",
    width: 1103,
    height: 202,
    url: "https://gsi.uoregon.edu/apru-scl",
    invert: false,
  },
  {
    src: "/images/nus-doa-white.svg",
    alt: "National University of Singapore, Department of Architecture, College of Design and Engineering",
    width: 690,
    height: 93,
    url: "https://cde.nus.edu.sg/arch/",
    invert: true,
  },
];

const ADDRESS_LINES = [
  { label: "Department of Architecture" },
  { label: "College of Design and Engineering", url: "https://cde.nus.edu.sg/" },
  { label: "National University of Singapore", url: "https://nus.edu.sg/" },
];

export function Footer() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || site.contactEmail;

  return (
    <footer className="border-t border-bk/10 pb-[32rem] pt-[40rem] max-md:pb-[24rem] max-md:pt-[28rem]">
      <div className="ctr">
        <div className="grd">
          <div style={{ gridColumn: "span 7" }}>
            <div className="flex items-center gap-x-[24rem] max-md:gap-x-[16rem]">
              {MARKS.map((mark) => (
                <a key={mark.url} href={mark.url} target="_blank" rel="noreferrer" className="shrink-0">
                  <img
                    src={mark.src}
                    alt={mark.alt}
                    width={mark.width}
                    height={mark.height}
                    className={"block h-[34rem] w-auto max-md:h-[25rem]" + (mark.invert ? " invert" : "")}
                  />
                </a>
              ))}
            </div>

            <address className="t-b2 not-italic pt-[16rem] leading-[1.6]">
              {ADDRESS_LINES.map((line) => (
                <span key={line.label} className="block">
                  {line.url ? (
                    <a href={line.url} target="_blank" rel="noreferrer" className="link">
                      {line.label}
                    </a>
                  ) : (
                    line.label
                  )}
                </span>
              ))}
              4 Architecture Drive
              <br />
              {/* No thin space in the postcode — the client set it closed up. */}
              Singapore 117566
            </address>
          </div>

          {/*
           * The email is the site's contact affordance. "Contact and FAQ" was
           * here beside it and came out at the client's request.
           */}
          <div
            style={{ gridColumn: "10 / span 6" }}
            className="flex flex-col items-start gap-[20rem] max-md:pt-[24rem] md:items-end md:text-right"
          >
            <a href={"mailto:" + contactEmail} className="t-b1 link">
              {contactEmail}
            </a>

            <div>
              <p className="t-lbl dim pb-[8rem]">Follow Us</p>
              <Social glyphs="classic" className="md:justify-end" />
            </div>
          </div>
        </div>

        {/* One line, left-aligned, rather than the three columns this used to
            set across the grid. */}
        <p className="t-b2 pt-[32rem] max-md:pt-[24rem]">
          &copy; National University of Singapore. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
