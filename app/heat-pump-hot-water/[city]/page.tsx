import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqSection } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { LeadCaptureBlock } from "@/components/LeadCaptureBlock";
import { ModelCard } from "@/components/ModelCard";
import { QuoteForm } from "@/components/QuoteForm";
import { ProgramCard, StateNoteCard } from "@/components/RebateCards";
import { StcEstimate } from "@/components/StcEstimate";
import { Arrow, External, Phone } from "@/components/icons";
import { GuidePriceBadge } from "@/components/ui";
import { bomUrl, cities, cityDetails, cityFaqs, cityPath, CITY_DATA_CHECKED, getCity } from "@/lib/cities";
import { formatAUD } from "@/lib/models";
import { federalSTC, formatCheckedDate } from "@/lib/rebates";
import { breadcrumbs, cityServiceSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { comparePath, site } from "@/lib/site";
import { STC_PRICE_CAP, STC_SOURCES } from "@/lib/stc";

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const city = getCity((await params).city);
  if (!city) return {};
  const d = cityDetails(city);
  return pageMeta({
    title: `Heat pump hot water ${city.name}: prices, rebates & local quotes`,
    description: `Heat pump hot water in ${city.name}, ${city.state}: guide installed prices, ${d.stcLo}–${d.stcHi} federal STCs (zone ${d.zone}), ${d.programs.length ? "state rebates" : "state rebate check"}, the best models for ${city.name}'s climate and a free 60-second quote.`,
    path: cityPath(city),
  });
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const city = getCity((await params).city);
  if (!city) notFound();
  const d = cityDetails(city);
  const faqs = cityFaqs(city);
  const others = cities.filter((c) => c.slug !== city.slug);
  const facts = [
    { label: "July mean minimum", value: `${city.bom.julyMeanMin} °C` },
    { label: "January mean maximum", value: `${city.bom.janMeanMax} °C` },
    { label: "Days ≤ 0 °C a year", value: `${city.bom.frostDaysYear}` },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Heat pump hot water", path: "/heat-pump-hot-water" },
          { name: city.name, path: cityPath(city) },
        ])}
      />
      <JsonLd data={cityServiceSchema(city)} />

      <section className="relative overflow-hidden border-b border-ink-200/60 bg-cream-100">
        <div aria-hidden className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-ember-300/30 blur-3xl" />
        <div className="container-x relative grid items-start gap-8 py-10 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:gap-10">
          <div>
            <nav className="text-sm text-ink-500" aria-label="Breadcrumb">
              <Link href="/heat-pump-hot-water" className="tap hover:text-ink-900">Local guides</Link> <span className="mx-1">/</span>{" "}
              <span className="text-ink-700">{city.name}</span>
            </nav>
            <p className="eyebrow mt-4 sm:mt-6">{city.name}, {city.state} · STC zone {d.zone} · NCC climate zone {city.ncc.zone}</p>
            <h1 className="h-display mt-3 text-4xl text-ink-900 sm:text-5xl">Heat pump hot water in {city.name}</h1>
            <p className="mt-4 max-w-xl text-lg text-ink-600">{city.intro}</p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row" data-track-location="city-hero">
              <Link href="/quote" className="btn-primary py-3.5 text-base">
                Get a free {city.name} quote <Arrow className="h-4 w-4" />
              </Link>
              <Link href="/quote#callback" className="btn-ghost py-3.5">Request a callback</Link>
            </div>
            <a href={site.phoneHref} className="tap mt-1 gap-2 text-sm font-semibold text-ink-700 hover:text-ink-900">
              <Phone className="h-4 w-4 text-ember-600" /> or call {site.phone}
            </a>
            <ul className="mt-6 grid max-w-xl grid-cols-3 gap-2 text-center">
              <li className="rounded-2xl bg-white/70 px-2 py-3">
                <span className="block font-display text-xl font-semibold text-ink-900">{d.stcLo}–{d.stcHi}</span>
                <span className="text-xs text-ink-600">STCs ({d.year})</span>
              </li>
              <li className="rounded-2xl bg-white/70 px-2 py-3">
                <span className="block font-display text-xl font-semibold text-ink-900">{formatAUD(Math.min(...d.priced.map((p) => p.model.priceFrom)))}</span>
                <span className="text-xs text-ink-600">Guide price from</span>
              </li>
              <li className="rounded-2xl bg-white/70 px-2 py-3">
                <span className="block font-display text-xl font-semibold text-ink-900">{city.bom.julyMeanMin} °C</span>
                <span className="text-xs text-ink-600">July mean min</span>
              </li>
            </ul>
          </div>
          <div id="city-quote" className="w-full scroll-mt-24 lg:self-start lg:pt-8">
            <QuoteForm variant="compact" initialState={city.state} placement={`city-${city.slug}`} heading={`${city.name} quote in 60 seconds`} />
          </div>
        </div>
      </section>

      <section className="container-x grid gap-10 py-14 sm:py-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Climate</p>
          <h2 className="h-display mt-3 text-3xl text-ink-900">{city.name}&apos;s climate and your hot water</h2>
          <p className="mt-4 leading-relaxed text-ink-700">{city.climateNote}</p>
          <dl className="mt-6 grid grid-cols-3 gap-3">
            {facts.map((f) => (
              <div key={f.label} className="card p-4">
                <dt className="text-xs text-ink-500">{f.label}</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-ink-900">{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-ink-500">
            Bureau of Meteorology climate statistics,{" "}
            <a href={bomUrl(city.bom.stationId)} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink-800">
              {city.bom.station} (station {city.bom.stationId})
            </a>
            , all years {city.bom.period}. Checked {formatCheckedDate(CITY_DATA_CHECKED)}.
          </p>
          <div className="mt-6 rounded-2xl bg-cream-100 p-5">
            <h3 className="font-semibold text-ink-900">NCC climate zone {city.ncc.zone}: {city.ncc.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">
              The National Construction Code splits Australia into 8 climate zones for building design. {city.name} is in zone {city.ncc.zone}{" "}
              by council area. For an exact address, use the ABCB climate zone map.{" "}
              <a href={city.ncc.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-ember-600 underline">
                {city.ncc.sourceLabel} <External className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>
        <div>
          <p className="eyebrow">Local tips</p>
          <h2 className="h-display mt-3 text-3xl text-ink-900">Before you book in {city.name}</h2>
          <ul className="mt-5 space-y-3">
            {city.localTips.map((t) => (
              <li key={t} className="flex gap-3 leading-relaxed text-ink-700">
                <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ember-500" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-ink-600">
            Also covering enquiries from {city.nearby.join(", ")} and surrounds (partner coverage TBC, so enter your postcode to check).
          </p>
        </div>
      </section>

      <section className="bg-cream-100 py-14 sm:py-16" aria-labelledby="city-rebates">
        <div className="container-x">
          <p className="eyebrow">Rebates</p>
          <h2 id="city-rebates" className="h-display mt-3 text-3xl text-ink-900">Rebates in {city.name}</h2>
          <p className="mt-3 max-w-2xl text-ink-600">
            Figures come only from official government pages. Postcode {city.postcode} shown; your exact postcode may be in a different zone.{" "}
            <Link href={`/rebates?postcode=${city.postcode}`} className="font-semibold text-ember-600 underline">Check your postcode</Link>.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="space-y-5">
              <StcEstimate postcode={city.postcode} />
              <ProgramCard program={federalSTC} />
            </div>
            <div className="space-y-5">
              {d.programs.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
              {d.note && <StateNoteCard state={city.state} note={d.note} />}
              <div className="rounded-2xl border border-ember-500/25 bg-ember-500/5 p-5">
                <p className="font-semibold text-ink-900">Want these taken off a real price?</p>
                <p className="mt-1 text-sm text-ink-600">Your installer confirms eligibility and applies the rebates on your quote.</p>
                <div className="mt-4 grid gap-2 sm:flex">
                  <Link href="/quote" className="btn-primary whitespace-nowrap">Get a free quote <Arrow className="h-4 w-4" /></Link>
                  <Link href="/quote#callback" className="btn-ghost whitespace-nowrap">Request a callback</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-14 sm:py-16" aria-labelledby="city-picks">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Recommended</p>
            <h2 id="city-picks" className="h-display mt-3 text-3xl text-ink-900">Best heat pumps for {city.name}</h2>
          </div>
          <Link href={comparePath} className="tap gap-1.5 text-sm font-semibold text-ember-600 hover:text-ember-700">
            Compare all six <Arrow className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {d.picks.map(({ model, why }) => (
            <div key={model.slug} className="flex flex-col gap-3">
              <p className="rounded-2xl bg-gum-50 px-4 py-3 text-sm text-gum-600">
                <strong>Why for {city.name}:</strong> {why}
              </p>
              <ModelCard model={model} />
            </div>
          ))}
        </div>
      </section>

      <section className="container-x pb-14 sm:pb-16" aria-labelledby="city-prices">
        <h2 id="city-prices" className="h-display text-3xl text-ink-900">{city.name} guide prices and STCs</h2>
        <p className="mt-3 max-w-2xl text-ink-600">
          Guide prices for supply and standard installation, before rebates. STCs are for a {d.year} install at postcode {city.postcode} (zone {d.zone}),
          valued at the ${STC_PRICE_CAP} Clearing House cap, so treat the value as a maximum. State rebates depend on eligibility and aren&apos;t included.
        </p>
        <div className="mt-6 overflow-x-auto rounded-3xl border border-ink-200/70 bg-white">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <caption className="sr-only">Guide prices and estimated STCs in {city.name}</caption>
            <thead className="bg-cream-100 text-xs text-ink-600">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">System</th>
                <th scope="col" className="px-4 py-3 font-semibold">Guide price</th>
                <th scope="col" className="px-4 py-3 font-semibold">STCs</th>
                <th scope="col" className="px-4 py-3 font-semibold">After STCs, from about</th>
              </tr>
            </thead>
            <tbody>
              {d.priced.map(({ model, stcs, stcValue }) => (
                <tr key={model.slug} className="border-t border-ink-200/60">
                  <th scope="row" className="px-4 py-3 font-medium text-ink-900">
                    <Link href={`/models/${model.slug}`} className="hover:text-ember-700">{model.name}</Link>
                    <span className="block text-xs font-normal text-ink-500">{model.households}</span>
                  </th>
                  <td className="px-4 py-3 text-ink-800">
                    {formatAUD(model.priceFrom)} {!model.priceConfirmed && <GuidePriceBadge className="ml-1 align-middle" />}
                  </td>
                  <td className="px-4 py-3 text-ink-800">{stcs} (up to {formatAUD(stcValue)})</td>
                  <td className="px-4 py-3 font-semibold text-ink-900">{formatAUD(model.priceFrom - stcValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-500">
          STC counts from the{" "}
          <a href={STC_SOURCES.register.url} target="_blank" rel="noopener noreferrer" className="underline">CER register</a> and{" "}
          <a href={STC_SOURCES.zones.url} target="_blank" rel="noopener noreferrer" className="underline">postcode zone table</a>, with the{" "}
          {d.year} multiplication factor of {d.factor}. See the <Link href="/blog/heat-pump-hot-water-cost-australia" className="underline">installed price guide</Link>.
        </p>
      </section>

      <LeadCaptureBlock
        title={`Get your fixed price in ${city.name}`}
        lead="A few quick questions, or leave your number for a callback. A licensed partner installer who covers your postcode will confirm your site, price and rebates."
      />

      <FaqSection items={faqs} title={`Heat pump hot water in ${city.name}: common questions`} className="pt-4 sm:pt-6" />

      <section className="bg-cream-100 py-12">
        <div className="container-x">
          <h2 className="font-display text-xl font-semibold text-ink-900">Other local guides</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {others.map((c) => (
              <li key={c.slug}>
                <Link href={cityPath(c)} className="tap rounded-full border border-ink-200 bg-white px-4 text-sm font-semibold text-ink-800 hover:border-ink-500">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
