import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero, PlaceholderNotice } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description: "How Aussie Heat Pumps collects, uses and shares your details when you request a heat pump quote or callback.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="container-x max-w-3xl py-14">
        <PlaceholderNotice>
          <strong>Draft placeholder.</strong> Have this policy reviewed against the Australian Privacy Principles before
          launch.
        </PlaceholderNotice>
        <div className="prose mt-10 max-w-none text-ink-700">
          <h2>What we collect</h2>
          <p>
            When you request a quote we collect your postcode, state, current hot water system, household size,
            preferred model, name, phone number and email address. We also collect basic technical data such as your
            browser type.
          </p>
          <h2>Why we collect it</h2>
          <p>
            To refer your quote request to a licensed partner installer who services your area, and to contact you about
            that request.
          </p>
          <h2>Who we share it with</h2>
          <p>
            With your consent, we share your details with a partner installer. They may contact you by phone, SMS or
            email. We don&apos;t sell your personal information.
          </p>
          <h2>Your rights</h2>
          <p>
            You can request access to or correction of your personal information, or withdraw consent, by contacting{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>. You can read more about your rights under the{" "}
            <a href="https://www.oaic.gov.au/privacy/australian-privacy-principles" target="_blank" rel="noopener noreferrer">
              Australian Privacy Principles (OAIC)
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
