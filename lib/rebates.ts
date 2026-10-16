/**
 * Rebate data, taken only from official government pages (checked 16 October 2026).
 *
 * Rules:
 * - `amount` only ever contains a figure stated on the official page. If the page gives no
 *   figure, the amount says so and `amountConfirmed` is false (the UI marks it "Not confirmed").
 * - `sourceUpdated` is the "last updated" date shown on the official page, if it shows one.
 * - `lastChecked` is when we last read the page. Re-check before relying on any figure.
 */
export type RebateProgram = {
  id: string;
  name: string;
  administrator: string;
  scope: "federal" | AusStateCode;
  amount: string;
  amountConfirmed: boolean;
  /** How the money reaches the customer, per the official page. */
  howPaid: string;
  summary: string;
  eligibility: string[];
  officialUrl: string;
  officialLabel: string;
  sourceUpdated?: string;
  lastChecked: string;
};

type AusStateCode = "QLD" | "NSW" | "VIC" | "ACT" | "SA" | "WA" | "TAS" | "NT";

export const LAST_CHECKED = "2026-10-16";

export const federalSTC: RebateProgram = {
  id: "federal-stc",
  name: "Small-scale Technology Certificates (STCs)",
  administrator: "Clean Energy Regulator",
  scope: "federal",
  amount: "Varies by model and location (no fixed amount published)",
  amountConfirmed: false,
  howPaid: "If you assign your STCs to a registered agent (usually via your installer), you may receive an upfront discount.",
  summary:
    "Eligible heat pump water heaters create STCs under the federal Small-scale Renewable Energy Scheme. The number of certificates depends on the system and where it's installed, and their value depends on the certificate market.",
  eligibility: [
    "Air source heat pump must be on the Clean Energy Regulator's register of eligible water heaters",
    "Heat pump tank must be less than 425 L",
    "Installed to your state's installer licensing requirements",
    "The scheme runs until it ends in 2030",
  ],
  officialUrl:
    "https://cer.gov.au/schemes/renewable-energy-target/small-scale-renewable-energy-scheme/small-scale-renewable-energy-systems/solar-water-heaters-and-air-source-heat-pumps",
  officialLabel: "cer.gov.au: Solar water heaters and air source heat pumps",
  sourceUpdated: "2026-09-18",
  lastChecked: LAST_CHECKED,
};

export const statePrograms: RebateProgram[] = [
  {
    id: "vic-solar-victoria",
    name: "Solar Victoria Hot Water Rebate",
    administrator: "Solar Victoria",
    scope: "VIC",
    amount: "Up to $1,000 (up to $1,400 for locally made products)",
    amountConfirmed: true,
    howPaid: "Paid directly to your authorised retailer and deducted from your invoice.",
    summary:
      "A rebate on eligible heat pump and solar hot water products: 50% of the purchase price, capped at $1,000, or $1,400 for products on the locally made list.",
    eligibility: [
      "You own and live in the home where the system is installed",
      "Combined taxable income of all owners is below $150,000 a year",
      "The property is valued under $3 million",
      "The system being replaced is at least 3 years old",
      "The address hasn't already had a Solar Homes hot water or battery rebate",
      "You use an authorised retailer and an eligible product",
    ],
    officialUrl: "https://www.solar.vic.gov.au/hot-water-rebate",
    officialLabel: "solar.vic.gov.au: Hot water rebate",
    sourceUpdated: "2026-07-01",
    lastChecked: LAST_CHECKED,
  },
  {
    id: "vic-veu",
    name: "Victorian Energy Upgrades (VEU)",
    administrator: "Victorian Government",
    scope: "VIC",
    amount: "Not confirmed (official page could not be checked)",
    amountConfirmed: false,
    howPaid: "Offered as a discount by accredited providers (confirm on the official page).",
    summary: "An energy efficiency program where accredited providers can discount eligible hot water upgrades.",
    eligibility: ["Check the official page for current eligibility and discount amounts"],
    officialUrl: "https://www.energy.vic.gov.au/households/victorian-energy-upgrades-for-households",
    officialLabel: "energy.vic.gov.au: Victorian Energy Upgrades",
    lastChecked: LAST_CHECKED,
  },
  {
    id: "nsw-hot-water-upgrade",
    name: "NSW Hot Water Upgrade Incentive",
    administrator: "NSW Government",
    scope: "NSW",
    amount: "Up to $640 replacing an electric water heater, up to $330 replacing gas (indicative)",
    amountConfirmed: true,
    howPaid: "Provided as an upfront discount in your installation quote.",
    summary:
      "Part of the NSW Household Energy Saving Upgrades. The official amounts are indicative only: the final discount depends on factors such as the installer and model.",
    eligibility: [
      "All NSW households and small businesses may be eligible",
      "Depends on an installer in your area offering the incentive",
      "You may not be eligible if you already have an energy efficient system",
    ],
    officialUrl:
      "https://www.energy.nsw.gov.au/households/grants-rebates/household-energy-saving-upgrades/hot-water-upgrade-incentive",
    officialLabel: "energy.nsw.gov.au: Hot water upgrade incentive",
    sourceUpdated: "2026-02-06",
    lastChecked: LAST_CHECKED,
  },
  {
    id: "act-home-energy-support",
    name: "ACT Home Energy Support rebates (hot water heat pumps)",
    administrator: "ACT Government",
    scope: "ACT",
    amount: "Not confirmed (official page couldn't be loaded when we checked)",
    amountConfirmed: false,
    howPaid: "Check the official page for how rebates are paid.",
    summary:
      "The ACT Government runs Home Energy Support rebates for eligible homeowners, with a hot water heat pump category. We couldn't load the official page to confirm the current amount or eligibility, so check it directly.",
    eligibility: ["Eligibility rules apply: check the official page before you book"],
    officialUrl: "https://www.climatechoices.act.gov.au/policy-programs/home-energy-support-rebates-for-homeowners/hot-water-heat-pumps",
    officialLabel: "climatechoices.act.gov.au: Hot water heat pumps",
    lastChecked: LAST_CHECKED,
  },
];

