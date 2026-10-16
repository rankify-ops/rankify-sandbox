/**
 * Ad attribution saved with each lead: UTM parameters, click IDs (gclid, fbclid and
 * friends), the landing page and the external referrer.
 *
 * Captured on the first page a visitor loads (see components/Analytics.tsx) and kept in
 * localStorage for 90 days (Google Ads' click window), so a visitor who clicks an ad and
 * comes back later to fill in the form is still attributed.
 * - `last` is replaced whenever the visitor arrives with any tracking parameter (a new ad click).
 * - `first` is the first visit we saw, kept until it expires.
 * Without storage (private mode, blocked), it still works for the current page session.
 */
export const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
] as const;

export type TrackingParam = (typeof TRACKING_PARAMS)[number];

export type Touch = Partial<Record<TrackingParam, string>> & {
  landingPage: string;
  referrer?: string;
  at: string;
};

type Stored = { first: Touch; last: Touch; expires: number };

/** What's sent with a lead: the latest touch's parameters plus where the visitor first arrived. */
export type LeadAttribution = Partial<Record<TrackingParam, string>> & {
  landingPage?: string;
  referrer?: string;
  capturedAt?: string;
  firstLandingPage?: string;
  firstReferrer?: string;
  firstCapturedAt?: string;
};

const KEY = "ahp:attribution";
const TTL = 90 * 24 * 60 * 60 * 1000;
const MAX = 300;
let memory: Stored | null = null;

const clip = (s: string) => s.slice(0, MAX);

function read(): Stored | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as Stored;
      if (s?.expires > Date.now() && s.first && s.last) return s;
    }
  } catch {}
  return memory && memory.expires > Date.now() ? memory : null;
}

function write(s: Stored) {
  memory = s;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

/** Referrer from another site only (our own pages aren't a traffic source). */
function externalReferrer() {
  try {
    const r = document.referrer;
    if (!r) return undefined;
    return new URL(r).origin === window.location.origin ? undefined : clip(r);
  } catch {
    return undefined;
  }
}

/** Record this page load as a touch if it's the first visit or carries tracking parameters. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const params: Partial<Record<TrackingParam, string>> = {};
  for (const p of TRACKING_PARAMS) {
    const v = url.searchParams.get(p);
    if (v) params[p] = clip(v);
  }
  const existing = read();
  const hasParams = Object.keys(params).length > 0;
  if (existing && !hasParams) return;
  const touch: Touch = { ...params, landingPage: clip(url.pathname + url.search), referrer: externalReferrer(), at: new Date().toISOString() };
  write({ first: existing?.first ?? touch, last: touch, expires: Date.now() + TTL });
}

export function getAttribution(): LeadAttribution | undefined {
  if (typeof window === "undefined") return undefined;
  if (!read()) captureAttribution();
  const s = read();
  if (!s) return undefined;
  const { landingPage, referrer, at, ...params } = s.last;
  return {
    ...params,
    landingPage,
    referrer,
    capturedAt: at,
    firstLandingPage: s.first.landingPage,
    firstReferrer: s.first.referrer,
    firstCapturedAt: s.first.at,
  };
}
