"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { Close, Phone } from "./icons";
import { CallbackForm } from "./CallbackForm";
import { FormTrustInline } from "./FormTrust";
import { QuoteForm } from "./QuoteForm";
import { useDialog } from "./useDialog";

/** Shared with ExitIntent so the two popups never stack. */
export const EXIT_SEEN_KEY = "ahp:exit-seen";

/**
 * Opens the 60-second quote form in a popup from any link to /quote on the site:
 * the header CTA, hero, model cards, blog CTAs and so on. Links stay real links, so
 * new-tab clicks, crawlers and no-JS visitors still reach the /quote page.
 */
export function QuoteModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState<{ mode: "quote" | "callback"; model?: string; n: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(null), []);
  useDialog(!!open, ref, close);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target || a.hasAttribute("download") || a.dataset.noModal !== undefined) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== "/quote") return;
      // On the quote page itself the form is already in front of the visitor.
      if (window.location.pathname === "/quote") return;
      e.preventDefault();
      try {
        sessionStorage.setItem(EXIT_SEEN_KEY, "1");
      } catch {}
      // /quote#callback opens the lighter callback form instead.
      const mode = url.hash === "#callback" ? "callback" : "quote";
      (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: `${mode}_open`, from: window.location.pathname });
      setOpen((o) => ({ mode, model: url.searchParams.get("model") ?? undefined, n: (o?.n ?? 0) + 1 }));
    };
    // Capture phase: runs before next/link's own click handler, which then sees the
    // event is handled (defaultPrevented) and skips its client-side navigation.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Close when the visitor navigates (e.g. to the thank-you page after submitting).
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reset on route change
  useEffect(() => setOpen(null), [pathname]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink-950/60 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={open.mode === "callback" ? "Request a callback" : "Get a free quote in 60 seconds"}
        className="relative max-h-[94dvh] w-full overflow-y-auto rounded-t-[1.75rem] bg-cream-50 p-3 pt-12 shadow-lift sm:max-w-lg sm:rounded-[1.75rem] sm:p-4 sm:pt-12"
      >
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-ink-700 shadow-card hover:bg-cream-100"
          aria-label="Close"
        >
          <Close className="h-4 w-4" />
        </button>
        <p className="absolute left-5 top-4 text-xs font-semibold tracking-[0.18em] text-ember-600 uppercase">Free · No obligation</p>
        {open.mode === "callback" ? (
          <div key={open.n} className="card p-5">
            <p className="font-display text-xl font-semibold text-ink-900">Request a free callback</p>
            <p className="mt-1 mb-5 text-sm text-ink-600">Four quick fields. A licensed local installer will ring at a time that suits.</p>
            <CallbackForm autoFocus />
            <FormTrustInline />
          </div>
        ) : (
          <QuoteForm key={open.n} variant="compact" initialModel={open.model} />
        )}
        <div className="mt-2 px-2 pb-2">
          <a href={site.phoneHref} className="tap mt-1 w-full justify-center gap-2 text-sm font-semibold text-ink-700 hover:text-ink-900">
            <Phone className="h-4 w-4 text-ember-600" /> Prefer to talk? Call {site.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
