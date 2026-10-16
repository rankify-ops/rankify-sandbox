import { getAllPosts, getPost } from "@/lib/blog";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Heat pump hot water guide";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  return ogImage({
    eyebrow: "Guide",
    title: post?.meta.title ?? "Heat pump hot water guides",
    subtitle: post ? `${post.meta.readingMinutes} min read · Official figures, linked sources` : undefined,
  });
}
