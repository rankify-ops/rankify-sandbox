# Aussie Heat Pumps

Lead-gen site for Australian heat pump hot water. Next.js 16 (App Router) + Tailwind v4 + MDX.

## Run locally

```bash
npm install --include=dev   # --include=dev matters if NODE_ENV=production in your shell
npm run dev                 # http://localhost:3000
npm run build && npm start  # production build
npm run lint && npm run typecheck
```

## Where to edit content

| What | File |
| --- | --- |
| Models, specs, supply-and-install prices | `lib/models.ts`: six real models with specs (capacity, COP, refrigerant, noise, warranty, operating range) from manufacturer spec sheets, linked per model as `specSheet`; `stc` holds the CER register entry and its certificate counts for zones 1–5. Prices are guide prices; set `priceConfirmed: true` once an installer confirms one, which removes the "Guide price" badge. Old placeholder URLs redirect (`legacyModelSlugs`). |
| Testimonials | `lib/testimonials.ts`: **placeholders only**: names show as "[Placeholder name]" and each card is badged "Placeholder testimonial". Shown on the home page, model pages and `/quote`. Replace with real reviews (with permission) and set `sample: false`. |
| Installer network line, rebate-help note | `installerNetwork` / `rebateHelpNote` in `lib/site.ts` |
| Rebate programs, amounts, official links | `lib/rebates.ts`: **official figures only**, each with `officialUrl`, the page's own `sourceUpdated` date and our `lastChecked` date (`LAST_CHECKED`). If a page gives no figure, `amountConfirmed: false` shows "Not confirmed". Re-check the pages and bump `LAST_CHECKED` whenever you update a figure. All eight states/territories are covered: states without a program we could confirm have a `stateNotes` entry (what we found, official link, dates). |
| City pages | `lib/cities.ts`: BOM station figures (re-check before launch: BOM showed a "problems with this product" banner when checked), NCC zones from NCC 2025 Table 3 or the ABCB Climate Map (not the old LGA tables, which the ABCB says are no longer reliable), picks, local tips. Prices, STCs and rebates are pulled from the shared data. |
| Federal STC estimate | `lib/stc.ts`: CER heat pump postcode zones (Table 1, v3), the year multiplication factor and the $40 Clearing House cap (shown as an upper estimate). Sources in `STC_SOURCES`. Update the register counts in `lib/models.ts` if the CER register changes. |
| Referral disclosure & consent | `referralDisclosure` / `privacyNote` in `lib/site.ts`, consent text in `components/QuoteForm.tsx` and `components/CallbackForm.tsx`, `/how-it-works`, `/about`, `/privacy`. All describe: free service, one licensed partner installer at a time (offered to the next if they pass), referral fee. Keep them in sync. |
| Trust badges | `components/TrustBadges.tsx`: **placeholders**, visibly labelled, until licence, insurer and network details are confirmed |
| Brand, phone, email, ABN, referral disclosure | `lib/site.ts` |
| Blog posts | `content/blog/*.mdx` (frontmatter: `title`, `description`, `date`, `tags`, optional `faqs` for FAQPage schema). `<Callout>` and `<QuoteCta>` are available in MDX |
| Privacy policy (draft) | `app/privacy/page.tsx` |
| FAQ copy (home, model pages, rebates), with FAQPage schema | `lib/faqs.ts` |
| Page titles & descriptions | `export const metadata = pageMeta(...)` in each page; helper in `lib/seo.ts` |

## Conversion features

