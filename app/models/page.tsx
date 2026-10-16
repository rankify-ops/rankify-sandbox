import type { Metadata } from "next";
import Link from "next/link";
import { ModelCard } from "@/components/ModelCard";
import { CtaBand, PageHero, PlaceholderNotice } from "@/components/ui";
import { formatAUD, models } from "@/lib/models";

export const metadata: Metadata = {
  title: "Heat pump models & supply-and-install prices",
  description: "Compare six heat pump hot water systems with set supply-and-install prices.",
};

export default function ModelsPage() {
  return (
    <>
      <PageHero
        eyebrow="Models & prices"
        title="Six systems. One set price each, installed."
        lead="Every price covers the unit, standard installation by licensed trades, and removal of your old system. Rebates you're eligible for come off on top."
      >
        <div className="mt-8 max-w-2xl">
          <PlaceholderNotice>
            <strong>Preview data:</strong> model names, specs and prices are placeholders marked TBC while verified pricing is confirmed.
          </PlaceholderNotice>
        </div>
      </PageHero>

      <section className="container-x py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {models.map((m) => (
            <ModelCard key={m.slug} model={m} />
          ))}
        </div>

        <div className="card mt-16 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="px-6 pt-6 text-left font-display text-xl font-medium text-ink-900">Side-by-side</caption>
            <thead className="text-xs tracking-wider text-ink-400 uppercase">
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
                    {formatAUD(m.priceFrom)} {!m.verified && <span className="text-xs font-bold text-amber-700">TBC</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CtaBand title="Not sure which size you need?" lead="Choose 'Help me choose' in the quote form and your installer will recommend the right system for your household." />
    </>
  );
}
