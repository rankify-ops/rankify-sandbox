"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brokenPath, site } from "@/lib/site";
import { Arrow, Phone } from "./icons";

// Every labelled form on the site: lead forms plus lookups like the postcode rebate checker.
const LEAD_FORMS = "form[aria-label]";

/**
 * Mobile-only sticky bar: call, "Get my free quote" (opens the 60-second form) and
 * "Request a callback". On the urgent page and the thank-you page it leads with a full
 * "Call" button instead of the quote button. It slides away while a lead form is on
 * screen or any field has focus, so it never covers inputs, consent text or submit buttons.
 */
export function StickyMobileBar() {
  const pathname = usePathname();
  const [formInView, setFormInView] = useState(false);
  const [typing, setTyping] = useState(false);
  const onQuote = pathname.startsWith("/quote");
  const callFirst = pathname.startsWith(brokenPath) || pathname.startsWith("/thank-you");

  useEffect(() => {
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
        setFormInView(visible.size > 0);
      },
      // Start hiding 120px before a form scrolls into view, so the bar is fully gone
      // (it slides out over 300ms) before any form control reaches it.
      { rootMargin: "0px 0px 120px 0px", threshold: 0 },
    );
    const observe = () => {
      document.querySelectorAll(LEAD_FORMS).forEach((f) => {
        if (!f.closest('[role="dialog"]')) io.observe(f);
      });
    };
    observe();
    // Forms can appear after mount (tabs, rebate checker results).
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    const isField = (t: EventTarget | null) => t instanceof HTMLElement && t.matches("input, select, textarea");
    const onIn = (e: FocusEvent) => isField(e.target) && setTyping(true);
    const onOut = (e: FocusEvent) => isField(e.target) && setTyping(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
      setFormInView(false);
    };
  }, [pathname]);

  const hidden = formInView || typing;

  return (
    <div
      data-sticky-bar
      aria-hidden={hidden || undefined}
      inert={hidden || undefined}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink-200/70 bg-white/95 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgb(11_27_43/0.25)] backdrop-blur transition-transform duration-300 md:hidden ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex gap-2">
        {callFirst ? (
          <a href={site.phoneHref} className="btn-primary min-h-12 flex-1 gap-1.5 px-2 text-[15px] whitespace-nowrap">
            <Phone className="h-4 w-4" /> Call {site.phone}
          </a>
        ) : (
          <>
            <a
              href={site.phoneHref}
              aria-label={`Call ${site.phone}`}
              className="grid min-h-12 w-12 shrink-0 place-items-center rounded-full border border-ink-200 text-ink-800"
            >
              <Phone className="h-5 w-5" />
            </a>
            <Link href="/quote" className="btn-primary min-h-12 flex-1 gap-1 px-2 text-[15px] whitespace-nowrap">
              Free quote <Arrow className="h-4 w-4" />
            </Link>
          </>
        )}
        <Link href={onQuote ? "#callback" : "/quote#callback"} className="btn-ghost min-h-12 flex-1 px-2 text-[15px] whitespace-nowrap">
          {callFirst ? "Request a callback" : "Request callback"}
        </Link>
      </div>
    </div>
  );
}
