import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqSection } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { LeadCaptureBlock } from "@/components/LeadCaptureBlock";
import { PostcodeJump } from "@/components/PostcodeJump";
import { ProgramCard, StateNoteCard } from "@/components/RebateCards";
import { Arrow, Phone } from "@/components/icons";
import { citiesForState, cityDetails, cityPath } from "@/lib/cities";
import { formatAUD } from "@/lib/models";
import { federalSTC, formatCheckedDate, LAST_CHECKED, programsFor, rebateStates, stateNames, stateNotes, stateRebatePath } from "@/lib/rebates";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { STC_PRICE_CAP } from "@/lib/stc";

type State = (typeof rebateStates)[number];
const fromSlug = (slug: string) => rebateStates.find((s) => s.toLowerCase() === slug);
const plainName = (s: State) => stateNames[s].replace(/^the /, "");
const titleName = (s: State) => plainName(s).replace(/^./, (c) => c.toUpperCase());

export function generateStaticParams() {
  return rebateStates.map((s) => ({ state: s.toLowerCase() }));
}

export const dynamicParams = false;

function summary(s: State) {
  const confirmed = programsFor(s).filter((p) => p.amountConfirmed);
  if (confirmed.length) return `${confirmed.map((p) => `${p.name}: ${p.amount}`).join(". ")}. Plus federal STCs.`;
  const unconfirmed = programsFor(s);
  if (unconfirmed.length) return `${unconfirmed.map((p) => p.name).join(" and ")} may apply (amount not confirmed on the official page). Federal STCs apply.`;
  // Keep the hero short (the full finding, with its source, is in the section below).
  return /^No current/.test(stateNotes[s]?.text ?? "No current")
    ? "No current state rebate for heat pump hot water found on the official pages. Federal STCs still apply."
    : "We couldn't confirm a current state program on the official pages. Federal STCs still apply.";
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const s = fromSlug((await params).state);
  if (!s) return {};
  return pageMeta({
    title: `Heat pump hot water rebates in ${titleName(s)} (2026)`,
    description: `${summary(s)} Official figures and links, checked ${formatCheckedDate(LAST_CHECKED)}. Check your postcode and get a free quote with rebates applied.`.slice(0, 300),
    path: stateRebatePath(s),
  });
}

function stateFaqs(s: State) {
  const programs = programsFor(s);
  const note = stateNotes[s];
  const cities = citiesForState(s).map((c) => ({ c, d: cityDetails(c) }));
  const lo = Math.min(...cities.map((x) => x.d.stcLo));
  const hi = Math.max(...cities.map((x) => x.d.stcHi));
  const name = plainName(s);
  return [
    {
      q: `Is there a heat pump hot water rebate in ${name}?`,
      a: programs.length
        ? `${programs.map((p) => `${p.name}: ${p.amountConfirmed ? p.amount : "amount not confirmed on the official page"}`).join(". ")}. Federal STCs apply on top. We last checked the official pages on ${formatCheckedDate(LAST_CHECKED)}.`
        : `${note?.text ?? "We couldn't find a current state program."} Federal STCs still apply. We last checked on ${formatCheckedDate(LAST_CHECKED)}.`,
    },
    {
      q: `How many STCs does a heat pump get in ${name}?`,
      a: `It depends on your postcode's heat pump zone and the model. ${cities.map((x) => `${x.c.name} (${x.c.postcode}) is in zone ${x.d.zone}`).join("; ")}. For a ${new Date().getFullYear()} install of our six models, that's about ${lo}–${hi} STCs, worth up to ${formatAUD(lo * STC_PRICE_CAP)}–${formatAUD(hi * STC_PRICE_CAP)} at the $${STC_PRICE_CAP} Clearing House cap.`,
    },
    {
      q: "How do I claim the rebates?",
      a: `Usually you don't claim them yourself. ${federalSTC.howPaid}${programs.length ? ` ${programs.map((p) => `${p.name}: ${p.howPaid}`).join(" ")}` : ""} Your installer confirms what you're eligible for before you commit.`,
    },
    {
      q: `Can I get a quote with the rebates already applied?`,
      a: `Yes. Request a free quote and a licensed partner installer who covers your postcode will confirm your eligibility and take the rebates off your fixed price. Partner coverage in ${name} is being confirmed (TBC).`,
    },
  ];
}

