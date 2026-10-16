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
  stateRebatePath,
  type RebateProgram,
} from "@/lib/rebates";
import { FieldError, inputClass } from "./formFields";
import { Arrow, Check, External, Info } from "./icons";
import { QuoteForm } from "./QuoteForm";
import { StcEstimate } from "./StcEstimate";
import { ProgramCard, StateNoteCard } from "./RebateCards";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { cityPath, citiesForState } from "@/lib/cities";

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
    track("rebate_check", { state: s });
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
            <p className="flex flex-wrap items-center gap-x-3 text-xs text-ink-500">
              Last checked {formatCheckedDate(LAST_CHECKED)}
              <Link href={stateRebatePath(result.state)} className="tap font-semibold text-ember-600 underline">
                Full {result.state} rebate guide
              </Link>
            </p>
          </div>

          <ProgramCard program={federalSTC} />
          {result.postcode && <StcEstimate postcode={result.postcode} />}
          {programs.map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
          {note && <StateNoteCard state={result.state} note={note} />}
          {programs.length === 0 && !note && (
            <div className="flex gap-3 rounded-3xl border border-ink-200/70 bg-cream-100 p-5 text-sm text-ink-700">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-ink-500" />
              <p>{checkedState ? "No state program found." : `We haven't checked state programs for ${stateNames[result.state]} yet.`} Federal STCs still apply.</p>
            </div>
          )}
          {citiesForState(result.state).length > 0 && (
            <p className="text-sm text-ink-700">
              <strong className="text-ink-900">Local guide{citiesForState(result.state).length > 1 ? "s" : ""}:</strong>{" "}
              {citiesForState(result.state).map((c, i) => (
                <span key={c.slug}>
                  {i > 0 && " · "}
                  <Link href={cityPath(c)} className="tap font-semibold text-ember-600 underline hover:text-ember-700">
                    Heat pump hot water in {c.name}
                  </Link>
                </span>
              ))}{" "}
              (climate, recommended models and local prices)
            </p>
          )}
          <div className="flex flex-col gap-3 rounded-2xl border border-ember-500/25 bg-ember-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-ink-800">Want these applied to a real price? Your installer confirms eligibility.</p>
            <div className="grid shrink-0 gap-2 sm:flex">
              <a href="#rebate-quote" className="btn-primary px-5 py-2.5 whitespace-nowrap">Get a free quote</a>
              <Link href="/quote#callback" className="btn-ghost px-5 py-2.5 whitespace-nowrap">Request a callback</Link>
            </div>
          </div>
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
                placement="rebate-checker"
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
