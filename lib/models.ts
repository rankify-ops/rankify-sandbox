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
  /** Short values for the comparison table. "Not listed" where no source gave a figure. */
  compare: { efficiency: string; noise: string; warranty: string; bestFor: string };
  /** Manufacturer spec sheet the specs were taken from. */
  specSheet: { label: string; url: string };
  /** CER register entry: model code and certificates (10-year deeming) for zones 1–5. */
  stc: { registerModel: string; counts: [number, number, number, number, number] };
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
      { label: "Refrigerant", value: "R290 (400 g)" },
      { label: "Efficiency", value: "COP 4.9, standard mode (20 °C ambient, water 15 → 55 °C)" },
      { label: "Noise", value: "49 dB(A) at 1 m, standard mode (45 dB(A) silent mode)" },
      { label: "Operating range", value: "−7 °C to 43 °C (heat pump only)" },
      { label: "Size", value: "600 × 600 × 1598 mm, 118 kg" },
      { label: "Warranty", value: "5 yrs parts, 2 yrs labour (CHOICE listing; confirm)" },
    ],
    included: standardInclusions,
    bestFor: "Couples, small families and townhouses replacing an electric tank.",
    compare: { efficiency: "COP 4.9 (@20 °C)", noise: "49 dB(A) at 1 m", warranty: "5 yrs parts, 2 yrs labour (confirm)", bestFor: "Smaller homes on a budget" },
    specSheet: { label: "Emerald All-in-One spec brochure (2025.06)", url: "https://www.emerald.com.au/wp-content/uploads/2025/07/Emerald-Heat-Pump-All-In-One-spec-brochure.pdf" },
    stc: { registerModel: "EE-HWS-A1-220", counts: [28, 27, 33, 36, 35] },
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
      { label: "Tank capacity", value: "270 L (model PASHW015-270LD-FL02-R290)" },
      { label: "Configuration", value: "Integrated (all-in-one)" },
      { label: "Refrigerant", value: "R290 (GWP 3)" },
      { label: "Efficiency", value: "COP 4.8 (20 °C ambient, heating to 60 °C)" },
      { label: "Noise", value: "47 dB(A) at 1 m (anechoic chamber)" },
      { label: "Operating range", value: "−5 °C to 43 °C" },
      { label: "Warranty", value: "3–5 yrs depending on source (confirm with installer)" },
    ],
    included: standardInclusions,
    bestFor: "Families of 3–4 who want a proven, good-value system.",
    compare: { efficiency: "COP 4.8 (@20 °C, to 60 °C)", noise: "47 dB(A) at 1 m", warranty: "3–5 yrs (sources differ; confirm)", bestFor: "Best value for families" },
    specSheet: { label: "iStore Product Specification Data Sheet R290 (October 2024)", url: "https://solarquotes.com.au/wp-content/uploads/2024/03/iStore-Product-Specification-Data-Sheet-270L-R290-Oct-2024.pdf" },
    stc: { registerModel: "PASHW015-270LD-FL02-R290", counts: [26, 25, 31, 33, 32] },
    sources: [
      "https://www.istore.net.au/",
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
    refrigerant: "R134a",
    households: "3–4 people",
    priceFrom: 4290,
    priceConfirmed: false,
    summary: "An Australian-made all-in-one from one of the country's best-known hot water brands.",
    highlights: ["Made in Australia", "Enamel-lined steel cylinder", "2.4 kW booster for cold snaps"],
    specs: [
      { label: "Tank capacity", value: "270 L (model HDc270, 571D270)" },
      { label: "Configuration", value: "Integrated (all-in-one)" },
      { label: "Refrigerant", value: "R134a (an R513a version, 571D270R5, is also sold; confirm which is supplied)" },
      { label: "Efficiency", value: "COP 4.5 (19 °C / 15 °C dry/wet bulb)" },
      { label: "Noise", value: "47 dB(A) at 1 m" },
      { label: "Operating range", value: "−5 °C to +43 °C" },
      { label: "Booster element", value: "2.4 kW" },
      { label: "Warranty", value: "7 yrs cylinder supply, 3 yrs cylinder labour, 3 yrs sealed system incl. labour" },
    ],
    included: standardInclusions,
    bestFor: "Families who want a big-brand system with local support.",
    compare: { efficiency: "COP 4.5 (@19 °C)", noise: "47 dB(A) at 1 m", warranty: "7 yrs cylinder, 3 yrs sealed system", bestFor: "Big-brand, Australian made" },
    specSheet: { label: "Rheem AmbiHeat brochure (January 2023)", url: "https://admin.rheem.com.au/sites/default/files/2023-03/RHE474%20Ambiheat%204pp%20Brochure_Jan%202023_DIGITAL.pdf" },
    stc: { registerModel: "571D270", counts: [26, 25, 31, 33, 32] },
    sources: [
      "https://admin.rheem.com.au/sites/default/files/2023-03/RHE474%20Ambiheat%204pp%20Brochure_Jan%202023_DIGITAL.pdf",
      "https://www.rheem.com.au/rheem/products/Residential/Heat-Pumps/Ambiheat-/Rheem-Ambiheat-HDc270-Heat-Pump-(with-R513a-refrigerant)/p/571D270R5",
      "https://tradelink.com.au/ambiheat-hdc-270-r513a-heat-pump-2-4kw-299928",
      "https://www.choice.com.au/products/home-improvement/water/hot-water-systems/rheem-ambiheat-hdc270-571d270",
      "https://www.gridly.com.au/blog/rheem-ambiheat-review-australia",
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
      { label: "Tank capacity", value: "302 L (delivers up to 510 L of 40 °C mixed water)" },
      { label: "Configuration", value: "Integrated (all-in-one)" },
      { label: "Refrigerant", value: "R134a" },
      { label: "Efficiency", value: "Seasonal COP 3.58 (AS/NZS 4234, climate zone HP2-AU)" },
      { label: "Noise", value: "45 dB(A) at 1 m, free field" },
      { label: "Operating range", value: "−5 °C to 42 °C, with active defrost" },
      { label: "Warranty", value: "See Stiebel Eltron terms (CHOICE lists 5 yrs cylinder & condenser, 2 yrs sealed system)" },
    ],
    included: standardInclusions,
    bestFor: "Larger families and homes with teenagers or two bathrooms.",
    compare: { efficiency: "COP 3.58 (seasonal)", noise: "45 dB(A) at 1 m", warranty: "5 yrs cylinder & condenser (confirm)", bestFor: "Larger families, big usable volume" },
    specSheet: { label: "Stiebel Eltron Australia data sheet, WWK 222/302 (H)", url: "https://filesync.galvins.com.au/datasheets/FXHS0004.pdf" },
    stc: { registerModel: "WWK302H", counts: [24, 25, 28, 30, 30] },
    sources: [
      "https://filesync.galvins.com.au/datasheets/FXHS0004.pdf",
      "https://media.goelectrical.com.au/Datasheets/Stiebel_Eltron/Stiebel_Hot_Water_Heat_Pump_WWK302.pdf",
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
      { label: "Tank capacity", value: "315 L (glass-lined or stainless tanks)" },
      { label: "Configuration", value: "Split (separate heat pump unit)" },
      { label: "Refrigerant", value: "R744 (CO2)" },
      { label: "Efficiency", value: "COP 6.02 at 32 °C ambient" },
      { label: "Noise", value: "37 dB" },
      { label: "Operating range", value: "Runs “even at an outside temperature of −10 °C” (manufacturer)" },
      { label: "Output temperature", value: "63 °C" },
      { label: "Warranty", value: "Up to 15 yrs, conditions apply (confirm terms)" },
    ],
    included: standardInclusions,
    bestFor: "Frosty areas like Canberra, Tasmania and inland Victoria, and noise-sensitive spots.",
    compare: { efficiency: "COP 6.02 (@32 °C)", noise: "37 dB", warranty: "Up to 15 yrs (conditions apply)", bestFor: "Cold climates, quiet spots" },
    specSheet: { label: "Reclaim Energy residential brochure (Issue 05, July 2023)", url: "https://reclaimenergy.com.au/wp-content/uploads/2026/06/Residential-Consumer-Brochure.pdf" },
    stc: { registerModel: "REHP-CO2-315GL-V2", counts: [26, 27, 31, 34, 34] },
    sources: [
      "https://reclaimenergy.com.au/wp-content/uploads/2026/06/Residential-Consumer-Brochure.pdf",
      "https://reclaimenergy.com.au/products/residential",
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
      { label: "Tank capacity", value: "315 L stainless steel (system GAUS-315FQTS)" },
      { label: "Configuration", value: "Split (heat pump unit GAU-A45HPD)" },
      { label: "Refrigerant", value: "R744 (CO2)" },
      { label: "Efficiency", value: "COP 5.96 (32.45 °C ambient, 18.74 °C inlet)" },
      { label: "Noise", value: "37 dB at 1 m from heat pump unit" },
      { label: "Operating range", value: "−10 °C to +42 °C" },
      { label: "Output temperature", value: "63 °C (nominal)" },
      { label: "Warranty", value: "Heat pump 6 yrs (parts & labour); stainless tank 15 yrs pro rata" },
    ],
    included: standardInclusions,
    bestFor: "Homeowners who want a premium system for the long haul, in any climate.",
    compare: { efficiency: "COP 5.96 (@32.45 °C)", noise: "37 dB at 1 m", warranty: "6 yrs heat pump, 15 yrs tank (pro rata)", bestFor: "Premium long-term pick" },
    specSheet: { label: "Sanden Eco Plus brochure (March 2023)", url: "https://www.solarquotes.com.au/wp-content/uploads/2024/03/Sanden_Brochure_2023.pdf" },
    stc: { registerModel: "GAUS-315FQTS", counts: [26, 27, 32, 34, 34] },
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
