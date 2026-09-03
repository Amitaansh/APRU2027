/**
 * Content shapes for the static site (Backend Schema §3).
 *
 * There is no database. These interfaces type the JSON files in /content, and
 * they are the contract that lets placeholder content become real content
 * without touching layout. Every list-shaped field renders <ToBeAnnounced/>
 * when empty — no field may render a blank region (PRD §6).
 */

export type PhaseId = "P0" | "P1" | "P2" | "P3" | "P4";

export type TbaStatus = "confirmed" | "tba";

export interface PriorEdition {
  edition: number;
  year: number;
  host: string;
  theme: string;
}

export interface SiteConfig {
  name: string;
  /** Full conference name, set under the title. `name` alone is the theme. */
  subtitle: string;
  seriesName: string;
  edition: number;
  dates: string;
  dateStart: string; // ISO — machine-readable, drives P3/P4
  dateEnd: string;
  /** The city, for prose and metadata. The street address is `venueAddress`. */
  location: string;
  /** Where the conference actually sits, room-level. SDE3, not the SDE1 the
   * department is in — the footer carries that one. */
  venueAddress: string;
  /**
   * The committee inbox. Content rather than env: it is a public, stable
   * address, and leaving it to NEXT_PUBLIC_CONTACT_EMAIL meant an unset
   * variable silently degraded every contact affordance on the site.
   */
  contactEmail: string;
  host: string;
  hostShort: string;
  coBrand: string;
  tagline: string;
  intro: string;
  priorEditions: PriorEdition[];
}

export interface NavItem {
  label: string;
  /**
   * Omitted only for a parent that exists to open a submenu and has no page of
   * its own — Participate. Every item a visitor can land on has one.
   */
  route?: string;
  group: "primary" | "footer-only";
  /** Promotes into the primary nav once the resolved phase reaches this id. */
  activeFrom?: PhaseId;
  /** Manual override for content-gated pages (Program). Speakers is derived. */
  active?: boolean;
  /**
   * One level, deliberately. The navbar draws a single dropdown, never a tree,
   * and `flattenNav` in lib/content.ts is what everything else reads instead.
   */
  children?: NavItem[];
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  institution: string;
  photo?: string;
  bio?: string;
  keynote: boolean;
}

export type ProgramBlockId =
  | "keynotes"
  | "forums"
  | "working-groups"
  | "student-symposium"
  | "field-visits";

export interface ProgramBlock {
  id: ProgramBlockId;
  title: string;
  summary: string;
  status: TbaStatus;
}

export interface ProgramConfig {
  intro: string;
  blocks: ProgramBlock[];
  scheduleStatus: "tba" | "published";
  scheduleNote: string;
}

export interface WorkingGroupLead {
  name: string;
  institution: string;
  /**
   * Published, unlike the committee roster's addresses: these are the contacts
   * a prospective member is meant to write to, and the proposals document lists
   * them for exactly that purpose.
   */
  email?: string;
}

export interface WorkingGroup {
  id: string;
  title: string;
  leads: WorkingGroupLead[];
  blurb: string;
}

export interface ForumsConfig {
  intro: string;
  /**
   * Trailing sentence of the introduction that carries a link. `intro` is a
   * plain string rendered into a single <p>, so a link inside it would have to
   * be markup in content; this keeps the JSON free of HTML.
   */
  introLink?: {
    /** Sentence before the link, e.g. "Selected publications … can be found". */
    lead: string;
    label: string;
    url: string;
  };
  workingGroups: WorkingGroup[];
}

export interface ImportantDate {
  id: string;
  label: string;
  /** ISO date, or null → renders "TBA". */
  date: string | null;
}

export interface Sponsor {
  /**
   * Basename of the mark in /public/images/sponsors, without extension —
   * written by `npm run imagery` from the brand files in shared storage.
   */
  slug: string;
  name: string;
  /** Omitted until the partner supplies one; the mark then renders unlinked. */
  url?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

/** A named destination a visitor is sent to — a map, an app, a booking page. */
export interface VenueLink {
  label: string;
  url: string;
}

export interface VenueSection {
  id: string;
  heading: string;
  body: string;
  status: TbaStatus;
  /**
   * Resources the prose refers to. Kept out of the body so the copy stays a
   * plain string that anyone can edit without writing markup, and so the links
   * render as a consistent row rather than as inline anchors in six styles.
   */
  links?: VenueLink[];
}

export interface CommitteeMember {
  name: string;
  role: string;
  affiliation: string;
  /** Published only when `showEmails` is true — consent-gated (Backend Schema §3.9). */
  email?: string;
  /**
   * External profile or CV page. The scientific committee is published as a
   * linked roster rather than a photo grid — these members sit at fifteen
   * different institutions and their own faculty page is the authority on how
   * they are titled.
   */
  profileUrl?: string;
  /**
   * Basename of the portrait in /public/images/committee, without extension —
   * both an .avif and a .webp are written there by `npm run imagery`. Omitted
   * for members with no published staff photo; the roster draws a monogram in
   * their place rather than leaving a hole.
   */
  photo?: string;
}

export interface CommitteeConfig {
  showEmails: boolean;
  organising: CommitteeMember[];
  scientific: CommitteeMember[];
  scientificStatus: "tba" | "published";
}
