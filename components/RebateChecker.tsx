"use client";

import { useId, useState } from "react";
import { stateForPostcode } from "@/lib/lead";
import {
  federalSTC,
  formatCheckedDate,
  LAST_CHECKED,
  programsFor,
  rebateStates,
  stateNames,
  stateNotes,
  type RebateProgram,
} from "@/lib/rebates";
import { FieldError, inputClass } from "./formFields";
import { Arrow, Check, External, Info } from "./icons";
import { QuoteForm } from "./QuoteForm";

type Result = { postcode: string; state: keyof typeof stateNames };

/**
 * Postcode-first rebate checker: postcode → state → federal STCs + state programs
 * (official figures only, with dates and links) → 60-second quote form prefilled.
 */
export function RebateChecker({ initialPostcode, initialState }: { initialPostcode?: string; initialState?: string }) {
  const uid = useId();
  const initial = (): Result | null => {
    const s = stateForPostcode(initialPostcode ?? "");
    if (s) return { postcode: initialPostcode!, state: s as Result["state"] };
    if (initialState && initialState in stateNames) return { postcode: "", state: initialState as Result["state"] };
    return null;
  };
  const [postcode, setPostcode] = useState(initialPostcode ?? "");
  const [result, setResult] = useState<Result | null>(initial);
  const [error, setError] = useState("");

  function check(pc: string) {
    const s = stateForPostcode(pc);
    if (!s) {
      setError(pc.length === 4 ? "We don't recognise that postcode. Please check it." : "Enter a 4-digit Australian postcode");
      setResult(null);
      return;
    }
    setError("");
    setResult({ postcode: pc, state: s as Result["state"] });
    window.history.replaceState(null, "", `/rebates?postcode=${pc}`);
    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "rebate_check", state: s });
  }

  const programs = result ? programsFor(result.state) : [];
  const checkedState = !!result && (rebateStates as readonly string[]).includes(result.state);
  const note = result ? stateNotes[result.state] : undefined;

  return (
    <div>
      <form
        className="card p-5 sm:p-8"
        aria-label="Check rebates by postcode"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          check(postcode);
        }}
      >
        <label htmlFor={`${uid}-pc`} className="font-semibold text-ink-900">
          What&apos;s the postcode of the property?
        </label>
        <div className="mt-3 flex gap-2">
          <input
            id={`${uid}-pc`}
            inputMode="numeric"
            autoComplete="postal-code"
            enterKeyHint="search"
            maxLength={4}
            placeholder="e.g. 3220"
            value={postcode}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${uid}-pc-error` : undefined}
            onChange={(e) => {
              const pc = e.target.value.replace(/\D/g, "");
              setPostcode(pc);
              setError("");
              if (pc.length === 4) check(pc);
            }}
            className={`${inputClass(error)} max-w-28 text-lg tracking-widest`}
          />
          <button type="submit" className="btn-primary min-h-12 flex-1 px-4 whitespace-nowrap sm:flex-none">
            Check my rebates <Arrow className="h-4 w-4" />
          </button>
        </div>
        <FieldError id={`${uid}-pc`} error={error} />
        <p className="mt-3 text-xs text-ink-500">
          Figures come only from official government pages, last checked {formatCheckedDate(LAST_CHECKED)}.
        </p>
      </form>

      {result && (
        <div className="mt-8 space-y-5" aria-live="polite">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="h-display text-2xl text-ink-900 sm:text-3xl">
              {result.postcode ? `Rebates for ${result.postcode}, ` : "Rebates in "}
              {stateNames[result.state]}
            </h2>
            <p className="text-xs text-ink-500">Last checked {formatCheckedDate(LAST_CHECKED)}</p>
          </div>

          <ProgramCard program={federalSTC} />
          {programs.map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
          {programs.length === 0 && (
            <div className="flex gap-3 rounded-3xl border border-ink-200/70 bg-cream-100 p-5 text-sm text-ink-700">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-ink-500" />
              <p>
                {note
                  ? note.text
                  : checkedState
                    ? "No state program found. Federal STCs still apply."
                    : `We haven't checked state programs for ${stateNames[result.state]} yet. Federal STCs still apply, and your installer can tell you about anything local.`}{" "}
                {note?.url && (
                  <a href={note.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ember-600 underline">
                    {note.label}
                  </a>
                )}
              </p>
            </div>
          )}
          {result.state === "NSW" && (
            <p className="text-sm text-ink-600">
              The NSW amount depends on what you&apos;re replacing. Tell us your current system in the form below and your
              installer will apply the right figure.
            </p>
          )}

          <div id="rebate-quote" className="scroll-mt-24 pt-4">
            <div className="rounded-[2rem] bg-ink-900 p-4 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.18em] text-ember-400 uppercase">Next step · Free quote</p>
              <h2 className="h-display mt-2 text-2xl text-white sm:text-3xl">Get a quote with your rebates applied</h2>
              <p className="mt-2 mb-6 text-ink-200">
                We&apos;ve filled in {result.postcode ? `postcode ${result.postcode} and ` : ""}the programs above. A licensed
                partner installer will confirm what you&apos;re eligible for and take it off your price.
              </p>
              <QuoteForm
                key={`${result.state}-${result.postcode}`}
                tone="dark"
                heading={`${result.state} rebate quote in 60 seconds`}
                initialState={result.state}
                initialPostcode={result.postcode}
                rebatesViewed={[federalSTC.name, ...programs.map((p) => p.name)]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProgramCard({ program: p }: { program: RebateProgram }) {
  return (
    <article className="card p-5 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="text-xs font-bold tracking-wide text-ember-600 uppercase">
            {p.scope === "federal" ? "Federal · all states" : p.scope}
          </span>
          <h3 className="mt-1 font-display text-xl font-medium text-ink-900">{p.name}</h3>
          <p className="text-sm text-ink-500">{p.administrator}</p>
        </div>
        <div className="sm:max-w-xs sm:text-right">
          <p className="text-xs text-ink-500">Amount</p>
          <p className="font-semibold text-ink-900">{p.amount}</p>
          <span
            className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-xs font-bold tracking-wide uppercase ${
              p.amountConfirmed ? "border-gum-500/30 bg-gum-50 text-gum-600" : "border-amber-300 bg-amber-50 text-amber-800"
            }`}
          >
            {p.amountConfirmed ? "Official figure" : "Not confirmed"}
          </span>
        </div>
      </div>
      <p className="mt-4 leading-relaxed text-ink-600">{p.summary}</p>
      <p className="mt-2 text-sm font-medium text-ink-700">{p.howPaid}</p>
      <ul className="mt-4 space-y-2 text-sm text-ink-700">
        {p.eligibility.map((e) => (
          <li key={e} className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gum-500" /> {e}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <a href={p.officialUrl} target="_blank" rel="noopener noreferrer" className="tap gap-1.5 text-sm font-semibold text-ember-600 hover:text-ember-700">
          Official page: {p.officialLabel} <External className="h-4 w-4 shrink-0" />
        </a>
        <p className="text-xs text-ink-500">
          {p.sourceUpdated ? `Page updated ${formatCheckedDate(p.sourceUpdated)} · ` : ""}Checked {formatCheckedDate(p.lastChecked)}
        </p>
      </div>
    </article>
  );
}
