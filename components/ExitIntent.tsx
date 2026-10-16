"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CallbackForm } from "./CallbackForm";
import { FormTrust } from "./FormTrust";
import { Close } from "./icons";

const SEEN_KEY = "ahp:exit-seen";
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
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      return;
    }
    let armed = false;
    const timer = window.setTimeout(() => (armed = true), ARM_DELAY_MS);
    const onLeave = (e: MouseEvent) => {
      if (!armed || e.relatedTarget || e.clientY > 0) return;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
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

  // While open: Escape closes, Tab stays inside the dialog, and focus returns to where it was.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>("a[href], button, input, select, textarea")].filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [open]);

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
          <CallbackForm autoFocus />
          <p className="mt-4 text-center text-sm text-ink-600">
            Prefer the full form?{" "}
            <Link href="/quote" onClick={() => setOpen(false)} className="font-semibold text-ember-600 hover:text-ember-700">
              Get a detailed quote
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
