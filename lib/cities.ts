import type { FaqItem } from "@/components/Faq";
import { formatAUD, getModel, models, type HeatPumpModel } from "./models";
import { formatCheckedDate, LAST_CHECKED, programsFor, stateNames, stateNotes } from "./rebates";
import type { AusState } from "./site";
import { STC_PRICE_CAP, stcCount, stcFactor, stcZoneForPostcode } from "./stc";

/**
 * City landing pages (/heat-pump-hot-water/[city]).
 *
 * Climate figures come only from the Bureau of Meteorology climate statistics for the named
 * station ("All years" view, checked 16 October 2026; BOM showed a banner saying the product
 * had problems, so re-check before launch). NCC climate zones come from the ABCB's climate
 * zone descriptions and state climate zone tables (by council area; the ABCB notes the map
 * is the authority for an exact address). STC zones come from the CER postcode table via
 * lib/stc.ts, and rebates from lib/rebates.ts, so every figure has one source of truth.
 */
export type City = {
  slug: string;
  name: string;
  state: AusState;
  /** Representative postcode (city centre), used for the STC zone. */
  postcode: string;
  bom: {
    station: string;
    stationId: string;
    julyMeanMin: number;
    janMeanMax: number;
    /** Mean number of days a year with a minimum of 0 °C or below. */
    frostDaysYear: number;
    period: string;
  };
  ncc: { zone: number; name: string; sourceUrl: string; sourceLabel: string };
  intro: string;
  climateNote: string;
  /** Recommended model slugs, best fit first, each with the local reason. */
  picks: { slug: string; why: string }[];
  localTips: string[];
  /** Nearby areas, for copy only. Not a claim that installers cover them. */
  nearby: string[];
};

const NCC_ZONES = "https://www.abcb.gov.au/ncc-navigator/understanding-ncc-climate-zones";
const nccPdf = (s: string) => `https://www.abcb.gov.au/sites/default/files/resources/2022/Climate-zone-map-${s}.pdf`;
export const bomUrl = (id: string) => `https://www.bom.gov.au/climate/averages/tables/cw_${id}.shtml`;
export const CITY_DATA_CHECKED = "2026-10-16";