/** What we found (or didn't) for each state, shown when there's no state program. */
export type StateNote = { text: string; url: string; label: string; sourceUpdated?: string; lastChecked: string };

export const stateNotes: Partial<Record<AusStateCode, StateNote>> = {
  QLD: {
    text: "No current state program found. We couldn't find a Queensland Government hot water rebate on the official energy page.",
    url: "https://www.qld.gov.au/housing/buying-owning-home/energy-water-home",
    label: "qld.gov.au: Energy and water at home",
    lastChecked: LAST_CHECKED,
  },
  WA: {
    text: "No current state program found for heat pump hot water. The WA Government's Energy Ahead program helps households in financial hardship improve energy efficiency (for example by replacing appliances such as fridges); it isn't a general hot water rebate.",
    url: "https://www.wa.gov.au/government/announcements/energy-ahead-formerly-the-household-energy-efficiency-scheme",
    label: "wa.gov.au: Energy Ahead",
    sourceUpdated: "2026-06-23",
    lastChecked: LAST_CHECKED,
  },
  SA: {
    text: "We couldn't confirm a current state program. The official South Australian energy pages couldn't be loaded when we checked, so we can't say whether a state hot water discount applies to you.",
    url: "https://www.energymining.sa.gov.au/consumers/energy-efficiency/retailer-energy-productivity-scheme",
    label: "energymining.sa.gov.au: Retailer Energy Productivity Scheme",
    lastChecked: LAST_CHECKED,
  },
  TAS: {
    text: "We couldn't confirm a current state program. The official Tasmanian energy pages couldn't be loaded when we checked.",
    url: "https://recfit.tas.gov.au/",
    label: "recfit.tas.gov.au: Renewables, Climate and Future Industries Tasmania",
    lastChecked: LAST_CHECKED,
  },
  NT: {
    text: "No current state program found. We couldn't find a Northern Territory Government rebate for heat pump hot water; the household energy support we found is bill relief and electricity concessions.",
    url: "https://nt.gov.au/community/concessions-and-payments/nt-concession-scheme",
    label: "nt.gov.au: NT Concession Scheme",
    lastChecked: LAST_CHECKED,
  },
};

export const stateNames: Record<AusStateCode, string> = {
  QLD: "Queensland",
  NSW: "New South Wales",
  VIC: "Victoria",
  ACT: "the ACT",
  SA: "South Australia",
  WA: "Western Australia",
  TAS: "Tasmania",
  NT: "the Northern Territory",
};

/** States and territories we've checked (all eight). */
export const rebateStates = ["QLD", "NSW", "VIC", "ACT", "SA", "WA", "TAS", "NT"] as const;

export function programsFor(state: string) {
  return statePrograms.filter((p) => p.scope === state);
}

export function formatCheckedDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}
