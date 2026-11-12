/**
 * Rebate data, taken only from official government pages (checked 17 October 2026).
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

export const LAST_CHECKED = "2026-10-17";

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
  sourceUpdated: "2025-05-29",
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
      "A rebate on eligible heat pump and solar hot water products: 50% of the purchase price, capped at $1,000, or $1,400 for locally made products (at least 50% locally made or assembled parts). It's worked out after other discounts, including STCs and Victorian Energy Efficiency Certificates.",
    eligibility: [
      "You're the owner-occupier of an existing property",
      "Combined taxable income of all owners is below $150,000 a year",
      "The property is valued under $3 million",
      "The system being replaced is at least 3 years old from the date of purchase",
      "The address hasn't already had a Solar Homes hot water or battery rebate",
      "You use an authorised retailer and an eligible product",
    ],
    officialUrl: "https://www.solar.vic.gov.au/hot-water-rebate",
    officialLabel: "solar.vic.gov.au: Hot water rebate",
    sourceUpdated: "2026-10-12",
    lastChecked: LAST_CHECKED,
  },
  {
    id: "vic-veu",
    name: "Victorian Energy Upgrades (VEU)",
    administrator: "Victorian Government",
    scope: "VIC",
    amount: "Not confirmed on the VEU page (it couldn't be loaded when we checked)",
    amountConfirmed: false,
    howPaid: "Offered as a discount by accredited providers (confirm on the official page).",
    summary:
      "An energy efficiency program where accredited providers can discount eligible hot water upgrades. Solar Victoria's hot water rebate page says that combined with its rebate, upfront costs can be reduced by up to $2,030 for an eligible locally made system, or up to $1,630 for other eligible systems.",
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
      "A nomination form must be completed before installation begins",
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
    amount: "50% of supply and installation, up to $2,500 per category (up to $5,000 total), plus a zero-interest loan of up to $10,000",
    amountConfirmed: true,
    howPaid:
      "Rebate-only: you pay the supplier, then claim; the rebate is paid to you, usually in about 10 business days. Rebate and loan: Brighte processes both.",
    summary:
      "For eligible concession-card homeowners, the program provides up to $5,000 in rebates: one rebate of 50% of the total cost of supply and installation, up to $2,500, for rooftop solar, and/or one rebate of 50% up to $2,500 for one Category B product, including a hot water heat pump. Eligible participants may also get a zero-interest loan of up to $10,000 through the Sustainable Household Scheme (via Brighte). Don't accept a quote until your application is pre-approved.",
    eligibility: [
      "You're a resident of the ACT",
      "You hold an Australian Government Pensioner Concession Card, Department of Veterans' Affairs Gold Card, or an Australian Government Health Care Card (a Commonwealth Seniors Health Card is not eligible)",
      "You own and live in the home where the product will be installed",
      "You've attended a free Everyday Climate Choices workshop",
      "Unimproved Value is at or below $750,000 (freestanding homes, units and dual occupancies) or $300,000 (unit-titled multi-storey apartments), in any year from 2022",
      "The heat pump must be on the Victorian Energy Upgrades register under 'Water heater - Heat pump'",
      "Don't accept a quote until the ACT Government (or Brighte, if you also want the loan) has pre-approved your application",
    ],
    officialUrl: "https://www.climatechoices.act.gov.au/policy-programs/home-energy-support-rebates-for-homeowners",
    officialLabel: "climatechoices.act.gov.au: Home Energy Support rebates for homeowners",
    lastChecked: "2026-11-12",
  },
  {
    id: "act-sustainable-household-scheme",
    name: "ACT Sustainable Household Scheme (heat pump loans)",
    administrator: "ACT Government",
    scope: "ACT",
    amount: "Loans of $2,000 to $20,000 at 3% interest (not a rebate); up to 10 years",
    amountConfirmed: true,
    howPaid:
      "The loan is paid to a Brighte-accredited supplier once the product is installed and working. You repay Brighte. Repayments can start only then, and you can repay early with no penalty.",
    summary:
      "A low-interest loan for eligible ACT households to buy energy-efficient upgrades, including hot water heat pumps. Loans are $2,000 to $20,000 at 3% over up to 10 years, with no establishment or account-keeping fees. Households that applied or were approved before 1 July 2026 stay on a $15,000 lifetime cap. Home Energy Support participants may instead get a zero-interest loan of up to $10,000.",
    eligibility: [
      "For a heat pump, you own the property (or live with the owner) and it is in the ACT, including Hall, Tharwa and Oaks Estate, but not Jervis Bay Territory",
      "The property is a standalone residence or a unit-titled property, and is not a new build (including a dwelling that received a Certificate of Occupancy or Use in the past 12 months)",
      "Unimproved Value is at or below $750,000 (freestanding homes, townhouses and dual occupancies) or $300,000 (unit-titled multi-storey apartments), in any year from 2022",
      "You meet the scheme guidelines and Brighte's lending criteria, including a credit check, and attend a free one-hour workshop",
      "You're replacing an existing gas or inefficient electric hot water system",
      "The model is on the Victorian Energy Upgrades register under 'Water heater - Heat pump', and you use a Brighte-accredited supplier",
    ],
    officialUrl: "https://www.climatechoices.act.gov.au/policy-programs/sustainable-household-scheme",
    officialLabel: "climatechoices.act.gov.au: Sustainable Household Scheme",
    lastChecked: "2026-11-12",
  },
  {
    id: "act-access-to-electric",
    name: "ACT Access to Electric Program",
    administrator: "ACT Government",
    scope: "ACT",
    amount: "Fully funds eligible gas-to-electric upgrades and ceiling insulation (no cost to the homeowner)",
    amountConfirmed: true,
    howPaid:
      "The ACT Government fully funds the upgrades through its contractor. There is no cost to the homeowner. Access is by referral and eligibility assessment only, through Care Financial Counselling.",
    summary:
      "A hardship program that fully funds switching all existing gas appliances (heating and cooling, water heating and cooktops) to efficient electric alternatives, plus ceiling insulation where required. Participating households are then disconnected from the gas network. It isn't a general rebate, and you can't combine it with Home Energy Support or the Sustainable Household Scheme.",
    eligibility: [
      "You're a homeowner who owns and occupies the home, and you don't own any additional properties in the ACT or interstate",
      "You meet the National Rental Affordability Scheme income limits, and pass a financial capability assessment by Care Financial Counselling (a concession card is not required)",
      "The property is in the ACT (including Hall, Tharwa and Oaks Estate, but not Jervis Bay Territory), is a standalone house or townhouse (not an apartment), and is an existing residence, not a new build",
      "The property's Unimproved Value is at or below a defined threshold (the official guidelines don't publish the dollar figure)",
      "You haven't already received support through Home Energy Support or the Sustainable Household Scheme, and you agree to upgrade all gas appliances and permanently disconnect from gas",
    ],
    officialUrl: "https://www.climatechoices.act.gov.au/policy-programs/access-to-electric-program",
    officialLabel: "climatechoices.act.gov.au: Access to Electric Program",
    lastChecked: "2026-11-12",
  },
  {
    id: "act-actewagl-hwhp-upgrade",
    name: "ActewAGL gas-to-heat-pump discount",
    administrator: "ActewAGL",
    scope: "ACT",
    amount: "From 1 November 2026: $1,500 off installation plus $400 in bill credits over 3 years, for eligible concession card holders only",
    amountConfirmed: true,
    howPaid:
      "The $1,500 discount is applied at the time of sale. The $400 is credited to your ActewAGL electricity account over three years ($33.34 a quarter). Closing the account generally ends any remaining credit.",
    summary:
      "Under the ACT Energy Efficiency Improvement Scheme, ActewAGL's terms for installations from 1 November 2026 offer eligible concession card holders $1,500 off the installation cost and $400 in electricity bill credits over three years when they replace a gas storage or instantaneous hot water system with an eligible heat pump. There is no general (non-concession) hot water discount in those terms. The offer is only available to ACT residents with an active ActewAGL electricity account, through the Electrify with ActewAGL online platform, and may be withdrawn without notice. Earlier terms for installations from 1 July to 31 October 2026 listed $1,250 off plus $250 in credits for non-concession customers, or $2,000 plus $400 for concession holders.",
    eligibility: [
      "You're an ACT resident with an active ActewAGL electricity account at the time of purchase",
      "You're replacing a gas storage or instantaneous hot water system with a heat pump nominated as eligible by ActewAGL",
      "You hold an eligible concession card whose address matches the installation address, or you qualify through financial hardship (a referral from a specified community organisation, or a retailer's hardship program such as ActewAGL's Staying Connected)",
      "The quote is requested and accepted through the Electrify with ActewAGL online platform from a retailer named in the current terms",
      "The offer is not available for new homes, government, commercial or development projects, or asbestos-affected properties, and may be withdrawn without notice",
    ],
    officialUrl: "https://www.actewagl.com.au/for-home/energy-efficient-homes/heating-and-cooling-upgrade/heating-and-cooling-upgrade-terms-and-conditions",
    officialLabel: "actewagl.com.au: Heating and hot water appliance upgrade terms and conditions",
    lastChecked: "2026-11-12",
  },
  {
    id: "sa-reps-water-heating",
    name: "SA Retailer Energy Productivity Scheme (REPS): water heating",
    administrator: "Essential Services Commission of SA (ESCOSA)",
    scope: "SA",
    amount: "No fixed amount published (set by approved activity providers)",
    amountConfirmed: false,
    howPaid: "Through an approved activity provider. ESCOSA says to speak directly with a provider about eligibility and any costs involved.",
    summary:
      "Under REPS, energy retailers fund household energy activities. ESCOSA lists residential water heating activities including replacing or upgrading your hot water system (WH1), switching an electric hot water system to a suitable tariff (WH3) and connecting a heat pump water heater to an approved demand response aggregator (WH4). Each activity can generally be completed once per property.",
    eligibility: ["Speak to an approved activity provider about eligibility and costs", "Each activity can generally be completed once per property"],
    officialUrl: "https://www.escosa.sa.gov.au/industry/reps/residential-activities/activity-water-heating-residential",
    officialLabel: "escosa.sa.gov.au: REPS water heating activity",
    lastChecked: LAST_CHECKED,
  },
];

/** What we found (or didn't) for each state, shown when there's no state program. */
export type StateNote = { text: string; url: string; label: string; sourceUpdated?: string; lastChecked: string };