export const cities: City[] = [
  {
    slug: "brisbane",
    name: "Brisbane",
    state: "QLD",
    postcode: "4000",
    bom: { station: "Brisbane", stationId: "040913", julyMeanMin: 10.6, janMeanMax: 30.4, frostDaysYear: 0, period: "1999–2026" },
    ncc: { zone: 2, name: "warm humid summer, mild winter", sourceUrl: NCC_ZONES, sourceLabel: "ABCB: Understanding NCC climate zones" },
    intro:
      "Brisbane's mild winters are easy work for a heat pump, so you can choose on price, size and noise rather than cold-weather performance.",
    climateNote:
      "With a July mean minimum of 10.6 °C and no frost days on average at the Brisbane station, every system in our range runs well inside its rated operating range all year.",
    picks: [
      { slug: "istore-270", why: "Good value for a family of 3–4, and its −5 °C to 43 °C range is plenty for Brisbane." },
      { slug: "emerald-all-in-one-220", why: "Our lowest guide price, for couples, units and townhouses." },
      { slug: "rheem-ambiheat-270", why: "A big-brand, Australian-made option if local support matters to you." },
    ],
    localTips: [
      "Summer afternoons are hot and humid. A spot with good airflow, out of the full western sun, helps the unit run efficiently.",
      "If you have rooftop solar, a timer can run the heat pump in the middle of the day, when your panels produce most.",
      "There's no current Queensland state rebate we could find, so federal STCs are the main discount. Your installer applies them on your quote.",
    ],
    nearby: ["Ipswich", "Logan", "Moreton Bay", "Redland"],
  },
  {
    slug: "gold-coast",
    name: "Gold Coast",
    state: "QLD",
    postcode: "4217",
    bom: { station: "Gold Coast Seaway", stationId: "040764", julyMeanMin: 12.1, janMeanMax: 28.9, frostDaysYear: 0, period: "1992–2026" },
    ncc: { zone: 2, name: "warm humid summer, mild winter", sourceUrl: nccPdf("qld"), sourceLabel: "ABCB: Queensland climate zone table" },
    intro:
      "The Gold Coast has one of the mildest climates in the country for a heat pump. The things to get right here are placement, coastal conditions and size.",
    climateNote:
      "The Gold Coast Seaway station averages a 12.1 °C minimum in July and no frost days, so cold-weather performance isn't a concern for any model in our range.",
    picks: [
      { slug: "istore-270", why: "Good value for families, and comfortably within its rated range on the coast." },
      { slug: "emerald-all-in-one-220", why: "Compact and our lowest guide price, for apartments, units and smaller homes." },
      { slug: "sanden-eco-plus-315", why: "A quiet split system if the unit has to sit near a bedroom or a neighbour's window." },
    ],
    localTips: [
      "Close to the beach, salt air can affect outdoor equipment. Ask your installer about placement and whether the warranty has coastal installation conditions.",
      "Strata buildings and townhouses may need body corporate approval for a new outdoor unit, so check before you book.",
      "There's no current Queensland state rebate we could find, so federal STCs are the main discount.",
    ],
    nearby: ["Tweed Heads", "Robina", "Southport", "Coomera"],
  },
  {
    slug: "sydney",
    name: "Sydney",
    state: "NSW",
    postcode: "2000",
    bom: { station: "Sydney (Observatory Hill)", stationId: "066062", julyMeanMin: 8.1, janMeanMax: 26.0, frostDaysYear: 0, period: "1859–2020" },
    ncc: { zone: 5, name: "warm temperate", sourceUrl: NCC_ZONES, sourceLabel: "ABCB: Understanding NCC climate zones" },
    intro:
      "Sydney homes can stack federal STCs with the NSW Hot Water Upgrade Incentive, which makes replacing an old electric tank one of the better-value upgrades around.",
    climateNote:
      "Observatory Hill averages an 8.1 °C minimum in July with no frost days. Western Sydney is cooler on winter mornings than the harbour, but still well within the range of every model we list.",
    picks: [
      { slug: "istore-270", why: "Good value for families, and a common choice for electric tank replacements." },
      { slug: "rheem-ambiheat-270", why: "Big-brand, Australian made, with local service support." },
      { slug: "stiebel-eltron-wwk-302", why: "A larger all-in-one for bigger households and homes with two bathrooms." },
    ],
    localTips: [
      "The NSW incentive is given as an upfront discount by participating installers, and the amount is indicative, so ask your installer to show it on your quote.",
      "The official NSW figures are higher when you're replacing an electric water heater (up to $640) than gas (up to $330).",
      "Terraces and tight side passages are common. Measure the space: integrated units need a footprint of around 600 mm or more plus clearance for airflow.",
    ],
    nearby: ["Parramatta", "Penrith", "Sutherland Shire", "Northern Beaches"],
  },
  {
    slug: "melbourne",
    name: "Melbourne",
    state: "VIC",
    postcode: "3000",
    bom: { station: "Melbourne (Olympic Park)", stationId: "086338", julyMeanMin: 7.6, janMeanMax: 26.8, frostDaysYear: 0, period: "2013–2026" },
    ncc: { zone: 6, name: "mild temperate", sourceUrl: NCC_ZONES, sourceLabel: "ABCB: Understanding NCC climate zones" },
    intro:
      "Melbourne has the most generous state rebate in our checker. Eligible households can get up to $1,000 from Solar Victoria on top of federal STCs.",
    climateNote:
      "Olympic Park in the city averages a 7.6 °C minimum in July. Outer and hills suburbs get colder on clear winter mornings, so if you're out that way, consider a model rated to lower temperatures.",
    picks: [
      { slug: "reclaim-energy-co2-315", why: "A CO2 split that runs even at −10 °C, for outer and hills suburbs and quiet spots." },
      { slug: "istore-270", why: "Good value for inner and middle-ring suburbs, rated from −5 °C." },
      { slug: "sanden-eco-plus-315", why: "Premium CO2 split rated from −10 °C, with a 15-year tank warranty (pro rata)." },
    ],
    localTips: [
      "Solar Victoria's rebate is paid to your authorised retailer and taken off your invoice. Check the eligibility rules (owner-occupier, income and property value caps, system age) before you book.",
      "Melbourne postcodes are in STC zone 4, which earns slightly more certificates than zones 1–3 for most models.",
      "Replacing gas? Ask about capping the gas line and whether you can drop the gas connection entirely if nothing else in the home uses it.",
    ],
    nearby: ["Geelong", "Dandenong", "Frankston", "Werribee"],
  },
  {
    slug: "adelaide",
    name: "Adelaide",
    state: "SA",
    postcode: "5000",
    bom: { station: "Adelaide (West Terrace / ngayirdapira)", stationId: "023000", julyMeanMin: 7.6, janMeanMax: 28.7, frostDaysYear: 0, period: "1887–2026" },
    ncc: { zone: 5, name: "warm temperate", sourceUrl: NCC_ZONES, sourceLabel: "ABCB: Understanding NCC climate zones" },
    intro:
      "Adelaide's hot summers and cool, frost-free city winters suit a heat pump well. The main things to plan for are the summer heat and choosing the right size.",
    climateNote:
      "West Terrace averages a 7.6 °C minimum in July with no frost days, and a 28.7 °C mean maximum in January. The Adelaide Hills are colder than the city, so a cold-climate model is worth considering there.",
    picks: [
      { slug: "istore-270", why: "Good value for families, rated −5 °C to 43 °C." },
      { slug: "rheem-ambiheat-270", why: "Big-brand and Australian made, with a 2.4 kW booster for heavy-use days." },
      { slug: "reclaim-energy-co2-315", why: "A quiet CO2 split for the Hills, rated to run at −10 °C." },
    ],
    localTips: [
      "Check the upper limit as well as the lower one. Most rated ranges in our range top out at 42–43 °C, so on extreme heat days a unit may lean on its backup element if it has one.",
      "We couldn't confirm a current South Australian state program, because the official pages wouldn't load when we checked. Federal STCs still apply.",
      "Put the unit in shade if you can. It helps on hot days and keeps it away from the hottest walls.",
    ],
    nearby: ["Adelaide Hills", "Port Adelaide", "Salisbury", "Onkaparinga"],
  },
  {
    slug: "perth",
    name: "Perth",
    state: "WA",
    postcode: "6000",
    bom: { station: "Perth Metro", stationId: "009225", julyMeanMin: 8.1, janMeanMax: 31.4, frostDaysYear: 0.1, period: "1994–2026" },
    ncc: { zone: 5, name: "warm temperate", sourceUrl: NCC_ZONES, sourceLabel: "ABCB: Understanding NCC climate zones" },
    intro:
      "Perth has lots of sun and mild winters, which makes a heat pump a natural fit, especially paired with rooftop solar.",
    climateNote:
      "Perth Metro averages an 8.1 °C minimum in July, with frost almost unheard of (0.1 days a year on average), and a 31.4 °C mean maximum in January.",
    picks: [
      { slug: "istore-270", why: "Good value for families, rated up to 43 °C for hot summers." },
      { slug: "emerald-all-in-one-220", why: "Our lowest guide price, for smaller homes and units." },
      { slug: "rheem-ambiheat-270", why: "Big-brand and Australian made, with a booster element for heavy-use days." },
    ],
    localTips: [
      "Perth's January heat means the upper operating limit matters. Most rated ranges in our range top out at 42–43 °C, and a backup element covers the hottest days on models that have one.",
      "With solar, run the heat pump on a daytime timer so it uses your own power.",
      "There's no current WA state hot water rebate we could find (Energy Ahead is hardship support), so federal STCs are the main discount.",
    ],
    nearby: ["Joondalup", "Fremantle", "Rockingham", "Armadale"],
  },
  {
    slug: "canberra",
    name: "Canberra",
    state: "ACT",
    postcode: "2600",
    bom: { station: "Canberra Airport", stationId: "070351", julyMeanMin: 0.1, janMeanMax: 30.0, frostDaysYear: 58.8, period: "2008–2026" },
    ncc: { zone: 7, name: "cool temperate", sourceUrl: NCC_ZONES, sourceLabel: "ABCB: Understanding NCC climate zones" },
    intro:
      "Canberra is where model choice matters most. Frosty winter mornings are routine, so pick a system rated for the cold. The upside: Canberra's STC zone 5 earns more certificates than most mainland capitals.",
    climateNote:
      "Canberra Airport averages a July minimum of just 0.1 °C and about 59 days a year at or below 0 °C (16 in July alone). Individual frosty mornings are colder than that average, so we lead with systems rated to −7 °C and below.",
    picks: [
      { slug: "sanden-eco-plus-315", why: "Rated from −10 °C to +42 °C. The CO2 split keeps heating through hard frosts." },
      { slug: "reclaim-energy-co2-315", why: "Runs even at an outside temperature of −10 °C, and quiet at 37 dB." },
      { slug: "emerald-all-in-one-220", why: "The budget pick for smaller homes, rated to −7 °C on the heat pump alone." },
    ],
    localTips: [
      "Canberra postcodes are in STC zone 5, which earns more certificates than zones 1–3 for every model in our range. A 2026 install of the Sanden or Reclaim earns 17 STCs.",
      "Defrost cycles are normal on frosty mornings. A CO2 split or a unit with active defrost copes best.",
      "The ACT Government runs Home Energy Support rebates with a hot water heat pump category. We couldn't confirm the current amount, so check the official page.",
    ],
    nearby: ["Queanbeyan", "Belconnen", "Tuggeranong", "Gungahlin"],
  },
  {
    slug: "hobart",
    name: "Hobart",
    state: "TAS",
    postcode: "7000",
    bom: { station: "Hobart (Ellerslie Road)", stationId: "094029", julyMeanMin: 4.7, janMeanMax: 21.8, frostDaysYear: 1.3, period: "1882–2026" },
    ncc: { zone: 7, name: "cool temperate", sourceUrl: NCC_ZONES, sourceLabel: "ABCB: Understanding NCC climate zones" },
    intro:
      "Hobart's cool climate means your hot water works harder for more of the year, which is exactly where an efficient heat pump earns its keep.",
    climateNote:
      "Ellerslie Road averages a 4.7 °C minimum in July and only a 21.8 °C maximum in January. The city itself sees little frost (about 1 day a year), but winters are long and cool, so a system that stays efficient in cool air matters.",
    picks: [
      { slug: "sanden-eco-plus-315", why: "Rated from −10 °C to +42 °C, with a 15-year tank warranty (pro rata)." },
      { slug: "reclaim-energy-co2-315", why: "A quiet CO2 split that runs even at −10 °C." },
      { slug: "stiebel-eltron-wwk-302", why: "A large all-in-one with active defrost, for bigger households." },
    ],
    localTips: [
      "Hobart postcodes are in STC zone 5, which earns more certificates than zones 1–3 for every model in our range.",
      "If you're in the hills or the Derwent Valley, colder mornings make a CO2 split the safer pick.",
      "We couldn't confirm a current Tasmanian state program, because the official pages wouldn't load when we checked. Federal STCs still apply.",
    ],
    nearby: ["Glenorchy", "Kingston", "Clarence", "Sorell"],
  },
];

