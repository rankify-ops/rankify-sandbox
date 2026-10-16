import Link from "next/link";
import { formatAUD, type HeatPumpModel } from "@/lib/models";
import { STC_PRICE_CAP, STC_SOURCES, stcCount, stcFactor } from "@/lib/stc";

/** Federal STC estimate for one model across the five heat pump zones (CER data). */
export function ModelStc({ model, year = new Date().getFullYear() }: { model: HeatPumpModel; year?: number }) {
  const factor = stcFactor(year);
  if (factor === 0) return null;
  const byZone = [1, 2, 3, 4, 5].map((z) => stcCount(model.stc.counts, z, year));
  const lo = Math.min(...byZone);
  const hi = Math.max(...byZone);
  return (
    <div className="mt-5 rounded-2xl border border-gum-500/25 bg-gum-50/60 p-5">
      <p className="text-xs font-bold tracking-wide text-gum-600 uppercase">Federal STCs, installed {year}</p>
      <p className="mt-1 font-semibold text-ink-900">
        {lo}–{hi} certificates depending on your postcode, up to {formatAUD(lo * STC_PRICE_CAP)}–{formatAUD(hi * STC_PRICE_CAP)}
      </p>
      <p className="mt-1 text-sm text-ink-600">
        By zone 1–5: {byZone.join(" · ")}. From the CER register entry {model.stc.registerModel}, at the ${STC_PRICE_CAP} Clearing House
        cap (ex GST); open-market prices are usually lower.{" "}
        <Link href="/rebates" className="font-semibold text-ember-600 underline">Check your postcode</Link> ·{" "}
        <a href={STC_SOURCES.register.url} target="_blank" rel="noopener noreferrer" className="underline">CER register</a>
      </p>
    </div>
  );
}
