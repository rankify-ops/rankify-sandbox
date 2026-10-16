import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { LeadCaptureBlock } from "@/components/LeadCaptureBlock";
import { PageHero } from "@/components/ui";
import { Shield, Tag, Users, Wrench } from "@/components/icons";
import { referralDisclosure, site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "About us: how our installer referrals work",
  description: "Aussie Heat Pumps is a referral service. See how we match you with licensed partner installers, how we are paid, and what happens to your details.",
  path: "/about",
});

const points = [
  {
    icon: Users,
    title: "We're a referral service, not an installer",
    text: "We don't employ plumbers or electricians and we don't perform installations. We help you compare systems and prices, then refer your job to an independent partner installer.",
  },
  {
    icon: Tag,
    title: "How we're paid",
    text: "Partner installers may pay us a fee for each referral or completed job. That fee is built into our partner arrangements and never added on top of the price you're quoted.",
  },
  {
    icon: Wrench,
    title: "Who's responsible for your install",
    text: "Your contract for supply and installation is with the partner installer. They're responsible for the workmanship, compliance certificates, and their installation warranty. Manufacturer warranties come from the manufacturer.",
  },
  {
    icon: Shield,
    title: "How we choose partners",
    text: "We work with installers who hold the plumbing and electrical licences required in their state and the insurance appropriate to the work. Our partner vetting criteria are being finalised (TBC).",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Making the switch to heat pump hot water simpler"
        lead={`${site.name} helps Australian households compare heat pump systems with clear, set pricing, and connects them with licensed local installers.`}
      />

      <section className="container-x py-16">
        <div className="card border-ember-500/30 bg-ember-500/[0.03] p-6 sm:p-8">
          <p className="eyebrow">Our disclosure</p>
          <p className="mt-3 text-lg leading-relaxed text-ink-800">{referralDisclosure}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {points.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6 sm:p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cream-100 text-ember-600">
                <Icon className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-xl font-medium text-ink-900">{title}</h2>
              <p className="mt-2 leading-relaxed text-ink-600">{text}</p>
            </div>
          ))}
        </div>

        <div className="prose mt-16 max-w-3xl text-ink-700">
          <h2 className="font-display font-medium">What happens to your details</h2>
          <p>
            When you submit a quote request and tick the consent box, we share the details you entered (postcode, state,
            current system, household size, preferred model, name, phone and email) with one partner installer who
            services your area so they can contact you about your quote. We don&apos;t sell your details to marketing lists.
            You can ask us to access, correct or delete your information at any time by emailing{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>. See our <a href="/privacy">Privacy Policy</a> for more.
          </p>
          <h2 className="font-display font-medium">Business details</h2>
          <p>
            {site.name} · {site.abn} · {site.email}
          </p>
        </div>
      </section>

      <LeadCaptureBlock
        title="Talk to a licensed installer about your home"
        lead="Get a free, no-obligation quote, or leave your number and a partner installer will call you back."
      />
    </>
  );
}
