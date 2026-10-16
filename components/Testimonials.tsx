import { testimonials } from "@/lib/testimonials";
import { SectionCta } from "./SectionCta";

/** Testimonial cards. While entries are samples, each card is visibly labelled as one. */
export function Testimonials({ limit = 3, className = "", cta = false }: { limit?: number; className?: string; cta?: boolean }) {
  const items = testimonials.slice(0, limit);
  const anySample = items.some((t) => t.sample);
  return (
    <section className={`container-x py-14 sm:py-20 ${className}`} aria-labelledby="testimonials-heading">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">What homeowners say</p>
          <h2 id="testimonials-heading" className="h-display mt-3 text-3xl text-ink-900 sm:text-4xl">Simple quotes, no surprises</h2>
        </div>
        {anySample && (
          <p className="max-w-sm text-xs text-ink-500">
            Sample reviews shown for layout only. They&apos;ll be replaced with real customer reviews before launch.
          </p>
        )}
      </div>
      <ul className={`mt-8 grid gap-5 ${items.length > 1 ? "md:grid-cols-3" : ""}`}>
        {items.map((t) => (
          <li key={t.name} className="card flex flex-col p-6">
            {t.sample && (
              <span className="mb-4 self-start rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-bold tracking-wide text-amber-800 uppercase">
                Sample review
              </span>
            )}
            <blockquote className="flex-1 leading-relaxed text-ink-700">
              <span aria-hidden className="mr-1 font-display text-3xl leading-none text-ember-600">&ldquo;</span>
              {t.quote}
            </blockquote>
            <p className="mt-5 text-sm">
              <span className="font-semibold text-ink-900">{t.name}</span>
              <span className="text-ink-500"> · {t.suburb} · {t.system}</span>
            </p>
          </li>
        ))}
      </ul>
      {cta && <SectionCta align="center" className="mt-10" />}
    </section>
  );
}
