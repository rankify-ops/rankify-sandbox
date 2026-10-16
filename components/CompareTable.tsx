"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import { formatAUD, models, type HeatPumpModel } from "@/lib/models";
import { STC_PRICE_CAP, stcCount, stcZoneForPostcode } from "@/lib/stc";
import { inputClass } from "./formFields";
import { Arrow } from "./icons";
import { GuidePriceBadge } from "./ui";

/** Plain-language climate fit from the lowest rated operating temperature (spec sheets). */
export function climateFit(m: HeatPumpModel) {
  if (m.minOperatingC <= -10) return { label: "Cold & frosty areas", note: "e.g. Canberra, Ballarat, Launceston" };
  if (m.minOperatingC <= -7) return { label: "Mild to cool, light frost", note: "e.g. Melbourne, Adelaide Hills" };
  return { label: "Mild to warm climates", note: "e.g. Brisbane, Sydney, Perth" };
}

const SORTS = {
  price: { label: "Lowest guide price", fn: (a: HeatPumpModel, b: HeatPumpModel) => a.priceFrom - b.priceFrom },
  noise: { label: "Quietest", fn: (a: HeatPumpModel, b: HeatPumpModel) => a.noiseDb - b.noiseDb || a.priceFrom - b.priceFrom },
  cold: { label: "Best for cold", fn: (a: HeatPumpModel, b: HeatPumpModel) => a.minOperatingC - b.minOperatingC || a.priceFrom - b.priceFrom },
  size: { label: "Largest tank", fn: (a: HeatPumpModel, b: HeatPumpModel) => b.capacityLitres - a.capacityLitres || a.priceFrom - b.priceFrom },
} as const;
type SortKey = keyof typeof SORTS;

/**
 * Side-by-side comparison of every model: capacity, climate fit, guide installed price,
 * STC estimate (for the visitor's postcode, or the range across all zones) and noise,
 * each with its own "Get a quote on this model" button.
 */
