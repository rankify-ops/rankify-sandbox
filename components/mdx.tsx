import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { Arrow, Info } from "./icons";

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

function QuoteCta({ title = "Ready to compare fixed prices?" }: { title?: string }) {
  return (
    <div className="not-prose my-10 flex flex-col items-start gap-4 rounded-3xl bg-ink-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
      <p className="font-display text-xl">{title}</p>
      <Link href="/quote" className="btn-primary shrink-0">
        Get my quote <Arrow className="h-4 w-4" />
      </Link>
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  Callout,
  QuoteCta,
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? (
      <Link href={href} {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    ),
};
