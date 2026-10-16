import Link from "next/link";
import { formatAUD, type HeatPumpModel } from "@/lib/models";
import { Arrow, Check, Users } from "./icons";
import { TbcBadge } from "./ui";

export function ModelCard({ model }: { model: HeatPumpModel }) {
  const popular = model.slug === "family-270";
  return (
    <article
      className={`card group relative flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
        popular ? "ring-2 ring-ember-500" : ""
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-6 rounded-full bg-ember-500 px-3 py-1 text-xs font-semibold text-white">
          Most requested
        </span>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-ink-400 uppercase">
          {model.tier} · {model.type}
        </span>
        <span className="flex items-center gap-1 text-xs text-ink-600">
          <Users className="h-3.5 w-3.5" /> {model.households}
        </span>
      </div>
      <h3 className="mt-3 font-display text-2xl font-medium text-ink-900">{model.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{model.summary}</p>
      <ul className="mt-5 space-y-2 text-sm text-ink-700">
        {model.highlights.map((h) => (
          <li key={h} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-gum-500" /> {h}
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t border-ink-200/70 pt-5">
        <p className="text-xs text-ink-400">Supply &amp; install from</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-display text-3xl font-semibold text-ink-900">{formatAUD(model.priceFrom)}</span>
          {!model.verified && <TbcBadge label="Price TBC" />}
        </div>
        <p className="mt-1 text-xs text-ink-400">Before any eligible rebates</p>
      </div>
      <div className="mt-6 flex gap-2">
        <Link href={`/quote?model=${model.slug}`} className="btn-primary flex-1 py-2.5">
          Get a quote
        </Link>
        <Link href={`/models/${model.slug}`} className="btn-ghost py-2.5" aria-label={`View details for ${model.name}`}>
          Details <Arrow className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
