/** Short page keys used in the outbound src tag (App Flow §6.5). */
const PAGE_KEYS: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/highlights": "highlights",
  "/highlights/key-dates": "key-dates",
  "/highlights/working-groups": "working-groups",
  "/highlights/keynotes": "keynotes",
  "/highlights/field-trip": "field-trip",
  "/programme": "programme",
  "/register": "register",
  "/call-for-abstracts": "cfa",
  "/venue": "venue",
  "/contact": "contact",
};

export function pageKeyFor(pathname: string): string {
  const normalised =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return PAGE_KEYS[normalised] ?? "other";
}
