import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { breadcrumbs, productSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqSection } from "@/components/Faq";
import { LeadCaptureBlock } from "@/components/LeadCaptureBlock";
import { ModelCard } from "@/components/ModelCard";
import { QuoteForm } from "@/components/QuoteForm";
import { Testimonials } from "@/components/Testimonials";
import { Arrow, Check, Phone, Users } from "@/components/icons";
import { GuidePriceBadge } from "@/components/ui";
import { modelFaqs } from "@/lib/faqs";
import { formatAUD, getModel, models } from "@/lib/models";
import { comparePath, site } from "@/lib/site";

export function generateStaticParams() {
  return models.map((m) => ({ slug: m.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const model = getModel((await params).slug);
  if (!model) return {};
  return pageMeta({
    title: `${model.name} heat pump: supply & install guide price ${formatAUD(model.priceFrom)}`,
    description: `${model.summary} ${model.capacityLitres} L ${model.type.toLowerCase()} system for ${model.households}. Guide supply-and-install price, rebates handled. Get a free quote in 60 seconds.`,
    path: `/models/${model.slug}`,
  });
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const model = getModel((await params).slug);
  if (!model) notFound();
  const others = models.filter((m) => m.slug !== model.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Models", path: "/models" }, { name: model.name, path: `/models/${model.slug}` }])} />
      <JsonLd data={productSchema(model)} />
      <section className="relative overflow-hidden border-b border-ink-200/60 bg-cream-100">
        <div aria-hidden className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-ember-300/30 blur-3xl" />
        <div className="container-x relative grid items-start gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <nav className="text-sm text-ink-500" aria-label="Breadcrumb">
              <Link href="/models" className="tap hover:text-ink-900">Models</Link> <span className="mx-1">/</span>{" "}
              <span className="text-ink-700">{model.name}</span>
            </nav>
            <p className="eyebrow mt-6">{model.brand} · {model.tier} · {model.type}</p>
            <h1 className="h-display mt-3 text-4xl text-ink-900 sm:text-5xl">{model.name}</h1>
            <p className="mt-4 max-w-xl text-lg text-ink-600">{model.summary}</p>
            <p className="mt-4 flex items-center gap-2 text-sm text-ink-700">
              <Users className="h-4 w-4" /> Suits {model.households}
            </p>

            <div className="card mt-8 max-w-md p-6">
              <p className="text-sm text-ink-500">Supply &amp; install from</p>
              <div className="mt-1 flex items-center gap-3">
                <span className="font-display text-5xl font-semibold text-ink-900">{formatAUD(model.priceFrom)}</span>
                {!model.priceConfirmed && <GuidePriceBadge />}
              </div>
              <p className="mt-2 text-xs text-ink-500">Guide price for standard installation, before eligible rebates. Your installer confirms your fixed price.</p>
              <Link href={`/quote?model=${model.slug}`} className="btn-primary mt-5 w-full py-3.5 text-base">
                <span className="sm:hidden">Free quote on this model</span>
                <span className="hidden sm:inline">Get a free quote on this model</span> <Arrow className="h-4 w-4" />
              </Link>
              <a href={site.phoneHref} className="btn-ghost mt-2.5 w-full py-3">
                <Phone className="h-4 w-4" /> Call {site.phone}
              </a>
            </div>
          </div>
          <div id="model-quote" className="w-full scroll-mt-24 lg:self-start lg:pt-10">
            <QuoteForm variant="compact" initialModel={model.slug} heading={`Quote the ${model.capacityLitres} L in 60s`} />
          </div>
        </div>
      </section>

      <section className="container-x grid gap-10 py-16 lg:grid-cols-2">
        <div>
          <p className="mb-6 text-sm text-ink-600">
            Specs from the manufacturer&apos;s data sheet and published listings. Items marked &ldquo;confirm&rdquo; vary between
            sources, so your installer will confirm them against the current data sheet.
          </p>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="h-display text-2xl text-ink-900">Specifications</h2>
            <Link href={comparePath} className="tap text-sm font-semibold text-ember-600 underline hover:text-ember-700">Compare with other models</Link>
          </div>
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

      <Testimonials className="pt-0 sm:pt-4" />

      <FaqSection
        items={modelFaqs(model)}
        title={`${model.name}: common questions`}
        quoteHref={`/quote?model=${model.slug}`}
        className="pt-4 sm:pt-6"
      />

      <section className="bg-cream-100 py-16">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <h2 className="h-display text-2xl text-ink-900">Compare other models</h2>
            <Link href={comparePath} className="tap gap-1.5 text-sm font-semibold text-ember-600 hover:text-ember-700">
              See all six side by side <Arrow className="h-4 w-4" />
            </Link>
          </div>
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
