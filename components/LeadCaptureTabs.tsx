"use client";

import { useId, useState } from "react";
import { CallbackForm } from "./CallbackForm";
import { QuoteForm } from "./QuoteForm";

/** 60-second quote form by default, with a tab for the lighter "call me back" option. */
export function LeadCaptureTabs({ model }: { model?: string }) {
  const [tab, setTab] = useState<"quote" | "callback">("quote");
  const uid = useId();
  const tabs = [
    { key: "quote", label: "60-second quote" },
    { key: "callback", label: "Call me back" },
  ] as const;
  return (
    <div>
      <div role="tablist" aria-label="How would you like your quote?" className="mb-3 grid grid-cols-2 gap-1 rounded-full bg-white/10 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`${uid}-${t.key}-tab`}
            aria-controls={`${uid}-${t.key}`}
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition ${tab === t.key ? "bg-white text-ink-900" : "text-ink-200 hover:text-white"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${uid}-quote`} aria-labelledby={`${uid}-quote-tab`} hidden={tab !== "quote"} className="text-ink-900">
        <QuoteForm variant="compact" tone="dark" initialModel={model} placement="lead-block" />
      </div>
      <div role="tabpanel" id={`${uid}-callback`} aria-labelledby={`${uid}-callback-tab`} hidden={tab !== "callback"} className="rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10">
        <p className="mb-4 text-sm text-ink-200">Four quick fields and a licensed installer will ring you at a time that suits.</p>
        <CallbackForm tone="dark" placement="lead-block" />
      </div>
    </div>
  );
}
