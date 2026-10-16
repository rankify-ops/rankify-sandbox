"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { bestTimes, callbackSchema, fieldErrors, submitLead } from "@/lib/lead";
import { THANKS_KEY } from "@/lib/site";
import { Arrow } from "./icons";

type Data = { name: string; phone: string; postcode: string; bestTime: string; consent: boolean; company: string };

/** The lighter lead option: name, phone, postcode and best time to call. */
export function CallbackForm({ tone = "light", autoFocus = false }: { tone?: "light" | "dark"; autoFocus?: boolean }) {
  const router = useRouter();
  const id = useId();
  const dark = tone === "dark";
  const [data, setData] = useState<Data>({ name: "", phone: "", postcode: "", bestTime: "asap", consent: false, company: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { type: "callback" as const, ...data };
    const check = callbackSchema.safeParse(payload);
    if (!check.success) {
      setErrors(fieldErrors(check.error));
      return;
    }
    setStatus("submitting");
    const res = await submitLead(payload);
    if (!res.ok) {
      if (res.errors) setErrors(res.errors);
      setStatus("error");
      return;
    }
    try {
      sessionStorage.setItem(THANKS_KEY, JSON.stringify({ firstName: data.name.trim().split(/\s+/)[0] }));
    } catch {}
    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "lead_submitted", lead_type: "callback" });
    router.push(`/thank-you?type=callback&time=${data.bestTime}`);
  }

  const input = (err?: string) =>
    `w-full rounded-xl border px-4 py-3 text-base outline-none transition focus:border-ember-500 focus:ring-4 focus:ring-ember-500/20 ${
      dark ? "bg-white/95 text-ink-900" : "bg-white text-ink-900"
    } ${err ? "border-red-400" : dark ? "border-transparent" : "border-ink-200"}`;
  const label = `mb-1.5 block text-sm font-semibold ${dark ? "text-white" : "text-ink-800"}`;
  const errCls = `mt-1 block text-sm ${dark ? "text-red-300" : "text-red-600"}`;

  return (
    <form onSubmit={submit} noValidate className="space-y-4" aria-label="Request a callback">
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input tabIndex={-1} autoComplete="off" value={data.company} onChange={(e) => set("company", e.target.value)} />
      </div>
      <label className="block">
        <span className={label}>Name</span>
        <input autoFocus={autoFocus} autoComplete="name" value={data.name} onChange={(e) => set("name", e.target.value)} className={input(errors.name)} />
        {errors.name && <span className={errCls}>{errors.name}</span>}
      </label>
      <div className="grid grid-cols-[1.4fr_1fr] gap-3">
        <label className="block">
          <span className={label}>Phone</span>
          <input type="tel" autoComplete="tel" placeholder="04xx xxx xxx" value={data.phone} onChange={(e) => set("phone", e.target.value)} className={input(errors.phone)} />
          {errors.phone && <span className={errCls}>{errors.phone}</span>}
        </label>
        <label className="block">
          <span className={label}>Postcode</span>
          <input
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={4}
            value={data.postcode}
            onChange={(e) => set("postcode", e.target.value.replace(/\D/g, ""))}
            className={input(errors.postcode)}
          />
          {errors.postcode && <span className={errCls}>{errors.postcode}</span>}
        </label>
      </div>
      <label className="block">
        <span className={label}>Best time to call</span>
        <select value={data.bestTime} onChange={(e) => set("bestTime", e.target.value)} className={input(errors.bestTime)}>
          {bestTimes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </label>
      <label htmlFor={`${id}-consent`} className={`flex cursor-pointer gap-2.5 text-xs leading-relaxed ${dark ? "text-ink-200" : "text-ink-600"}`}>
        <input
          id={`${id}-consent`}
          type="checkbox"
          checked={data.consent}
          onChange={(e) => set("consent", e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-ember-500"
        />
        <span>
          I agree to my details being shared with a licensed partner installer who may call me about a quote. See our{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </span>
      </label>
      {errors.consent && <p className={`${errCls} -mt-2`}>{errors.consent}</p>}
      {status === "error" && !Object.values(errors).some(Boolean) && (
        <p className={errCls}>Something went wrong. Please try again, or call us.</p>
      )}
      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full py-3.5 text-base">
        {status === "submitting" ? "Sending…" : "Request my free callback"} <Arrow className="h-4 w-4" />
      </button>
    </form>
  );
}
