/**
 * PLACEHOLDER REBATE DATA. Amounts and eligibility summaries are NOT verified.
 * Every program links to its official government page, and the UI tells users
 * to confirm their eligibility there. Set `verified: true` once you've checked a program.
 */
export type RebateProgram = {
  id: string;
  name: string;
  administrator: string;
  scope: "federal" | "QLD" | "NSW" | "VIC";
  amount: string;
  verified: boolean;
  summary: string;
  eligibility: string[];
  officialUrl: string;
  officialLabel: string;
};

export const federalSTC: RebateProgram = {
  id: "federal-stc",
  name: "Small-scale Technology Certificates (STCs)",
  administrator: "Clean Energy Regulator",
  scope: "federal",
  amount: "Up to $TBC",
  verified: false,
  summary:
    "Under the Small-scale Renewable Energy Scheme, eligible heat pump water heaters create STCs. Installers usually apply their value as an upfront discount on your quote.",
  eligibility: [
    "The model must be listed on the official register of eligible heat pumps (TBC)",
    "Installed at an Australian address",
    "Certificate value depends on your climate zone and the market price (TBC)",
  ],
  officialUrl:
    "https://cer.gov.au/schemes/renewable-energy-target/small-scale-renewable-energy-scheme/small-scale-technology-certificates",
  officialLabel: "cer.gov.au: Small-scale technology certificates",
};

export const statePrograms: RebateProgram[] = [
  {
    id: "vic-solar-victoria",
    name: "Solar Victoria Hot Water Rebate",
    administrator: "Solar Victoria",
    scope: "VIC",
    amount: "Up to $TBC",
    verified: false,
    summary:
      "A Victorian Government rebate on eligible heat pump and solar hot water systems for eligible households.",
    eligibility: [
      "Owner-occupier or landlord criteria apply (TBC)",
      "Household income and property value caps may apply (TBC)",
      "Must use an authorised retailer and eligible product (TBC)",
    ],
    officialUrl: "https://www.solar.vic.gov.au/hot-water-rebate",
    officialLabel: "solar.vic.gov.au: Hot water rebate",
  },
  {
    id: "vic-veu",
    name: "Victorian Energy Upgrades (VEU)",
    administrator: "Victorian Government",
    scope: "VIC",
    amount: "Discount of $TBC",
    verified: false,
    summary:
      "An energy efficiency program where accredited providers can offer discounts on eligible hot water upgrades.",
    eligibility: [
      "Replacing an existing gas or electric hot water system (TBC)",
      "Installed by a VEU-accredited provider (TBC)",
      "Can sometimes be combined with the Solar Victoria rebate (TBC)",
    ],
    officialUrl: "https://www.energy.vic.gov.au/households/victorian-energy-upgrades-for-households",
    officialLabel: "energy.vic.gov.au: Victorian Energy Upgrades",
  },
  {
    id: "nsw-hot-water-upgrade",
    name: "NSW Hot Water Upgrade Incentive",
    administrator: "NSW Government (Energy Savings Scheme)",
    scope: "NSW",
    amount: "Discount of $TBC",
    verified: false,
    summary:
      "Part of the NSW Household Energy Saving Upgrades. Accredited providers can discount eligible heat pump hot water installs.",
    eligibility: [
      "Replacing an existing electric or gas hot water system (TBC)",
      "Installed by an accredited certificate provider (TBC)",
      "Product must be eligible under the scheme (TBC)",
    ],
    officialUrl:
      "https://www.energy.nsw.gov.au/households/grants-rebates/household-energy-saving-upgrades/hot-water-upgrade-incentive",
    officialLabel: "energy.nsw.gov.au: Hot water upgrade incentive",
  },
  {
    id: "qld-programs",
    name: "Queensland household energy programs",
    administrator: "Queensland Government",
    scope: "QLD",
    amount: "TBC (program availability to be confirmed)",
    verified: false,
    summary:
      "Queensland state rebates for hot water have changed over time. We're confirming which program, if any, is currently open.",
    eligibility: [
      "Current program availability TBC",
      "Federal STCs still apply in QLD (see above)",
      "Energy concessions may apply separately (TBC)",
    ],
    officialUrl: "https://www.qld.gov.au/housing/buying-owning-home/energy-water-home",
    officialLabel: "qld.gov.au: Energy and water at home",
  },
];

export const rebateStates = ["QLD", "NSW", "VIC"] as const;

export function programsFor(state: string) {
  return statePrograms.filter((p) => p.scope === state);
}
