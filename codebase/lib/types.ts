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
  seriesName: string;
  edition: number;
  dates: string;
  dateStart: string; // ISO — machine-readable, drives P3/P4
  dateEnd: string;
  location: string;
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
}

export interface WorkingGroup {
  id: string;
  title: string;
  leads: WorkingGroupLead[];
  blurb: string;
}

export interface ForumsConfig {
  intro: string;
  workingGroups: WorkingGroup[];
}

export interface ImportantDate {
  id: string;
  label: string;
  /** ISO date, or null → renders "TBA". */
  date: string | null;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface VenueSection {
  id: string;
  heading: string;
  body: string;
  status: TbaStatus;
}

export interface CommitteeMember {
  name: string;
  role: string;
  affiliation: string;
  /** Published only when `showEmails` is true — consent-gated (Backend Schema §3.9). */
  email?: string;
}

export interface CommitteeConfig {
  showEmails: boolean;
  organising: CommitteeMember[];
  scientific: CommitteeMember[];
  scientificStatus: "tba" | "published";
}
