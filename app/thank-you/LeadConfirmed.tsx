"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { saveThanks, type ThanksData } from "@/lib/lead";
import { THANKS_KEY } from "@/lib/site";

/**
 * Fires `lead_confirmed` once per submitted lead when the thank-you page shows (the
 * conversion event for ad platforms). Visiting /thank-you directly, or refreshing it,
 * doesn't fire it, because there's no unconfirmed lead in this tab.
 */
export function LeadConfirmed() {
  useEffect(() => {
    let t: ThanksData | null = null;
    try {
      t = JSON.parse(sessionStorage.getItem(THANKS_KEY) ?? "null");
    } catch {}
    if (!t || t.confirmed) return;
    track("lead_confirmed", {
      lead_id: t.leadId ?? "",
      form: t.leadType,
      placement: t.placement,
      state: t.state ?? "",
      urgent: !!t.urgent,
      ...t.tracking,
    });
    saveThanks({ ...t, confirmed: true });
  }, []);
  return null;
}
