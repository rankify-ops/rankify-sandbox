"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CallbackForm } from "./CallbackForm";
import { FormTrust } from "./FormTrust";
import { Close } from "./icons";
import { EXIT_SEEN_KEY } from "./QuoteModal";
import { useDialog } from "./useDialog";

const ARM_DELAY_MS = 5000;

/**
 * Desktop-only exit-intent popup: shows once per session when the cursor leaves
 * through the top of the window. Never runs on touch devices or small screens,
 * and never on the quote or thank-you pages.
 */
export function ExitIntent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const excluded = pathname.startsWith("/quote") || pathname.startsWith("/thank-you");

  useEffect(() => {
    if (excluded) return;
    if (!window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches) return;
    try {
      if (sessionStorage.getItem(EXIT_SEEN_KEY)) return;
    } catch {
      return;
    }
    let armed = false;
    const timer = window.setTimeout(() => (armed = true), ARM_DELAY_MS);
    const onLeave = (e: MouseEvent) => {
      if (!armed || e.relatedTarget || e.clientY > 0) return;
      if (document.querySelector('[role="dialog"]')) return;
      try {
        if (sessionStorage.getItem(EXIT_SEEN_KEY)) return;
      } catch {}
      try {
        sessionStorage.setItem(EXIT_SEEN_KEY, "1");
      } catch {}
      setOpen(true);
      document.removeEventListener("mouseout", onLeave);
    };
    document.addEventListener("mouseout", onLeave);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [excluded]);

  const close = useCallback(() => setOpen(false), []);
  useDialog(open, dialogRef, close);

  if (!open || excluded) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-title"
        className="relative grid w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-lift md:grid-cols-[0.9fr_1fr]"
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-cream-100 text-ink-700 hover:bg-cream-200"
          aria-label="Close"
        >
          <Close className="h-4 w-4" />
        </button>
        <div className="bg-ink-900 p-8 text-white">
          <p className="text-xs font-semibold tracking-[0.18em] text-ember-400 uppercase">Before you go</p>
          <h2 id="exit-title" className="h-display mt-3 text-3xl">Want your price without the legwork?</h2>
          <p className="mt-3 text-ink-200">
            Leave your number and a licensed local installer will call you with a fixed price and the rebates you may be
            eligible for.
          </p>
          <div className="mt-6">
            <FormTrust tone="dark" compact />
          </div>
        </div>
        <div className="p-8">
          <CallbackForm autoFocus placement="exit-intent" />
          <p className="mt-4 text-center text-sm text-ink-600">
            Prefer the full form?{" "}
            <Link href="/quote" onClick={() => setOpen(false)} className="font-semibold text-ember-600 hover:text-ember-700">
              Get a free quote in 60 seconds
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
