import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { site } from "@/lib/site";
import { Info } from "./icons";
import { QuoteForm } from "./QuoteForm";

function Callout({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="not-prose my-8 flex gap-3 rounded-2xl border border-ember-500/25 bg-ember-500/5 p-5 text-ink-700">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-ember-600" />
      <div>
        {title && <p className="font-semibold text-ink-900">{title}</p>}
        <div className="mt-1 text-[15px] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/** Mid-post lead capture: the 60-second quote form, inline in the article. */
function QuoteCta({ title = "Get your free quote in 60 seconds" }: { title?: string }) {
  return (
    <aside className="not-prose my-10 rounded-[1.75rem] bg-ink-900 p-4 text-white sm:p-6" aria-label="Free quote">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2 px-1">
        <p className="font-display text-xl sm:text-2xl">{title}</p>
        <span className="flex flex-wrap gap-x-4">
          <Link href="/quote#callback" className="tap text-sm font-semibold text-white underline hover:text-ember-300">
            Request a callback
          </Link>
          <a href={site.phoneHref} className="tap text-sm font-semibold text-ink-200 hover:text-white">
            or call {site.phone}
          </a>
        </span>
      </div>
      <div className="text-ink-900">
        <QuoteForm variant="compact" tone="dark" heading="Free quote in 60 seconds" />
      </div>
    </aside>
  );
}

export const mdxComponents: MDXComponents = {
  Callout,
  QuoteCta,
  // eslint-disable-next-line @next/next/no-img-element -- MDX images are author-supplied; alt is enforced in lib/blog.ts
  img: ({ alt = "", ...props }) => <img alt={alt} loading="lazy" decoding="async" className="rounded-2xl" {...props} />,
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? (
      <Link href={href} {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    ),
};
