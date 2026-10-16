/**
 * Federal STC estimate, built only from Clean Energy Regulator (CER) sources:
 *
 * - Postcode → zone: "Postcode zones for air source heat pumps and solar water heaters",
 *   Version 3, 1 January 2020, Table 1 (air source heat pumps, 5 zones).
 *   https://cer.gov.au/document/postcode-zones-solar-water-heaters-and-heat-pumps
 * - Certificates per model and zone: the CER register of air source heat pump models
 *   (page last updated 10 August 2026). The register lists STCs for a 10-year deeming period.
 *   https://cer.gov.au/document/air-source-heat-pump-models
 * - Multiplication factor by installation year (deeming period: 2026 = 5 years → 0.5), and
 *   "rounded down to the nearest whole number": CER, Calculate small-scale technology
 *   certificate entitlements (last updated 18 September 2026).
 * - Price: the STC Clearing House price is capped at $40 excluding GST (CER, Buy and sell STCs,
 *   last updated 14 September 2026). Open-market prices vary daily and are usually what
 *   installers get, so the dollar figure is an upper estimate.
 */

export const STC_SOURCES = {
  zones: {
    label: "CER: Postcode zones for air source heat pumps (Version 3, 1 January 2020)",
    url: "https://cer.gov.au/document/postcode-zones-solar-water-heaters-and-heat-pumps",
  },
  register: {
    label: "CER: Register of air source heat pump models (updated 10 August 2026)",
    url: "https://cer.gov.au/schemes/renewable-energy-target/small-scale-renewable-energy-scheme/small-scale-renewable-energy-systems/solar-water-heaters/register-solar-water-heaters",
  },
  method: {
    label: "CER: Calculate STC entitlements (updated 18 September 2026)",
    url: "https://cer.gov.au/schemes/renewable-energy-target/small-scale-renewable-energy-scheme/small-scale-technology-certificates/calculate-small-scale-technology-certificate-entitlements",
  },
  price: {
    label: "CER: Buy and sell STCs, Clearing House capped at $40 ex GST (updated 14 September 2026)",
    url: "https://cer.gov.au/schemes/renewable-energy-target/small-scale-renewable-energy-scheme/small-scale-technology-certificates/buy-and-sell-small-scale-technology-certificates",
  },
};

/** STC Clearing House price cap, excluding GST. */
export const STC_PRICE_CAP = 40;