- **Quote CTAs everywhere**: every page has "Get a free quote" + click-to-call above the fold (`HeroCtas` in `components/ui.tsx`) and repeated down the page
- **60-second quote form** (`components/QuoteForm.tsx`): postcode (state auto-detected) → current system → need → household size (one tap each, auto-advance) → name, phone, optional email, consent. Shows a progress bar, "Step N of 5", "~Ns left" and a short reason for each question. Contact details come last. When the postcode is already known (rebate checker) it starts on step 2.
- **Phone validation** (`lib/phone.ts`): Australian mobiles (04) and landlines (02, 03, 07, 08), with `+61` handled, specific messages (missing area code, wrong length, 13/1300/1800 numbers, obvious fakes), stored as `0412345678` and shown as `0412 345 678`. Shared by both forms and the API.
- **City landing pages** (`/heat-pump-hot-water/[city]`, data in `lib/cities.ts`): all eight capitals (Brisbane, Sydney, Melbourne, Adelaide, Perth, Canberra, Hobart, Darwin) plus the Gold Coast and regional centres (Sunshine Coast, Toowoomba, Townsville, Cairns, Newcastle, Central Coast, Wollongong, Geelong, Ballarat, Bendigo, Launceston). Each has BOM climate figures (station, period and link), the ABCB NCC climate zone, the CER STC zone and estimate, the state's rebate programs or note from `lib/rebates.ts`, recommended models with a local reason, a guide price + STC table, local tips, FAQs (FAQPage schema), BreadcrumbList and Service schema, and a quote form plus quote/callback buttons above the fold. Index at `/heat-pump-hot-water` (capitals and regional centres); linked from a "near you" row in the footer and from the rebate checker results for the matching state.
- **Sticky mobile bar** (`components/StickyMobileBar.tsx`): on every page, including `/thank-you`. Call icon + "Free quote" + "Request callback"; on `/hot-water-broken` and `/thank-you` it leads with "Call" + "Request a callback". Hides near any form or while a field has focus.
- **Urgent page** (`/hot-water-broken`, linked from the header, mobile menu and homepage hero): call and callback buttons first, a 3-step urgent form (`<QuoteForm mode="urgent">`: postcode → system + household → contact, sent with `need: "failed"`), safety steps, honest timing (no promised times) and rebates.
- **Thank-you page** (`/thank-you`): what happens next, what to have ready for the rebate (unit label, meter box, electricity bill, where the unit sits), click-to-call, and an urgent notice for broken systems. Fires `lead_confirmed` once per lead (not on refresh or a direct visit) with `lead_id`, `form`, `placement`, `state`, `urgent` and campaign fields, for use as the ad conversion event.
- **Where it appears**: as a popup from every link to `/quote` (`components/QuoteModal.tsx`; this covers the header "Free quote · 60s" button, sticky mobile bar, model cards and price cards); inline in the home hero, the footer of every page (`components/FooterQuote.tsx`), mid-post in every blog article (`<QuoteCta />`), at the end of the rebate checker (prefilled state + programs), on `/quote`, and in the lead capture blocks (`components/LeadCaptureBlock.tsx`, with a "Call me back" tab). Links stay real `/quote` links, so new tabs and no-JS visitors still get the full page.
- **Callback form** (`components/CallbackForm.tsx`): name, phone, postcode, best time to call
- **Sticky mobile bar** (`components/StickyMobileBar.tsx`, phones only): "Get my free quote" (opens the 60-second popup) and "Request a callback" (opens a callback popup via `/quote#callback`). It slides away while any lead form is on screen (starting 120px early) or a field has focus, so it never covers inputs, consent text or submit buttons.
- **Postcode rebate checker** (`/rebates`, `components/RebateChecker.tsx`): postcode → state → federal STCs + state programs (official figures, page dates, last-checked date, official links) → 60-second form prefilled with postcode, state and programs. `?postcode=` and the older `?state=` links both work.
- **Homepage**: every section ends in a 60-second quote + callback CTA (`components/SectionCta.tsx`).
- **Blog FAQs**: add `faqs:` (list of `q`/`a`) to a post's frontmatter to render a visible FAQ section with FAQPage schema.
- **Compare tool** `/compare` (`components/CompareTable.tsx`, in the main nav): all six models side by side with capacity, climate fit (from each spec sheet's lowest rated operating temperature, `minOperatingC`), guide installed price, STC estimate (for the visitor's postcode, or the range across zones) and noise (`noiseDb`). Sortable by price, noise, cold rating and tank size, with a "Get a quote on this model" button per row (fires `compare_quote_click`) and a sticky quote/callback/call bar on tablet and desktop.
- **Buying guide** `/best-heat-pump-hot-water-systems`: data-driven quick picks, side-by-side table (cards on mobile) with a quote CTA per model, and a mid-page 60-second form. Built from the `compare` fields in `lib/models.ts`.
- **Exit-intent popup** (`components/ExitIntent.tsx`): desktop with a mouse only, once per session, never on `/quote` or `/thank-you`, closes on Esc or backdrop click
- **Rebate checker → quote**: after picking a state, the checker ends in a quote form prefilled with that state; the programs shown are sent with the lead as `rebatesViewed`
- **Trust signals** next to every form (`components/FormTrust.tsx`); copy lives in `lib/site.ts` (`formTrustPoints`, `responseTime`, `privacyNote`)
- **Thank-you page** (`/thank-you`) with next steps for quote vs callback
- **Analytics events** (`lib/analytics.ts`), pushed to `window.dataLayer` only (no paid tools; add GTM later to use them): `form_start`, `form_step`, `form_submit`, `form_submit_error` (each with `form` and `placement`), `click_to_call` (any `tel:` link, with `link_location`), `lead_confirmed` (thank-you page, once per lead), `quote_open` / `callback_open`, `rebate_check` and `compare_quote_click`. `form_submit` carries `utm_source`, `utm_medium`, `utm_campaign`, `has_gclid` and `has_fbclid`. Events never include names, phone numbers or emails.
- **Ad attribution** (`lib/attribution.ts`, captured by `components/Analytics.tsx`): UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `utm_id`), click IDs (`gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid`), the landing page and the external referrer. Kept in localStorage for 90 days: the latest ad click is the "last" touch, the first visit is kept as "first". Sent with every lead as `attribution` alongside `source` (the page the form was submitted on). Disclosed in the privacy policy.

## SEO & accessibility

