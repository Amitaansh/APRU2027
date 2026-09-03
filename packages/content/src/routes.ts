/** Short page keys used in the outbound src tag (App Flow §6.5). */
const PAGE_KEYS: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/highlights/keynotes": "keynotes",
  "/highlights/working-groups": "working-groups",
  "/highlights/field-trip": "field-trip",
  "/highlights/students-network-session": "students-network",
  "/programme/key-dates": "key-dates",
  "/programme/schedule": "schedule",
  "/register": "register",
  "/call-for-abstracts": "cfa",
  "/visitors": "visitors",
  "/contact": "contact",
};

export function pageKeyFor(pathname: string): string {
  const normalised =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return PAGE_KEYS[normalised] ?? "other";
}