export function CompareTable({ year = new Date().getFullYear() }: { year?: number }) {
  const uid = useId();
  const [postcode, setPostcode] = useState("");
  const [sort, setSort] = useState<SortKey>("price");
  const zone = postcode.length === 4 ? stcZoneForPostcode(postcode) : null;

  const rows = useMemo(
    () =>
      [...models].sort(SORTS[sort].fn).map((m) => {
        const byZone = [1, 2, 3, 4, 5].map((z) => stcCount(m.stc.counts, z, year));
        const stcs = zone ? stcCount(m.stc.counts, zone, year) : null;
        return { m, fit: climateFit(m), stcLo: Math.min(...byZone), stcHi: Math.max(...byZone), stcs };
      }),
    [sort, zone, year],
  );

  const stcText = (r: (typeof rows)[number]) =>
    r.stcs !== null ? `${r.stcs} STCs, up to ${formatAUD(r.stcs * STC_PRICE_CAP)}` : `${r.stcLo}–${r.stcHi} STCs, up to ${formatAUD(r.stcLo * STC_PRICE_CAP)}–${formatAUD(r.stcHi * STC_PRICE_CAP)}`;
  const afterText = (r: (typeof rows)[number]) =>
    `from about ${formatAUD(r.m.priceFrom - (r.stcs ?? r.stcHi) * STC_PRICE_CAP)} after STCs${r.stcs === null ? " (best zone)" : ""}`;
  const quoteHref = (m: HeatPumpModel) => `/quote?model=${m.slug}`;
  const onQuote = (m: HeatPumpModel) => track("compare_quote_click", { model: m.slug, sort, has_postcode: zone !== null });

  return (
    <div>
      <form
        className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5"
        aria-label="Compare options"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex-1">
          <label htmlFor={`${uid}-pc`} className="mb-1.5 block text-sm font-semibold text-ink-800">
            Your postcode <span className="font-normal text-ink-500">(optional, for STCs)</span>
          </label>
          <input
            id={`${uid}-pc`}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={4}
            placeholder="e.g. 4000"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value.replace(/\D/g, ""))}
            className={`${inputClass()} max-w-36`}
            aria-describedby={`${uid}-pc-status`}
          />
          <p id={`${uid}-pc-status`} className="mt-1.5 text-xs text-ink-500" role="status">
            {postcode.length === 4
              ? zone
                ? `Postcode ${postcode} is in heat pump zone ${zone}. STCs below are for a ${year} install there.`
                : `Postcode ${postcode} isn't in the CER zone table. Showing the range across all zones.`
              : `Showing the STC range across all five zones for a ${year} install.`}
          </p>
        </div>
        <div>
          <label htmlFor={`${uid}-sort`} className="mb-1.5 block text-sm font-semibold text-ink-800">Sort by</label>
          <select id={`${uid}-sort`} value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={inputClass()}>
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </form>

      <h2 className="sr-only">Systems compared</h2>
      {/* Desktop and tablet: table */}
      <div className="mt-6 hidden overflow-x-auto rounded-3xl border border-ink-200/70 bg-white md:block">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <caption className="sr-only">Heat pump hot water systems compared: capacity, climate fit, guide price, STCs and noise</caption>
          <thead className="bg-cream-100 text-xs text-ink-600">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">System</th>
              <th scope="col" className="px-4 py-3 font-semibold">Capacity</th>
              <th scope="col" className="px-4 py-3 font-semibold">Climate fit</th>
              <th scope="col" className="px-4 py-3 font-semibold">Guide price, installed</th>
              <th scope="col" className="px-4 py-3 font-semibold">STC estimate</th>
              <th scope="col" className="px-4 py-3 font-semibold">Noise</th>
              <th scope="col" className="px-4 py-3"><span className="sr-only">Quote</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.m.slug} className="border-t border-ink-200/60 align-top">
                <th scope="row" className="px-4 py-4 font-medium text-ink-900">
                  <Link href={`/models/${r.m.slug}`} className="font-semibold hover:text-ember-700">{r.m.name}</Link>
                  <span className="block text-xs font-normal text-ink-500">{r.m.brand} · {r.m.type}</span>
                </th>
                <td className="px-4 py-4 text-ink-800">
                  {r.m.capacityLitres} L<span className="block text-xs text-ink-500">{r.m.households}</span>
                </td>
                <td className="px-4 py-4 text-ink-800">
                  {r.fit.label}
                  <span className="block text-xs text-ink-500">Rated from {String(r.m.minOperatingC).replace("-", "−")} °C · {r.fit.note}</span>
                </td>
                <td className="px-4 py-4 text-ink-800">
                  <span className="font-semibold">{formatAUD(r.m.priceFrom)}</span> {!r.m.priceConfirmed && <GuidePriceBadge className="ml-1 align-middle" />}
                  <span className="block text-xs text-ink-500">before rebates</span>
                </td>
                <td className="px-4 py-4 text-ink-800">
                  {stcText(r)}
                  <span className="block text-xs text-ink-500">{afterText(r)}</span>
                </td>
                <td className="px-4 py-4 text-ink-800">{r.m.compare.noise}</td>
                <td className="px-4 py-4">
                  <Link href={quoteHref(r.m)} onClick={() => onQuote(r.m)} className="btn-primary px-4 py-2.5 text-sm whitespace-nowrap">
                    Get a quote on this model
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <ul className="mt-6 space-y-4 md:hidden">
        {rows.map((r) => (
          <li key={r.m.slug} className="card p-5">
            <p className="text-xs font-semibold tracking-wider text-ink-500 uppercase">{r.m.brand} · {r.m.type}</p>
            <h3 className="mt-1 font-display text-xl font-medium text-ink-900">
              <Link href={`/models/${r.m.slug}`}>{r.m.name}</Link>
            </h3>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-xs text-ink-500">Capacity</dt>
                <dd className="font-semibold text-ink-900">{r.m.capacityLitres} L · {r.m.households}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Guide price, installed</dt>
                <dd className="font-semibold text-ink-900">{formatAUD(r.m.priceFrom)}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Climate fit</dt>
                <dd className="text-ink-800">{r.fit.label} (from {String(r.m.minOperatingC).replace("-", "−")} °C)</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Noise</dt>
                <dd className="text-ink-800">{r.m.compare.noise}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-ink-500">STC estimate</dt>
                <dd className="text-ink-800">{stcText(r)}, {afterText(r)}</dd>
              </div>
            </dl>
            <Link href={quoteHref(r.m)} onClick={() => onQuote(r.m)} className="btn-primary mt-4 w-full">
              Get a quote on this model <Arrow className="h-4 w-4" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
