import type { Metadata } from "next";
import { ProgramCard, RebateChecker } from "@/components/RebateChecker";
import { CtaBand, PageHero, PlaceholderNotice } from "@/components/ui";
import { federalSTC } from "@/lib/rebates";

export const metadata: Metadata = {
  title: "Heat pump rebate checker: QLD, NSW, VIC & federal STCs",
  description: "See which heat pump hot water rebates may apply in your state, with links to every official government page.",
};

export default async function RebatesPage({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Rebate checker"
        title="Find the heat pump rebates you may be eligible for"
        lead="Pick your state to see federal and state programs. Rebates change often, so every program links to its official government page where you can confirm current amounts and eligibility."
      >
        <div className="mt-8 max-w-2xl">
          <PlaceholderNotice>
            <strong>Amounts are placeholders (TBC).</strong> This tool is general information, not financial advice or a
            guarantee of eligibility. Always confirm on the official page.
          </PlaceholderNotice>
        </div>
      </PageHero>

      <section className="container-x max-w-4xl py-14">
        <RebateChecker key={state ?? "none"} initialState={state} />

        <div id="stc" className="mt-16 scroll-mt-24">
          <h2 className="h-display text-2xl text-ink-900">Federal: available Australia-wide</h2>
          <p className="mt-2 text-ink-600">
            STCs apply in every state and territory, including ACT, SA, WA, TAS and NT.
          </p>
          <div className="mt-6">
            <ProgramCard program={federalSTC} />
          </div>
        </div>
      </section>

      <CtaBand title="Let your installer handle the paperwork" lead="Partner installers typically apply eligible STCs as an upfront discount and can talk you through state programs." />
    </>
  );
}
