import { site } from "@/lib/site";
import { FormTrust } from "./FormTrust";
import { Phone } from "./icons";
import { LeadCaptureTabs } from "./LeadCaptureTabs";

/** Inline lead capture for long pages: pitch + trust on the left, the 60-second quote form on the right. */
export function LeadCaptureBlock({
  title = "Get a free quote in 60 seconds",
  lead = "Four quick questions, then a licensed partner installer in your area confirms your fixed price and rebates. No obligation.",
  model,
  id = "get-quote",
}: {
  title?: string;
  lead?: string;
  /** Pre-selects a model in the form (used on model pages). */
  model?: string;
  id?: string;
}) {
  return (
    <section id={id} className="container-x scroll-mt-24 py-14 sm:py-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink-900 p-5 text-white sm:p-10 lg:p-12">
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-ember-500/25 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-ember-400 uppercase">Free quote · No obligation</p>
            <h2 className="h-display mt-3 text-3xl sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-ink-200">{lead}</p>
            <div className="mt-7 border-t border-white/10 pt-6">
              <FormTrust tone="dark" />
            </div>
            <a href={site.phoneHref} className="tap mt-4 gap-2 font-semibold text-white hover:text-ember-300">
              <Phone className="h-4 w-4 text-ember-400" /> Prefer to talk? {site.phone}
            </a>
          </div>
          <LeadCaptureTabs model={model} />
        </div>
      </div>
    </section>
  );
}
