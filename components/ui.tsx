import Link from "next/link";
import { Arrow, Info } from "./icons";

export function TbcBadge({ label = "TBC", className = "" }: { label?: string; className?: string }) {
  return (
    <span
      title="Placeholder value, to be confirmed"
      className={`inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-800 uppercase ${className}`}
    >
      {label}
    </span>
  );
}

export function PlaceholderNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900">
      <Info className="mt-0.5 h-5 w-5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  center = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="h-display mt-3 text-3xl text-ink-900 sm:text-4xl">{title}</h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-ink-600">{lead}</p>}
    </div>
  );
}

export function CtaBand({
  title = "Get your fixed-price quote in under 2 minutes",
  lead = "Tell us a little about your home and we'll match you with a licensed partner installer in your area. No obligation.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="container-x py-16 sm:py-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink-900 px-6 py-14 text-center sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-ember-500/30 blur-3xl"
        />
        <h2 className="h-display relative mx-auto max-w-2xl text-3xl text-white sm:text-4xl">{title}</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-ink-200">{lead}</p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/quote" className="btn-primary px-8 py-4 text-base">
            Start my quote <Arrow className="h-4 w-4" />
          </Link>
          <Link href="/rebates" className="btn text-white hover:text-ember-300">
            Check my rebates first
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink-200/60 bg-cream-100">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-ember-300/30 blur-3xl"
      />
      <div className="container-x relative py-14 sm:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h-display mt-3 max-w-3xl text-4xl text-ink-900 sm:text-5xl">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-600">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
