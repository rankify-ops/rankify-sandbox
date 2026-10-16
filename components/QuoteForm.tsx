"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { currentSystems, HONEYPOT_FIELD, householdSizes, leadSchema, NO_PREFERENCE, needs, stateForPostcode, submitLead } from "@/lib/lead";
import { formatAuPhone } from "@/lib/phone";
import { getModel } from "@/lib/models";
import { privacyNote, states, THANKS_KEY } from "@/lib/site";
import { Field, FieldError, fieldA11y, fieldMessage, focusFirstError, Honeypot, inputClass } from "./formFields";
import { FormTrust, FormTrustInline } from "./FormTrust";
import { ArrowLeft, Arrow, Check, Clock, Close, Lock } from "./icons";

type Data = {
  need: string;
  currentSystem: string;
  householdSize: string;
  postcode: string;
  state: string;
  preferredModel: string;
  name: string;
  phone: string;
  email: string;
  consent: boolean;
};

/**
 * The 60-second quote form. Postcode and current system first (the easy, low-commitment
 * questions that decide rebates and installer), two one-tap questions, then contact details
 * last. Every step is short, and progress plus time left are always visible.
 */
const STEPS = [
  { key: "postcode", title: "What's your postcode?", why: "So we can check your rebates and match an installer who covers your area.", fields: ["postcode", "state"] },
  { key: "system", title: "What heats your water now?", why: "This decides which rebates you may be eligible for.", fields: ["currentSystem"] },
  { key: "need", title: "What do you need?", why: "So we know how quickly to get an installer to you.", fields: ["need"] },
  { key: "household", title: "How many people live there?", why: "This sets the right tank size for your home.", fields: ["householdSize"] },
  { key: "contact", title: "Where should we send your quote?", why: "Last step. Shared with one licensed local installer at a time.", fields: ["name", "phone", "email", "consent"] },
] as const;
const SECONDS_LEFT = [60, 45, 35, 25, 15];

