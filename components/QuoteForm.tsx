"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { currentSystems, householdSizes, leadSchema, NO_PREFERENCE, stateForPostcode, submitLead } from "@/lib/lead";
import { formatAUD, models } from "@/lib/models";
import { privacyNote, states, THANKS_KEY } from "@/lib/site";
import { FormTrust } from "./FormTrust";
import { ArrowLeft, Arrow, Check, Lock } from "./icons";
import { TbcBadge } from "./ui";

type Data = {
  postcode: string;
  state: string;
  currentSystem: string;
  householdSize: string;
  preferredModel: string;
  name: string;
  phone: string;
  email: string;
  consent: boolean;
  company: string;
};

const STEPS = [
  { key: "location", title: "Where's the install?", fields: ["postcode", "state"] },
  { key: "system", title: "What heats your water now?", fields: ["currentSystem"] },
  { key: "household", title: "How many people live there?", fields: ["householdSize"] },
  { key: "model", title: "Got a model in mind?", fields: ["preferredModel"] },
  { key: "contact", title: "Where should we send your quote?", fields: ["name", "phone", "email", "consent"] },
] as const;

const recommendFor: Record<string, string[]> = {
  "1-2": ["compact-180", "everyday-220"],
  "3-4": ["family-270", "split-250"],
  "5+": ["family-plus-315", "cold-climate-300"],
};

