import { z } from "zod";
import { states } from "./site";
import { models } from "./models";

export const currentSystems = [
  { value: "electric", label: "Electric storage tank" },
  { value: "gas-storage", label: "Gas storage tank" },
  { value: "gas-instant", label: "Gas instantaneous" },
  { value: "solar", label: "Solar hot water" },
  { value: "heat-pump", label: "Existing heat pump" },
  { value: "unsure", label: "Not sure" },
] as const;

export const householdSizes = [
  { value: "1-2", label: "1–2 people" },
  { value: "3-4", label: "3–4 people" },
  { value: "5+", label: "5+ people" },
] as const;

export const NO_PREFERENCE = "no-preference";

export const leadSchema = z.object({
  postcode: z.string().regex(/^\d{4}$/, "Enter a 4-digit Australian postcode"),
  state: z.enum(states, { message: "Select your state or territory" }),
  currentSystem: z.enum(currentSystems.map((s) => s.value) as [string, ...string[]], {
    message: "Select your current system",
  }),
  householdSize: z.enum(householdSizes.map((s) => s.value) as [string, ...string[]], {
    message: "Select your household size",
  }),
  preferredModel: z.enum([NO_PREFERENCE, ...models.map((m) => m.slug)] as [string, ...string[]], {
    message: "Choose a model, or 'Help me choose'",
  }),
  name: z.string().trim().min(2, "Enter your name").max(100),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s()-]/g, ""))
    .pipe(z.string().regex(/^(\+?61|0)[2-478]\d{8}$/, "Enter a valid Australian phone number")),
  email: z.string().trim().email("Enter a valid email address").max(200),
  consent: z.literal(true, { message: "Please agree so we can pass your details to an installer" }),
  // Honeypot — real users never see or fill this.
  company: z.string().max(0).optional(),
  source: z.string().max(200).optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

/** Rough state check from postcode ranges, used to warn about likely typos. */
export function stateForPostcode(pc: string): string | null {
  const n = Number(pc);
  if (!/^\d{4}$/.test(pc)) return null;
  if ((n >= 200 && n <= 299) || (n >= 2600 && n <= 2618) || (n >= 2900 && n <= 2920)) return "ACT";
  if (n >= 1000 && n <= 2999) return "NSW";
  if ((n >= 3000 && n <= 3999) || (n >= 8000 && n <= 8999)) return "VIC";
  if ((n >= 4000 && n <= 4999) || (n >= 9000 && n <= 9999)) return "QLD";
  if (n >= 5000 && n <= 5999) return "SA";
  if (n >= 6000 && n <= 6999) return "WA";
  if (n >= 7000 && n <= 7999) return "TAS";
  if (n >= 800 && n <= 999) return "NT";
  return null;
}
