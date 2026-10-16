import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { QuoteForm } from "@/components/QuoteForm";
import { Arrow, Check, Phone } from "@/components/icons";
import { formatAUD, models } from "@/lib/models";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { brokenPath as BROKEN_PATH, responseTime, site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Hot water broken? Fast heat pump replacement quotes",
  description:
    "Hot water stopped working? Call, request a callback or send a 30-second urgent request. Safety steps to take now, how quickly a quote can usually be arranged, and the rebates that still apply.",
  path: "/hot-water-broken",
});

const SAFETY = [
  {
    title: "Electric system: switch it off at the switchboard",
    text: "Turn off the hot water circuit (often labelled “hot water” or “HWS”). Do this first if water is leaking anywhere near the unit’s electrical parts, and don’t touch wet electrical parts.",
  },
  {
    title: "Gas system: turn the gas off at the heater",
    text: "Close the gas isolation valve on the supply pipe. If you smell gas, don’t use switches or flames: leave the area and call your gas distributor’s emergency number (on your gas bill), or 000 if anyone is in danger.",
  },
  {
    title: "Leaking: shut off the cold water to the tank",
    text: "Close the cold water isolation valve on the pipe going into the system. If you can’t find it, turn off the water at the main tap near your water meter.",
  },
  {
    title: "Don’t drain or open it yourself",
    text: "Water in the tank can still be scalding. Gas, electrical and plumbing repairs must be done by licensed tradespeople.",
  },
];

const faqs = [
  {
    q: "How quickly can I get a replacement quote?",
    a: `We pass urgent requests to a licensed partner installer who covers your postcode as soon as they come in, flagged as urgent. How soon they can contact you and book a visit depends on who covers your area and how busy they are, so we can't promise a time. Our general response time: ${responseTime}.`,
  },
  {
    q: "Do rebates still apply if it's an emergency replacement?",
    a: "Usually, yes. Federal STCs apply to eligible heat pumps installed by licensed installers, whether or not the old system failed. State programs have their own rules, for example Solar Victoria needs the replaced system to be at least 3 years old, so your installer confirms eligibility before you commit.",
  },
  {
    q: "Should I repair my old system or replace it?",
    a: "If your system is old, or the tank itself is leaking, it usually needs replacing. A licensed plumber can tell you whether a repair is worthwhile. If you're replacing anyway, a heat pump costs less to run than a standard electric tank.",
  },
  {
    q: "Can a heat pump be installed as quickly as a like-for-like tank?",
    a: "A straightforward swap, with the heat pump going where the old tank was, is typically done in a single visit. Availability of the model you choose and any extra work (a new location, electrical upgrades or a gas disconnection) can affect timing. Your installer will confirm.",
  },
  {
    q: "What does a replacement heat pump cost?",
    a: `Our guide prices for supply and standard installation, before rebates, start from ${formatAUD(Math.min(...models.map((m) => m.priceFrom)))}. Your installer confirms a fixed price after checking your site, with any rebates you're eligible for taken off.`,
  },
];

export default function HotWaterBrokenPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Hot water broken?", path: BROKEN_PATH }])} />
      <section className="relative overflow-hidden border-b border-ink-200/60 bg-ink-900 text-white">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-ember-500/25 blur-3xl" />
        <div className="container-x relative grid items-start gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_0.9fr] lg:gap-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-ember-300 uppercase">Hot water stopped?</p>
            <h1 className="h-display mt-3 text-4xl sm:text-5xl">Hot water broken? Get a fast heat pump replacement quote</h1>
            <p className="mt-4 max-w-xl text-lg text-ink-200">
              Call us, ask for a callback, or send a 30-second request and we&apos;ll pass it to a licensed installer who covers your
              postcode, flagged as urgent.
            </p>
            <div className="mt-6 grid gap-2.5 sm:flex" data-track-location="broken-hero">
              <a href={site.phoneHref} className="btn-primary py-4 text-base">
                <Phone className="h-5 w-5" /> Call {site.phone}
              </a>
              <Link href="/quote#callback" className="btn border border-white/25 py-4 text-base text-white hover:bg-white/10">
                Request a callback
              </Link>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-ink-200">
              {["Free, no-obligation quote", "Rebates still apply to replacements", "Coverage in your area TBC: enter your postcode to check"].map((t) => (
                <li key={t} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gum-400" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div id="urgent-quote" className="w-full scroll-mt-24 text-ink-900">
            <QuoteForm mode="urgent" variant="compact" tone="dark" placement="hot-water-broken" heading="Urgent replacement quote" />
          </div>
        </div>
      </section>

      <section className="container-x py-14 sm:py-16" aria-labelledby="safety">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Right now</p>
            <h2 id="safety" className="h-display mt-3 text-3xl text-ink-900">What to do while you wait</h2>
            <p className="mt-4 text-ink-600">
              These are general safety steps. If you&apos;re unsure, or there&apos;s a risk to anyone, stop and call a licensed tradesperson,
              or 000 in an emergency.
            </p>
            <a href={site.phoneHref} className="btn-primary mt-6">
              <Phone className="h-4 w-4" /> Call {site.phone}
            </a>
          </div>
          <ol className="space-y-4">
            {SAFETY.map((s, i) => (
              <li key={s.title} className="card flex gap-4 p-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ember-600 font-semibold text-white">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-ink-900">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream-100 py-14 sm:py-16" aria-labelledby="how-fast">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Honest timing</p>
            <h2 id="how-fast" className="h-display mt-3 text-3xl text-ink-900">How fast can we arrange a quote?</h2>
            <p className="mt-4 leading-relaxed text-ink-700">
              We pass urgent requests on as soon as they come in, marked as a broken system, to one licensed partner installer who
              covers your postcode. If they can&apos;t take it, we offer it to the next one. How soon someone can call you and book a visit
              depends on who covers your area and how busy they are, so <strong>we don&apos;t promise a time</strong>.
            </p>
            <p className="mt-3 text-sm text-ink-600">Our general response time: {responseTime}.</p>
            <p className="mt-3 text-sm text-ink-600">
              A straightforward swap is typically done in a single visit once it&apos;s booked. See{" "}
              <Link href="/blog/how-long-does-heat-pump-installation-take" className="font-semibold text-ember-600 underline">what happens on install day</Link>.
            </p>
          </div>
          <div className="card p-6">
            <h2 className="h-display text-2xl text-ink-900">Rebates still apply</h2>
            <p className="mt-3 leading-relaxed text-ink-700">
              An urgent replacement can still get federal STCs, and in some states a state rebate, applied as a discount on your quote.
              Rules vary: Solar Victoria, for example, needs the system you&apos;re replacing to be at least 3 years old.
            </p>
            <div className="mt-5 grid gap-2 sm:flex sm:flex-wrap">
              <Link href="/rebates" className="btn-dark whitespace-nowrap">Check rebates for your postcode <Arrow className="h-4 w-4" /></Link>
              <Link href="#urgent-quote" className="btn-ghost whitespace-nowrap">Send an urgent request</Link>
            </div>
          </div>
        </div>
      </section>

      <FaqSection items={faqs} title="Broken hot water: common questions" quoteHref="#urgent-quote" />
    </>
  );
}
