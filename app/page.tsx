import Link from "next/link";
import { ModelCard } from "@/components/ModelCard";
import { QuoteForm } from "@/components/QuoteForm";
import { Testimonials } from "@/components/Testimonials";
import { FaqSection } from "@/components/Faq";
import { LeadCaptureBlock } from "@/components/LeadCaptureBlock";
import { GuidePriceBadge, SectionHeading, TbcBadge } from "@/components/ui";
import { Arrow, Bolt, Check, Clock, Leaf, Phone, Shield, Tag, Wrench } from "@/components/icons";
import { homeFaqs } from "@/lib/faqs";
import { formatAUD, models } from "@/lib/models";
import { referralDisclosure, site } from "@/lib/site";

const trust = [
  { icon: Tag, title: "Set, upfront pricing", text: "Supply and install prices are published per model. No surprise call-out quotes." },
  { icon: Shield, title: "Licensed installers (TBC)", text: "Partner installers hold the plumbing and electrical licences your state requires." },
  { icon: Leaf, title: "Rebates applied for you", text: "Eligible STCs are typically taken off your quote upfront by the installer." },
  { icon: Clock, title: "Fast response", text: "60 seconds to request. A local installer usually replies within 1 business day (TBC)." },
];

const steps = [
  {
    n: "1",
    title: "Get a free quote",
    text: "Answer four quick questions and leave your details. It takes about 60 seconds, with no obligation.",
  },
  {
    n: "2",
    title: "We match a local installer",
    text: "Your request goes to one licensed partner installer (TBC) who services your postcode. They confirm your site and fixed price.",
  },
  {
    n: "3",
    title: "Install & claim rebates",
    text: "They fit your new system, take the old one away, and apply eligible rebates like STCs straight off your quote.",
  },
];

