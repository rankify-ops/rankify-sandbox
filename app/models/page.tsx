import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { LeadCaptureBlock } from "@/components/LeadCaptureBlock";
import { ModelCard } from "@/components/ModelCard";
import { PageHero, PlaceholderNotice } from "@/components/ui";
import { formatAUD, models } from "@/lib/models";

export const metadata: Metadata = pageMeta({
  title: "Heat pump models & fixed supply-and-install prices",
  description: "Compare six heat pump hot water systems from Emerald, iStore, Rheem, Stiebel Eltron, Reclaim Energy and Sanden, 220 L to 315 L, with supply-and-install guide prices. Get a free quote in 60 seconds.",
  path: "/models",
});

export default function ModelsPage() {
  return (
    <>
      <PageHero
        eyebrow="Models & prices"
        title="Six proven systems. Clear guide prices, installed."
        lead="Every price covers the unit, standard installation by licensed trades, and removal of your old system. Rebates you're eligible for come off on top."
      >
        <div className="mt-8 max-w-2xl">
          <PlaceholderNotice>
            <strong>Guide prices:</strong> supply and standard install, before rebates. Your installer confirms the fixed price after checking your site.
          </PlaceholderNotice>
        </div>
      </PageHero>

      <section className="container-x py-16" aria-labelledby="all-models">
        <h2 id="all-models" className="h-display text-2xl text-ink-900 sm:text-3xl">All six models</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {models.map((m) => (
            <ModelCard key={m.slug} model={m} />
          ))}
        </div>

      </section>

      <LeadCaptureBlock
        title="Not sure which model suits your home?"
        lead="Tell us your household size in the 60-second form, or request a callback. A licensed installer will recommend the right system and confirm your fixed price."
      />

      <section className="container-x pb-4">
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="px-6 pt-6 text-left font-display text-xl font-medium text-ink-900">Side-by-side comparison</caption>
            <thead className="text-xs tracking-wider text-ink-500 uppercase">
              <tr className="border-b border-ink-200/70">
                <th className="px-6 py-4 font-semibold">Model</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Tank</th>
                <th className="px-6 py-4 font-semibold">Suits</th>
                <th className="px-6 py-4 font-semibold">Installed from</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.slug} className="border-b border-ink-200/50 last:border-0">
                  <td className="px-6 py-4 font-semibold text-ink-900">
                    <Link href={`/models/${m.slug}`} className="hover:text-ember-600">{m.name}</Link>
                  </td>
                  <td className="px-6 py-4 text-ink-600">{m.type}</td>
                  <td className="px-6 py-4 text-ink-600">{m.capacityLitres} L</td>
                  <td className="px-6 py-4 text-ink-600">{m.households}</td>
                  <td className="px-6 py-4 font-semibold text-ink-900">
                    {formatAUD(m.priceFrom)} {!m.priceConfirmed && <span className="text-xs font-semibold text-ink-500">guide</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
