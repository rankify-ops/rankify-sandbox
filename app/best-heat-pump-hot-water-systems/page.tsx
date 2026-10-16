import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/Faq";
import { Arrow, Check } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { LeadCaptureBlock } from "@/components/LeadCaptureBlock";
import { GuidePriceBadge, PageHero } from "@/components/ui";
import { compareFaqs } from "@/lib/faqs";
import { formatAUD, models, type HeatPumpModel } from "@/lib/models";
import { breadcrumbs, productList } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { comparePagePath, comparePath } from "@/lib/site";

const TITLE = "Best heat pump hot water systems in Australia (2026)";

export const metadata: Metadata = pageMeta({
  title: TITLE,
  description:
    "Compare six heat pump hot water systems side by side: tank size, efficiency, noise, warranty and guide installed price. Then get a free quote in 60 seconds.",
  path: comparePath,
  type: "article",
});

/** Picks derived from the data, so each label is a checkable fact rather than an opinion. */
function picks(list: HeatPumpModel[]) {
  const byPrice = [...list].sort((a, b) => a.priceFrom - b.priceFrom);
  const integrated = list.filter((m) => m.type === "Integrated").sort((a, b) => b.capacityLitres - a.capacityLitres);
  const quietest = list.filter((m) => /^37 dB/.test(m.compare.noise));
  return [
    { label: "Lowest guide price", models: [byPrice[0]], why: `From ${formatAUD(byPrice[0].priceFrom)} installed, before rebates.` },
    { label: "Family-size value", models: list.filter((m) => m.slug === "istore-270"), why: "270 L for 3–4 people at a value price." },
    { label: "Largest all-in-one tank", models: [integrated[0]], why: `${integrated[0].capacityLitres} L in a single integrated unit.` },
    { label: "Quietest", models: quietest, why: "37 dB, the lowest noise rating in our range." },
    { label: "Longest tank warranty", models: list.filter((m) => ["sanden-eco-plus-315", "reclaim-energy-co2-315"].includes(m.slug)), why: "Up to 15 years on the tank, per the manufacturers (pro rata or conditions apply)." },
  ];
}

const columns = [
  { key: "tank", label: "Tank" },
  { key: "type", label: "Type" },
  { key: "efficiency", label: "Efficiency" },
  { key: "noise", label: "Noise" },
  { key: "warranty", label: "Warranty" },
  { key: "price", label: "Guide price" },
  { key: "bestFor", label: "Best for" },
] as const;

function cell(m: HeatPumpModel, key: (typeof columns)[number]["key"]) {
  switch (key) {
    case "tank":
      return `${m.capacityLitres} L`;
    case "type":
      return `${m.type}, ${m.refrigerant.replace(/ \(.*\)/, "")}`;
    case "price":
      return `from ${formatAUD(m.priceFrom)}`;
    default:
      return m.compare[key];
  }
}

