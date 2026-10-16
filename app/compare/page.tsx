import type { Metadata } from "next";
import Link from "next/link";
import { CompareTable } from "@/components/CompareTable";
import { FaqSection } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { LeadCaptureBlock } from "@/components/LeadCaptureBlock";
import { Arrow, Phone } from "@/components/icons";
import { formatAUD, models } from "@/lib/models";
import { breadcrumbs, productList } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { comparePath, comparePagePath, site } from "@/lib/site";
import { STC_PRICE_CAP, STC_SOURCES } from "@/lib/stc";

export const metadata: Metadata = pageMeta({
  title: "Compare heat pump hot water systems: price, STCs, noise, climate",
  description:
    "Six heat pump hot water systems side by side: tank size, climate fit, guide installed price, STC estimate for your postcode and noise. Get a quote on any model in 60 seconds.",
  path: comparePagePath,
});

const cheapest = Math.min(...models.map((m) => m.priceFrom));

const faqs = [
  {
    q: "Which heat pump is cheapest to buy?",
    a: `In our range, the lowest guide price for supply and standard installation is ${formatAUD(cheapest)}, before rebates. Federal STCs then take off a few hundred dollars depending on your postcode. Your installer confirms a fixed price after a site check.`,
  },
  {
    q: "Which heat pump is best for a cold climate?",
    a: "Look at the rated minimum operating temperature. In our range the CO2 split systems (Sanden Eco Plus and Reclaim Energy) are rated to −10 °C, the Emerald all-in-one to −7 °C on the heat pump alone, and the others to −5 °C.",
  },
  {
    q: "Which heat pump is the quietest?",
    a: "The two CO2 split systems are rated at 37 dB at 1 metre, the lowest in our range. The all-in-one units are rated at 45–49 dB(A). Placement matters too: see our noise and placement guide.",
  },
  {
    q: "How is the STC estimate worked out?",
    a: `From official Clean Energy Regulator data: your postcode's heat pump zone, the model's certificate count for that zone on the CER register, and the multiplication factor for the installation year, rounded down. The dollar value uses the $${STC_PRICE_CAP} Clearing House cap (excluding GST), so treat it as a maximum.`,
  },
];

export default function ComparePage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Compare", path: comparePagePath }])} />
      <JsonLd data={productList(models, "Heat pump hot water systems compared")} />

      <section className="border-b border-ink-200/60 bg-cream-100">
        <div className="container-x py-10 sm:py-14">
          <p className="eyebrow">Compare</p>
          <h1 className="h-display mt-3 max-w-3xl text-4xl text-ink-900 sm:text-5xl">Compare heat pump hot water systems side by side</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-600">
            Tank size, climate fit, guide installed price, STCs for your postcode and noise, for all six systems in our range.
            Found one you like? Get a fixed-price quote on it in 60 seconds.
          </p>
          <div className="mt-6 grid gap-2.5 sm:flex md:hidden">
            <Link href="/quote" className="btn-primary py-3.5">Get a free quote <Arrow className="h-4 w-4" /></Link>
            <Link href="/quote#callback" className="btn-ghost py-3.5">Request a callback</Link>
          </div>
        </div>
      </section>

      {/* Sticky CTA on tablet and desktop (mobile has the sticky bottom bar) */}
      <div className="sticky top-16 z-30 hidden border-b border-ink-200/60 bg-white/95 backdrop-blur md:block" data-track-location="compare-sticky">
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <p className="text-sm font-medium text-ink-800">Free, no-obligation quotes from a licensed local installer. Rebates applied.</p>
          <div className="flex shrink-0 items-center gap-2">
            <a href={site.phoneHref} className="tap gap-1.5 px-2 text-sm font-semibold whitespace-nowrap text-ink-700 hover:text-ink-900">
              <Phone className="h-4 w-4" /> {site.phone}
            </a>
            <Link href="/quote#callback" className="btn-ghost px-4 py-2.5 text-sm whitespace-nowrap">Request a callback</Link>
            <Link href="/quote" className="btn-primary px-4 py-2.5 text-sm whitespace-nowrap">Get a free quote <Arrow className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>

      <section className="container-x py-10 sm:py-12" aria-label="Comparison">
        <CompareTable />
        <p className="mt-4 text-xs leading-relaxed text-ink-500">
          Specs from manufacturer spec sheets (linked on each model page). Guide prices are for supply and standard installation before
          rebates; your installer confirms a fixed price. STCs from the{" "}
          <a href={STC_SOURCES.register.url} target="_blank" rel="noopener noreferrer" className="underline">CER register</a> and{" "}
          <a href={STC_SOURCES.zones.url} target="_blank" rel="noopener noreferrer" className="underline">postcode zone table</a>, valued at
          the ${STC_PRICE_CAP} Clearing House cap (excl. GST); open-market prices are usually lower. For efficiency and warranty, see the{" "}
          <Link href={comparePath} className="underline">full buying guide</Link>.
        </p>
      </section>

      <LeadCaptureBlock
        title="Not sure which one? Ask a local installer"
        lead="A few quick questions, or leave your number for a callback. A licensed partner installer will recommend a system for your home and confirm the price and rebates."
      />

      <FaqSection items={faqs} title="Comparing heat pumps: common questions" className="pt-4 sm:pt-6" />
    </>
  );
}
