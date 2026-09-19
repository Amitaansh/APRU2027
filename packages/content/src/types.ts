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
  /** The host paragraph: who is running the tenth conference, and when. */
  intro: string;
  /**
   * The theme statement, one entry per paragraph. The content document sets
   * these on the home page, under the key visual — not on About, which is where
   * they were written first.
   */
  themeParagraphs: string[];
  /** What the APRU-SCL programme is. The first thing About says. */
  aboutParagraph: string;
  /**
   * The programme's own page. `label` is the opening phrase of
   * `aboutParagraph`, verbatim: the source marks that phrase as the link, and
   * the page sets the link on it inside the paragraph by matching the two --
   * the same reason ForumsConfig.introLink is split rather than marked up, so
   * the JSON stays free of HTML. If the label stops matching the paragraph's
   * opening, the paragraph renders plain and the link is silently lost, so
   * edit them together.
   */
  aboutLink?: VenueLink;
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
  /**
   * Basename in /public/images/committee, without extension — the same folder,
   * pipeline and monogram fallback as a committee portrait, so a keynote
   * headshot is added by dropping a file into committee-source and re-running
   * `npm run imagery`, with no second source folder to keep in step.
   */
  photo?: string;
  bio?: string;
  /** The speaker's own page. Requested alongside the bios in the content review. */
  profileUrl?: string;
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
  /** What the three days hold, while the session-level timetable is outstanding. */
  scheduleIntro: string;
  scheduleNote: string;
}

export interface WorkingGroupLead {
  name: string;
  institution: string;
  /**
   * The convenor's own faculty or CV page, NOT an address.
   *
   * These leads were published as `mailto:` links until the content review asked
   * for the opposite: "to protect privacy and prevent spam, please link to their
   * university CV page instead of displaying their email address". A lead with no
   * published page is simply not a link, and the review's condition for that case
   * is that the affiliation then has to be stated in full -- which `institution`
   * always is.
   */
  profileUrl?: string;
}

export interface WorkingGroup {
  id: string;
  title: string;
  leads: WorkingGroupLead[];
  /**
   * One paragraph, or several. Most proposals are a single block; the array form
   * exists because Landscape and Human Health is written as two, and joining
   * them into one string to fit a narrower type would be an editing decision
   * made by the schema rather than by the author.
   */
  blurb: string | string[];
}

export interface ForumsConfig {
  /** The introduction, one entry per paragraph. */
  intro: string[];
  /**
   * The sentence of the introduction that carries a link. The paragraphs are
   * plain strings, so a link inside one would have to be markup in content;
   * this keeps the JSON free of HTML. It belongs to the first paragraph and is
   * set immediately after it -- see WorkingGroupsIntro.
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
  /** ISO date. Set on a row that runs over several days — the conference itself. */
  dateEnd?: string;
  /**
   * Set after the date in parentheses. The abstract deadline is kept in Singapore
   * time, and the client wants that stated against the date rather than in the
   * label, which is how the content document writes it.
   */
  note?: string;
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
  /**
   * The prose, one entry per paragraph. Optional: a section can be nothing but
   * a list of destinations — "Useful links for visitors" is exactly that in the
   * content document — and writing a sentence to introduce them would be copy
   * invented here rather than supplied.
   */
  body?: string | string[];
  /**
   * Where the source sets the section as a list rather than as prose. The visa
   * requirements are five separate conditions and reading them as one paragraph
   * loses the fact that they are a checklist.
   */
  bullets?: string[];
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

/**
 * The call for abstracts (Master_Web Content, "Call for Abstracts").
 *
 * The page used to be a status block and a date table, because there was nothing
 * else to say yet. All of this is the approved copy for the open call.
 */
export interface AbstractsConfig {
  intro: string;
  /** The sentence that introduces the track list. */
  tracksLead: string;
  /**
   * Track titles without their "Track 1:" prefix — the list numbers itself, and
   * carrying the number in the string means it is wrong the moment one is added
   * or reordered.
   */
  tracks: string[];
  /** How the open call and the working groups relate, one entry per paragraph. */
  coordination: string[];
  /**
   * The source marks the phrase "Working Groups" in that copy as a link to the
   * working groups page. It is lifted out to a row of its own, like every other
   * link in the content layer, so the paragraphs stay plain text. A page that
   * wants the link inline, as the source has it, finds the label's first
   * occurrence in the paragraph and wraps that.
   */
  workingGroupsLink?: VenueLink;
  /**
   * One sentence of `coordination` that the source sets in bold -- the caveat
   * that an accepted abstract is not a seat at a working group. Held as the
   * sentence rather than as markup in the paragraph, for the same reason as the
   * link above; a page that wants the emphasis splits on it.
   */
  emphasis?: string;
  /** The in-flow label over the dates on the call itself. */
  datesHeading?: string;
  rulesHeading: string;
  rules: string[];
  submitLabel: string;
  /** The NUS UVENTs submission portal. */
  submitUrl: string;
}

/** The half-day field trips (Master_Web Content, "Field Trip"). */
export interface FieldTripConfig {
  intro: string;
  /** The five curated themes. */
  themes: string[];
  /** What a participant can expect. */
  note: string;
  /**
   * When itineraries land. It was the last sentence of `note`; the client
   * asked for it as a paragraph of its own.
   */
  availability: string;
}

/** The registration page, which is a single stated fact until the portal opens. */
export interface RegistrationConfig {
  body: string;
  url: string;
}
