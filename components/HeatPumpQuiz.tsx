"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { currentSystems, householdSizes, stateForPostcode } from "@/lib/lead";
import { formatAUD } from "@/lib/models";
import { budgets, placements, recommend, type QuizAnswers } from "@/lib/quiz";
import { stateNames, stateRebatePath } from "@/lib/rebates";
import { site } from "@/lib/site";
import { STC_PRICE_CAP } from "@/lib/stc";
import { FieldError, inputClass } from "./formFields";
import { Arrow, ArrowLeft, Check, Clock, Phone } from "./icons";
import { QuoteForm, Tiles } from "./QuoteForm";
import { GuidePriceBadge } from "./ui";

const STEPS = [
  { key: "householdSize", title: "How many people live there?", why: "This sets the tank size." },
  { key: "currentSystem", title: "What heats your water now?", why: "It affects which rebates may apply." },
  { key: "postcode", title: "What's your postcode?", why: "For your climate zone and STC estimate." },
  { key: "placement", title: "Where would the unit go?", why: "Noise and space decide between all-in-one and split." },
  { key: "budget", title: "What matters most on price?", why: "So we pick from the right end of the range." },
] as const;
const SECONDS_LEFT = [60, 50, 40, 25, 10];

const EMPTY: QuizAnswers = { householdSize: "", currentSystem: "", postcode: "", placement: "", budget: "" };

/**
 * "Which heat pump suits my home?" Five quick questions, then 1–2 recommended models with
 * the guide price after STCs, and the quote form prefilled with the answers. Analytics events
 * carry the answers' categories only (never the postcode or any personal details).
 */
