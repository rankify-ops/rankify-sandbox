import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/Faq";
import { HeatPumpQuiz } from "@/components/HeatPumpQuiz";
import { JsonLd } from "@/components/JsonLd";
import { Check, Phone } from "@/components/icons";
import { QUIZ_PATH } from "@/lib/quiz";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { comparePagePath, site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Which heat pump suits my home? 60-second quiz",
  description:
    "Answer five quick questions (household, current system, postcode, where it goes, budget) and we'll match you with one or two of our six heat pumps, with the guide price after STCs. No contact details needed.",
  path: QUIZ_PATH,
});

const faqs = [
  {
    q: "How does the quiz pick a heat pump?",
    a: "It uses facts from each manufacturer's spec sheet: tank size for your household, the lowest rated operating temperature (weighted more in the cooler STC zones 4 and 5), the rated noise level if the unit will sit near bedrooms, and our guide prices for your budget choice.",
  },
  {
    q: "Do I have to give my details to see the result?",
    a: "No. You see your recommended models and the guide price after STCs straight away. If you'd like a fixed price, the quote form underneath is already filled in with your answers, so it only takes a few more taps.",
  },
  {
    q: "How accurate is the price after STCs?",
    a: "It's a guide: our guide price for supply and standard installation, minus the STCs for your postcode's heat pump zone valued at the $40 Clearing House cap. Installers usually use the lower open-market STC price, and your site may need extra work, so your installer confirms the fixed price.",
  },
];

export default function QuizPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Heat pump quiz", path: QUIZ_PATH }])} />
      <section className="relative overflow-hidden border-b border-ink-200/60 bg-cream-100">
        <div aria-hidden className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-ember-300/30 blur-3xl" />
        <div className="container-x relative grid items-start gap-6 py-7 sm:gap-8 sm:py-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <p className="eyebrow">60-second quiz</p>
            <h1 className="h-display mt-2 text-3xl text-ink-900 sm:mt-3 sm:text-5xl">Which heat pump suits my home?</h1>
            <p className="mt-3 text-base text-ink-600 sm:mt-4 sm:text-lg">
              Five quick questions, then one or two matched systems with the guide price after STCs. No contact details needed.
            </p>
            <ul className="mt-5 hidden space-y-2 text-sm text-ink-700 lg:block">
              {["Based on manufacturer spec sheets", "STCs for your postcode's zone", "Quote form filled in with your answers"].map((t) => (
                <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gum-500" /> {t}</li>
              ))}
            </ul>
            <p className="mt-5 hidden flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-ink-700 lg:flex" data-track-location="quiz-hero">
              <Link href="/quote#callback" className="tap underline hover:text-ink-900">Request a callback</Link>
              <a href={site.phoneHref} className="tap gap-1.5 hover:text-ink-900"><Phone className="h-4 w-4 text-ember-600" /> {site.phone}</a>
              <Link href={comparePagePath} className="tap underline hover:text-ink-900">Compare all six</Link>
            </p>
          </div>
          <HeatPumpQuiz />
        </div>
      </section>
      <FaqSection items={faqs} title="About the quiz" />
    </>
  );
}
