import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeatPumpArt } from "@/components/HeatPumpArt";
import { ModelCard } from "@/components/ModelCard";
import { Arrow, Check, Users } from "@/components/icons";
import { CtaBand, PlaceholderNotice, TbcBadge } from "@/components/ui";
import { formatAUD, getModel, models } from "@/lib/models";

export function generateStaticParams() {
  return models.map((m) => ({ slug: m.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const model = getModel((await params).slug);
  if (!model) return {};
  return {
    title: `${model.name} heat pump, supply & install`,
    description: `${model.summary} Supply and install from ${formatAUD(model.priceFrom)} (price TBC).`,
  };
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const model = getModel((await params).slug);
  if (!model) notFound();
  const others = models.filter((m) => m.slug !== model.slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-200/60 bg-cream-100">
        <div aria-hidden className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-ember-300/30 blur-3xl" />
        <div className="container-x relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <nav className="text-sm text-ink-400" aria-label="Breadcrumb">
              <Link href="/models" className="hover:text-ink-900">Models</Link> <span className="mx-1">/</span>{" "}
              <span className="text-ink-700">{model.name}</span>
            </nav>
            <p className="eyebrow mt-6">{model.tier} · {model.type}</p>
            <h1 className="h-display mt-3 text-4xl text-ink-900 sm:text-5xl">{model.name}</h1>
            <p className="mt-4 max-w-xl text-lg text-ink-600">{model.summary}</p>
            <p className="mt-4 flex items-center gap-2 text-sm text-ink-700">
              <Users className="h-4 w-4" /> Suits {model.households}
            </p>

            <div className="card mt-8 max-w-md p-6">
              <p className="text-sm text-ink-400">Supply &amp; install, set price</p>
              <div className="mt-1 flex items-center gap-3">
                <span className="font-display text-5xl font-semibold text-ink-900">{formatAUD(model.priceFrom)}</span>
                {!model.verified && <TbcBadge label="Price TBC" />}
              </div>
              <p className="mt-2 text-xs text-ink-400">Inc. GST (TBC), before eligible rebates. Standard installation only.</p>
              <Link href={`/quote?model=${model.slug}`} className="btn-primary mt-5 w-full py-3.5 text-base">
                Get a quote for this model <Arrow className="h-4 w-4" />
              </Link>
              <Link href="/rebates" className="mt-3 block text-center text-sm font-semibold text-ember-600 hover:text-ember-700">
                Check which rebates apply →
              </Link>
            </div>
          </div>
          <HeatPumpArt className="mx-auto w-56 sm:w-72" />
        </div>
      </section>

      <section className="container-x grid gap-10 py-16 lg:grid-cols-2">
        <div>
          {!model.verified && (
            <div className="mb-6">
              <PlaceholderNotice>This is a placeholder model. Specifications and price are TBC.</PlaceholderNotice>
            </div>
          )}
          <h2 className="h-display text-2xl text-ink-900">Specifications</h2>
          <dl className="card mt-5 divide-y divide-ink-200/60">
            {model.specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-4 px-6 py-4 text-sm">
                <dt className="text-ink-600">{s.label}</dt>
                <dd className="text-right font-semibold text-ink-900">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="h-display text-2xl text-ink-900">What&apos;s included in the price</h2>
          <ul className="mt-5 space-y-3">
            {model.included.map((i) => (
              <li key={i} className="flex gap-3 text-ink-700">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gum-50 text-gum-600">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {i}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-2xl bg-cream-100 p-6">
            <h3 className="font-semibold text-ink-900">Best for</h3>
            <p className="mt-1 text-ink-600">{model.bestFor}</p>
            <h3 className="mt-5 font-semibold text-ink-900">May cost extra</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">
              Relocating the system, new concrete slab, switchboard upgrades, extended pipework or difficult access.
              Your installer confirms any extras before work starts.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream-100 py-16">
        <div className="container-x">
          <h2 className="h-display text-2xl text-ink-900">Compare other models</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {others.map((m) => (
              <ModelCard key={m.slug} model={m} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
