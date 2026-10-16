/**
 * Optional lead forwarding. If LEAD_WEBHOOK_URL is set, each saved lead is POSTed there
 * as JSON (e.g. a Zapier/Make hook, CRM endpoint or Slack relay). If it's unset, this
 * is a no-op. Failures are logged and never affect the visitor's submission.
 */
const TIMEOUT_MS = 5000;

export async function forwardLead(lead: object): Promise<void> {
  const url = process.env.LEAD_WEBHOOK_URL?.trim();
  if (!url) return;
  if (!/^https?:\/\//i.test(url)) {
    console.error("[lead] LEAD_WEBHOOK_URL must start with http:// or https://; skipping webhook");
    return;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "aussie-heat-pumps-lead-webhook" },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) console.error(`[lead] webhook responded ${res.status}`);
  } catch (err) {
    console.error("[lead] webhook failed:", err instanceof Error ? err.message : err);
  }
}
