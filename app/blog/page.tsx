import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { LeadCaptureBlock } from "@/components/LeadCaptureBlock";
import { PageHero } from "@/components/ui";
import { Arrow } from "@/components/icons";
import { formatDate, getAllPosts } from "@/lib/blog";

export const metadata: Metadata = pageMeta({
  title: "Heat pump hot water guides for Australian homes",
  description: "Plain-English guides to heat pump hot water in Australia: running costs, sizing, rebates and what to expect on install day.",
  path: "/blog",
});

export default function BlogIndex() {
  const posts = getAllPosts();
  const [first, ...rest] = posts;
  return (
    <>
      <PageHero
        eyebrow="Guides"
        title="Heat pump hot water, explained"
        lead="Plain-English guides to costs, sizing, rebates and what to expect on install day."
      />
      <section className="container-x py-16">
        {first && (
          <Link href={`/blog/${first.slug}`} className="card group grid gap-6 p-8 transition-all hover:shadow-lift md:grid-cols-[1fr_auto] md:items-end sm:p-10">
            <div>
              <p className="eyebrow">Latest · {formatDate(first.date)}</p>
              <h2 className="h-display mt-3 text-3xl text-ink-900 group-hover:text-ember-700 sm:text-4xl">{first.title}</h2>
              <p className="mt-3 max-w-2xl text-lg text-ink-600">{first.description}</p>
            </div>
            <span className="btn-dark">Read guide <Arrow className="h-4 w-4" /></span>
          </Link>
        )}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card group flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <p className="text-xs text-ink-500">{formatDate(p.date)} · {p.readingMinutes} min read</p>
              <h2 className="mt-3 font-display text-xl font-medium text-ink-900 group-hover:text-ember-700">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{p.description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ember-600">
                Read <Arrow className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <LeadCaptureBlock
        title="Skip the research. Get a free quote."
        lead="A licensed partner installer will recommend the right system, confirm your fixed price and apply eligible rebates."
      />
    </>
  );
}
