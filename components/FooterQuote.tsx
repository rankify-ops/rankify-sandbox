"use client";

import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { Phone } from "./icons";
import { QuoteForm } from "./QuoteForm";

/** The 60-second quote form at the foot of every page (except where a form is already the page). */
export function FooterQuote() {
  const pathname = usePathname();
  if (pathname.startsWith("/quote") || pathname.startsWith("/thank-you")) return null;
  return (
    <div className="border-b border-white/10">
      <div className="container-x grid gap-8 py-12 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-14">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-ember-400 uppercase">Free quote · 60 seconds</p>
          <h2 className="h-display mt-3 text-3xl text-white sm:text-4xl">Ready for lower hot water bills?</h2>
          <p className="mt-3 max-w-md text-ink-200">
            Answer four quick questions and a licensed local installer will come back with your fixed price and the rebates
            you may be eligible for.
          </p>
          <a href={site.phoneHref} className="tap mt-6 gap-2 text-lg font-semibold text-white hover:text-ember-300">
            <Phone className="h-5 w-5 text-ember-400" /> {site.phone}
          </a>
        </div>
        <div className="text-ink-900">
          <QuoteForm variant="compact" tone="dark" heading="Free quote in 60 seconds" placement="footer" />
        </div>
      </div>
    </div>
  );
}
