import type * as z from "zod/mini";
import { HONEYPOT_FIELD } from "@/lib/lead";

/**
 * Accessible props for an input: id, aria-invalid, and aria-describedby pointing at its
 * error, or at its hint when there's no error (Field hides the hint while an error shows).
 */
export function fieldA11y(id: string, error?: string, hasHint = false) {
  const describedBy = error ? `${id}-error` : hasHint ? `${id}-hint` : undefined;
  return { id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy };
}

export function inputClass(error?: string, tone: "light" | "dark" = "light") {
  return `w-full rounded-xl border bg-white px-4 py-3 text-base text-ink-900 outline-none transition placeholder:text-ink-500/70 focus:border-ember-600 focus:ring-4 focus:ring-ember-500/20 ${
    error ? "border-red-500 ring-2 ring-red-500/15" : tone === "dark" ? "border-transparent" : "border-ink-200"
  }`;
}

export function Field({
  id,
  label,
  error,
  hint,
  tone = "light",
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  tone?: "light" | "dark";
  className?: string;
  children: React.ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <div className={className}>
      <label htmlFor={id} className={`mb-1.5 block text-sm font-semibold ${dark ? "text-white" : "text-ink-800"}`}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className={`mt-1.5 text-xs ${dark ? "text-ink-200/80" : "text-ink-500"}`}>{hint}</p>
      )}
      <FieldError id={id} error={error} tone={tone} />
    </div>
  );
}

export function FieldError({ id, error, tone = "light" }: { id: string; error?: string; tone?: "light" | "dark" }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} role="alert" className={`mt-1.5 flex items-center gap-1.5 text-sm font-medium ${tone === "dark" ? "text-red-300" : "text-red-700"}`}>
      <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
        <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-.75 4.5h1.5v5h-1.5v-5Zm0 6.5h1.5v1.5h-1.5V13Z" />
      </svg>
      {error}
    </p>
  );
}

/** Validate one field against its schema, for showing an error as soon as the visitor leaves it. */
export function fieldMessage(schema: z.ZodMiniObject, field: string, value: unknown) {
  const shape = (schema.shape as Record<string, z.ZodMiniType>)[field];
  if (!shape) return "";
  const r = shape.safeParse(value);
  return r.success ? "" : (r.error.issues[0]?.message ?? "");
}

/** Move focus to the first field (in the given order) that has an error. */
export function focusFirstError(root: HTMLElement | null, order: readonly string[], errors: Record<string, string>) {
  const first = order.find((f) => errors[f]);
  if (!first || !root) return;
  const el = root.querySelector<HTMLElement>(`[data-field="${first}"]`);
  el?.focus();
}

/**
 * Anti-spam honeypot. Positioned off-screen, skipped by Tab and hidden from screen
 * readers, so only bots fill it; the API discards any submission where it has a value.
 */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden opacity-0">
      <label>
        Leave this field blank
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}
