"use client";

import Link from "next/link";
import { useState } from "react";
import { programsFor, rebateStates, type RebateProgram } from "@/lib/rebates";
import { Arrow, Check, External } from "./icons";
import { TbcBadge } from "./ui";

const stateNames: Record<string, string> = { QLD: "Queensland", NSW: "New South Wales", VIC: "Victoria" };

export function RebateChecker({ initialState }: { initialState?: string }) {
  const [state, setState] = useState<string>(
    rebateStates.includes(initialState as (typeof rebateStates)[number]) ? initialState! : "",
  );

  function pick(s: string) {
    setState(s);
    window.history.replaceState(null, "", `/rebates?state=${s}`);
  }

  return (
    <div>
      <div className="card p-6 sm:p-8">
        <h2 className="font-semibold text-ink-900">Where is the property?</h2>
        <div className="mt-4 grid grid-cols-3 gap-3" role="radiogroup" aria-label="State">
          {rebateStates.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={state === s}
              onClick={() => pick(s)}
              className={`rounded-2xl border-2 px-4 py-4 text-center transition-all ${
                state === s ? "border-ember-500 bg-ember-500/5" : "border-ink-200 hover:border-ink-400"
              }`}
            >
              <span className="block font-display text-2xl font-semibold text-ink-900">{s}</span>
              <span className="mt-0.5 hidden text-xs text-ink-600 sm:block">{stateNames[s]}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-400">
          Elsewhere in Australia? Federal STCs still apply. <Link href="#stc" className="underline">See below</Link>.
        </p>
      </div>

      {state && (
        <div className="mt-8 space-y-5" aria-live="polite">
          <h2 className="h-display text-2xl text-ink-900">
            State programs that may apply in {stateNames[state]}
          </h2>
          <p className="text-ink-600">
            Plus federal STCs, which apply everywhere. <Link href="#stc" className="font-semibold text-ember-600 underline">See below</Link>.
          </p>
          {programsFor(state).map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
          <div className="flex flex-col items-start gap-4 rounded-3xl bg-ink-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="font-semibold">Want an installer to apply what you&apos;re eligible for?</p>
              <p className="mt-1 text-sm text-ink-200">They&apos;ll confirm eligibility and show rebates on your quote.</p>
            </div>
            <Link href="/quote" className="btn-primary shrink-0">
              Get my quote <Arrow className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProgramCard({ program: p }: { program: RebateProgram }) {
  return (
    <article className="card p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-xs font-bold tracking-wider text-ember-600 uppercase">
            {p.scope === "federal" ? "Federal · all states" : p.scope}
          </span>
          <h3 className="mt-1 font-display text-xl font-medium text-ink-900">{p.name}</h3>
          <p className="text-sm text-ink-400">{p.administrator}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-400">Indicative amount</p>
          <p className="flex items-center justify-end gap-2 font-semibold text-ink-900">
            {p.amount} {!p.verified && <TbcBadge />}
          </p>
        </div>
      </div>
      <p className="mt-4 leading-relaxed text-ink-600">{p.summary}</p>
      <ul className="mt-4 space-y-2 text-sm text-ink-700">
        {p.eligibility.map((e) => (
          <li key={e} className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gum-500" /> {e}
          </li>
        ))}
      </ul>
      <a
        href={p.officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ember-600 hover:text-ember-700"
      >
        Official page: {p.officialLabel} <External className="h-4 w-4" />
      </a>
    </article>
  );
}