export default function ComparePage() {
  const ranked = [...models].sort((a, b) => a.priceFrom - b.priceFrom);
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Compare", path: comparePath }])} />
      <JsonLd data={productList(ranked, TITLE)} />

      <PageHero
        eyebrow="Comparison · Updated October 2026"
        title={TITLE}
        lead={
          <>
            Six systems sold in Australia, compared side by side on tank size, efficiency, noise, warranty and guide installed price. Pick a
            shortlist, then get a fixed price in 60 seconds. Want STCs for your postcode? Use the{" "}
            <Link href={comparePagePath} className="font-semibold text-ember-600 underline">compare tool</Link>.
          </>
        }
      />

      {/* Quick picks */}
      <section className="container-x py-12 sm:py-16" aria-labelledby="picks">
        <h2 id="picks" className="h-display text-2xl text-ink-900 sm:text-3xl">Quick picks</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {picks(ranked).map((p) => (
            <li key={p.label} className="card flex flex-col p-5">
              <p className="text-xs font-bold tracking-wider text-ember-600 uppercase">{p.label}</p>
              <ul className="mt-1 font-semibold text-ink-900">
                {p.models.map((m) => (
                  <li key={m.slug}>
                    <Link href={`/models/${m.slug}`} className="tap leading-snug hover:text-ember-700">{m.name}</Link>
                  </li>
                ))}
              </ul>
              <p className="mt-1 flex-1 text-sm text-ink-600">{p.why}</p>
              <Link href={`/quote?model=${p.models[0].slug}`} className="tap mt-2 gap-1 text-sm font-semibold text-ember-600 hover:text-ember-700">
                Get a free quote <Arrow className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Side-by-side */}
      <section className="container-x pb-6" aria-labelledby="side-by-side">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <h2 id="side-by-side" className="h-display text-2xl text-ink-900 sm:text-3xl">Side by side</h2>
          <p className="max-w-md text-xs text-ink-500">
            Specs from manufacturer spec sheets. COP test conditions differ between brands, so compare
            them as a rough guide. Items marked &ldquo;confirm&rdquo; weren&apos;t in the spec sheet.
          </p>
        </div>

        {/* Desktop table */}
        <div className="card mt-6 hidden overflow-x-auto lg:block">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Heat pump hot water systems compared, sorted by guide price</caption>
            <thead className="bg-cream-100 text-xs tracking-wider text-ink-600 uppercase">
              <tr>
                <th scope="col" className="px-5 py-4 font-semibold">Model</th>
                {columns.map((c) => (
                  <th key={c.key} scope="col" className="px-4 py-4 font-semibold">{c.label}</th>
                ))}
                <th scope="col" className="px-5 py-4 font-semibold"><span className="sr-only">Quote</span></th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((m) => (
                <tr key={m.slug} className="border-t border-ink-200/60 align-top">
                  <th scope="row" className="px-5 py-4 font-semibold text-ink-900">
                    <Link href={`/models/${m.slug}`} className="hover:text-ember-700">{m.name}</Link>
                    {m.badge && <span className="mt-1 block text-xs font-medium text-ember-600">{m.badge}</span>}
                  </th>
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-4 ${c.key === "price" ? "font-semibold whitespace-nowrap text-ink-900" : c.key === "tank" ? "whitespace-nowrap text-ink-700" : "text-ink-700"}`}>
                      {cell(m, c.key)}
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    <Link href={`/quote?model=${m.slug}`} className="btn-primary px-4 py-2 whitespace-nowrap" aria-label={`Get a free quote on the ${m.name}`}>
                      Free quote
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile / tablet cards */}
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:hidden">
          {ranked.map((m) => (
            <li key={m.slug} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-medium text-ink-900">
                    <Link href={`/models/${m.slug}`} className="tap">{m.name}</Link>
                  </h3>
                  {m.badge && <p className="text-xs font-semibold text-ember-600">{m.badge}</p>}
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-semibold whitespace-nowrap text-ink-900">{formatAUD(m.priceFrom)}</p>
                  {!m.priceConfirmed && <GuidePriceBadge />}
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                {columns
                  .filter((c) => c.key !== "price")
                  .map((c) => (
                    <div key={c.key} className={c.key === "bestFor" || c.key === "warranty" ? "col-span-2" : ""}>
                      <dt className="text-xs text-ink-500">{c.label}</dt>
                      <dd className="text-ink-800">{cell(m, c.key)}</dd>
                    </div>
                  ))}
              </dl>
              <Link href={`/quote?model=${m.slug}`} className="btn-primary mt-5 w-full py-3" aria-label={`Get a free quote on the ${m.name}`}>
                Get a free quote <Arrow className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <LeadCaptureBlock
        title="Shortlisted? Get your fixed price in 60 seconds"
        lead="Four quick questions and a licensed partner installer confirms your price on the system that suits your home, with eligible rebates taken off."
      />

      {/* How to choose */}
      <section className="container-x pb-6" aria-labelledby="how-to-choose">
        <h2 id="how-to-choose" className="h-display text-2xl text-ink-900 sm:text-3xl">How to choose</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Size it to your household", d: "Roughly 220 L for 2–3 people, 270 L for 3–4, and 300 L+ for 4 or more." },
            { t: "All-in-one or split", d: "All-in-ones are simpler and cheaper. Splits put the noisy part away from bedrooms and fit tight spaces." },
            { t: "Think about winter", d: "In frosty areas, check the operating range. CO2 systems are a common cold-climate choice." },
            { t: "Count the rebates", d: "Federal STCs apply Australia-wide, plus state programs in VIC and NSW. Your installer applies them." },
          ].map((x) => (
            <div key={x.t} className="rounded-3xl bg-cream-100 p-5">
              <p className="flex items-center gap-2 font-semibold text-ink-900">
                <Check className="h-4 w-4 text-gum-500" /> {x.t}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{x.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink-600">
          More detail: <Link href="/blog/what-size-heat-pump-do-i-need" className="font-semibold text-ember-600 underline">sizing guide</Link>,{" "}
          <Link href="/blog/do-heat-pumps-work-in-winter-australia" className="font-semibold text-ember-600 underline">winter performance</Link> and{" "}
          <Link href="/rebates" className="font-semibold text-ember-600 underline">rebate checker</Link>.
        </p>
      </section>

      <FaqSection items={compareFaqs} title="Comparison questions" className="pt-10 sm:pt-14" />
    </>
  );
}
