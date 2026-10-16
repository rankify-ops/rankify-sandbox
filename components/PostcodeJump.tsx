"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { track } from "@/lib/analytics";
import { stateForPostcode } from "@/lib/lead";
import { FieldError, inputClass } from "./formFields";
import { Arrow } from "./icons";

/** Compact postcode box that opens the full rebate checker for that postcode. */
export function PostcodeJump({ label = "Check rebates for your postcode", from }: { label?: string; from: string }) {
  const router = useRouter();
  const uid = useId();
  const [pc, setPc] = useState("");
  const [error, setError] = useState("");
  return (
    <form
      aria-label="Check rebates by postcode"
      noValidate
      className="card p-4 sm:p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!stateForPostcode(pc)) {
          setError("Enter a 4-digit Australian postcode");
          return;
        }
        track("rebate_jump", { from });
        router.push(`/rebates?postcode=${pc}`);
      }}
    >
      <label htmlFor={`${uid}-pc`} className="font-semibold text-ink-900">{label}</label>
      <div className="mt-2 flex gap-2">
        <input
          id={`${uid}-pc`}
          inputMode="numeric"
          autoComplete="postal-code"
          enterKeyHint="search"
          maxLength={4}
          placeholder="e.g. 4000"
          value={pc}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${uid}-pc-error` : undefined}
          onChange={(e) => {
            setPc(e.target.value.replace(/\D/g, ""));
            setError("");
          }}
          className={`${inputClass(error)} w-32 shrink-0 text-lg tracking-widest`}
        />
        <button type="submit" className="btn-primary min-h-12 flex-1 px-4 whitespace-nowrap sm:flex-none">
          Check <Arrow className="h-4 w-4" />
        </button>
      </div>
      <FieldError id={`${uid}-pc`} error={error} />
    </form>
  );
}