export default async function StateRebatePage({ params }: { params: Promise<{ state: string }> }) {
  const s = fromSlug((await params).state);
  if (!s) notFound();
  const programs = programsFor(s);
  const note = stateNotes[s];
  const cities = citiesForState(s).map((c) => ({ c, d: cityDetails(c) }));
  const others = rebateStates.filter((x) => x !== s);
  const name = titleName(s);

  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Rebates", path: "/rebates" }, { name: name, path: stateRebatePath(s) }])} />
      <section className="relative overflow-hidden border-b border-ink-200/60 bg-cream-100">
        <div aria-hidden className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-ember-300/30 blur-3xl" />
        <div className="container-x relative grid items-start gap-6 py-8 sm:gap-8 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <nav className="text-sm text-ink-500" aria-label="Breadcrumb">
              <Link href="/rebates" className="tap hover:text-ink-900">Rebates</Link> <span className="mx-1">/</span> <span className="text-ink-700">{name}</span>
            </nav>
            <p className="eyebrow mt-4">Rebates · {s} · Checked {formatCheckedDate(LAST_CHECKED)}</p>
            <h1 className="h-display mt-3 text-4xl text-ink-900 sm:text-5xl">Heat pump hot water rebates in {name} (2026)</h1>
            <p className="mt-3 max-w-xl text-base text-ink-600 sm:mt-4 sm:text-lg">{summary(s)}</p>
            <div className="mt-6 grid gap-2.5 sm:flex sm:flex-wrap" data-track-location={`rebates-${s.toLowerCase()}-hero`}>
              <Link href="/quote" className="btn-primary py-3.5">Get a quote with rebates applied <Arrow className="h-4 w-4" /></Link>
              <Link href="/quote#callback" className="btn-ghost py-3.5">Request a callback</Link>
            </div>
            <a href={site.phoneHref} className="tap mt-1 gap-2 text-sm font-semibold text-ink-700 hover:text-ink-900">
              <Phone className="h-4 w-4 text-ember-600" /> or call {site.phone}
            </a>
          </div>
          <div className="w-full lg:pt-6">
            <PostcodeJump label={`Check your ${s} postcode: STC zone and rebates`} from={`rebates-${s.toLowerCase()}`} />
            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              Figures come only from official government pages. Anything we couldn&apos;t confirm is marked &ldquo;Not confirmed&rdquo;. Your installer
              confirms what you&apos;re eligible for.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x max-w-4xl space-y-5 py-12 sm:py-14" aria-labelledby="state-programs">
        <h2 id="state-programs" className="h-display text-3xl text-ink-900">{programs.length ? `${name} programs` : `${name}: what we found`}</h2>
        {programs.map((p) => (
          <ProgramCard key={p.id} program={p} />
        ))}
        {note && <StateNoteCard state={s} note={note} />}
        <h2 className="h-display pt-6 text-3xl text-ink-900">Federal STCs in {name}</h2>
        <ProgramCard program={federalSTC} />
        <div className="overflow-x-auto rounded-3xl border border-ink-200/70 bg-white">
          <table className="w-full min-w-[30rem] text-left text-sm">
            <caption className="sr-only">STC estimates for {name} locations</caption>
            <thead className="bg-cream-100 text-xs text-ink-600">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Location (postcode)</th>
                <th scope="col" className="px-4 py-3 font-semibold">Heat pump zone</th>
                <th scope="col" className="px-4 py-3 font-semibold">STCs, our range ({new Date().getFullYear()})</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Local guide</span></th>
              </tr>
            </thead>
            <tbody>
              {cities.map(({ c, d }) => (
                <tr key={c.slug} className="border-t border-ink-200/60">
                  <th scope="row" className="px-4 py-3 font-medium text-ink-900">{c.name} ({c.postcode})</th>
                  <td className="px-4 py-3 text-ink-800">Zone {d.zone}</td>
                  <td className="px-4 py-3 text-ink-800">{d.stcLo}–{d.stcHi}, up to {formatAUD(d.stcLo * STC_PRICE_CAP)}–{formatAUD(d.stcHi * STC_PRICE_CAP)}</td>
                  <td className="px-4 py-3">
                    <Link href={cityPath(c)} className="font-semibold whitespace-nowrap text-ember-600 underline">{c.name} guide</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-ink-500">
          Zones from the CER postcode table; values at the ${STC_PRICE_CAP} Clearing House cap (excl. GST), so treat them as a maximum. Your
          own postcode may be in a different zone: <Link href="/rebates" className="underline">check it</Link>.
        </p>
      </section>

      <LeadCaptureBlock
        title={`Get your ${name} quote with rebates applied`}
        lead="A few quick questions, or leave your number for a callback. A licensed partner installer confirms your eligibility and takes the rebates off your fixed price."
      />

      <FaqSection items={stateFaqs(s)} title={`${name} rebates: common questions`} className="pt-4 sm:pt-6" />

      <section className="bg-cream-100 py-12">
        <div className="container-x">
          <h2 className="font-display text-xl font-semibold text-ink-900">Rebates in other states and territories</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {others.map((o) => (
              <li key={o}>
                <Link href={stateRebatePath(o)} className="tap rounded-full border border-ink-200 bg-white px-4 text-sm font-semibold text-ink-800 hover:border-ink-500">
                  {titleName(o)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
