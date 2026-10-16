import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, Check, Phone } from "@/components/icons";
import { bestTimes } from "@/lib/lead";
import { rebateStates } from "@/lib/rebates";
import { responseTime, site } from "@/lib/site";
import { ThanksGreeting } from "./ThanksGreeting";

export const metadata: Metadata = { title: "Thanks, we've got your request" };

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; state?: string; time?: string }>;
}) {
  const { type, state, time } = await searchParams;
  const callback = type === "callback";
  const timeLabel = bestTimes.find((t) => t.value === time)?.label;
  const rebateState = rebateStates.find((s) => s === state);

  const steps = callback
    ? [
        { title: "We pass your request on", text: "Your details go to one licensed partner installer who services your postcode." },
        {
          title: "They give you a call",
          text: timeLabel && time !== "asap" ? `They'll aim to ring you in the ${timeLabel.toLowerCase()}.` : `${responseTime}.`,
        },
        { title: "Get your fixed price", text: "They'll ask a few questions about your home and confirm your price and rebates." },
      ]
    : [
        { title: "We match you with a local installer", text: "Your request goes to one licensed partner installer who services your postcode." },
        { title: "They confirm your site details", text: `${responseTime}. They may ask for a couple of photos.` },
        { title: "You get a fixed price, rebates applied", text: "Then you decide. There's no obligation to go ahead." },
      ];

  return (
    <section className="relative overflow-hidden bg-cream-100">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-gum-500/15 blur-3xl" />
      <div className="container-x relative max-w-3xl py-14 sm:py-20">
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
              : "We've received your details. Here's what happens next."}
          </p>
        </div>

        <ol className="card mt-10 divide-y divide-ink-200/60">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 p-6">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ember-500 font-semibold text-white">{i + 1}</span>
              <div>
                <h2 className="font-semibold text-ink-900">{s.title}</h2>
                <p className="mt-1 text-ink-600">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="card p-6">
            <h2 className="font-semibold text-ink-900">Speed things up</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Have a photo of your current system&apos;s compliance plate and of where it sits ready for when your installer calls.
            </p>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold text-ink-900">Need to talk sooner?</h2>
            <a href={site.phoneHref} className="mt-2 flex items-center gap-2 text-lg font-semibold text-ember-600">
              <Phone className="h-5 w-5" /> {site.phone}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={rebateState ? `/rebates?state=${rebateState}` : "/rebates"} className="btn-dark">
            Review the rebates you may get <Arrow className="h-4 w-4" />
          </Link>
          <Link href="/blog" className="btn-ghost">Read our buying guides</Link>
        </div>
      </div>
    </section>
  );
}