export const cityPath = (c: City) => `/heat-pump-hot-water/${c.slug}`;
export const getCity = (slug: string) => cities.find((c) => c.slug === slug);
export const citiesForState = (state: string) => cities.filter((c) => c.state === state);

/** Everything a city page needs, worked out from the shared data. */
export function cityDetails(c: City, year = new Date().getFullYear()) {
  const zone = stcZoneForPostcode(c.postcode) ?? 3;
  const factor = stcFactor(year);
  const priced = models.map((m) => {
    const stcs = stcCount(m.stc.counts, zone, year);
    return { model: m, stcs, stcValue: stcs * STC_PRICE_CAP };
  });
  const picks = c.picks
    .map((p) => ({ model: getModel(p.slug), why: p.why }))
    .filter((p): p is { model: HeatPumpModel; why: string } => !!p.model);
  const counts = priced.map((p) => p.stcs);
  return {
    zone,
    factor,
    year,
    priced,
    picks,
    stcLo: Math.min(...counts),
    stcHi: Math.max(...counts),
    programs: programsFor(c.state),
    note: stateNotes[c.state],
    stateName: stateNames[c.state],
  };
}

export function cityFaqs(c: City): FaqItem[] {
  const d = cityDetails(c);
  const cheapest = [...models].sort((a, b) => a.priceFrom - b.priceFrom)[0];
  const confirmed = d.programs.filter((p) => p.amountConfirmed);
  const stateAnswer = confirmed.length
    ? `Yes. ${confirmed.map((p) => `${p.name}: ${p.amount}`).join(". ")}. Eligibility rules apply, so confirm on the official page. Federal STCs apply on top.`
    : d.programs.length
      ? `${d.programs.map((p) => p.name).join(" and ")} may apply, but we couldn't confirm the current amount on the official page. Federal STCs apply either way.`
      : `${d.note?.text ?? "We couldn't find a current state program."} Federal STCs still apply.`;
  return [
    {
      q: `How much does a heat pump hot water system cost in ${c.name}?`,
      a: `Our guide prices for supply and standard installation, before rebates, start from ${formatAUD(cheapest.priceFrom)} for a ${cheapest.capacityLitres} L all-in-one and go up to ${formatAUD(Math.max(...models.map((m) => m.priceFrom)))} for a premium CO2 split. In ${c.name}, federal STCs could take off up to ${formatAUD(d.stcLo * STC_PRICE_CAP)}–${formatAUD(d.stcHi * STC_PRICE_CAP)} for a ${d.year} install (at the $${STC_PRICE_CAP} Clearing House cap). Your installer confirms the fixed price after a site check.`,
    },
    {
      q: `Is there a heat pump rebate in ${c.name}?`,
      a: `${stateAnswer} We last checked the official pages on ${formatCheckedDate(LAST_CHECKED)}.`,
    },
    {
      q: `How many STCs does a heat pump get in ${c.name}?`,
      a: `Postcode ${c.postcode} is in heat pump zone ${d.zone} on the Clean Energy Regulator's postcode table. For a ${d.year} install (multiplication factor ${d.factor}), the six models in our range earn ${d.stcLo}–${d.stcHi} STCs there, worth up to ${formatAUD(d.stcLo * STC_PRICE_CAP)}–${formatAUD(d.stcHi * STC_PRICE_CAP)} at the $${STC_PRICE_CAP} cap. Installers usually sell at the open-market price, which is lower.`,
    },
    {
      q: `Which heat pump is best for ${c.name}'s climate?`,
      a: `${c.climateNote} Our picks for ${c.name}: ${d.picks.map((p) => p.model.name).join(", ")}. Your installer will confirm what suits your home and usage.`,
    },
    {
      q: `Do you have installers in ${c.name}?`,
      a: `We're a free referral service. Your enquiry goes to one licensed partner installer who covers your postcode, one at a time. Partner coverage in ${c.name} is being confirmed (TBC), so enter your postcode and we'll let you know.`,
    },
  ];
}
