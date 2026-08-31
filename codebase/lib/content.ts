import siteJson from "@/content/site.json";
import navJson from "@/content/nav.json";
import speakersJson from "@/content/speakers.json";
import programJson from "@/content/program.json";
import forumsJson from "@/content/forums.json";
import datesJson from "@/content/dates.json";
import faqJson from "@/content/faq.json";
import venueJson from "@/content/venue.json";
import sponsorsJson from "@/content/sponsors.json";
import committeeJson from "@/content/committee.json";
import { phases } from "@/content/phases";
import type {
  CommitteeConfig,
  FAQItem,
  ForumsConfig,
  ImportantDate,
  NavItem,
  ProgramConfig,
  SiteConfig,
  Speaker,
  Sponsor,
  VenueSection,
} from "@/lib/types";

/**
 * Typed loaders for /content (Backend Schema §2).
 *
 * There is no database and no fetch — the JSON is compiled into the build. The
 * assertions at the bottom of this file run at build time, so a malformed
 * content edit fails `next build` rather than shipping a blank region.
 */

export const site = siteJson as SiteConfig;
export const nav = navJson as NavItem[];
export const speakers = speakersJson as Speaker[];
export const program = programJson as ProgramConfig;
export const forums = forumsJson as ForumsConfig;
export const faq = faqJson as FAQItem[];
export const venue = venueJson as VenueSection[];
export const committee = committeeJson as CommitteeConfig;
export const sponsors = sponsorsJson as Sponsor[];

/**
 * Speakers used to drive their own nav promotion, back when /speakers was a
 * route that hid itself until the roster landed. It is /highlights/keynotes
 * now, and the navbar shows the whole structure unconditionally — the point of
 * the site at this stage is that the team can see every page exists. The roster
 * still gates what that page renders; see SpeakerGrid.
 */

/**
 * Important dates for display.
 *
 * `content/phases.ts` is the single source for every machine-relevant
 * milestone; these rows are derived from it so the human-facing table can never
 * drift from the engine (Backend Schema §4.3). Rows the engine does not know
 * about — early-bird, notification — keep whatever `dates.json` says.
 *
 * An UNSET milestone defers to `dates.json` rather than blanking the row. The
 * published schedule and the phase engine are two different commitments: a date
 * can be announced long before we are willing to let it flip the site's CTA. So
 * the table can state 15 Sep 2026 while `abstractsOpen` stays null and the site
 * holds at P0. Filling the milestone still overrides the authored value, which
 * is what keeps the engine authoritative once it is switched on.
 */
const DERIVED_FROM_MILESTONES: Record<string, string | null> = {
  "abstracts-open": phases.milestones.abstractsOpen,
  "abstracts-close": phases.milestones.abstractsClose,
  "registration-opens": phases.milestones.registrationOpens,
  conference: phases.milestones.eventStart,
};

export const dates: ImportantDate[] = (datesJson as ImportantDate[]).map(
  (row) =>
    row.id in DERIVED_FROM_MILESTONES
      ? { ...row, date: DERIVED_FROM_MILESTONES[row.id] ?? row.date }
      : row,
);

/**
 * The nav is a tree now — one level of submenus under Highlight and Participate.
 * Everything that is not the navbar itself wants the flat list: the sitemap, the
 * duplicate-route check, and any reachability audit. Flattening in one place is
 * what stops a child route from being validated or indexed by half the codebase.
 */
export function flattenNav(items: NavItem[] = nav): NavItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children ? flattenNav(item.children) : []),
  ]);
}

/** Every route the site actually serves, parents and children alike. */
export const allRoutes = flattenNav()
  .map((item) => item.route)
  .filter((route): route is string => Boolean(route));

// ---------------------------------------------------------------------------
// Build-time integrity checks (Backend Schema §7)
// ---------------------------------------------------------------------------

function fail(message: string): never {
  throw new Error("Content validation failed: " + message);
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function assertContent(): void {
  if (!site.name || !site.seriesName) fail("site.json is missing its identity");
  for (const key of ["dateStart", "dateEnd"] as const) {
    if (!ISO_DATE.test(site[key])) fail("site." + key + " must be ISO YYYY-MM-DD");
  }

  const routes = new Set<string>();
  for (const item of flattenNav()) {
    // A parent that only opens a submenu has no route to collide with, but it
    // still needs children — otherwise it is a nav item that does nothing.
    if (!item.route) {
      if (!item.children?.length) {
        fail("nav item " + item.label + " has neither a route nor children");
      }
    } else {
      if (routes.has(item.route)) fail("duplicate nav route " + item.route);
      routes.add(item.route);
    }
    if (item.group !== "primary" && item.group !== "footer-only") {
      fail("nav item " + item.label + " has an unknown group");
    }
    // One level only: the navbar has no markup for a third.
    if (item.children?.some((child) => child.children)) {
      fail("nav item " + item.label + " nests more than one level deep");
    }
  }

  for (const row of dates) {
    if (row.date !== null && !ISO_DATE.test(row.date)) {
      fail("dates." + row.id + " must be ISO YYYY-MM-DD or null");
    }
  }

  for (const block of program.blocks) {
    if (block.status !== "confirmed" && block.status !== "tba") {
      fail("program block " + block.id + " has an unknown status");
    }
    if (!block.summary) fail("program block " + block.id + " has no summary");
  }

  for (const section of venue) {
    if (section.status === "confirmed" && !section.body) {
      fail("venue section " + section.id + " is confirmed but empty");
    }
  }

  for (const group of forums.workingGroups) {
    if (!group.title || !group.blurb || group.leads.length === 0) {
      fail("working group " + group.id + " is incomplete");
    }
  }

  if (!committee.showEmails && committee.organising.some((m) => m.email)) {
    fail("committee emails are present but consent is not granted");
  }

  // Milestone monotonicity, where set (Backend Schema §7.4).
  const m = phases.milestones;
  const ordered = [
    m.registrationOpens,
    m.abstractsOpen,
    m.abstractsClose,
    m.countdownFrom,
    m.eventStart,
    m.eventEnd,
  ].filter((d): d is string => Boolean(d));
  for (let i = 1; i < ordered.length; i += 1) {
    if (ordered[i] < ordered[i - 1]) {
      fail("milestones are out of order: " + ordered[i - 1] + " then " + ordered[i]);
    }
  }
}

assertContent();
