import Link from "next/link";
import { site } from "@/lib/site";
import { CallbackForm } from "./CallbackForm";
import { FormTrust } from "./FormTrust";
import { Arrow, Phone } from "./icons";

/** Inline lead capture for long pages: full-quote CTA on the left, short callback form on the right. */
export function LeadCaptureBlock({
  title = "Get a free, fixed-price quote",
  lead = "Tell us a little about your home and a licensed partner installer in your area will confirm your price and rebates. No obligation.",
  quoteHref = "/quote",
  id = "get-quote",
}: {
  title?: string;
  lead?: string;
  quoteHref?: string;
  id?: string;
}) {
  return (
    <section id={id} className="container-x scroll-mt-24 py-14 sm:py-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink-900 p-6 text-white sm:p-10 lg:p-12">
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-ember-500/25 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-ember-400 uppercase">Free quote · No obligation</p>
            <h2 className="h-display mt-3 text-3xl sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-ink-200">{lead}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={quoteHref} className="btn-primary px-7 py-3.5 text-base">
                Get my free quote <Arrow className="h-4 w-4" />
              </Link>
              <a href={site.phoneHref} className="btn border border-white/20 px-7 py-3.5 text-base text-white hover:bg-white/10">
                <Phone className="h-4 w-4" /> Call {site.phone}
              </a>
            </div>
            <div className="mt-8 border-t border-white/10 pt-6">
              <FormTrust tone="dark" />
            </div>
          </div>
          <div className="rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10 sm:p-7">
            <h3 className="font-semibold">Short on time? Get a callback</h3>
            <p className="mt-1 mb-5 text-sm text-ink-200">Four quick fields and an installer will ring you.</p>
            <CallbackForm tone="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}
