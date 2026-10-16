import Link from "next/link";
import { site } from "@/lib/site";
import { Arrow, Phone } from "./icons";

export type FaqItem = { q: string; a: string };

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-ink-200/70 rounded-3xl border border-ink-200/70 bg-white">
      {items.map((item) => (
        <details key={item.q} className="group px-5 py-4 sm:px-6 sm:py-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-lg font-semibold text-ink-900">
            <h3 className="text-base">{item.q}</h3>
            <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cream-100 text-ink-600 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 leading-relaxed text-ink-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** FAQ block with FAQPage schema and a quote nudge beside it. */
export function FaqSection({
  items,
  title = "Questions we hear every day",
  quoteHref = "/quote",
  className = "",
}: {
  items: FaqItem[];
  title?: string;
  quoteHref?: string;
  className?: string;
}) {
  return (
    <section className={`container-x py-16 sm:py-24 ${className}`} aria-labelledby="faq-heading">
      <FaqJsonLd items={items} />
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-heading" className="h-display mt-3 text-3xl text-ink-900 sm:text-4xl">{title}</h2>
          <p className="mt-4 text-ink-600">Still unsure? Get a free quote and ask your installer directly, or give us a call.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link href={quoteHref} className="btn-primary">
              Get a free quote <Arrow className="h-4 w-4" />
            </Link>
            <a href={site.phoneHref} className="btn-ghost">
              <Phone className="h-4 w-4" /> {site.phone}
            </a>
          </div>
        </div>
        <Faq items={items} />
      </div>
    </section>
  );
}
