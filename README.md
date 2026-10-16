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
| Models, specs, supply-and-install prices | `lib/models.ts`: six real models with specs from data sheets/CHOICE (sources per model). Prices are guide prices; set `priceConfirmed: true` once an installer confirms one, which removes the "Guide price" badge. Old placeholder URLs redirect (`legacyModelSlugs`). |
| Testimonials | `lib/testimonials.ts`: **samples only**, labelled "Sample review" on the site. Replace with real reviews (with permission) and set `sample: false`. |
| Installer network line, rebate-help note | `installerNetwork` / `rebateHelpNote` in `lib/site.ts` |
| Rebate programs, amounts, official links | `lib/rebates.ts`: set `verified: true` per program |
| Brand, phone, email, ABN, referral disclosure | `lib/site.ts` |
| Blog posts | `content/blog/*.mdx` (frontmatter: `title`, `description`, `date`, `tags`). `<Callout>` and `<QuoteCta>` are available in MDX |
| Privacy policy (draft) | `app/privacy/page.tsx` |
| FAQ copy (home, model pages, rebates), with FAQPage schema | `lib/faqs.ts` |
| Page titles & descriptions | `export const metadata = pageMeta(...)` in each page; helper in `lib/seo.ts` |

## Conversion features

- **Quote CTAs everywhere**: every page has "Get a free quote" + click-to-call above the fold (`HeroCtas` in `components/ui.tsx`) and repeated down the page
- **60-second quote form** (`components/QuoteForm.tsx`): need → current system → household size (one tap each, auto-advance) → postcode (state auto-detected) → name, mobile, optional email, consent. Shows progress, "~Ns left" and a short reason for each question. Contact details come last. Pushes `quote_start`, `quote_step` and `lead_submitted` to `window.dataLayer`.
- **Where it appears**: as a popup from every link to `/quote` (`components/QuoteModal.tsx`; this covers the header "Free quote · 60s" button, sticky mobile bar, model cards and price cards); inline in the home hero, the footer of every page (`components/FooterQuote.tsx`), mid-post in every blog article (`<QuoteCta />`), at the end of the rebate checker (prefilled state + programs), on `/quote`, and in the lead capture blocks (`components/LeadCaptureBlock.tsx`, with a "Call me back" tab). Links stay real `/quote` links, so new tabs and no-JS visitors still get the full page.
- **Callback form** (`components/CallbackForm.tsx`): name, phone, postcode, best time to call
- **Sticky mobile bar** with Call + Get a free quote (`components/StickyMobileBar.tsx`), hidden from tablet up
- **Exit-intent popup** (`components/ExitIntent.tsx`): desktop with a mouse only, once per session, never on `/quote` or `/thank-you`, closes on Esc or backdrop click
- **Rebate checker → quote**: after picking a state, the checker ends in a quote form prefilled with that state; the programs shown are sent with the lead as `rebatesViewed`
- **Trust signals** next to every form (`components/FormTrust.tsx`); copy lives in `lib/site.ts` (`formTrustPoints`, `responseTime`, `privacyNote`)
- **Thank-you page** (`/thank-you`) with next steps for quote vs callback
- Each successful submit pushes `{ event: "lead_submitted", lead_type }` to `window.dataLayer` if GTM is added later

## SEO & accessibility

- Each page has its own title, description, canonical URL and Open Graph/Twitter tags (`lib/seo.ts`). A share image is generated at `/opengraph-image`, and the favicon is `app/icon.svg`.
- `sitemap.xml` lists every page except `/thank-you`. Set `SITE_URL` at launch so sitemap, robots and canonicals use the real domain.
- Forms: labelled fields, errors shown on blur and on submit, announced to screen readers, and focus moves to the first invalid field. Choice tiles work with arrow keys.
- Blog images must have alt text: the build fails if an MDX image is missing it.
- Lighthouse (mobile) on every page: performance 96–99, accessibility 100, best practices 100. SEO reads 66 only because of the deliberate noindex (`is-crawlable`); it's the sole failing SEO audit.

## Leads

Both forms POST to `POST /api/leads` (`type: "quote"` or `type: "callback"`). Quote leads carry `need` (`replace`, `failed` = urgent, `new`, `prices`), `currentSystem`, `householdSize`, `postcode`, `state`, `preferredModel` (from the page they came from), `name`, `phone`, optional `email`, `consent`, and `rebatesViewed` when they came from the rebate checker. The API validates with zod
(`lib/lead.ts`) and checks a honeypot field. Each lead is:

- logged to the console as `[lead] {...}` (on Vercel, check the function logs), and
- appended to `data/leads.json` locally, or `/tmp/leads.json` on Vercel. That file is ephemeral and per-instance.

Replace with a CRM, database or email hook before going live.

A filled honeypot field (`company`, hidden from real visitors) gets a fake success response and is never stored or forwarded.

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
- [ ] If leads are sold to more than one buyer, update the consent text in the forms and the privacy policy
- [ ] Verified rebate amounts/eligibility in `lib/rebates.ts`
- [ ] Real phone, email, ABN and business address in `lib/site.ts` (these also feed the Organization/LocalBusiness JSON-LD in `components/SiteJsonLd.tsx`)
- [ ] Privacy policy reviewed against the Australian Privacy Principles
- [ ] Real lead storage / CRM delivery
- [ ] Remove noindex (`next.config.ts`, `app/layout.tsx`, `app/robots.ts`) and the `vercel.json` main-branch block