export const stateNotes: Partial<Record<AusStateCode, StateNote>> = {
  QLD: {
    text: "No current state program found for heat pump hot water. The Queensland Government's home energy savings page lists programs such as Supercharged Solar for Renters, the Solar Bonus Scheme and concessions, but no household hot water rebate.",
    url: "https://www.qld.gov.au/housing/home-energy-savings",
    label: "qld.gov.au: Home energy savings",
    lastChecked: LAST_CHECKED,
  },
  WA: {
    text: "No current state program found for heat pump hot water. The WA Government's Energy Ahead program helps households in financial hardship improve energy efficiency (for example by replacing appliances such as fridges); it isn't a general hot water rebate.",
    url: "https://www.wa.gov.au/government/announcements/energy-ahead-formerly-the-household-energy-efficiency-scheme",
    label: "wa.gov.au: Energy Ahead",
    sourceUpdated: "2026-06-23",
    lastChecked: LAST_CHECKED,
  },
  TAS: {
    text: "We couldn't confirm a current state program. The official Tasmanian energy pages couldn't be loaded when we checked, so we can't say whether a state hot water program or loan applies.",
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

/** State rebate page path, e.g. /rebates/qld. */
export const stateRebatePath = (state: string) => `/rebates/${state.toLowerCase()}`;
