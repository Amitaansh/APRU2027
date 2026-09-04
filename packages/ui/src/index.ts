/**
 * @apru/ui — the presentation-neutral half of the site.
 *
 * Everything here is shared by both editions. None of it carries a colour or a
 * family of its own: rules are drawn in `currentColor` and type is set by the
 * scale in @apru/styles, so the same component renders rich in the portfolio
 * edition and calm in the client edition with no branching inside it.
 *
 * Motion works the same way. Reveal writes `.is-in` onto a `.rise` node and
 * MaskLines renders `.ln-mask > .ln`; base.css defines those as inert
 * structure and motion.css supplies the hidden state and the transition. An app
 * that does not import motion.css gets the identical markup, still.
 *
 * What is NOT here lives in apps/portfolio: Halo, Cursor, Curtain, Preloader,
 * SmoothScroll and Hero. Those are the edition, not the site.
 */

export { AbstractsState } from "./AbstractsState";
export { Accordion, type AccordionItem } from "./Accordion";
export { Belt } from "./Belt";
export { Committee } from "./Committee";
export { ContactRoute } from "./ContactRoute";
export { Container } from "./Container";
export { CTAButton, type Surface } from "./CTAButton";
export { FAQAccordion } from "./FAQAccordion";
export { ImportantDates } from "./ImportantDates";
export { IndexRow, RuleList } from "./IndexRow";
export { LogoAPRU, LogoNUS } from "./Logos";
export { PageHead } from "./PageHead";
export { PageHeadArt } from "./PageHeadArt";
export { Portrait } from "./Portrait";
export { RegisterState } from "./RegisterState";
export { ENTERED, MaskLines, Reveal } from "./Reveal";
export { Section, SectionGrid, type HaloLane } from "./Section";
export { SectionLabel } from "./SectionLabel";
export { Social } from "./Social";
export { SpeakerGrid } from "./SpeakerGrid";
export { Sponsors } from "./Sponsors";
export { Pending, StatusBlock, ToBeAnnounced } from "./ToBeAnnounced";
export { workingGroupColour } from "./wg-colour";
export { WorkingGroups } from "./WorkingGroups";
