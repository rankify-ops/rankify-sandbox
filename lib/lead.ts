import * as z from "zod/mini";
import { states, THANKS_KEY } from "./site";
import { models } from "./models";
import { getAttribution, TRACKING_PARAMS } from "./attribution";
import { normaliseAuPhone, phoneError } from "./phone";

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

/** Australian mobile (04) or landline (02, 03, 07, 08), stored as 0412345678. */
const phoneField = z.string({ error: "Enter your phone number" }).check(
  z.overwrite(normaliseAuPhone),
  z.refine((v) => phoneError(v) === null, { error: (iss) => phoneError(String(iss.input)) ?? "Enter a valid Australian phone number" }),
);
const postcodeField = z.string({ error: "Enter a 4-digit Australian postcode" }).check(z.regex(/^\d{4}$/, "Enter a 4-digit Australian postcode"));
const nameField = z.string({ error: "Enter your name" }).check(z.trim(), z.minLength(2, "Enter your name"), z.maxLength(100));
/** Name of the hidden anti-spam field on every lead form. */
// Deliberately not a name browsers autofill (like "company"), so a real visitor's autofill
// can never fill it and get their lead discarded.
export const HONEYPOT_FIELD = "hp_extra_info";
const honeypot = z.optional(z.string().check(z.maxLength(0, "Leave this field blank")));
const source = z.optional(z.string().check(z.maxLength(300)));
const short = z.optional(z.string().check(z.maxLength(300)));
/** UTM parameters, click IDs, landing page and referrer (see lib/attribution.ts). Unknown keys are dropped. */
const attribution = z.optional(
  z.object({
    ...(Object.fromEntries(TRACKING_PARAMS.map((p) => [p, short])) as Record<(typeof TRACKING_PARAMS)[number], typeof short>),
    landingPage: short,
    referrer: short,
    capturedAt: short,
    firstLandingPage: short,
    firstReferrer: short,
    firstCapturedAt: short,
  }),
);
/** Milliseconds from first interaction to submit. Very fast submits are flagged as likely bots. */
const formMs = z.optional(z.number().check(z.int(), z.nonnegative()));

const options = <T extends readonly { value: string }[]>(list: T) => list.map((o) => o.value) as [string, ...string[]];

/*
 * Schemas use zod/mini (same validation as classic zod, much smaller in the browser bundle,
 * where the quote and callback forms validate each step).
 */

/** The 60-second quote form. Order matches the form: postcode → system → need → household → contact. */
export const leadSchema = z.object({
  type: z._default(z.literal("quote", { error: "Invalid lead type" }), "quote"),
  postcode: postcodeField,
  state: z.enum(states, { error: "Select your state or territory" }),
  currentSystem: z.enum(options(currentSystems), { error: "Choose your current system" }),
  need: z.enum(options(needs), { error: "Choose what you need" }),
  householdSize: z.enum(options(householdSizes), { error: "Choose your household size" }),
  // Set from context (e.g. the model page the visitor came from); not a form step.
  preferredModel: z._default(z.enum([NO_PREFERENCE, ...models.map((m) => m.slug)] as [string, ...string[]], { error: "Unknown model" }), NO_PREFERENCE),
  name: nameField,
  phone: phoneField,
  // Optional to keep the form fast; phone is the primary contact.
  email: z._default(
    z.union([
      z.literal(""),
      z.pipe(z.string().check(z.trim()), z.email({ error: "Enter a valid email, or leave it blank" }).check(z.maxLength(200))),
    ]),
    "",
  ),
  consent: z.literal(true, { error: "Please agree so we can pass your details to an installer" }),
  // Rebate programs the visitor was shown in the rebate checker, if they came from there.
  rebatesViewed: z.optional(z.array(z.string().check(z.maxLength(120))).check(z.maxLength(10, "Too many rebate programs"))),
  // Honeypot — real users never see or fill this.
  [HONEYPOT_FIELD]: honeypot,
  source,
  attribution,
  formMs,
});

export const callbackSchema = z.object({
  type: z.literal("callback", { error: "Invalid lead type" }),
  name: nameField,
  phone: phoneField,
  postcode: postcodeField,
  bestTime: z.enum(options(bestTimes), { error: "Pick a time that suits" }),
  consent: z.literal(true, { error: "Please agree so an installer can call you" }),
  [HONEYPOT_FIELD]: honeypot,
  source,
  attribution,
  formMs,
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
export type CallbackInput = z.input<typeof callbackSchema>;

/** Field → first error message, for showing inline errors. */
export function fieldErrors(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}

/** Shared client-side submit used by every lead form. */
export async function submitLead(
  payload: object,
): Promise<{ ok: true; id?: string; tracking: Record<string, string | boolean> } | { ok: false; errors?: Record<string, string> }> {
  const attribution = getAttribution();
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, source: window.location.pathname + window.location.search, attribution }),
    });
    // Campaign details for the analytics event (no personal details).
    const tracking: Record<string, string | boolean> = {
      utm_source: attribution?.utm_source ?? "",
      utm_medium: attribution?.utm_medium ?? "",
      utm_campaign: attribution?.utm_campaign ?? "",
      has_gclid: !!(attribution?.gclid || attribution?.gbraid || attribution?.wbraid),
      has_fbclid: !!attribution?.fbclid,
    };
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: true, id: typeof body?.id === "string" ? body.id : undefined, tracking };
    }
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

/**
 * What the thank-you page needs, kept in sessionStorage for this tab only: the first name
 * for the greeting, and non-personal details for the one-off `lead_confirmed` event.
 */
export type ThanksData = {
  firstName: string;
  leadId?: string;
  leadType: "quote" | "callback";
  placement: string;
  state?: string;
  urgent?: boolean;
  tracking?: Record<string, string | boolean>;
  /** Set once `lead_confirmed` has fired, so a refresh doesn't count the lead twice. */
  confirmed?: boolean;
};

export function saveThanks(t: ThanksData) {
  try {
    sessionStorage.setItem(THANKS_KEY, JSON.stringify(t));
  } catch {}
}
