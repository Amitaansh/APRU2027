"use client";

import { useEffect, useRef } from "react";
import { abstracts } from "@apru/content";
import { availableActions } from "@apru/content/phase";
import { phases } from "@apru/content/phases";
import { usePhase } from "@apru/content/usePhase";
import { CTAButton } from "@apru/ui";

/**
 * The extended-deadline notice: a modal over the first page a visitor lands
 * on, while the call for abstracts is open.
 *
 * ONCE PER VISIT, NOT ONCE PER PAGE. It opens on arrival and, once dismissed,
 * stays dismissed for the rest of the browser session, so someone reading
 * through the site is told once rather than on every page they open. A new
 * visit tomorrow sees it again, which is what an announcement wants.
 *
 * IT RETIRES ITSELF. It asks the same question the submit buttons do --
 * `availableActions` -- so on the close date it stops appearing with no code
 * change, and it never announces a deadline that has passed. Removing
 * `extensionNotice` from abstracts.json switches it off early.
 *
 * A native <dialog> opened with showModal(): the browser supplies the top
 * layer, the backdrop, the focus trap, Escape to close and the inert page
 * behind, which is everything a hand-rolled overlay gets wrong.
 */

const SEEN_KEY = "apru-deadline-notice-seen";

function seenThisVisit(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen(): void {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* Private mode or blocked storage: it will simply show again next page. */
  }
}

export function DeadlineNotice() {
  const notice = abstracts.extensionNotice;
  const { today, resolved } = usePhase();
  const ref = useRef<HTMLDialogElement>(null);

  // Judged on the visitor's own clock, so only after hydration -- the build
  // date would show a notice to someone arriving after the call has closed.
  const open =
    resolved &&
    Boolean(notice) &&
    availableActions(today).includes("abstracts") &&
    Boolean(phases.cta.abstracts.url);

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog || dialog.open || seenThisVisit()) return;
    dialog.showModal();
    // The heading takes the opening focus. Left to itself the browser focuses
    // the first control, the close button, and draws its focus ring round it
    // before anyone has touched the keyboard.
    dialog.querySelector<HTMLElement>("h2")?.focus();
    markSeen();
  }, [open]);

  if (!notice || !open) return null;

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      aria-labelledby="deadline-notice-title"
      className="deadline-notice"
      // A click on the backdrop lands on the dialog element itself; a click on
      // the panel lands on a child. Following the submit link closes it too,
      // so a visitor who comes back to this tab finds the page, not the notice.
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
        else if ((e.target as Element).closest("a")) close();
      }}
    >
      <div className="relative px-[32rem] pb-[34rem] pt-[38rem] max-md:px-[22rem] max-md:pb-[26rem] max-md:pt-[30rem]">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-[10rem] top-[10rem] flex h-[40rem] w-[40rem] items-center justify-center text-[24rem] leading-none"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <h2
          id="deadline-notice-title"
          tabIndex={-1}
          className="t-h3 pr-[32rem] outline-none"
        >
          {notice.title}
        </h2>

        <div className="mt-[16rem] space-y-[12rem]">
          {notice.body.map((paragraph, i) => (
            <p key={i} className="t-b1">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-[28rem]">
          <CTAButton
            page="notice"
            surface="popup"
            target={{ ...phases.cta.abstracts, label: notice.buttonLabel }}
          />
        </div>
      </div>
    </dialog>
  );
}
