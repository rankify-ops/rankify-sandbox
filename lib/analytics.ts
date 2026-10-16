/**
 * Analytics events, pushed to `window.dataLayer` only (for Google Tag Manager or similar,
 * once one is added). No personal details go in events: no name, phone or email.
 *
 * Events:
 * - `form_start`        first interaction with a lead form          { form, placement }
 * - `form_step`         quote form moves to a step                  { form, step, step_number, total_steps, placement }
 * - `form_submit`       lead accepted by the API                    { form, placement, state?, need?, utm_source?, utm_medium?, utm_campaign?, has_gclid, has_fbclid }
 * - `form_submit_error` lead rejected or network error              { form, placement }
 * - `click_to_call`     any tel: link clicked                       { link_location, page_path }
 * - `quote_open` / `callback_open`  popup opened                    { from }
 * - `rebate_check`      postcode checked in the rebate checker      { state }
 */
export type FormName = "quote" | "callback";

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}