export function QuoteForm({
  initialModel,
  initialState,
  rebatesViewed,
  title,
  tone = "light",
}: {
  initialModel?: string;
  initialState?: string;
  /** Rebate programs shown in the checker, sent with the lead so the installer knows what to apply. */
  rebatesViewed?: string[];
  title?: string;
  /** Colour of the trust signals under the form, to suit the section it sits in. */
  tone?: "light" | "dark";
}) {
  const router = useRouter();
  const validInitial = models.some((m) => m.slug === initialModel) ? initialModel! : "";
  const validState = (states as readonly string[]).includes(initialState ?? "") ? initialState! : "";
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>({
    postcode: "",
    state: validState,
    currentSystem: "",
    householdSize: "",
    preferredModel: validInitial,
    name: "",
    phone: "",
    email: "",
    consent: false,
    company: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  function validateStep(i: number) {
    const result = leadSchema.safeParse(data);
    const fields: readonly string[] = STEPS[i].fields;
    const stepErrors: Record<string, string> = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const f = String(issue.path[0]);
        if (fields.includes(f) && !stepErrors[f]) stepErrors[f] = issue.message;
      }
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function choose<K extends "currentSystem" | "householdSize" | "preferredModel">(k: K, v: string) {
    set(k, v);
    // Single-choice steps advance on their own for a faster flow.
    setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 180);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(step)) return;
    setStatus("submitting");
    const res = await submitLead({ type: "quote", ...data, rebatesViewed });
    if (!res.ok) {
      if (res.errors) setErrors(res.errors);
      setStatus("error");
      return;
    }
    try {
      sessionStorage.setItem(THANKS_KEY, JSON.stringify({ firstName: data.name.trim().split(/\s+/)[0], postcode: data.postcode }));
    } catch {}
    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "lead_submitted", lead_type: "quote", state: data.state });
    router.push(`/thank-you?type=quote&state=${data.state}`);
  }

  const progress = ((step + 1) / STEPS.length) * 100;
  const suggestedState = stateForPostcode(data.postcode);
  const recommended = recommendFor[data.householdSize] ?? [];

  return (
    <div>
    <form onSubmit={submit} noValidate className="card overflow-hidden" aria-label="Quote request">
      <div className="border-b border-ink-200/70 px-6 py-5 sm:px-8">
        <div className="flex items-center justify-between text-xs font-medium text-ink-400">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>About 2 minutes</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream-200" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length}>
          <div className="h-full rounded-full bg-gradient-to-r from-ember-400 to-ember-600 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="px-6 py-8 sm:px-8">
        {title && step === 0 && <p className="mb-2 text-sm font-semibold text-ember-600">{title}</p>}
        <h2 className="h-display text-2xl text-ink-900 sm:text-3xl">{STEPS[step].title}</h2>
        {rebatesViewed && rebatesViewed.length > 0 && step === 0 && (
          <p className="mt-3 rounded-xl bg-gum-50 px-4 py-3 text-sm text-gum-600">
            <strong>Included with your request:</strong> {rebatesViewed.join(" · ")}. Your installer will check what you&apos;re eligible for.
          </p>
        )}

        {/* Honeypot */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>Company<input tabIndex={-1} autoComplete="off" value={data.company} onChange={(e) => set("company", e.target.value)} /></label>
        </div>

        {step === 0 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Postcode" error={errors.postcode}>
              <input
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={4}
                placeholder="e.g. 4000"
                value={data.postcode}
                onChange={(e) => {
                  const pc = e.target.value.replace(/\D/g, "");
                  set("postcode", pc);
                  const s = stateForPostcode(pc);
                  if (pc.length === 4 && s && !data.state) set("state", s);
                }}
                className={inputCls(errors.postcode)}
              />
            </Field>
            <Field label="State or territory" error={errors.state}>
              <select value={data.state} onChange={(e) => set("state", e.target.value)} className={inputCls(errors.state)}>
                <option value="">Select…</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            {data.postcode.length === 4 && suggestedState && data.state && suggestedState !== data.state && (
              <p className="text-sm text-amber-700 sm:col-span-2">
                Postcode {data.postcode} is usually in {suggestedState}. Please double-check.
              </p>
            )}
          </div>
        )}

        {step === 1 && (
          <Tiles
            options={currentSystems.map((s) => ({ value: s.value, label: s.label }))}
            value={data.currentSystem}
            onChoose={(v) => choose("currentSystem", v)}
            error={errors.currentSystem}
          />
        )}

        {step === 2 && (
          <Tiles
            cols={3}
            options={householdSizes.map((s) => ({ value: s.value, label: s.label }))}
            value={data.householdSize}
            onChoose={(v) => choose("householdSize", v)}
            error={errors.householdSize}
          />
        )}

        {step === 3 && (
          <Tiles
            options={[
              { value: NO_PREFERENCE, label: "Help me choose", hint: "Your installer will recommend the right size" },
              ...models.map((m) => ({
                value: m.slug,
                label: m.name,
                hint: `${m.households} · from ${formatAUD(m.priceFrom)}`,
                badge: recommended.includes(m.slug) ? "Good fit" : undefined,
                tbc: !m.verified,
              })),
            ]}
            value={data.preferredModel}
            onChoose={(v) => choose("preferredModel", v)}
            error={errors.preferredModel}
          />
        )}

        {step === 4 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Full name" error={errors.name} className="sm:col-span-2">
              <input autoComplete="name" value={data.name} onChange={(e) => set("name", e.target.value)} className={inputCls(errors.name)} />
            </Field>
            <Field label="Mobile or phone" error={errors.phone}>
              <input type="tel" autoComplete="tel" placeholder="04xx xxx xxx" value={data.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls(errors.phone)} />
            </Field>
            <Field label="Email" error={errors.email}>
              <input type="email" autoComplete="email" value={data.email} onChange={(e) => set("email", e.target.value)} className={inputCls(errors.email)} />
            </Field>
            <div className="sm:col-span-2">
              <label className={`flex cursor-pointer gap-3 rounded-2xl border p-4 text-sm leading-relaxed ${errors.consent ? "border-red-400 bg-red-50/50" : "border-ink-200 bg-cream-50"}`}>
                <input
                  type="checkbox"
                  checked={data.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-ember-500"
                />
                <span className="text-ink-700">
                  I agree that Aussie Heat Pumps can share my details with a licensed partner installer in my area, who may
                  contact me by phone, SMS or email about this quote. I&apos;ve read the{" "}
                  <Link href="/privacy" target="_blank" className="font-semibold underline">Privacy Policy</Link> and understand
                  Aussie Heat Pumps may receive a referral fee (<Link href="/about" target="_blank" className="underline">how this works</Link>).
                </span>
              </label>
              {errors.consent && <p className="mt-2 text-sm text-red-600">{errors.consent}</p>}
            </div>
          </div>
        )}

        {step === STEPS.length - 1 && (
          <p className="mt-5 flex gap-2 text-xs leading-relaxed text-ink-400">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {privacyNote}
          </p>
        )}
        {status === "error" && (
          <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            Something went wrong sending your request. Please check your details and try again, or give us a call.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-ink-200/70 bg-cream-50 px-6 py-5 sm:px-8">
        {step > 0 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="btn px-3 text-ink-600 hover:text-ink-900">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        ) : (
          <span className="hidden items-center gap-1.5 text-xs font-medium text-ink-600 sm:flex">
            <Check className="h-4 w-4 text-gum-500" /> Free &amp; no obligation
          </span>
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className="btn-primary">
            Continue <Arrow className="h-4 w-4" />
          </button>
        ) : (
          <button type="submit" disabled={status === "submitting"} className="btn-primary px-8">
            {status === "submitting" ? "Sending…" : "Get my free quote"} <Arrow className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
    <div className="mt-5 px-1">
      <FormTrust tone={tone} />
    </div>
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full rounded-xl border bg-white px-4 py-3 text-base text-ink-900 outline-none transition focus:border-ember-500 focus:ring-4 focus:ring-ember-500/15 ${
    error ? "border-red-400" : "border-ink-200"
  }`;
}

function Field({ label, error, className = "", children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-ink-800">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-sm text-red-600">{error}</span>}
    </label>
  );
}

type TileOption = { value: string; label: string; hint?: string; badge?: string; tbc?: boolean };

function Tiles({
  options,
  value,
  onChoose,
  error,
  cols = 2,
}: {
  options: TileOption[];
  value: string;
  onChoose: (v: string) => void;
  error?: string;
  cols?: 2 | 3;
}) {
  return (
    <div className="mt-6">
      <div className={`grid gap-3 ${cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`} role="radiogroup">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChoose(o.value)}
              className={`group flex items-start justify-between gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                active ? "border-ember-500 bg-ember-500/5" : "border-ink-200/80 bg-white hover:border-ink-400"
              }`}
            >
              <span>
                <span className="flex flex-wrap items-center gap-2 font-semibold text-ink-900">
                  {o.label}
                  {o.badge && <span className="rounded-full bg-gum-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-gum-600 uppercase">{o.badge}</span>}
                </span>
                {o.hint && (
                  <span className="mt-1 flex items-center gap-1.5 text-sm text-ink-600">
                    {o.hint} {o.tbc && <TbcBadge />}
                  </span>
                )}
              </span>
              <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${active ? "border-ember-500 bg-ember-500 text-white" : "border-ink-200"}`}>
                {active && <Check className="h-3 w-3" />}
              </span>
            </button>
          );
        })}
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
