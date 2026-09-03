import Link from "next/link";
import { LogoNUS, Social } from "@apru/ui";
import { site } from "@apru/content";

/**
 * "Remove the APRU at the bottom, keep footer simple."
 *
 * The portfolio edition ends every page with four serif capitals running gutter
 * to gutter and the halo turning behind them. This is what is left when that
 * goes: where we are, how to reach us, and the line of small print.
 *
 * It is also light rather than dark. The portfolio's footer is the site's one
 * permanently black surface, which is why every page there has to arrive at it
 * already dark through a curtain. With no curtain in this edition there is
 * nothing to arrive from, and a black band under a white page would be a
 * decorative event on a site that asked for none.
 */
export function Footer() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || site.contactEmail;

  return (
    <footer className="border-t border-bk/10 pb-[40rem] pt-[70rem] max-md:pb-[28rem] max-md:pt-[44rem]">
      <div className="ctr">
        <div className="grd">
          {/*
           * The department, not the conference venue. This address is SDE1,
           * where the Department of Architecture sits; the conference itself is
           * in SDE3, which /visitors carries. Both are on Architecture Drive,
           * which is exactly why they are worth keeping apart.
           */}
          <div style={{ gridColumn: "span 7" }}>
            <a
              href="https://cde.nus.edu.sg/arch/"
              target="_blank"
              rel="noreferrer"
              className="inline-block"
            >
              <LogoNUS />
            </a>
            <address className="t-b2 not-italic pt-[18rem] leading-[1.7]">
              Department of Architecture
              <br />
              National University of Singapore
              <br />
              College of Design and Engineering
              <br />
              4 Architecture Drive, SDE1 #03-01
              <br />
              Singapore 117 566
              <br />
              <a href="tel:+6565168736" className="link">
                +65 6516 8736
              </a>
            </address>
          </div>

          {/*
           * Contact came out of the navigation at the client's request and lives
           * here instead, so this is the site's primary contact affordance.
           */}
          <div
            style={{ gridColumn: "10 / span 6" }}
            className="flex flex-col items-start gap-[14rem] max-md:pt-[32rem]"
          >
            <a href={"mailto:" + contactEmail} className="t-b1 link">
              {contactEmail}
            </a>
            <Link href="/contact" className="t-b2 link">
              Contact and FAQ
            </Link>
            <Social />
          </div>
        </div>

        <div className="grd t-b2 pt-[50rem] max-md:pt-[28rem] max-md:leading-[1.7]">
          <p style={{ gridColumn: "span 5" }}>{site.seriesName}</p>
          <p style={{ gridColumn: "span 5" }}>
            {site.dates} &middot; {site.location}
          </p>
          <p style={{ gridColumn: "span 5" }} className="tnum">
            &copy; {new Date(site.dateStart).getFullYear()} {site.hostShort}
          </p>
        </div>
      </div>
    </footer>
  );
}
