/**
 * Model catalogue: six heat pump hot water systems sold in Australia.
 *
 * Specs come from manufacturer data sheets and CHOICE / retailer listings (researched
 * Oct 2026; sources listed per model). Where sources disagreed we used the manufacturer
 * figure, or CHOICE's, and the spec is marked "confirm". Prices are GUIDE supply-and-install
 * prices before rebates, based on published retail prices plus typical standard installation.
 * They are provisional until confirmed with partner installers: while `priceConfirmed` is
 * false the UI labels them "Guide price".
 */
export type HeatPumpModel = {
  slug: string;
  brand: string;
  name: string;
  tier: "Value" | "Mid-range" | "Premium";
  capacityLitres: number;
  type: "Integrated" | "Split";
  refrigerant: string;
  households: string;
  priceFrom: number;
  priceConfirmed: boolean;
  /** Short badge for the card, e.g. "Popular size". Opinion/size labels only, never sales claims. */
  badge?: string;
  summary: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  included: string[];
  bestFor: string;
  /** Where the specs came from, so they can be re-checked. Not shown on the site. */
  sources: string[];
};

const standardInclusions = [
  "Supply of the heat pump unit",
  "Removal and disposal of your old system",
  "Standard installation by a licensed plumber",
  "Electrical connection by a licensed electrician (where required)",
  "Compliance certificates",
];