export function QuoteForm({
  initialModel,
  initialState,
  initialPostcode,
  rebatesViewed,
  tone = "light",
  variant = "card",
  heading = "Free quote in 60 seconds",
  placement = "page",
}: {
  initialModel?: string;
  initialState?: string;
  initialPostcode?: string;
  /** Rebate programs shown in the checker, sent with the lead so the installer knows what to apply. */
  rebatesViewed?: string[];
  /** Colour of the trust signals under the form, to suit the section it sits in. */
  tone?: "light" | "dark";
  /** `card` shows trust signals under the form; `compact` is for the hero, footer and popup. */
  variant?: "card" | "compact";
  heading?: string;
  /** Where the form sits, sent with analytics events (e.g. "home-hero", "popup", "city-brisbane"). */
  placement?: string;
}) {
  const router = useRouter();
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const startedAt = useRef<number | null>(null);
  const prefilled = /^\d{4}$/.test(initialPostcode ?? "") && (states as readonly string[]).includes(initialState ?? "");
  // With postcode and state already known (e.g. from the rebate checker), start on step 2.
  const startStep = prefilled ? 1 : 0;
  const [step, setStep] = useState(startStep);
  const [hp, setHp] = useState("");
  const [data, setData] = useState<Data>({
    need: "",
    currentSystem: "",
    householdSize: "",
    postcode: /^\d{4}$/.test(initialPostcode ?? "") ? initialPostcode! : "",
    state: (states as readonly string[]).includes(initialState ?? "") ? initialState! : "",
    // Resolve legacy slugs (old preview links) to the current model, or no preference.
    preferredModel: getModel(initialModel ?? "")?.slug ?? NO_PREFERENCE,
    name: "",
    phone: "",
    email: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const id = (f: string) => `${uid}-${f}`;
  const compact = variant === "compact";
  const model = getModel(data.preferredModel);

  // Move focus into each new step so keyboard and screen-reader users land in the right place.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    track("form_step", { form: "quote", step: STEPS[step].key, step_number: step + 1, total_steps: STEPS.length, placement });
    stepRef.current
      ?.querySelector<HTMLElement>('input:not([tabindex="-1"]), select, [role="radio"][tabindex="0"]')
      ?.focus({ preventScroll: true });
    formRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once per step change only
  }, [step]);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    if (startedAt.current === null) {
      startedAt.current = Date.now();
      track("form_start", { form: "quote", placement });
    }
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

  function choose(k: "need" | "currentSystem" | "householdSize", v: string) {
    set(k, v);
    // One-tap steps advance on their own.
    window.setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 150);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // Enter on an earlier step moves forward instead of submitting.
    if (step < STEPS.length - 1) return next();
    if (!validateStep(step)) return;
    setStatus("submitting");
    const formMs = startedAt.current === null ? 0 : Date.now() - startedAt.current;
    const res = await submitLead({ type: "quote", ...data, rebatesViewed, [HONEYPOT_FIELD]: hp, formMs });
    if (!res.ok) {
      track("form_submit_error", { form: "quote", placement });
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
    track("form_submit", { form: "quote", placement, state: data.state, need: data.need, ...res.tracking });
    router.push(`/thank-you?type=quote&state=${data.state}`);
  }

  const last = step === STEPS.length - 1;
  const key = STEPS[step].key;
  const progress = ((step + 1) / STEPS.length) * 100;
  const suggestedState = stateForPostcode(data.postcode);
  const headingId = id("step-title");
  const pad = compact ? "px-5 sm:px-6" : "px-5 sm:px-8";

  return (
    <div>
      <form ref={formRef} onSubmit={submit} noValidate className="card relative scroll-mt-24 overflow-hidden text-left" aria-label="Quote request">
        <div className={`border-b border-ink-200/70 py-4 ${pad}`}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-lg font-semibold text-ink-900">{heading}</p>
            <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-ink-500" aria-live="polite">
              <Clock className="h-3.5 w-3.5" /> ~{SECONDS_LEFT[step]}s left
            </span>
          </div>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream-200"
            role="progressbar"
            aria-label={`Quote form progress: step ${step + 1} of ${STEPS.length}`}
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
          >
            <div className="h-full rounded-full bg-gradient-to-r from-ember-400 to-ember-600 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-ink-500">Step {step + 1} of {STEPS.length}</p>
        </div>

        <div ref={stepRef} className={`py-6 ${pad}`}>
          {model && step === startStep && (
            <p className="mb-4 flex items-center justify-between gap-2 rounded-xl bg-cream-100 px-3 py-2 text-sm text-ink-700">
              <span>Quoting on the <strong>{model.name}</strong></span>
              <button type="button" onClick={() => set("preferredModel", NO_PREFERENCE)} className="-my-2 -mr-2 grid h-11 w-11 place-items-center rounded-full hover:bg-cream-200" aria-label="Remove model preference">
                <Close className="h-3.5 w-3.5" />
              </button>
            </p>
          )}
          {rebatesViewed && rebatesViewed.length > 0 && step === startStep && (
            <p className="mb-4 rounded-xl bg-gum-50 px-3 py-2 text-sm text-gum-600">
              <strong>Rebates included:</strong> {rebatesViewed.join(" · ")}
            </p>
          )}
          <h2 id={headingId} className={`h-display text-ink-900 ${compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>{STEPS[step].title}</h2>
          <p className="mt-1 text-sm text-ink-600">{STEPS[step].why}</p>

          <Honeypot value={hp} onChange={setHp} />

          {key === "need" && (
            <Tiles name="need" labelledBy={headingId} options={[...needs]} value={data.need} onChoose={(v) => choose("need", v)} error={errors.need} errorId={id("need")} />
          )}
          {key === "system" && (
            <Tiles
              name="currentSystem"
              labelledBy={headingId}
              cols={compact ? 2 : 3}
              options={[...currentSystems]}
              value={data.currentSystem}
              onChoose={(v) => choose("currentSystem", v)}
              error={errors.currentSystem}
              errorId={id("currentSystem")}
            />
          )}
          {key === "household" && (
            <Tiles
              name="householdSize"
              labelledBy={headingId}
              cols={3}
              options={[...householdSizes]}
              value={data.householdSize}
              onChoose={(v) => choose("householdSize", v)}
              error={errors.householdSize}
              errorId={id("householdSize")}
            />
          )}

          {key === "postcode" && (
            <div className="mt-5 grid grid-cols-[1.3fr_1fr] gap-3">
              <Field id={id("postcode")} label="Postcode" error={errors.postcode}>
                <input
                  {...fieldA11y(id("postcode"), errors.postcode)}
                  data-field="postcode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  enterKeyHint="next"
                  maxLength={4}
                  placeholder="e.g. 3220"
                  value={data.postcode}
                  onBlur={() => blur("postcode")}
                  onChange={(e) => {
                    const pc = e.target.value.replace(/\D/g, "");
                    set("postcode", pc);
                    const s = stateForPostcode(pc);
                    if (pc.length === 4 && s) set("state", s);
                  }}
                  className={inputClass(errors.postcode)}
                />
              </Field>
              <Field id={id("state")} label="State" error={errors.state}>
                <select
                  {...fieldA11y(id("state"), errors.state)}
                  data-field="state"
                  value={data.state}
                  onChange={(e) => set("state", e.target.value)}
                  className={inputClass(errors.state)}
                >
                  <option value="">Select</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              {data.postcode.length === 4 && suggestedState && data.state && suggestedState !== data.state && (
                <p className="col-span-2 text-sm text-amber-800" role="status">
                  Postcode {data.postcode} is usually in {suggestedState}. Please double-check.
                </p>
              )}
            </div>
          )}

          {key === "contact" && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field id={id("name")} label="Name" error={errors.name} className="sm:col-span-2">
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
              <Field id={id("phone")} label="Phone" hint="Mobile or landline" error={errors.phone}>
                <input
                  {...fieldA11y(id("phone"), errors.phone, true)}
                  data-field="phone"
                  type="tel"
                  autoComplete="tel"
                  enterKeyHint="next"
                  placeholder="04xx xxx xxx"
                  value={data.phone}
                  onBlur={() => {
                    blur("phone");
                    setData((d) => ({ ...d, phone: formatAuPhone(d.phone) }));
                  }}
                  onChange={(e) => set("phone", e.target.value)}
                  className={inputClass(errors.phone)}
                />
              </Field>
              <Field id={id("email")} label="Email (optional)" error={errors.email}>
                <input
                  {...fieldA11y(id("email"), errors.email)}
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
                  className={`flex cursor-pointer gap-3 rounded-2xl border p-3 text-xs leading-relaxed ${errors.consent ? "border-red-500 bg-red-50/60" : "border-ink-200 bg-cream-50"}`}
                >
                  <input
                    {...fieldA11y(id("consent"), errors.consent)}
                    data-field="consent"
                    type="checkbox"
                    checked={data.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-ember-600"
                  />
                  <span className="text-ink-700">
                    I agree that Aussie Heat Pumps can send my details to one licensed partner installer in my area, who may
                    contact me by phone, SMS or email about this quote. If they can&apos;t take the job, my details may be offered
                    to another partner installer, one at a time. I understand Aussie Heat Pumps may receive a referral fee (
                    <Link href="/how-it-works" target="_blank" className="underline">how it works</Link>) and I&apos;ve read the{" "}
                    <Link href="/privacy" target="_blank" className="font-semibold underline">Privacy Policy</Link>.
                  </span>
                </label>
                <FieldError id={id("consent")} error={errors.consent} />
              </div>
            </div>
          )}

          {last && (
            <p className="mt-4 flex gap-2 text-xs leading-relaxed text-ink-500">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {privacyNote}
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              We couldn&apos;t send your request. Please check the highlighted fields and try again, or give us a call.
            </p>
          )}
        </div>

        <div className={`flex items-center justify-between gap-3 border-t border-ink-200/70 bg-cream-50 py-4 ${pad}`}>
          {step > 0 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="btn px-2 text-ink-600 hover:text-ink-900">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-medium text-ink-600">
              <Check className="h-4 w-4 text-gum-500" /> Free &amp; no obligation
            </span>
          )}
          {last ? (
            <button type="submit" disabled={status === "submitting"} className="btn-primary ml-auto px-6">
              {status === "submitting" ? "Sending…" : "Get my free quote"} <Arrow className="h-4 w-4" />
            </button>
          ) : key === "postcode" ? (
            <button type="submit" className="btn-primary ml-auto">
              Continue <Arrow className="h-4 w-4" />
            </button>
          ) : (
            <span className="ml-auto text-xs whitespace-nowrap text-ink-500">Tap to continue</span>
          )}
        </div>
      </form>
      {variant === "card" ? (
        <div className="mt-5 px-1">
          <FormTrust tone={tone} />
        </div>
      ) : (
        <FormTrustInline tone={tone} />
      )}
    </div>
  );
}

type TileOption = { value: string; label: string; hint?: string };

/** Single-choice tiles with radiogroup keyboard support (arrow keys move, Enter/Space chooses). */
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
    <div className="mt-5">
      <div
        className={`grid gap-2.5 ${cols === 3 ? "grid-cols-3" : "grid-cols-1 min-[420px]:grid-cols-2"}`}
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
              className={`flex min-h-14 items-center justify-between gap-2 rounded-2xl border-2 px-3.5 py-3 text-left transition-all active:scale-[0.98] ${
                active ? "border-ember-600 bg-ember-500/5" : error ? "border-red-300 bg-white" : "border-ink-200/80 bg-white hover:border-ink-500"
              }`}
            >
              <span>
                <span className="block font-semibold leading-snug text-ink-900">{o.label}</span>
                {o.hint && <span className="mt-0.5 block text-xs text-ink-600">{o.hint}</span>}
              </span>
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${active ? "border-ember-600 bg-ember-600 text-white" : "border-ink-200"}`}>
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
