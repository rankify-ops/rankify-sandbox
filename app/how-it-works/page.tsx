import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection, type FaqItem } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { LeadCaptureBlock } from "@/components/LeadCaptureBlock";
import { TrustBadges } from "@/components/TrustBadges";
import { PageHero } from "@/components/ui";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { howItWorksPath, referralDisclosure, site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "How it works: a free referral service",
  description:
    "Aussie Heat Pumps is a free referral service. Your enquiry goes to one licensed partner installer at a time, and we may receive a referral fee. Here's exactly how it works.",
  path: howItWorksPath,
});

const steps = [
  {
    title: "You request a free quote",
    text: "Answer four quick questions in our 60-second form, or ask for a callback. It's free and there's no obligation.",
  },
  {
    title: "We send it to one licensed partner installer",
    text: "Your enquiry goes to one licensed partner installer who services your postcode. Only one installer has it at a time.",
  },
  {
    title: "If they can't take it, we offer it to the next one",
    text: "If that installer passes (they're booked out, or your job isn't a fit), we offer your enquiry to the next partner installer, again one at a time.",
  },
  {
    title: "The installer quotes, and you decide",
    text: "They confirm your site, fixed price and the rebates you may be eligible for. You're under no obligation to go ahead.",
  },
];

const faqs: FaqItem[] = [
  {
    q: "Is it really free?",
    a: "Yes. There's no charge to you for using Aussie Heat Pumps. Partner installers may pay us a referral fee for enquiries, and that fee never changes the price you're quoted.",
  },
  {
    q: "Will lots of installers call me?",
    a: "No. Your enquiry goes to one licensed partner installer at a time. It only goes to another installer if the first can't take the job.",
  },
  {
    q: "Who do I sign a contract with?",
    a: "Your contract for supply and installation is with the partner installer, who is responsible for the work, compliance certificates and their installation warranty. Manufacturer warranties come from the manufacturer.",
  },
  {
    q: "Can I stop my details being passed on?",
    a: `Yes. Email ${site.email} at any time and we'll stop offering your enquiry to installers, and correct or delete your details on request.`,
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "How it works", path: howItWorksPath }])} />
      <PageHero
        eyebrow="How it works"
        title="A free referral service, one installer at a time"
        lead="We don't install hot water systems. We connect you with a licensed partner installer in your area, and you only ever deal with one at a time."
      />

      <section className="container-x py-14 sm:py-20" aria-labelledby="steps">
        <h2 id="steps" className="h-display text-3xl text-ink-900 sm:text-4xl">What happens to your enquiry</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s.title} className="card flex gap-4 p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink-900 font-display text-xl font-semibold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-ink-900">{s.title}</h3>
                <p className="mt-1.5 leading-relaxed text-ink-600">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Link href="/quote" className="btn-primary px-7 py-3.5 text-base">Get my free 60-second quote</Link>
          <Link href="/quote#callback" className="btn-ghost px-7 py-3.5 text-base">Request a callback</Link>
        </div>
      </section>

      <section className="container-x pb-14" aria-labelledby="paid">
        <div className="grid gap-8 rounded-[2rem] border border-ink-200/70 bg-white p-6 sm:p-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 id="paid" className="h-display text-2xl text-ink-900 sm:text-3xl">How we&apos;re paid</h2>
            <p className="mt-3 leading-relaxed text-ink-700">{referralDisclosure}</p>
            <p className="mt-3 text-sm text-ink-600">
              More about us and our disclosure on the <Link href="/about" className="font-semibold text-ember-600 underline">About page</Link>, and how we
              handle your details in our <Link href="/privacy" className="font-semibold text-ember-600 underline">Privacy Policy</Link>.
            </p>
          </div>
          <div>
            <h2 className="h-display text-2xl text-ink-900 sm:text-3xl">Who we work with</h2>
            <p className="mt-3 text-sm text-ink-600">Partner details below are placeholders until confirmed.</p>
            <TrustBadges className="mt-4 sm:grid-cols-1" />
          </div>
        </div>
      </section>

      <LeadCaptureBlock title="Ready? Get your free quote in 60 seconds" />
      <FaqSection items={faqs} title="Referral questions" className="pt-2 sm:pt-4" />
    </>
  );
}
