import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { Arrow, Check, Phone } from "@/components/icons";
import { bestTimes } from "@/lib/lead";
import { programsFor, rebateStates } from "@/lib/rebates";
import { responseTime, site } from "@/lib/site";
import { LeadConfirmed } from "./LeadConfirmed";
import { ThanksGreeting } from "./ThanksGreeting";

export const metadata: Metadata = pageMeta({
  title: "Thanks, we've got your request",
  description: "Your heat pump quote or callback request has been received. Here is what happens next.",
  path: "/thank-you",
});

/** What to have ready: speeds up the quote and the rebate paperwork. */
const READY = [
  {
    title: "Your existing hot water unit's label",
    text: "A clear photo of the compliance plate or sticker: brand, model, size and, if shown, the date. Some rebates depend on the old system's type and age (Solar Victoria, for example, needs it to be at least 3 years old).",
  },
  {
    title: "Your meter box and switchboard",
    text: "A photo with the door open, so the electrician can check the circuit and whether your hot water is on a separate off-peak (controlled load) tariff.",
  },
  {
    title: "A recent electricity bill",
    text: "It shows your tariffs and your meter number, which help with running-cost estimates and rebate forms. If you're replacing gas, have a gas bill too.",
  },
  {
    title: "Where the unit sits",
    text: "A photo of the spot and the path to it, so the installer can check clearances, access and pipework before the visit.",
  },
];

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; state?: string; time?: string; urgent?: string }>;
}) {
  const { type, state, time, urgent } = await searchParams;
  const callback = type === "callback";
  const isUrgent = urgent === "1";
  const timeLabel = bestTimes.find((t) => t.value === time)?.label;
  const rebateState = rebateStates.find((s) => s === state);
  const statePrograms = rebateState ? programsFor(rebateState) : [];

  const steps = callback
    ? [
        { title: "We pass your request on", text: "Your details go to one licensed partner installer who services your postcode. If they can't take it, we offer it to the next one, one at a time." },
        {
          title: "They give you a call",
          text: timeLabel && time !== "asap" ? `They'll aim to ring you in the ${timeLabel.toLowerCase()}.` : `${responseTime}.`,
        },
        { title: "Get your fixed price", text: "They'll ask a few questions about your home and confirm your price and rebates. There's no obligation." },
      ]
    : [
        {
          title: "We pass your request to a local installer",
          text: `It goes to one licensed partner installer who covers your postcode${isUrgent ? ", flagged as urgent" : ""}. If they can't take it, we offer it to the next one, one at a time.`,
        },
        { title: "They contact you", text: `${responseTime}. They'll confirm a few details about your home and usage.` },
        { title: "Site check", text: "In person or from your photos: where the unit goes, the power and water connections, and access." },
        { title: "Your fixed price, rebates applied", text: "STCs and any state rebate you're eligible for are taken off. Then you decide. There's no obligation to go ahead." },
        { title: "Install day", text: "A straightforward like-for-like swap is typically done in a single visit. Your installer confirms timing." },
      ];

  return (
    <section className="relative overflow-hidden bg-cream-100">
      <LeadConfirmed />
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-gum-500/15 blur-3xl" />
      <div className="container-x relative max-w-3xl py-12 sm:py-20">
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gum-500 text-white shadow-lift">
            <Check className="h-8 w-8" />
          </span>
          <h1 className="h-display mt-6 text-4xl text-ink-900 sm:text-5xl">
            <ThanksGreeting fallback={callback ? "We'll call you soon." : "Your quote request is in."} />
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-600">
            {callback
              ? "We've received your callback request. Here's what happens next."
              : "We've received your details. Here's what happens next, and what to have ready for your rebates."}
          </p>
        </div>

        {isUrgent && (
          <div className="mt-8 rounded-3xl border border-ember-500/30 bg-ember-500/5 p-5 sm:p-6">
            <h2 className="font-semibold text-ink-900">Flagged as urgent</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-700">
              Your request is marked as a broken system. How soon an installer can contact you depends on who covers your postcode
              and how busy they are, so we can&apos;t promise a time. If you need to talk it through now, give us a call.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl bg-ink-900 p-5 text-white sm:flex-row sm:p-6" data-track-location="thank-you">
          <div>
            <p className="font-semibold">Prefer to talk now?</p>
            <p className="text-sm text-ink-200">Questions about your quote, rebates or timing.</p>
          </div>
          <a href={site.phoneHref} className="btn-primary w-full whitespace-nowrap sm:w-auto">
            <Phone className="h-4 w-4" /> Call {site.phone}
          </a>
        </div>

        <h2 className="h-display mt-12 text-2xl text-ink-900 sm:text-3xl">What happens next</h2>
        <ol className="card mt-5 divide-y divide-ink-200/60">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 p-5 sm:p-6">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ember-600 font-semibold text-white">{i + 1}</span>
              <div>
                <h3 className="font-semibold text-ink-900">{s.title}</h3>
                <p className="mt-1 text-ink-600">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="h-display mt-12 text-2xl text-ink-900 sm:text-3xl">Have these ready for your rebate</h2>
        <p className="mt-2 text-ink-600">Photos on your phone are fine. They speed up the quote and the rebate paperwork.</p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {READY.map((r) => (
            <li key={r.title} className="card p-5">
              <h3 className="flex items-center gap-2 font-semibold text-ink-900">
                <Check className="h-4 w-4 shrink-0 text-gum-500" /> {r.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{r.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-ink-600">
          {statePrograms.length > 0
            ? `State programs can have their own eligibility checks (for example ${statePrograms.map((p) => p.name).join(" or ")}). Your installer or retailer will tell you exactly what they need.`
            : "Federal STCs are usually handled by your installer, who takes their value off your quote."}
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={rebateState ? `/rebates?state=${rebateState}` : "/rebates"} className="btn-dark">
            Review the rebates you may get <Arrow className="h-4 w-4" />
          </Link>
          <Link href="/blog/how-long-does-heat-pump-installation-take" className="btn-ghost">What happens on install day</Link>
        </div>
      </div>
    </section>
  );
}
