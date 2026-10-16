import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="h-display mt-3 text-4xl text-ink-900">We couldn&apos;t find that page</h1>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn-dark">Home</Link>
        <Link href="/quote" className="btn-primary">Get a quote</Link>
      </div>
    </section>
  );
}
