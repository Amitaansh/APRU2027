/**
 * A committee portrait, or a monogram where there is no photo.
 *
 * The nine organising committee members do not all have a published staff
 * photo: six are on the DOA staff directory and three are not. The two cases
 * have to occupy the same box at the same size, or the roster comes out ragged
 * and the members without a photograph read as an error rather than as a fact
 * about the directory.
 *
 * So the fallback is not a grey rectangle or a generic silhouette — a silhouette
 * is a picture of a person who is not this person. It is the member's initials
 * on the same 4:5 field, set in the serif at display size. That reads as a
 * deliberate typographic stand-in, sits in the monochrome palette the portraits
 * are graded into (scripts/build-imagery.mjs), and is replaced by dropping a
 * file into the portrait source folder and re-running `npm run imagery`.
 *
 * The <picture> carries AVIF with a WebP fallback, both written at 440x550 —
 * the box is 110rem, so that covers it well past 2x and there is no srcset to
 * carry. `loading="lazy"` because the roster is far below the fold on /about.
 */
export function Portrait({
  name,
  photo,
  className = "",
}: {
  name: string;
  /** Basename in /public/images/committee, without extension. */
  photo?: string;
  className?: string;
}) {
  const box = "aspect-[4/5] w-full overflow-hidden bg-gr " + className;

  if (!photo) {
    return (
      <div className={box + " flex items-center justify-center"} aria-hidden="true">
        <span className="t-h4 dim">{initials(name)}</span>
      </div>
    );
  }

  return (
    <picture className="block">
      <source srcSet={"/images/committee/" + photo + ".avif"} type="image/avif" />
      <img
        src={"/images/committee/" + photo + ".webp"}
        alt={"Portrait of " + name}
        width={440}
        height={550}
        loading="lazy"
        decoding="async"
        className={box + " block object-cover"}
      />
    </picture>
  );
}

/**
 * First letters of the first and last name parts. Parenthesised given names —
 * "Shengxiao (Alex) Li" — are dropped first, so the monogram is SL rather than
 * SA: the bracket is an alternate for the same name, not a third one.
 */
function initials(name: string) {
  const parts = name
    .replace(/\(.*?\)/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}
