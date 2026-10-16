export const site = {
  name: "Aussie Heat Pumps",
  tagline: "Heat pump hot water, fixed-price and fitted by licensed local installers.",
  description:
    "Compare heat pump hot water systems with set supply-and-install prices, check the rebates you may be eligible for, and get matched with a licensed partner installer in your area.",
  // Placeholder contact details — replace before launch.
  phone: "1300 000 000",
  phoneHref: "tel:1300000000",
  email: "hello@example.com.au",
  abn: "ABN TBC",
};

export const nav = [
  { href: "/models", label: "Models & prices" },
  { href: "/rebates", label: "Rebate checker" },
  { href: "/about", label: "How we work" },
  { href: "/blog", label: "Guides" },
];

export const referralDisclosure =
  "Aussie Heat Pumps is a referral service. We don't install systems ourselves. When you request a quote, we pass your details to an independent licensed partner installer who services your area, and they may pay us a referral fee. That fee never changes the price you're quoted.";

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
  "Your details are only shared with one licensed partner installer for your area. We never sell your information.";

/** Remembered between the form and the thank-you page (session only, never sent anywhere). */
export const THANKS_KEY = "ahp:thanks";
