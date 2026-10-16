/**
 * PLACEHOLDER CATALOGUE — every model name, spec and price here is a stand-in.
 * Replace with verified models and supply-and-install prices before launch.
 * While `verified` is false, the UI shows a "TBC" badge next to it.
 */
export type HeatPumpModel = {
  slug: string;
  name: string;
  tier: "Value" | "Popular" | "Premium";
  capacityLitres: number;
  type: "Integrated" | "Split";
  households: string;
  priceFrom: number;
  verified: boolean;
  summary: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  included: string[];
  bestFor: string;
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
    slug: "compact-180",
    name: "Compact 180L",
    tier: "Value",
    capacityLitres: 180,
    type: "Integrated",
    households: "1–2 people",
    priceFrom: 2990,
    verified: false,
    summary: "A small integrated unit for apartments, granny flats and couples.",
    highlights: ["Small footprint", "Plug-and-play integrated design", "Quiet operation"],
    specs: [
      { label: "Tank capacity", value: "180 L" },
      { label: "Configuration", value: "Integrated (all-in-one)" },
      { label: "Noise level", value: "TBC dB(A)" },
      { label: "Operating range", value: "TBC °C to TBC °C" },
      { label: "Tank warranty", value: "TBC years" },
    ],
    included: standardInclusions,
    bestFor: "Small households with limited outdoor space.",
  },
  {
    slug: "everyday-220",
    name: "Everyday 220L",
    tier: "Value",
    capacityLitres: 220,
    type: "Integrated",
    households: "2–3 people",
    priceFrom: 3290,
    verified: false,
    summary: "A no-fuss, budget-friendly upgrade from an old electric tank.",
    highlights: ["Strong value", "Integrated design", "Timer for solar soaking"],
    specs: [
      { label: "Tank capacity", value: "220 L" },
      { label: "Configuration", value: "Integrated (all-in-one)" },
      { label: "Noise level", value: "TBC dB(A)" },
      { label: "Operating range", value: "TBC °C to TBC °C" },
      { label: "Tank warranty", value: "TBC years" },
    ],
    included: standardInclusions,
    bestFor: "Small families replacing an electric storage tank.",
  },
  {
    slug: "family-270",
    name: "Family 270L",
    tier: "Popular",
    capacityLitres: 270,
    type: "Integrated",
    households: "3–4 people",
    priceFrom: 3790,
    verified: false,
    summary: "Our most-requested size, sized right for the typical Aussie family home.",
    highlights: ["Most popular size", "Solar timer mode", "Low running costs"],
    specs: [
      { label: "Tank capacity", value: "270 L" },
      { label: "Configuration", value: "Integrated (all-in-one)" },
      { label: "Noise level", value: "TBC dB(A)" },
      { label: "Operating range", value: "TBC °C to TBC °C" },
      { label: "Tank warranty", value: "TBC years" },
    ],
    included: standardInclusions,
    bestFor: "Families of 3–4 with typical hot water use.",
  },
  {
    slug: "family-plus-315",
    name: "Family Plus 315L",
    tier: "Popular",
    capacityLitres: 315,
    type: "Integrated",
    households: "4–5 people",
    priceFrom: 4190,
    verified: false,
    summary: "Extra capacity for busy mornings and back-to-back showers.",
    highlights: ["Bigger tank", "Boost mode", "Wi-Fi control (TBC)"],
    specs: [
      { label: "Tank capacity", value: "315 L" },
      { label: "Configuration", value: "Integrated (all-in-one)" },
      { label: "Noise level", value: "TBC dB(A)" },
      { label: "Operating range", value: "TBC °C to TBC °C" },
      { label: "Tank warranty", value: "TBC years" },
    ],
    included: standardInclusions,
    bestFor: "Larger families and homes with teenagers.",
  },
  {
    slug: "split-250",
    name: "Split System 250L",
    tier: "Premium",
    capacityLitres: 250,
    type: "Split",
    households: "3–4 people",
    priceFrom: 4890,
    verified: false,
    summary: "A separate compressor and tank, so the noisy part can sit away from bedrooms.",
    highlights: ["Ultra-quiet tank side", "Flexible placement", "Premium efficiency"],
    specs: [
      { label: "Tank capacity", value: "250 L" },
      { label: "Configuration", value: "Split (separate compressor)" },
      { label: "Noise level", value: "TBC dB(A)" },
      { label: "Operating range", value: "TBC °C to TBC °C" },
      { label: "Tank warranty", value: "TBC years" },
    ],
    included: standardInclusions,
    bestFor: "Tight side passages and homes where noise matters.",
  },
  {
    slug: "cold-climate-300",
    name: "Cold Climate 300L",
    tier: "Premium",
    capacityLitres: 300,
    type: "Split",
    households: "4–6 people",
    priceFrom: 5490,
    verified: false,
    summary: "Built for frosty mornings in Victoria, Canberra, Tasmania and the tablelands.",
    highlights: ["Sub-zero performance", "High-capacity tank", "Premium warranty (TBC)"],
    specs: [
      { label: "Tank capacity", value: "300 L" },
      { label: "Configuration", value: "Split (separate compressor)" },
      { label: "Noise level", value: "TBC dB(A)" },
      { label: "Operating range", value: "TBC °C to TBC °C" },
      { label: "Tank warranty", value: "TBC years" },
    ],
    included: standardInclusions,
    bestFor: "Cold-climate regions and large households.",
  },
];

export function getModel(slug: string) {
  return models.find((m) => m.slug === slug);
}

export function formatAUD(n: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(n);
}
