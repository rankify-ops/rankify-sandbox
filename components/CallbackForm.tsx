"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { bestTimes, callbackSchema, fieldErrors, submitLead } from "@/lib/lead";
import { THANKS_KEY } from "@/lib/site";
import { Field, FieldError, fieldA11y, fieldMessage, focusFirstError, Honeypot, inputClass } from "./formFields";
import { Arrow } from "./icons";

type Data = { name: string; phone: string; postcode: string; bestTime: string; consent: boolean; company: string };
const ORDER = ["name", "phone", "postcode", "bestTime", "consent"] as const;

/** The lighter lead option: name, phone, postcode and best time to call. */
export function CallbackForm({ tone = "light", autoFocus = false }: { tone?: "light" | "dark"; autoFocus?: boolean }) {
  const router = useRouter();
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const dark = tone === "dark";
  const [data, setData] = useState<Data>({ name: "", phone: "", postcode: "", bestTime: "asap", consent: false, company: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const id = (f: string) => `${uid}-${f}`;

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };
  const blur = (k: keyof Data) => {
    if (data[k] === "") return;
    setErrors((e) => ({ ...e, [k]: fieldMessage(callbackSchema, k, data[k]) }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { type: "callback" as const, ...data };
    const check = callbackSchema.safeParse(payload);
    if (!check.success) {
      const errs = fieldErrors(check.error);
      setErrors(errs);
      focusFirstError(formRef.current, ORDER, errs);
      return;
    }
    setStatus("submitting");
    const res = await submitLead(payload);
    if (!res.ok) {
      if (res.errors) {
        setErrors(res.errors);
        focusFirstError(formRef.current, ORDER, res.errors);
      }
      setStatus("error");
      return;
    }
    try {
      sessionStorage.setItem(THANKS_KEY, JSON.stringify({ firstName: data.name.trim().split(/\s+/)[0] }));
    } catch {}
    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "lead_submitted", lead_type: "callback" });
    router.push(`/thank-you?type=callback&time=${data.bestTime}`);
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="space-y-4" aria-label="Request a callback">
      <Honeypot value={data.company} onChange={(v) => set("company", v)} />
      <Field id={id("name")} label="Name" error={errors.name} tone={tone}>
        <input
          {...fieldA11y(id("name"), errors.name)}
          data-field="name"
          autoFocus={autoFocus}
          autoComplete="name"
          enterKeyHint="next"
          value={data.name}
          onBlur={() => blur("name")}
          onChange={(e) => set("name", e.target.value)}
          className={inputClass(errors.name, tone)}
        />
      </Field>
      <div className="grid grid-cols-[1.4fr_1fr] gap-3">
        <Field id={id("phone")} label="Phone" error={errors.phone} tone={tone}>
          <input
            {...fieldA11y(id("phone"), errors.phone)}
            data-field="phone"
            type="tel"
            autoComplete="tel"
            enterKeyHint="next"
            placeholder="04xx xxx xxx"
            value={data.phone}
            onBlur={() => blur("phone")}
            onChange={(e) => set("phone", e.target.value)}
            className={inputClass(errors.phone, tone)}
          />
        </Field>
        <Field id={id("postcode")} label="Postcode" error={errors.postcode} tone={tone}>
          <input
            {...fieldA11y(id("postcode"), errors.postcode)}
            data-field="postcode"
            inputMode="numeric"
            autoComplete="postal-code"
            enterKeyHint="next"
            maxLength={4}
            value={data.postcode}
            onBlur={() => blur("postcode")}
            onChange={(e) => set("postcode", e.target.value.replace(/\D/g, ""))}
            className={inputClass(errors.postcode, tone)}
          />
        </Field>
      </div>
      <Field id={id("bestTime")} label="Best time to call" error={errors.bestTime} tone={tone}>
        <select
          {...fieldA11y(id("bestTime"), errors.bestTime)}
          data-field="bestTime"
          value={data.bestTime}
          onChange={(e) => set("bestTime", e.target.value)}
          className={inputClass(errors.bestTime, tone)}
        >
          {bestTimes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </Field>
      <div>
        <label htmlFor={id("consent")} className={`flex cursor-pointer gap-2.5 text-xs leading-relaxed ${dark ? "text-ink-200" : "text-ink-600"}`}>
          <input
            {...fieldA11y(id("consent"), errors.consent)}
            data-field="consent"
            type="checkbox"
            checked={data.consent}
            onChange={(e) => set("consent", e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-ember-600"
          />
          <span>
            I agree to my details being shared with a licensed partner installer who may call me about a quote. See our{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </span>
        </label>
        <FieldError id={id("consent")} error={errors.consent} tone={tone} />
      </div>
      {status === "error" && !Object.values(errors).some(Boolean) && (
        <p role="alert" className={`text-sm font-medium ${dark ? "text-red-300" : "text-red-700"}`}>
          We couldn&apos;t send that. Please try again, or call us.
        </p>
      )}
      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full px-4 py-3.5 text-base whitespace-nowrap">
        {status === "submitting" ? "Sending…" : "Request a free callback"} <Arrow className="h-4 w-4" />
      </button>
    </form>
  );
}
