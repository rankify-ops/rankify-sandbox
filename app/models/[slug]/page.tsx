import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeatPumpArt } from "@/components/HeatPumpArt";
import { FaqSection } from "@/components/Faq";
import { FormTrust } from "@/components/FormTrust";
import { LeadCaptureBlock } from "@/components/LeadCaptureBlock";
import { ModelCard } from "@/components/ModelCard";
import { Arrow, Check, Phone, Users } from "@/components/icons";
import { PlaceholderNotice, TbcBadge } from "@/components/ui";
import { modelFaqs } from "@/lib/faqs";
import { formatAUD, getModel, models } from "@/lib/models";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return models.map((m) => ({ slug: m.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const model = getModel((await params).slug);
  if (!model) return {};
  return pageMeta({
    title: `${model.name} heat pump: supply & install from ${formatAUD(model.priceFrom)}`,
    description: `${model.summary} ${model.capacityLitres} L ${model.type.toLowerCase()} system for ${model.households}. Set supply-and-install price (TBC), rebates handled. Get a free quote.`,
    path: `/models/${model.slug}`,
  });
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
            <nav className="text-sm text-ink-500" aria-label="Breadcrumb">
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
              <p className="text-sm text-ink-500">Supply &amp; install, set price</p>
              <div className="mt-1 flex items-center gap-3">
                <span className="font-display text-5xl font-semibold text-ink-900">{formatAUD(model.priceFrom)}</span>
                {!model.verified && <TbcBadge label="Price TBC" />}
              </div>
              <p className="mt-2 text-xs text-ink-500">Inc. GST (TBC), before eligible rebates. Standard installation only.</p>
              <Link href={`/quote?model=${model.slug}`} className="btn-primary mt-5 w-full py-3.5 text-base">
                Get a free quote <Arrow className="h-4 w-4" />
              </Link>
              <a href={site.phoneHref} className="btn-ghost mt-2.5 w-full py-3">
                <Phone className="h-4 w-4" /> Call {site.phone}
              </a>
              <div className="mt-5 border-t border-ink-200/70 pt-5">
                <FormTrust compact />
              </div>
            </div>
          </div>
          <HeatPumpArt className="mx-auto hidden w-72 sm:block" />
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
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-ember-500/25 bg-ember-500/5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-ink-900">Want the {model.name} at your place?</p>
              <p className="text-sm text-ink-600">Rebates you may be eligible for are applied on your quote.</p>
            </div>
            <Link href={`/quote?model=${model.slug}`} className="btn-primary shrink-0">
              Get a free quote <Arrow className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <LeadCaptureBlock
        title={`Get your fixed price on the ${model.name}`}
        lead="Four quick questions, or leave your number for a callback. A licensed partner installer will confirm your site, price and rebates."
        model={model.slug}
      />

      <FaqSection
        items={modelFaqs(model)}
        title={`${model.name}: common questions`}
        quoteHref={`/quote?model=${model.slug}`}
        className="pt-4 sm:pt-6"
      />

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

    </>
  );
}
