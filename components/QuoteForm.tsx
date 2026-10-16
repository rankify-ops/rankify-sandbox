"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { currentSystems, householdSizes, leadSchema, NO_PREFERENCE, stateForPostcode, submitLead } from "@/lib/lead";
import { formatAUD, models } from "@/lib/models";
import { privacyNote, states, THANKS_KEY } from "@/lib/site";
import { Field, FieldError, fieldA11y, fieldMessage, focusFirstError, Honeypot, inputClass } from "./formFields";
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
  tone = "light",
}: {
  initialModel?: string;
  initialState?: string;
  /** Rebate programs shown in the checker, sent with the lead so the installer knows what to apply. */
  rebatesViewed?: string[];
  /** Colour of the trust signals under the form, to suit the section it sits in. */
  tone?: "light" | "dark";
}) {
  const router = useRouter();
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const validModel = models.some((m) => m.slug === initialModel) ? initialModel! : "";
  const validState = (states as readonly string[]).includes(initialState ?? "") ? initialState! : "";
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>({
    postcode: "",
    state: validState,
    currentSystem: "",
    householdSize: "",
    preferredModel: validModel,
    name: "",
    phone: "",
    email: "",
    consent: false,
    company: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const id = (f: string) => `${uid}-${f}`;

  // Move focus into each new step so keyboard and screen-reader users land in the right place.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    stepRef.current
      ?.querySelector<HTMLElement>('input:not([tabindex="-1"]), select, [role="radio"][tabindex="0"]')
      ?.focus({ preventScroll: true });
    stepRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [step]);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  /** Show a field's error as soon as the visitor leaves it (only once they've typed something). */
  const blur = (k: keyof Data) => {
    if (data[k] === "") return;
    setErrors((e) => ({ ...e, [k]: fieldMessage(leadSchema, k, data[k]) }));
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
    focusFirstError(formRef.current, fields, stepErrors);
    return Object.keys(stepErrors).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function choose(k: "currentSystem" | "householdSize" | "preferredModel", v: string) {
    set(k, v);
    // Single-choice steps advance on their own for a faster flow.
    window.setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 160);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // Enter on an earlier step moves forward instead of submitting.
    if (step < STEPS.length - 1) return next();
    if (!validateStep(step)) return;
    setStatus("submitting");
    const res = await submitLead({ type: "quote", ...data, rebatesViewed });
    if (!res.ok) {
      if (res.errors) {
        setErrors(res.errors);
        const bad = STEPS.findIndex((s) => s.fields.some((f) => res.errors?.[f]));
        if (bad >= 0 && bad !== step) setStep(bad);
      }
      setStatus("error");
      return;
    }
    try {
      sessionStorage.setItem(THANKS_KEY, JSON.stringify({ firstName: data.name.trim().split(/\s+/)[0] }));
    } catch {}
    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "lead_submitted", lead_type: "quote", state: data.state });
    router.push(`/thank-you?type=quote&state=${data.state}`);
  }

  const last = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;
  const suggestedState = stateForPostcode(data.postcode);
  const recommended = recommendFor[data.householdSize] ?? [];
  const headingId = id("step-title");

  return (
    <div>
      <form ref={formRef} onSubmit={submit} noValidate className="card overflow-hidden" aria-label="Quote request">
        <div className="border-b border-ink-200/70 px-5 py-4 sm:px-8 sm:py-5">
          <div className="flex items-center justify-between text-xs font-medium text-ink-500">
            <span aria-live="polite">Step {step + 1} of {STEPS.length}</span>
            <span>About 2 minutes</span>
          </div>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream-200"
            role="progressbar"
            aria-label="Quote form progress"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
          >
            <div className="h-full rounded-full bg-gradient-to-r from-ember-400 to-ember-600 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div ref={stepRef} className="scroll-mt-24 px-5 py-7 sm:px-8 sm:py-8">
          <h2 id={headingId} className="h-display text-2xl text-ink-900 sm:text-3xl">{STEPS[step].title}</h2>
          {rebatesViewed && rebatesViewed.length > 0 && step === 0 && (
            <p className="mt-3 rounded-xl bg-gum-50 px-4 py-3 text-sm text-gum-600">
              <strong>Included with your request:</strong> {rebatesViewed.join(" · ")}. Your installer will check what you&apos;re eligible for.
            </p>
          )}

          <Honeypot value={data.company} onChange={(v) => set("company", v)} />

          {step === 0 && (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field id={id("postcode")} label="Postcode" error={errors.postcode}>
                <input
                  {...fieldA11y(id("postcode"), errors.postcode)}
                  data-field="postcode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  enterKeyHint="next"
                  maxLength={4}
                  placeholder="e.g. 4000"
                  value={data.postcode}
                  onBlur={() => blur("postcode")}
                  onChange={(e) => {
                    const pc = e.target.value.replace(/\D/g, "");
                    set("postcode", pc);
                    const s = stateForPostcode(pc);
                    if (pc.length === 4 && s && !data.state) set("state", s);
                  }}
                  className={inputClass(errors.postcode)}
                />
              </Field>
              <Field id={id("state")} label="State or territory" error={errors.state}>
                <select
                  {...fieldA11y(id("state"), errors.state)}
                  data-field="state"
                  value={data.state}
                  onChange={(e) => set("state", e.target.value)}
                  className={inputClass(errors.state)}
                >
                  <option value="">Select…</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              {data.postcode.length === 4 && suggestedState && data.state && suggestedState !== data.state && (
                <p className="text-sm text-amber-800 sm:col-span-2" role="status">
                  Postcode {data.postcode} is usually in {suggestedState}. Please double-check.
                </p>
              )}
            </div>
          )}

          {step === 1 && (
            <Tiles
              name="currentSystem"
              labelledBy={headingId}
              options={currentSystems.map((s) => ({ value: s.value, label: s.label }))}
              value={data.currentSystem}
              onChoose={(v) => choose("currentSystem", v)}
              error={errors.currentSystem}
              errorId={id("currentSystem")}
            />
          )}

          {step === 2 && (
            <Tiles
              name="householdSize"
              labelledBy={headingId}
              cols={3}
              options={householdSizes.map((s) => ({ value: s.value, label: s.label }))}
              value={data.householdSize}
              onChoose={(v) => choose("householdSize", v)}
              error={errors.householdSize}
              errorId={id("householdSize")}
            />
          )}

          {step === 3 && (
            <Tiles
              name="preferredModel"
              labelledBy={headingId}
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
              errorId={id("preferredModel")}
            />
          )}

          {step === 4 && (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field id={id("name")} label="Full name" error={errors.name} className="sm:col-span-2">
                <input
                  {...fieldA11y(id("name"), errors.name)}
                  data-field="name"
                  autoComplete="name"
                  enterKeyHint="next"
                  value={data.name}
                  onBlur={() => blur("name")}
                  onChange={(e) => set("name", e.target.value)}
                  className={inputClass(errors.name)}
                />
              </Field>
              <Field id={id("phone")} label="Mobile or phone" error={errors.phone} hint="So your installer can confirm details">
                <input
                  {...fieldA11y(id("phone"), errors.phone, true)}
                  data-field="phone"
                  type="tel"
                  autoComplete="tel"
                  enterKeyHint="next"
                  placeholder="04xx xxx xxx"
                  value={data.phone}
                  onBlur={() => blur("phone")}
                  onChange={(e) => set("phone", e.target.value)}
                  className={inputClass(errors.phone)}
                />
              </Field>
              <Field id={id("email")} label="Email" error={errors.email} hint="We'll send your quote summary here">
                <input
                  {...fieldA11y(id("email"), errors.email, true)}
                  data-field="email"
                  type="email"
                  autoComplete="email"
                  enterKeyHint="send"
                  value={data.email}
                  onBlur={() => blur("email")}
                  onChange={(e) => set("email", e.target.value)}
                  className={inputClass(errors.email)}
                />
              </Field>
              <div className="sm:col-span-2">
                <label
                  htmlFor={id("consent")}
                  className={`flex cursor-pointer gap-3 rounded-2xl border p-4 text-sm leading-relaxed ${errors.consent ? "border-red-500 bg-red-50/60" : "border-ink-200 bg-cream-50"}`}
                >
                  <input
                    {...fieldA11y(id("consent"), errors.consent)}
                    data-field="consent"
                    type="checkbox"
                    checked={data.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 accent-ember-600"
                  />
                  <span className="text-ink-700">
                    I agree that Aussie Heat Pumps can share my details with a licensed partner installer in my area, who may
                    contact me by phone, SMS or email about this quote. I&apos;ve read the{" "}
                    <Link href="/privacy" target="_blank" className="font-semibold underline">Privacy Policy</Link> and understand
                    Aussie Heat Pumps may receive a referral fee (<Link href="/about" target="_blank" className="underline">how our referrals work</Link>).
                  </span>
                </label>
                <FieldError id={id("consent")} error={errors.consent} />
              </div>
            </div>
          )}

          {last && (
            <p className="mt-5 flex gap-2 text-xs leading-relaxed text-ink-500">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {privacyNote}
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              We couldn&apos;t send your request. Please check the highlighted fields and try again, or give us a call.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-ink-200/70 bg-cream-50 px-5 py-4 sm:px-8 sm:py-5">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="btn px-3 text-ink-600 hover:text-ink-900">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <span className="hidden items-center gap-1.5 text-xs font-medium text-ink-600 sm:flex">
              <Check className="h-4 w-4 text-gum-500" /> Free &amp; no obligation
            </span>
          )}
          {last ? (
            <button type="submit" disabled={status === "submitting"} className="btn-primary ml-auto px-7">
              {status === "submitting" ? "Sending…" : "Get my free quote"} <Arrow className="h-4 w-4" />
            </button>
          ) : (
            <button type="submit" className="btn-primary ml-auto">
              Continue <Arrow className="h-4 w-4" />
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

type TileOption = { value: string; label: string; hint?: string; badge?: string; tbc?: boolean };

/** Single-choice tiles with proper radiogroup keyboard support (arrow keys move, Enter/Space chooses). */
function Tiles({
  name,
  labelledBy,
  options,
  value,
  onChoose,
  error,
  errorId,
  cols = 2,
}: {
  name: string;
  labelledBy: string;
  options: TileOption[];
  value: string;
  onChoose: (v: string) => void;
  error?: string;
  errorId: string;
  cols?: 2 | 3;
}) {
  const focusIndex = Math.max(0, options.findIndex((o) => o.value === value));

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const radios = [...e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')];
    const i = radios.indexOf(document.activeElement as HTMLElement);
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    radios[(i + dir + radios.length) % radios.length]?.focus();
  }

  return (
    <div className="mt-6">
      <div
        className={`grid gap-3 ${cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
        role="radiogroup"
        aria-labelledby={labelledBy}
        aria-describedby={error ? `${errorId}-error` : undefined}
        aria-invalid={error ? true : undefined}
        onKeyDown={onKeyDown}
      >
        {options.map((o, i) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={i === focusIndex ? 0 : -1}
              data-field={i === focusIndex ? name : undefined}
              onClick={() => onChoose(o.value)}
              className={`group flex min-h-14 items-start justify-between gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                active ? "border-ember-600 bg-ember-500/5" : error ? "border-red-300 bg-white" : "border-ink-200/80 bg-white hover:border-ink-500"
              }`}
            >
              <span>
                <span className="flex flex-wrap items-center gap-2 font-semibold text-ink-900">
                  {o.label}
                  {o.badge && <span className="rounded-full bg-gum-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-gum-600 uppercase">{o.badge}</span>}
                </span>
                {o.hint && (
                  <span className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-ink-600">
                    {o.hint} {o.tbc && <TbcBadge />}
                  </span>
                )}
              </span>
              <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${active ? "border-ember-600 bg-ember-600 text-white" : "border-ink-200"}`}>
                {active && <Check className="h-3 w-3" />}
              </span>
            </button>
          );
        })}
      </div>
      <FieldError id={errorId} error={error} />
    </div>
  );
}
