import Link from "next/link";
import { HeatPumpArt } from "@/components/HeatPumpArt";
import { ModelCard } from "@/components/ModelCard";
import { FaqSection } from "@/components/Faq";
import { LeadCaptureBlock } from "@/components/LeadCaptureBlock";
import { CtaBand, SectionHeading, TbcBadge } from "@/components/ui";
import { Arrow, Bolt, Check, Clock, Leaf, Phone, Shield, Tag, Wrench } from "@/components/icons";
import { homeFaqs } from "@/lib/faqs";
import { formatAUD, models } from "@/lib/models";
import { referralDisclosure, site } from "@/lib/site";

const trust = [
  { icon: Tag, title: "Set, upfront pricing", text: "Supply and install prices are published per model. No surprise call-out quotes." },
  { icon: Shield, title: "Licensed installers (TBC)", text: "Partner installers hold the plumbing and electrical licences your state requires." },
  { icon: Leaf, title: "Rebates applied for you", text: "Eligible STCs are typically taken off your quote upfront by the installer." },
  { icon: Clock, title: "Fast response", text: "Two minutes to request. A local installer usually replies within 1 business day (TBC)." },
];

const steps = [
  { n: "01", title: "Tell us about your home", text: "Postcode, current system and household size. It takes about two minutes." },
  { n: "02", title: "Get matched locally", text: "We pass your request to a licensed partner installer who services your area." },
  { n: "03", title: "Confirm your fixed price", text: "They check your site, confirm rebates and lock in your supply-and-install price." },
  { n: "04", title: "Installed, old unit removed", text: "Most standard swaps are done in a day, and your old system is taken away." },
];

export default function Home() {
  const featured = models.filter((m) => ["everyday-220", "family-270", "split-250"].includes(m.slug));
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-ember-500/25 blur-3xl" />
          <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-gum-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:22px_22px]" />
        </div>
        <div className="container-x relative grid items-center gap-12 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:pb-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-ink-200">
              <span className="h-1.5 w-1.5 rounded-full bg-gum-500" /> Matching homes in QLD, NSW &amp; VIC
            </p>
            <h1 className="h-display mt-6 text-[2.5rem] leading-[1.05] sm:text-6xl">
              Hot water that costs <span className="italic text-ember-400">less</span> to run. Installed for a fixed price.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-200">
              Set supply-and-install prices, rebates handled for you, and a licensed local installer. Your free quote takes
              about 2 minutes.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/quote" className="btn-primary px-8 py-4 text-base sm:text-lg">
                Get my free quote <Arrow className="h-5 w-5" />
              </Link>
              <a href={site.phoneHref} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-ink-200 hover:text-white sm:justify-start">
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
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <HeatPumpArt className="relative z-10 mx-auto w-52 drop-shadow-2xl sm:w-72" />
            <div className="absolute -left-4 top-16 z-20 rounded-2xl bg-white p-4 text-ink-900 shadow-lift sm:-left-10">
              <p className="text-xs text-ink-500">Installed from</p>
              <p className="flex items-center gap-2 font-display text-2xl font-semibold">
                {formatAUD(Math.min(...models.map((m) => m.priceFrom)))} <TbcBadge />
              </p>
            </div>
            <div className="absolute -right-2 bottom-20 z-20 flex items-center gap-3 rounded-2xl bg-white p-4 text-ink-900 shadow-lift sm:-right-8">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gum-50 text-gum-600">
                <Bolt className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Up to ~70% less energy</p>
                <p className="text-xs text-ink-500">vs electric storage (TBC)</p>
              </div>
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

      {/* How it works */}
      <section className="container-x py-20 sm:py-28">
        <SectionHeading
          eyebrow="How it works"
          title="From old tank to heat pump, without the run-around"
          lead="One short form instead of ringing around for quotes. Your installer confirms everything before any work begins."
        />
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="relative rounded-3xl bg-cream-100 p-6">
              <span className="font-display text-4xl font-medium text-ember-600">{s.n}</span>
              <h3 className="mt-4 font-semibold text-ink-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Models */}
      <section className="bg-cream-100 py-20 sm:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Models & prices"
              title="Set supply-and-install prices"
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
        lead="Tell us about your home in two minutes, or leave your number and a licensed partner installer will call you back."
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
            <Link href="/about" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ember-600 hover:text-ember-700">
              How our referrals work <Arrow className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <FaqSection items={homeFaqs} className="pb-6 sm:pb-10" />
      <p className="container-x text-xs text-ink-500">
        *Where eligible. Rebates and STC values vary by program, product, location and date.
      </p>

      <CtaBand />
    </>
  );
}