export const models: HeatPumpModel[] = [
  {
    slug: "emerald-all-in-one-220",
    brand: "Emerald Energy",
    name: "Emerald All-in-One 220L",
    tier: "Value",
    capacityLitres: 220,
    type: "Integrated",
    refrigerant: "R290 (propane)",
    households: "2–3 people",
    priceFrom: 3290,
    priceConfirmed: false,
    summary: "A compact, budget-friendly all-in-one unit for smaller households and units.",
    highlights: ["Natural R290 refrigerant", "Compact 600 × 600 mm footprint", "Optional 1.6 kW backup element"],
    specs: [
      { label: "Tank capacity", value: "220 L" },
      { label: "Configuration", value: "Integrated (all-in-one)" },
      { label: "Refrigerant", value: "R290 (propane)" },
      { label: "Operating range", value: "−7 °C to 43 °C" },
      { label: "Efficiency", value: "Seasonal COP 4.9 (@20 °C)" },
      { label: "Size", value: "600 × 600 × 1598 mm, 118 kg (empty)" },
      { label: "Warranty", value: "5 yrs parts, 2 yrs labour (confirm)" },
    ],
    included: standardInclusions,
    bestFor: "Couples, small families and townhouses replacing an electric tank.",
    sources: [
      "https://www.emerald.com.au/wp-content/uploads/2025/07/Emerald-Heat-Pump-All-In-One-spec-brochure.pdf",
      "https://www.choice.com.au/products/home-improvement/water/hot-water-systems/emerald-ee-hws-a1-220",
    ],
  },
  {
    slug: "istore-270",
    brand: "iStore",
    name: "iStore 270L",
    tier: "Value",
    capacityLitres: 270,
    type: "Integrated",
    refrigerant: "R290 (propane)",
    households: "3–4 people",
    priceFrom: 3590,
    priceConfirmed: false,
    badge: "Popular size",
    summary: "A widely installed 270 L all-in-one that's sized right for the typical family home.",
    highlights: ["Family-size 270 L tank", "R290 refrigerant, COP 4.8", "Timer for solar soaking"],
    specs: [
      { label: "Tank capacity", value: "270 L" },
      { label: "Configuration", value: "Integrated (all-in-one)" },
      { label: "Refrigerant", value: "R290 (propane)" },
      { label: "Operating range", value: "−5 °C to 43 °C" },
      { label: "Efficiency", value: "COP 4.8 (20 °C ambient, heating to 60 °C)" },
      { label: "Noise", value: "47 dB(A) at 1 m" },
      { label: "Warranty", value: "5 yrs tank, heat pump and controller (confirm)" },
    ],
    included: standardInclusions,
    bestFor: "Families of 3–4 who want a proven, good-value system.",
    sources: [
      "https://solarquotes.com.au/wp-content/uploads/2024/03/iStore-Product-Specification-Data-Sheet-270L-R290-Oct-2024.pdf",
      "https://www.choice.com.au/products/home-improvement/water/hot-water-systems/istore-pashw015-270ld-fl02-r290",
    ],
  },
  {
    slug: "rheem-ambiheat-270",
    brand: "Rheem",
    name: "Rheem AmbiHeat 270L",
    tier: "Mid-range",
    capacityLitres: 270,
    type: "Integrated",
    refrigerant: "R513a",
    households: "3–4 people",
    priceFrom: 4290,
    priceConfirmed: false,
    summary: "An Australian-made all-in-one from one of the country's best-known hot water brands.",
    highlights: ["Made in Australia", "Enamel-lined steel cylinder", "2.4 kW booster for cold snaps"],
    specs: [
      { label: "Tank capacity", value: "270 L (model HDc270)" },
      { label: "Configuration", value: "Integrated (all-in-one)" },
      { label: "Refrigerant", value: "R513a" },
      { label: "Operating range", value: "−5 °C to 43 °C" },
      { label: "Noise", value: "47–48 dB(A) at 1 m" },
      { label: "Booster element", value: "2.4 kW" },
      { label: "Warranty", value: "Rheem advertises 10 years (check terms)" },
    ],
    included: standardInclusions,
    bestFor: "Families who want a big-brand system with local support.",
    sources: [
      "https://www.rheem.com.au/rheem/products/Residential/Heat-Pumps/Ambiheat-/Rheem-Ambiheat-HDc270-Heat-Pump-(with-R513a-refrigerant)/p/571D270R5",
      "https://tradelink.com.au/ambiheat-hdc-270-r513a-heat-pump-2-4kw-299928",
      "https://www.choice.com.au/products/home-improvement/water/hot-water-systems/rheem-ambiheat-hdc270-571d270",
    ],
  },
  {
    slug: "stiebel-eltron-wwk-302",
    brand: "Stiebel Eltron",
    name: "Stiebel Eltron WWK 302 H",
    tier: "Premium",
    capacityLitres: 302,
    type: "Integrated",
    refrigerant: "R134a",
    households: "4–5 people",
    priceFrom: 5690,
    priceConfirmed: false,
    summary: "German-engineered 302 L all-in-one with a big usable volume for busy households.",
    highlights: ["Up to 510 L of 40 °C mixed water", "Active defrost for frosty mornings", "Quiet 45 dB(A) operation"],
    specs: [
      { label: "Tank capacity", value: "302 L" },
      { label: "Configuration", value: "Integrated (all-in-one)" },
      { label: "Refrigerant", value: "R134a" },
      { label: "Operating range", value: "−5 °C to 42 °C, with active defrost" },
      { label: "Efficiency", value: "Seasonal COP 3.58" },
      { label: "Noise", value: "45 dB(A)" },
      { label: "Warranty", value: "5 yrs cylinder & condenser, 2 yrs sealed system (confirm)" },
    ],
    included: standardInclusions,
    bestFor: "Larger families and homes with teenagers or two bathrooms.",
    sources: [
      "https://www.choice.com.au/products/home-improvement/water/hot-water-systems/stiebel-eltron-wwk-302-h",
      "https://www.winnings.com.au/p/stiebel-eltron-302l-hot-water-heat-pump-wwk302h",
      "https://commercial.thegoodguys.com.au/stiebel-302l-hot-water-heat-pump-wwk-302",
    ],
  },
  {
    slug: "reclaim-energy-co2-315",
    brand: "Reclaim Energy",
    name: "Reclaim Energy CO2 315L",
    tier: "Premium",
    capacityLitres: 315,
    type: "Split",
    refrigerant: "R744 (CO2)",
    households: "4–6 people",
    priceFrom: 6490,
    priceConfirmed: false,
    badge: "Cold-climate pick",
    summary: "A quiet CO2 split system built around a Japanese compressor, popular for cold-climate homes.",
    highlights: ["Natural CO2 refrigerant", "Very quiet: 37 dB(A)", "Separate unit can sit away from bedrooms"],
    specs: [
      { label: "Tank capacity", value: "315 L (stainless or glass-lined)" },
      { label: "Configuration", value: "Split (separate heat pump unit)" },
      { label: "Refrigerant", value: "R744 (CO2)" },
      { label: "Output temperature", value: "63 °C" },
      { label: "Noise", value: "37 dB(A)" },
      { label: "Operating range", value: "Cold-climate rated (confirm minimum)" },
      { label: "Warranty", value: "Glass-lined: tank 10 yrs parts / 5 yrs labour, heat pump 10 yrs (confirm)" },
    ],
    included: standardInclusions,
    bestFor: "Frosty areas like Canberra, Tasmania and inland Victoria, and noise-sensitive spots.",
    sources: [
      "https://www.choice.com.au/products/home-improvement/water/hot-water-systems/reclaim-energy-rehp-co2-315gl-v2",
      "https://www.choice.com.au/products/home-improvement/water/hot-water-systems/reclaim-energy-rehp-co2-315ssew",
      "https://solarquotes.com.au/hot-water/heat-pump/reviews/reclaim-energy-review.html",
    ],
  },
  {
    slug: "sanden-eco-plus-315",
    brand: "Sanden",
    name: "Sanden Eco Plus 315L",
    tier: "Premium",
    capacityLitres: 315,
    type: "Split",
    refrigerant: "R744 (CO2)",
    households: "4–6 people",
    priceFrom: 7490,
    priceConfirmed: false,
    summary: "The long-established Japanese CO2 heat pump, known for long warranties and quiet running.",
    highlights: ["Natural CO2 refrigerant", "Long cylinder warranty", "Quiet 37 dB(A) heat pump unit"],
    specs: [
      { label: "Tank capacity", value: "315 L (model GAUS-315FQTS)" },
      { label: "Configuration", value: "Split (separate heat pump unit)" },
      { label: "Refrigerant", value: "R744 (CO2)" },
      { label: "Output temperature", value: "Up to 63 °C" },
      { label: "Noise", value: "37 dB(A)" },
      { label: "Operating range", value: "−10 °C to 43 °C (confirm)" },
      { label: "Warranty", value: "15 yrs cylinder (10 full + 5 pro-rata), 10 yrs compressor (confirm)" },
    ],
    included: standardInclusions,
    bestFor: "Homeowners who want a premium system for the long haul, in any climate.",
    sources: [
      "https://www.choice.com.au/products/home-improvement/water/hot-water-systems/sanden-gaus-315fqts",
      "https://australianhotwater.com.au/product/sanden-eco-plus-315-litre-heat-pump-price/",
      "https://www.solarquotes.com.au/wp-content/uploads/2024/03/Sanden_Brochure_2023.pdf",
    ],
  },
];

/** Old placeholder URLs → new model pages (kept so earlier preview links still work). */
export const legacyModelSlugs: Record<string, string> = {
  "compact-180": "emerald-all-in-one-220",
  "everyday-220": "emerald-all-in-one-220",
  "family-270": "istore-270",
  "family-plus-315": "stiebel-eltron-wwk-302",
  "split-250": "reclaim-energy-co2-315",
  "cold-climate-300": "sanden-eco-plus-315",
};

export function getModel(slug: string) {
  return models.find((m) => m.slug === (legacyModelSlugs[slug] ?? slug));
}

export function formatAUD(n: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(n);
}