export function HeatPumpQuiz() {
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [a, setA] = useState<QuizAnswers>(EMPTY);
  const [pcError, setPcError] = useState("");
  const [done, setDone] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const started = useRef(false);
  // Ignore extra taps while a step is animating out, so a double tap can't skip a question.
  const pending = useRef(false);
  const result = done ? recommend(a) : null;

  useEffect(() => {
    if (step === 0 && !done) return;
    rootRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [step, done]);

  function answer<K extends keyof QuizAnswers>(k: K, v: string) {
    if (pending.current) return;
    if (!started.current) {
      started.current = true;
      track("quiz_start");
    }
    const next = { ...a, [k]: v };
    setA(next);
    track("quiz_step", { step: k, step_number: step + 1, total_steps: STEPS.length, ...(k === "postcode" ? {} : { answer: v }) });
    if (k === "postcode") return;
    pending.current = true;
    window.setTimeout(() => {
      pending.current = false;
      advance(next);
    }, 150);
  }

  function advance(next: QuizAnswers) {
    if (step < STEPS.length - 1) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      return;
    }
    const r = recommend(next);
    track("quiz_complete", {
      models: r.picks.map((p) => p.model.slug).join(","),
      zone: r.zone ?? "",
      state: r.state ?? "",
      household: next.householdSize,
      placement: next.placement,
      budget: next.budget,
    });
    setChosen(r.picks[0]?.model.slug ?? null);
    setDone(true);
  }

  function submitPostcode(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{4}$/.test(a.postcode) || !stateForPostcode(a.postcode)) {
      setPcError("Enter a 4-digit Australian postcode");
      return;
    }
    setPcError("");
    track("quiz_step", { step: "postcode", step_number: 3, total_steps: STEPS.length });
    advance(a);
  }

  function restart() {
    setA(EMPTY);
    setStep(0);
    setDone(false);
    setChosen(null);
    track("quiz_restart");
  }

  if (result) {
    const state = result.state ?? "";
    const chosenPick = result.picks.find((p) => p.model.slug === chosen) ?? result.picks[0];
    return (
      <div ref={rootRef} className="scroll-mt-24">
        <div className="card p-5 sm:p-8" aria-live="polite">
          <p className="eyebrow">Your match</p>
          <h2 className="h-display mt-2 text-3xl text-ink-900">
            {result.picks.length > 1 ? "Two systems that suit your home" : "The system that suits your home best"}
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            {result.zone ? `Postcode ${a.postcode} is in heat pump zone ${result.zone}. ` : ""}
            Prices are guide prices for supply and standard installation; STCs are for a {new Date().getFullYear()} install at the ${STC_PRICE_CAP}{" "}
            Clearing House cap, so treat them as a maximum.
          </p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {result.picks.map((p, i) => (
              <li key={p.model.slug} className={`rounded-3xl border-2 p-5 ${p.model.slug === chosenPick?.model.slug ? "border-ember-600 bg-ember-500/5" : "border-ink-200/80"}`}>
                <p className="text-xs font-semibold tracking-wider text-ink-500 uppercase">
                  {i === 0 ? "Best match" : "Also suits"} · {p.model.brand} · {p.model.type}
                </p>
                <h3 className="mt-1 font-display text-2xl font-medium text-ink-900">
                  <Link href={`/models/${p.model.slug}`} className="hover:text-ember-700">{p.model.name}</Link>
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm text-ink-700">
                  {p.reasons.map((r) => (
                    <li key={r} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gum-500" /> {r}</li>
                  ))}
                </ul>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-ink-500">Guide price, installed</dt>
                    <dd className="font-semibold text-ink-900">{formatAUD(p.model.priceFrom)} {!p.model.priceConfirmed && <GuidePriceBadge className="ml-1 align-middle" />}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-500">After STCs, from about</dt>
                    <dd className="font-display text-2xl font-semibold text-ink-900">{formatAUD(p.afterStcs)}</dd>
                    <dd className="text-xs text-ink-500">{p.stcs} STCs, up to {formatAUD(p.stcValue)}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() => {
                    setChosen(p.model.slug);
                    track("quiz_choose_model", { model: p.model.slug });
                    document.getElementById(`${uid}-quote`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="btn-primary mt-4 w-full"
                >
                  Get a quote on this model <Arrow className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          {result.statePrograms.length > 0 && (
            <p className="mt-5 rounded-2xl bg-gum-50 px-4 py-3 text-sm text-gum-600">
              <strong>Also in {stateNames[state as keyof typeof stateNames]}:</strong>{" "}
              {result.statePrograms.map((pr) => `${pr.name} (${pr.amount})`).join("; ")}. Eligibility applies.{" "}
              <Link href={stateRebatePath(state)} className="font-semibold underline">See the official details</Link>
            </p>
          )}
          <div className="mt-6 grid gap-2.5 sm:flex sm:flex-wrap sm:items-center" data-track-location="quiz-result">
            <Link href="/quote#callback" className="btn-ghost">Request a callback</Link>
            <a href={site.phoneHref} className="btn-ghost">
              <Phone className="h-4 w-4" /> Call {site.phone}
            </a>
            <button type="button" onClick={restart} className="tap px-3 text-sm font-semibold text-ink-600 underline hover:text-ink-900">
              Start again
            </button>
          </div>
        </div>

        <div id={`${uid}-quote`} className="mt-6 scroll-mt-24">
          <QuoteForm
            key={chosenPick?.model.slug ?? "none"}
            variant="card"
            placement="quiz"
            heading={`Your ${chosenPick?.model.name ?? "heat pump"} quote`}
            initialModel={chosenPick?.model.slug}
            initialPostcode={a.postcode}
            initialState={state}
            initialCurrentSystem={a.currentSystem}
            initialHouseholdSize={a.householdSize}
          />
        </div>
      </div>
    );
  }

  const s = STEPS[Math.min(step, STEPS.length - 1)];
  const headingId = `${uid}-h`;
  return (
    <div ref={rootRef} className="card scroll-mt-24 overflow-hidden" role="group" aria-labelledby={headingId}>
      <div className="border-b border-ink-200/70 px-5 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-lg font-semibold text-ink-900">Your 60-second match</p>
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-ink-500">
            <Clock className="h-3.5 w-3.5" /> ~{SECONDS_LEFT[step]}s left
          </span>
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream-200"
          role="progressbar"
          aria-label={`Quiz progress: question ${step + 1} of ${STEPS.length}`}
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
        >
          <div className="h-full rounded-full bg-gradient-to-r from-ember-400 to-ember-600 transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <p className="mt-2 text-xs text-ink-500">Question {step + 1} of {STEPS.length}</p>
      </div>
      <div className="px-5 py-5 sm:px-8 sm:py-6">
        <h2 id={headingId} className="h-display text-2xl text-ink-900 sm:text-3xl">{s.title}</h2>
        <p className="mt-1 text-sm text-ink-600">{s.why}</p>
        {s.key === "householdSize" && (
          <Tiles name="householdSize" labelledBy={headingId} cols={3} options={[...householdSizes]} value={a.householdSize} onChoose={(v) => answer("householdSize", v)} errorId={`${uid}-hh`} />
        )}
        {s.key === "currentSystem" && (
          <Tiles name="currentSystem" labelledBy={headingId} cols={3} options={[...currentSystems]} value={a.currentSystem} onChoose={(v) => answer("currentSystem", v)} errorId={`${uid}-cs`} />
        )}
        {s.key === "postcode" && (
          <form onSubmit={submitPostcode} noValidate className="mt-5 flex gap-2" aria-label="Quiz postcode">
            <label htmlFor={`${uid}-pc`} className="sr-only">Postcode</label>
            <input
              id={`${uid}-pc`}
              autoFocus
              inputMode="numeric"
              autoComplete="postal-code"
              enterKeyHint="next"
              maxLength={4}
              placeholder="e.g. 4000"
              value={a.postcode}
              aria-invalid={pcError ? true : undefined}
              aria-describedby={pcError ? `${uid}-pc-error` : undefined}
              onChange={(e) => {
                setA((x) => ({ ...x, postcode: e.target.value.replace(/\D/g, "") }));
                setPcError("");
              }}
              className={`${inputClass(pcError)} max-w-32 text-lg tracking-widest`}
            />
            <button type="submit" className="btn-primary flex-1 sm:flex-none">Continue <Arrow className="h-4 w-4" /></button>
          </form>
        )}
        {s.key === "postcode" && <FieldError id={`${uid}-pc`} error={pcError} />}
        {s.key === "placement" && (
          <Tiles name="placement" labelledBy={headingId} options={[...placements]} value={a.placement} onChoose={(v) => answer("placement", v)} errorId={`${uid}-pl`} />
        )}
        {s.key === "budget" && (
          <Tiles name="budget" labelledBy={headingId} options={[...budgets]} value={a.budget} onChoose={(v) => answer("budget", v)} errorId={`${uid}-bu`} />
        )}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-ink-200/70 bg-cream-50 px-5 py-4 sm:px-8">
        {step > 0 ? (
          <button type="button" onClick={() => setStep((x) => x - 1)} className="btn px-2 text-ink-600 hover:text-ink-900">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-medium text-ink-600">
            <Check className="h-4 w-4 text-gum-500" /> Free, takes 60 seconds
          </span>
        )}
        <Link href="/quote#callback" className="tap text-sm font-semibold text-ink-700 underline hover:text-ink-900">
          Rather talk? Request a callback
        </Link>
      </div>
    </div>
  );
}
