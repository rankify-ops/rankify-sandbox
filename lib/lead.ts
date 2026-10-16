import { z } from "zod";
import { states } from "./site";
import { models } from "./models";

/** What the visitor needs. `failed` flags an urgent job for the installer. */
export const needs = [
  { value: "replace", label: "Replace my current system", hint: "It works, but I want lower bills" },
  { value: "failed", label: "My hot water has stopped", hint: "Urgent: I need it sorted fast" },
  { value: "new", label: "New build or renovation", hint: "No system there yet" },
  { value: "prices", label: "Just comparing prices", hint: "No commitment" },
] as const;

export const currentSystems = [
  { value: "electric", label: "Electric tank" },
  { value: "gas", label: "Gas" },
  { value: "solar", label: "Solar" },
  { value: "heat-pump", label: "Heat pump" },
  { value: "unsure", label: "Not sure" },
] as const;

export const householdSizes = [
  { value: "1-2", label: "1–2 people" },
  { value: "3-4", label: "3–4 people" },
  { value: "5+", label: "5+ people" },
] as const;

export const bestTimes = [
  { value: "asap", label: "As soon as possible" },
  { value: "morning", label: "Morning (8am–12pm)" },
  { value: "afternoon", label: "Afternoon (12pm–5pm)" },
  { value: "evening", label: "Evening (5pm–7pm)" },
] as const;

export const NO_PREFERENCE = "no-preference";

const phoneField = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s()-]/g, ""))
  .pipe(z.string().regex(/^(\+?61|0)[2-478]\d{8}$/, "Enter a valid Australian phone number"));
const postcodeField = z.string().regex(/^\d{4}$/, "Enter a 4-digit Australian postcode");
const nameField = z.string().trim().min(2, "Enter your name").max(100);
/** Name of the hidden anti-spam field on every lead form. */
export const HONEYPOT_FIELD = "company";
const honeypot = z.string().max(0).optional();
const source = z.string().max(300).optional();

const options = <T extends readonly { value: string }[]>(list: T) => list.map((o) => o.value) as [string, ...string[]];

/** The 60-second quote form. Order matches the form: need → system → household → postcode → contact. */
export const leadSchema = z.object({
  type: z.literal("quote").default("quote"),
  need: z.enum(options(needs), { message: "Choose what you need" }),
  postcode: postcodeField,
  state: z.enum(states, { message: "Select your state or territory" }),
  currentSystem: z.enum(options(currentSystems), { message: "Choose your current system" }),
  householdSize: z.enum(options(householdSizes), { message: "Choose your household size" }),
  // Set from context (e.g. the model page the visitor came from); not a form step.
  preferredModel: z
    .enum([NO_PREFERENCE, ...models.map((m) => m.slug)] as [string, ...string[]])
    .default(NO_PREFERENCE),
  name: nameField,
  phone: phoneField,
  // Optional to keep the form fast; phone is the primary contact.
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email, or leave it blank").max(200)]).default(""),
  consent: z.literal(true, { message: "Please agree so we can pass your details to an installer" }),
  // Rebate programs the visitor was shown in the rebate checker, if they came from there.
  rebatesViewed: z.array(z.string().max(120)).max(10).optional(),
  // Honeypot — real users never see or fill this.
  company: honeypot,
  source,
});

export const callbackSchema = z.object({
  type: z.literal("callback"),
  name: nameField,
  phone: phoneField,
  postcode: postcodeField,
  bestTime: z.enum(bestTimes.map((t) => t.value) as [string, ...string[]], { message: "Pick a time that suits" }),
  consent: z.literal(true, { message: "Please agree so an installer can call you" }),
  company: honeypot,
  source,
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
export type CallbackInput = z.input<typeof callbackSchema>;

/** Field → first error message, for showing inline errors. */
export function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}

/** Shared client-side submit used by every lead form. */
export async function submitLead(payload: object): Promise<{ ok: true } | { ok: false; errors?: Record<string, string> }> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, source: window.location.pathname + window.location.search }),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    return { ok: false, errors: body?.errors };
  } catch {
    return { ok: false };
  }
}

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