- Each page has its own title, description, canonical URL and Open Graph/Twitter tags (`lib/seo.ts`). A share image is generated at `/opengraph-image`, and the favicon is `app/icon.svg`.
- `sitemap.xml` lists every page except `/thank-you`. Set `SITE_URL` at launch so sitemap, robots and canonicals use the real domain.
- Forms: labelled fields, errors shown on blur and on submit, announced to screen readers, and focus moves to the first invalid field. Choice tiles work with arrow keys.
- Blog images must have alt text: the build fails if an MDX image is missing it.
- Structured data (`lib/schema.ts`, `components/JsonLd.tsx`): Organization + LocalBusiness on every page, FAQPage wherever an FAQ section shows, BreadcrumbList on model, blog, city and comparison pages, Service on city pages, Product + Offer on model pages (brand, manufacturer, CER register model code as `model`/`mpn`, typed properties for capacity, noise and minimum operating temperature, the spec sheet as `subjectOf`, and a guide-price Offer in AUD sold by the Organization), Article on posts, ItemList on the comparison page. **No Review or AggregateRating** while testimonials are samples.
- Performance: fonts use `display: "optional"` (no late repaint, which keeps LCP low on mobile); form validation uses `zod/mini` to keep the client bundle small. No raster images are used.
- Lighthouse (mobile) on every page: performance 96–99, accessibility 100, best practices 100. SEO reads 66 only because of the deliberate noindex (`is-crawlable`); it's the sole failing SEO audit.

## Leads

Both forms POST to `POST /api/leads` (`type: "quote"` or `type: "callback"`). Every lead carries `attribution` (see above). Quote leads carry `need` (`replace`, `failed` = urgent, `new`, `prices`), `currentSystem`, `householdSize`, `postcode`, `state`, `preferredModel` (from the page they came from), `name`, `phone`, optional `email`, `consent`, and `rebatesViewed` when they came from the rebate checker. The API validates with zod
(`lib/lead.ts`) and checks a honeypot field. Each lead is:

- logged to the console as `[lead] {...}` (on Vercel, check the function logs), and
- appended to `data/leads.json` locally, or `/tmp/leads.json` on Vercel. That file is ephemeral and per-instance.

Replace with a CRM, database or email hook before going live.

A filled honeypot field (`hp_extra_info`, hidden from real visitors) gets a fake success response and is never stored or forwarded. The name is deliberately one browsers don't autofill, so a real visitor's autofill can't trigger it. Each lead also carries `formMs` (time from first interaction to submit), `phoneType` (`mobile` or `landline`) and `suspectedBot`, which is true when the form was completed faster than a person could (under 4 s for quotes, 2.5 s for callbacks) or the API was called directly. Flagged leads are still saved, so you decide whether to filter them.

### Forwarding leads with `LEAD_WEBHOOK_URL`

Set `LEAD_WEBHOOK_URL` to forward each saved lead to another service, such as a Zapier/Make webhook or a CRM endpoint (see `.env.example`):

- After a lead is validated and saved, it's `POST`ed to that URL as JSON. That's the same object that gets logged, including `id`, `receivedAt`, `type` (`quote` or `callback`) and the form fields.
- It runs after the response is sent (`after()` in `app/api/leads/route.ts`), with a 5-second timeout, so a slow or failing webhook never delays or breaks the visitor's submission. Failures are logged as `[lead] webhook ...`.
- If the variable is unset, nothing is sent. The code lives in `lib/leadWebhook.ts`.

On Vercel, add it under Project → Settings → Environment Variables for the Preview environment.

## Deploying (preview only)

Two guards keep this preview-only:

1. `vercel.json` sets `ignoreCommand` to `scripts/vercel-ignore-production.sh`, which **skips any build Vercel
   would make as production** (`VERCEL_ENV=production`). This matters because Vercel treats the repo's default
   branch as the production branch, and this repo's default branch is currently `claude/trusting-volta-5xkajg`.
2. `vercel.json` also disables Git deployments from `main`/`master`.

To get a preview URL, deploy any non-production branch via the Vercel Git integration, or run `npx vercel deploy`
(no `--prod`) from a local checkout. The site also sends
`X-Robots-Tag: noindex`, uses noindex metadata, and serves a `robots.txt` that disallows everything.
Remove all three at launch.

## Before launch checklist

- [ ] Confirm guide prices and specs marked "confirm" with partner installers (`lib/models.ts`), then set `priceConfirmed: true`
- [ ] Replace sample testimonials with real, permissioned reviews (`lib/testimonials.ts`)
- [ ] Confirm the installer network size in `installerNetwork` (`lib/site.ts`)
- [ ] Replace the placeholder trust badges with real licence, insurance and network details (`components/TrustBadges.tsx`)
- [ ] Re-check every rebate figure against its official page and update `LAST_CHECKED` (`lib/rebates.ts`)
- [ ] Have the consent text and privacy policy reviewed (they describe one-installer-at-a-time referrals and a referral fee)
- [ ] Verified rebate amounts/eligibility in `lib/rebates.ts`
- [ ] Real phone, email, ABN and business address in `lib/site.ts` (these also feed the Organization/LocalBusiness JSON-LD in `components/SiteJsonLd.tsx`)
- [ ] Privacy policy reviewed against the Australian Privacy Principles
- [ ] Real lead storage / CRM delivery
- [ ] Remove noindex (`next.config.ts`, `app/layout.tsx`, `app/robots.ts`) and the `vercel.json` main-branch block
