import { stateForPostcode } from "./lead";
import { models, type HeatPumpModel } from "./models";
import { programsFor } from "./rebates";
import { STC_PRICE_CAP, stcCount, stcZoneForPostcode } from "./stc";

/**
 * "Which heat pump suits my home?" quiz. Pure scoring over our six models, using only
 * spec-sheet facts (tank size, lowest rated operating temperature, rated noise) and guide
 * prices, so every recommendation can be explained in one line.
 */
export const QUIZ_PATH = "/heat-pump-quiz";

export const placements = [
  { value: "near-bedrooms", label: "Near bedrooms or a neighbour", hint: "Quiet matters" },
  { value: "open", label: "Outside, away from bedrooms", hint: "Plenty of space and airflow" },
  { value: "tight", label: "A tight or narrow spot", hint: "Side passage, small courtyard" },
  { value: "unsure", label: "Not sure yet", hint: "Your installer will help" },
] as const;

export const budgets = [
  { value: "lowest", label: "Lowest upfront price" },
  { value: "value", label: "Best value for money" },
  { value: "premium", label: "Premium, longest warranty" },
  { value: "unsure", label: "Not sure" },
] as const;

export type QuizAnswers = {
  householdSize: string;
  currentSystem: string;
  postcode: string;
  placement: string;
  budget: string;
};

export type QuizPick = {
  model: HeatPumpModel;
  reasons: string[];
  stcs: number;
  stcValue: number;
  afterStcs: number;
};

/** Tank sizes that suit each household (from the models' own "suits" ranges). */
const fitsHousehold = (m: HeatPumpModel, size: string) =>
  size === "1-2" ? m.capacityLitres <= 270 : size === "3-4" ? m.capacityLitres >= 270 : m.capacityLitres >= 300;
/** Smaller homes can still go bigger when cold or quiet matters most (with a small penalty). */
const allowedFor = (m: HeatPumpModel, size: string) => fitsHousehold(m, size) || size === "1-2";

export function recommend(a: QuizAnswers, year = new Date().getFullYear()) {
  const zone = stcZoneForPostcode(a.postcode);
  const state = stateForPostcode(a.postcode);
  // CER heat pump zones 4 and 5 cover the cooler south (zone 4 e.g. Melbourne; zone 5 e.g.
  // Canberra, Hobart, Ballarat). Zone 5 weighs cold-weather rating most.
  const cool = zone !== null && zone >= 4;
  const coldWeight = zone === 5 ? 3 : zone === 4 ? 1 : 0;
  const pool = models.filter((m) => allowedFor(m, a.householdSize));
  const byPrice = [...pool].filter((m) => fitsHousehold(m, a.householdSize)).sort((x, y) => x.priceFrom - y.priceFrom);

  const scored = pool.map((m) => {
    let score = 0;
    const oversize = !fitsHousehold(m, a.householdSize);
    const reasons: string[] = [
      oversize ? `${m.capacityLitres} L: more than a 1–2 person home needs, but the best fit for cold or quiet` : `${m.capacityLitres} L tank, suits ${m.households}`,
    ];
    if (oversize) score -= 2;
    if (coldWeight) {
      if (m.minOperatingC <= -10) {
        score += coldWeight;
        reasons.push(`Rated to ${fmtC(m.minOperatingC)}, the lowest in our range, for your cooler zone`);
      } else if (m.minOperatingC <= -7) score += 1;
    }
    if (a.placement === "near-bedrooms") {
      if (m.noiseDb <= 37) {
        score += 3;
        reasons.push(`${m.noiseDb} dB at 1 m, the quietest in our range`);
      } else if (m.noiseDb <= 45) score += 1;
    }
    if (a.placement === "tight" && m.type === "Split") {
      score += 1;
      reasons.push("Split system: the outdoor unit and tank can go in different spots");
    }
    const rank = byPrice.indexOf(m);
    if ((a.budget === "lowest" || a.budget === "unsure") && rank >= 0) {
      score += Math.max(0, (a.budget === "lowest" ? 3 : 1) - rank);
      if (rank === 0) reasons.push("Lowest guide price for your household size");
    }
    if (a.budget === "value" && rank >= 0 && rank <= 1) {
      score += 2;
      reasons.push("Among the two lowest guide prices for your household size");
    }
    if (a.budget === "premium" && /15 yrs/.test(m.compare.warranty)) {
      score += 3;
      reasons.push(`Warranty: ${m.compare.warranty}`);
    }
    if (reasons.length < 2) reasons.push(`Rated from ${fmtC(m.minOperatingC)}, ${m.compare.noise}`);
    const stcs = zone ? stcCount(m.stc.counts, zone, year) : 0;
    return { m, score, reasons, stcs };
  });

  scored.sort((x, y) => y.score - x.score || x.m.priceFrom - y.m.priceFrom);
  const top = scored.slice(0, scored.length > 1 && scored[0].score - scored[1].score <= 2 ? 2 : 1);
  const picks: QuizPick[] = top.map(({ m, reasons, stcs }) => ({
    model: m,
    reasons: reasons.slice(0, 3),
    stcs,
    stcValue: stcs * STC_PRICE_CAP,
    afterStcs: m.priceFrom - stcs * STC_PRICE_CAP,
  }));
  const statePrograms = state ? programsFor(state).filter((p) => p.amountConfirmed) : [];
  return { picks, zone, state, cool, statePrograms };
}

const fmtC = (c: number) => `${String(c).replace("-", "−")} °C`;
