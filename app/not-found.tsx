import type { Metadata } from "next";
import Link from "next/link";
import { QuoteForm } from "@/components/QuoteForm";
import { Arrow, Phone } from "@/components/icons";
import { QUIZ_PATH } from "@/lib/quiz";
import { brokenPath, comparePagePath, site } from "@/lib/site";
import { NotFoundTracker } from "./NotFoundTracker";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

const links = [
  { href: brokenPath, label: "Hot water broken? Urgent quote" },
  { href: QUIZ_PATH, label: "Which heat pump suits my home? (quiz)" },
  { href: comparePagePath, label: "Compare all six systems" },
  { href: "/rebates", label: "Check rebates by postcode" },
  { href: "/models", label: "Models and guide prices" },
  { href: "/heat-pump-hot-water", label: "Local guides near you" },
];

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-cream-100">
      <NotFoundTracker />
      <div aria-hidden className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-ember-300/30 blur-3xl" />
      <div className="container-x relative grid items-start gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="eyebrow">Page not found</p>
          <h1 className="h-display mt-3 text-4xl text-ink-900 sm:text-5xl">That page has gone, but your quote hasn&apos;t</h1>
          <p className="mt-4 max-w-xl text-lg text-ink-600">
            The link may be old or mistyped. If you were after a heat pump price, you can still get a free, fixed-price quote in 60 seconds,
            call us, or ask for a callback.
          </p>
          <div className="mt-6 grid gap-2.5 sm:flex sm:flex-wrap" data-track-location="not-found">
            <Link href="/quote" className="btn-primary py-3.5">Get a free quote <Arrow className="h-4 w-4" /></Link>
            <a href={site.phoneHref} className="btn-ghost py-3.5"><Phone className="h-4 w-4" /> Call {site.phone}</a>
            <Link href="/quote#callback" className="btn-ghost py-3.5">Request a callback</Link>
          </div>
          <h2 className="mt-10 font-semibold text-ink-900">Or try one of these</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="tap w-full justify-between gap-2 rounded-2xl border border-ink-200 bg-white px-4 text-sm font-semibold text-ink-800 hover:border-ink-500">
                  {l.label} <Arrow className="h-4 w-4 shrink-0 text-ember-600" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full lg:pt-6">
          <QuoteForm variant="compact" placement="not-found" heading="Free quote in 60 seconds" />
        </div>
      </div>
    </section>
  );
}