export default function Home() {
  const featured = models.filter((m) => ["istore-270", "rheem-ambiheat-270", "reclaim-energy-co2-315"].includes(m.slug));
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-ember-500/25 blur-3xl" />
          <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-gum-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:22px_22px]" />
        </div>
        <div className="container-x relative grid items-center gap-10 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-ink-200">
              <span className="h-1.5 w-1.5 rounded-full bg-gum-500" /> Matching homes in QLD, NSW &amp; VIC
            </p>
            <h1 className="h-display mt-6 text-[2.5rem] leading-[1.05] sm:text-6xl lg:text-[3.4rem]">
              Hot water that costs <span className="italic text-ember-400">less</span> to run. Installed for a fixed price.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-200">
              Clear guide prices, rebates handled for you, and a licensed local installer who locks in your fixed price.{" "}
              <strong className="font-semibold text-white">Get your free quote in 60 seconds.</strong>
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center lg:hidden">
              <a href="#hero-quote" className="btn-primary px-8 py-4 text-base">
                Start my 60-second quote <Arrow className="h-5 w-5" />
              </a>
              <a href={site.phoneHref} className="tap justify-center gap-2 text-sm font-semibold text-ink-200 hover:text-white sm:justify-start">
                <Phone className="h-4 w-4 text-ember-400" /> or call {site.phone}
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-200" aria-label="Why homeowners use us">
              {["Free & no obligation", "Old system removed", "Rebates handled for you*"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-ember-400" /> {t}
                </li>
              ))}
            </ul>
            <dl className="mt-8 hidden gap-4 sm:flex">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <dt className="text-xs text-ink-200">Installed from</dt>
                <dd className="mt-0.5 flex items-center gap-2 font-display text-2xl font-semibold">
                  {formatAUD(Math.min(...models.map((m) => m.priceFrom)))} <GuidePriceBadge />
                </dd>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Bolt className="h-5 w-5 text-gum-500" />
                <div>
                  <dt className="text-sm font-semibold">Up to ~70% less energy</dt>
                  <dd className="text-xs text-ink-200">vs electric storage (TBC)</dd>
                </div>
              </div>
            </dl>
            <a href={site.phoneHref} className="mt-6 hidden items-center gap-2 text-sm font-semibold text-ink-200 hover:text-white lg:inline-flex">
              <Phone className="h-4 w-4 text-ember-400" /> Prefer to talk? Call {site.phone}
            </a>
          </div>

          <div id="hero-quote" className="relative w-full scroll-mt-20 text-ink-900">
            <div aria-hidden className="absolute -inset-3 rounded-[2.25rem] bg-gradient-to-br from-ember-500/40 to-gum-500/20 blur-2xl" />
            <div className="relative">
              <QuoteForm variant="compact" tone="dark" heading="Free quote in 60 seconds" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="relative z-10 -mt-10">
        <div className="container-x">
          <div className="card grid gap-px overflow-hidden bg-ink-200/70 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white p-6">
                <Icon className="h-6 w-6 text-ember-600" />
                <p className="mt-3 font-semibold text-ink-900">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works: 3-step band */}
      <section className="container-x py-20 sm:py-24" aria-labelledby="how-it-works">
        <div className="text-center">
          <p className="eyebrow">How it works</p>
          <h2 id="how-it-works" className="h-display mx-auto mt-3 max-w-2xl text-3xl text-ink-900 sm:text-4xl">
            Three steps from old tank to heat pump
          </h2>
        </div>
        <ol className="relative mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
          <span aria-hidden className="absolute left-[16.6%] right-[16.6%] top-7 hidden h-px bg-gradient-to-r from-ember-300 via-ember-500 to-gum-500 md:block" />
          {steps.map((s) => (
            <li key={s.n} className="relative flex gap-4 rounded-3xl bg-cream-100 p-6 md:flex-col md:items-center md:bg-transparent md:p-2 md:text-center">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ink-900 font-display text-2xl font-semibold text-white ring-8 ring-cream-50">
                {s.n}
              </span>
              <div>
                <h3 className="font-semibold text-ink-900 md:mt-3 md:text-lg">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600 md:mx-auto md:max-w-xs">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <Link href="/quote" className="btn-primary px-8 py-4 text-base">
            Get a free quote <Arrow className="h-4 w-4" />
          </Link>
          <p className="text-sm text-ink-600">Takes about 60 seconds · Free &amp; no obligation</p>
        </div>
      </section>

      <Testimonials className="pt-0 sm:pt-0" />

      {/* Models */}
      <section className="bg-cream-100 py-20 sm:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Models & prices"
              title="Six proven systems, clear guide prices"
              lead="Each price includes the unit, standard installation by licensed trades, and removal of your old system."
            />
            <Link href="/models" className="btn-ghost shrink-0">
              Compare all 6 models <Arrow className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featured.map((m) => (
              <ModelCard key={m.slug} model={m} />
            ))}
          </div>
        </div>
      </section>

      <LeadCaptureBlock
        title="Get your fixed price, rebates included"
        lead="Four quick questions and you are done, or leave your number and a licensed partner installer will call you back."
      />

      {/* Rebates teaser */}
      <section className="container-x pb-20 pt-6 sm:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Rebates"
              title="See what you could save before you commit"
              lead="Federal STCs apply in every state, and QLD, NSW and VIC homes may access extra state programs. Our checker lists them, with links to every official government page."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/quote" className="btn-primary">
                Get a free quote <Arrow className="h-4 w-4" />
              </Link>
              <Link href="/rebates" className="btn-ghost">Check my rebates first</Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { s: "Federal", t: "Small-scale Technology Certificates" },
              { s: "VIC", t: "Solar Victoria + VEU" },
              { s: "NSW", t: "Hot Water Upgrade Incentive" },
              { s: "QLD", t: "State programs (TBC)" },
            ].map((r) => (
              <Link
                key={r.s}
                href={r.s === "Federal" ? "/rebates#stc" : `/rebates?state=${r.s}`}
                className="card group p-6 transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="text-xs font-bold tracking-wider text-ember-600 uppercase">{r.s}</span>
                <p className="mt-2 font-semibold text-ink-900">{r.t}</p>
                <p className="mt-4 flex items-center gap-2 text-sm text-ink-600">
                  Amount <TbcBadge />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="container-x">
        <div className="grid gap-8 rounded-[2rem] border border-ink-200/70 bg-white p-8 sm:p-12 lg:grid-cols-[auto_1fr] lg:items-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gum-50 text-gum-600">
            <Wrench className="h-7 w-7" />
          </span>
          <div>
            <h2 className="h-display text-2xl text-ink-900">Straight up about how we work</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-ink-600">{referralDisclosure}</p>
            <Link href="/about" className="tap mt-2 gap-1.5 text-sm font-semibold text-ember-600 hover:text-ember-700">
              How our referrals work <Arrow className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <FaqSection items={homeFaqs} className="pb-6 sm:pb-10" />
      <p className="container-x text-xs text-ink-500">
        *Where eligible. Rebates and STC values vary by program, product, location and date.
      </p>
    </>
  );
}
