import type { Metadata } from "next";
import { CallbackForm } from "@/components/CallbackForm";
import { QuoteForm } from "@/components/QuoteForm";
import { Check, Phone } from "@/components/icons";
import { referralDisclosure, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get a fixed-price heat pump quote",
  description: "Answer a few quick questions and get matched with a licensed heat pump installer in your area.",
};

export default async function QuotePage({ searchParams }: { searchParams: Promise<{ model?: string }> }) {
  const { model } = await searchParams;
  return (
    <section className="relative overflow-hidden bg-cream-100">
      <div aria-hidden className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-ember-300/30 blur-3xl" />
      <div className="container-x relative grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_0.55fr]">
        <div>
          <p className="eyebrow">Free, no-obligation quote</p>
          <h1 className="h-display mt-3 text-4xl text-ink-900 sm:text-5xl">Get your free, fixed-price quote</h1>
          <p className="mt-4 max-w-xl text-lg text-ink-600">
            Five quick steps, about 2 minutes. A licensed installer in your area will confirm your price and take off any
            rebates you&apos;re eligible for.
          </p>
          <p className="mt-3 text-sm text-ink-600">
            In a hurry?{" "}
            <a href="#callback" className="font-semibold text-ember-600 underline lg:hidden">Request a quick callback</a>
            <span className="hidden lg:inline">Request a quick callback on the right</span>, or call{" "}
            <a href={site.phoneHref} className="font-semibold whitespace-nowrap text-ember-600 underline">{site.phone}</a>.
          </p>
          <div className="mt-8">
            <QuoteForm initialModel={model} />
          </div>
        </div>
        <aside className="space-y-5 lg:pt-44">
          <div id="callback" className="card scroll-mt-24 border-ember-500/30 p-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-ember-600 uppercase">The quick option</p>
            <h2 className="mt-1.5 font-display text-2xl font-medium text-ink-900">Rather we call you?</h2>
            <p className="mt-1 mb-5 text-sm text-ink-600">Just four fields. A licensed installer will ring at a time that suits.</p>
            <CallbackForm />
          </div>
          <div className="card p-6">
            <h2 className="font-semibold text-ink-900">What happens next</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-600">
              {[
                "We match you with a licensed partner installer who services your postcode",
                "They contact you to confirm site details and photos",
                "You get a confirmed fixed price with eligible rebates applied",
                "You decide. There's no obligation to go ahead",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gum-500" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold text-ink-900">Prefer to talk?</h2>
            <a href={site.phoneHref} className="mt-3 flex items-center gap-2 text-lg font-semibold text-ember-600">
              <Phone className="h-5 w-5" /> {site.phone}
            </a>
          </div>
          <p className="px-1 text-xs leading-relaxed text-ink-400">{referralDisclosure}</p>
        </aside>
      </div>
    </section>
  );
}
