import Link from "next/link";
import { formatAUD, models } from "@/lib/models";
import { STC_PRICE_CAP, STC_SOURCES, stcCount, stcFactor, stcZoneForPostcode } from "@/lib/stc";
import { External } from "./icons";

/**
 * Federal STC estimate for a postcode across our six models, using the CER zone table,
 * register counts and multiplication factor. The dollar value is an upper estimate at the
 * $40 Clearing House cap; installers usually sell at the (lower) open-market price.
 */
export function StcEstimate({ postcode, year = new Date().getFullYear() }: { postcode: string; year?: number }) {
  const zone = stcZoneForPostcode(postcode);
  const factor = stcFactor(year);
  if (!postcode || zone === null || factor === 0) {
    return (
      <div className="rounded-2xl bg-cream-100 p-4 text-sm text-ink-700">
        {factor === 0
          ? "The federal scheme has ended, so no STC estimate is shown."
          : postcode
            ? `Postcode ${postcode} isn't in the Clean Energy Regulator's heat pump zone table, so we can't estimate STCs here. Your installer will confirm the zone and certificate count.`
            : "Enter your postcode to see an STC estimate."}
      </div>
    );
  }
  const rows = models.map((m) => {
    const n = stcCount(m.stc.counts, zone, year);
    return { m, n, value: n * STC_PRICE_CAP };
  });
  const counts = rows.map((r) => r.n);
  const lo = Math.min(...counts);
  const hi = Math.max(...counts);

  return (
    <div className="rounded-3xl border border-gum-500/25 bg-gum-50/60 p-5 sm:p-6">
      <p className="text-xs font-bold tracking-wide text-gum-600 uppercase">Federal STC estimate · {postcode}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-ink-900">
        {lo === hi ? lo : `${lo}–${hi}`} STCs, up to {formatAUD(lo * STC_PRICE_CAP)}
        {lo !== hi && `–${formatAUD(hi * STC_PRICE_CAP)}`}
      </p>
      <p className="mt-1 text-sm text-ink-700">
        Heat pump zone {zone}, installed in {year} (multiplication factor {factor}). Dollar values use the $
        {STC_PRICE_CAP} Clearing House cap, excluding GST. Most installers sell STCs at the open-market price, which is
        usually lower, so treat this as the maximum.
      </p>
      <details className="mt-3 group">
        <summary className="tap cursor-pointer text-sm font-semibold text-ember-600 underline">By model</summary>
        <table className="mt-2 w-full text-left text-sm">
          <caption className="sr-only">Estimated STCs by model for postcode {postcode}</caption>
          <thead className="text-xs text-ink-500">
            <tr>
              <th scope="col" className="py-1.5 font-semibold">Model (register entry)</th>
              <th scope="col" className="py-1.5 font-semibold">STCs</th>
              <th scope="col" className="py-1.5 font-semibold">Up to</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ m, n, value }) => (
              <tr key={m.slug} className="border-t border-gum-500/15">
                <th scope="row" className="py-1.5 pr-2 font-medium text-ink-800">
                  <Link href={`/models/${m.slug}`} className="hover:text-ember-700">{m.name}</Link>
                  <span className="block text-xs font-normal text-ink-500">{m.stc.registerModel}</span>
                </th>
                <td className="py-1.5 text-ink-800">{n}</td>
                <td className="py-1.5 text-ink-800">{formatAUD(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <ul className="mt-3 space-y-1 text-xs text-ink-500">
        {Object.values(STC_SOURCES).map((src) => (
          <li key={src.url}>
            <a href={src.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline hover:text-ink-800">
              {src.label} <External className="h-3 w-3 shrink-0" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
