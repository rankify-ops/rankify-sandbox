import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx";
import { CtaBand } from "@/components/ui";
import { formatDate, getAllPosts, getPost } from "@/lib/blog";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: { type: "article", publishedTime: post.meta.date },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const { meta, content } = post;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <header className="border-b border-ink-200/60 bg-cream-100">
          <div className="container-x max-w-3xl py-14 sm:py-20">
            <Link href="/blog" className="text-sm font-semibold text-ember-600 hover:text-ember-700">← All guides</Link>
            <h1 className="h-display mt-5 text-4xl text-ink-900 sm:text-5xl">{meta.title}</h1>
            <p className="mt-4 text-lg text-ink-600">{meta.description}</p>
            <p className="mt-6 text-sm text-ink-400">
              {formatDate(meta.date)} · {meta.readingMinutes} min read
            </p>
          </div>
        </header>
        <div className="container-x max-w-3xl py-14">
          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-medium prose-headings:text-ink-900 prose-p:text-ink-700 prose-a:text-ember-600 prose-strong:text-ink-900 prose-li:text-ink-700">
            <MDXRemote source={content} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
          </div>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
