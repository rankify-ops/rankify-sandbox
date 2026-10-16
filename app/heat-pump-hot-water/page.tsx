import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Arrow } from "@/components/icons";
import { PageHero } from "@/components/ui";
import { cities, cityDetails, cityPath } from "@/lib/cities";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Heat pump hot water by city: local prices, rebates and climate",
  description:
    "Local heat pump hot water guides for every capital city and major regional centres, from Cairns to Launceston: climate, STC zone, state rebates, recommended models and guide prices.",
  path: "/heat-pump-hot-water",
});

export default function CitiesIndex() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Heat pump hot water", path: "/heat-pump-hot-water" }])} />
      <PageHero
        eyebrow="Local guides"
        title="Heat pump hot water in your city"
        lead="Climate, STC zone, state rebates and the models that suit where you live, using official BOM, ABCB and government figures."
      />
      {[
        { title: "Capital cities", list: cities.filter((c) => !c.regional) },
        { title: "Regional centres", list: cities.filter((c) => c.regional) },
      ].map((group) => (
        <section key={group.title} className="container-x py-10 sm:py-12" aria-label={group.title}>
          <h2 className="h-display mb-6 text-2xl text-ink-900">{group.title}</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {group.list.map((c) => {
              const d = cityDetails(c);
              return (
                <li key={c.slug}>
                  <Link href={cityPath(c)} className="card group flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-lift">
                    <span className="text-xs font-semibold tracking-wider text-ink-500 uppercase">{c.state} · STC zone {d.zone}</span>
                    <span className="mt-2 font-display text-2xl font-medium text-ink-900">{c.name}</span>
                    <span className="mt-2 text-sm text-ink-600">
                      July mean min {c.bom.julyMeanMin} °C · {d.stcLo}–{d.stcHi} STCs · {d.programs.some((p) => p.amountConfirmed) ? "State rebate available" : "Federal STCs"}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ember-600">
                      {c.name} guide <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
