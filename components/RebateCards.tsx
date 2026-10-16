import { formatCheckedDate, stateNames, type RebateProgram, type StateNote } from "@/lib/rebates";
import { Check, External, Info } from "./icons";

/** One official rebate program, with its amount, eligibility, source link and dates. */
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

/** What we found for a state without a confirmed program, with its source and dates. */
export function StateNoteCard({ state, note }: { state: keyof typeof stateNames; note: StateNote }) {
  return (
    <div className="rounded-3xl border border-ink-200/70 bg-cream-100 p-5 text-sm text-ink-700">
      <p className="flex gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-ink-500" />
        <span>
          <strong className="text-ink-900">{stateNames[state].replace(/^the /, "").replace(/^./, (c) => c.toUpperCase())}:</strong>{" "}
          {note.text} Federal STCs still apply.
        </span>
      </p>
      <div className="mt-3 flex flex-col gap-1 pl-8 sm:flex-row sm:items-center sm:justify-between">
        <a href={note.url} target="_blank" rel="noopener noreferrer" className="tap gap-1.5 font-semibold text-ember-600 hover:text-ember-700">
          Source: {note.label} <External className="h-4 w-4 shrink-0" />
        </a>
        <span className="text-xs text-ink-500">
          {note.sourceUpdated ? `Page updated ${formatCheckedDate(note.sourceUpdated)} · ` : ""}Checked {formatCheckedDate(note.lastChecked)}
        </span>
      </div>
    </div>
  );
}