/** [postcode from, postcode to, zone] for air source heat pumps (CER Table 1). */
const ASHP_ZONES: [number, number, number][] = [
  [800, 854, 1],
  [860, 860, 2],
  [862, 862, 1],
  [870, 875, 2],
  [880, 886, 1],
  [2000, 2347, 3],
  [2350, 2350, 5],
  [2352, 2361, 3],
  [2365, 2369, 5],
  [2370, 2579, 3],
  [2580, 2581, 5],
  [2582, 2582, 3],
  [2583, 2583, 5],
  [2584, 2594, 3],
  [2600, 2617, 5],
  [2618, 2618, 3],
  [2619, 2633, 5],
  [2640, 2648, 3],
  [2649, 2649, 5],
  [2650, 2652, 3],
  [2653, 2653, 5],
  [2655, 2717, 3],
  [2720, 2720, 5],
  [2721, 2727, 3],
  [2729, 2730, 5],
  [2731, 2786, 3],
  [2787, 2792, 5],
  [2793, 2794, 3],
  [2795, 2800, 5],
  [2803, 2844, 3],
  [2845, 2847, 5],
  [2848, 2898, 3],
  [2900, 2914, 5],
  [3000, 3115, 4],
  [3116, 3116, 5],
  [3121, 3136, 4],
  [3137, 3140, 5],
  [3141, 3156, 4],
  [3158, 3160, 5],
  [3161, 3287, 4],
  [3289, 3289, 5],
  [3292, 3292, 4],
  [3293, 3301, 5],
  [3302, 3312, 4],
  [3314, 3315, 5],
  [3317, 3345, 4],
  [3350, 3350, 5],
  [3351, 3351, 4],
  [3352, 3358, 5],
  [3360, 3361, 4],
  [3363, 3370, 5],
  [3371, 3371, 4],
  [3373, 3373, 5],
  [3374, 3374, 4],
  [3375, 3379, 5],
  [3380, 3381, 4],
  [3384, 3384, 3],
  [3385, 3387, 4],
  [3388, 3396, 3],
  [3400, 3401, 4],
  [3407, 3407, 5],
  [3409, 3413, 4],
  [3414, 3424, 3],
  [3427, 3429, 4],
  [3430, 3463, 5],
  [3464, 3465, 3],
  [3467, 3469, 5],
  [3472, 3520, 3],
  [3521, 3522, 4],
  [3523, 3649, 3],
  [3658, 3658, 4],
  [3659, 3673, 3],
  [3675, 3678, 5],
  [3682, 3695, 3],
  [3697, 3723, 5],
  [3725, 3730, 3],
  [3732, 3746, 5],
  [3747, 3749, 3],
  [3750, 3762, 4],
  [3763, 3763, 5],
  [3764, 3764, 4],
  [3765, 3779, 5],
  [3781, 3783, 4],
  [3785, 3799, 5],
  [3802, 3815, 4],
  [3816, 3824, 5],
  [3825, 3825, 4],
  [3831, 3835, 5],
  [3840, 3892, 4],
  [3893, 3900, 5],
  [3902, 3996, 4],
  [4000, 4419, 3],
  [4420, 4420, 1],
  [4421, 4428, 3],
  [4454, 4454, 1],
  [4455, 4465, 3],
  [4467, 4468, 1],
  [4470, 4474, 2],
  [4477, 4477, 1],
  [4478, 4482, 2],
  [4486, 4488, 3],
  [4489, 4493, 2],
  [4494, 4615, 3],
  [4620, 4724, 1],
  [4725, 4725, 2],
  [4726, 4726, 1],
  [4727, 4731, 2],
  [4732, 4735, 1],
  [4736, 4736, 2],
  [4737, 4824, 1],
  [4825, 4830, 2],
  [4849, 4895, 1],
  [5000, 5214, 3],
  [5220, 5223, 4],
  [5231, 5261, 3],
  [5262, 5263, 4],
  [5264, 5270, 3],
  [5271, 5291, 4],
  [5301, 6256, 3],
  [6258, 6262, 4],
  [6271, 6317, 3],
  [6318, 6338, 4],
  [6341, 6341, 3],
  [6343, 6348, 4],
  [6350, 6353, 3],
  [6355, 6357, 4],
  [6358, 6395, 3],
  [6396, 6398, 4],
  [6401, 6438, 3],
  [6440, 6440, 2],
  [6442, 6443, 3],
  [6445, 6452, 4],
  [6460, 6640, 3],
  [6642, 6725, 2],
  [6726, 6743, 1],
  [6751, 6799, 2],
  [7000, 7470, 5],
];

export function stcZoneForPostcode(postcode: string): number | null {
  if (!/^\d{4}$/.test(postcode)) return null;
  const n = Number(postcode);
  const row = ASHP_ZONES.find(([from, to]) => n >= from && n <= to);
  return row ? row[2] : null;
}

/** CER multiplication factor by installation year: 2021 = 1.0 … 2030 = 0.1; 0 after the scheme ends. */
export function stcFactor(year: number) {
  if (year <= 2021) return 1;
  if (year > 2030) return 0;
  return Math.round((10 - (year - 2021)) ) / 10;
}

/** Certificates for one model: register count (10-year) × factor, rounded down (CER method). */
export function stcCount(registerCounts: readonly number[], zone: number, year: number) {
  const base = registerCounts[zone - 1];
  return Number.isFinite(base) ? Math.floor(base * stcFactor(year)) : 0;
}
