export const site = {
  name: "Aussie Heat Pumps",
  tagline: "Heat pump hot water, fixed-price and fitted by licensed local installers.",
  description:
    "Compare heat pump hot water systems with clear supply-and-install guide prices, check the rebates you may be eligible for, and get matched with a licensed partner installer in your area.",
  // Placeholder contact details — replace before launch.
  phone: "1300 000 000",
  phoneHref: "tel:1300000000",
  email: "hello@example.com.au",
  abn: "ABN TBC",
  // Business address: TBC. Leave fields empty until confirmed; empty fields are left
  // out of the structured data rather than published as made-up values.
  address: { street: "", locality: "", region: "", postcode: "", country: "AU" },
  areaServed: ["Queensland", "New South Wales", "Victoria", "Australian Capital Territory", "South Australia", "Western Australia", "Tasmania"],
};

export const comparePath = "/best-heat-pump-hot-water-systems";

/** Side-by-side comparison tool (the buying guide lives at comparePath). */
export const comparePagePath = "/compare";

export const howItWorksPath = "/how-it-works";

/** Urgent landing page for a broken hot water system. */
export const brokenPath = "/hot-water-broken";

export const nav = [
  { href: "/models", label: "Models" },
  { href: comparePagePath, label: "Compare" },
  { href: "/rebates", label: "Rebates" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/blog", label: "Guides" },
];

export const referralDisclosure =
  "Aussie Heat Pumps is a free referral service. We don't install systems ourselves. Your enquiry goes to one licensed partner installer who services your area. If they can't take the job, we offer it to the next one, one installer at a time. Partner installers may pay us a referral fee, which never changes the price you're quoted.";

export const states = ["QLD", "NSW", "VIC", "ACT", "SA", "WA", "TAS", "NT"] as const;
export type AusState = (typeof states)[number];

// Placeholder service promise — confirm with partner installers before launch.
export const responseTime = "Usually within 1 business day (TBC)";

export const formTrustPoints = [
  { key: "free", label: "Free, no-obligation quote" },
  { key: "licensed", label: "Licensed partner installers (TBC)" },
  { key: "rebates", label: "Rebates handled for you" },
  { key: "response", label: `Reply ${responseTime.charAt(0).toLowerCase()}${responseTime.slice(1)}` },
] as const;

export const privacyNote =
  "Your details go to one licensed partner installer at a time, never to marketing lists.";

/** Remembered between the form and the thank-you page (session only, never sent anywhere). */
export const THANKS_KEY = "ahp:thanks";

// Trust copy near forms. The network size is a placeholder until partner numbers are confirmed.
export const installerNetwork = "Licensed partner installers in your area (network size and coverage TBC)";
export const rebateHelpNote = "Not sure what you're eligible for? Your installer checks STCs and state rebates and takes them off your quote.";
