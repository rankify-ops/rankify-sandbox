import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/Faq";
import { RebateChecker } from "@/components/RebateChecker";
import { PageHero, PlaceholderNotice } from "@/components/ui";
import { rebateFaqs } from "@/lib/faqs";
import { stateForPostcode } from "@/lib/lead";
import { formatCheckedDate, LAST_CHECKED, rebateStates, stateNames, stateRebatePath } from "@/lib/rebates";
import { pageMeta } from "@/lib/seo";

type Params = Promise<{ state?: string; postcode?: string }>;

function stateFrom({ state, postcode }: { state?: string; postcode?: string }) {
  const s = stateForPostcode(postcode ?? "") ?? state ?? "";
  return s in stateNames ? (s as keyof typeof stateNames) : undefined;
}

export async function generateMetadata({ searchParams }: { searchParams: Params }): Promise<Metadata> {
  const s = stateFrom(await searchParams);
  const name = s ? stateNames[s] : undefined;
  // Every postcode/state view shares one canonical URL: it's the same checker, pre-filled.
  return pageMeta({
    title: name ? `Heat pump rebates in ${name.replace(/^the /, "")} + federal STCs` : "Heat pump rebate checker by postcode (2026)",
    description: name
      ? `See the heat pump hot water rebates that may apply in ${name}, plus federal STCs, from official government pages.`
      : "Enter your postcode to see federal STCs and any state heat pump hot water rebate, with official figures, dates and links. Then get a free quote.",
    path: "/rebates",
  });
}

export default async function RebatesPage({ searchParams }: { searchParams: Params }) {
  const params = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Rebate checker"
        title="Check your heat pump rebates by postcode"
        lead="Enter your postcode to see the federal STC discount and any state program that applies, straight from the official government pages. Then get a free quote with them applied."
      >
        <div className="mt-8 max-w-2xl">
          <PlaceholderNotice>
            <strong>General information only.</strong> Figures are taken from official pages (last checked{" "}
            {formatCheckedDate(LAST_CHECKED)}) and can change. Anything we couldn&apos;t confirm is marked &ldquo;Not
            confirmed&rdquo;. Your installer confirms what you&apos;re eligible for. See our{" "}
            <Link href="/blog/heat-pump-hot-water-rebates-by-state" className="font-semibold underline">rebates by state guide</Link>.
          </PlaceholderNotice>
        </div>
      </PageHero>

      <nav className="container-x max-w-4xl pt-10" aria-label="Rebates by state">
        <h2 className="text-sm font-semibold text-ink-900">Rebates by state and territory</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {rebateStates.map((st) => (
            <li key={st}>
              <Link href={stateRebatePath(st)} className="tap rounded-full border border-ink-200 bg-white px-4 text-sm font-semibold text-ink-800 hover:border-ink-500">
                {stateNames[st].replace(/^the /, "").replace(/^./, (c) => c.toUpperCase())}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="container-x max-w-4xl py-10 sm:py-12">
        <RebateChecker key={`${params.postcode ?? ""}-${params.state ?? ""}`} initialPostcode={params.postcode} initialState={stateFrom(params)} />
      </section>

      <FaqSection items={rebateFaqs} title="Rebate questions, answered" className="pt-4 sm:pt-6" />
    </>
  );
}
