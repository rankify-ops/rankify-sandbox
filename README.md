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
| Models, specs, supply-and-install prices | `lib/models.ts`: set `verified: true` to remove the TBC badge |
| Rebate programs, amounts, official links | `lib/rebates.ts`: set `verified: true` per program |
| Brand, phone, email, ABN, referral disclosure | `lib/site.ts` |
| Blog posts | `content/blog/*.mdx` (frontmatter: `title`, `description`, `date`, `tags`). `<Callout>` and `<QuoteCta>` are available in MDX |
| Privacy policy (draft) | `app/privacy/page.tsx` |

## Conversion features

- **Quote CTAs everywhere**: every page has "Get a free quote" + click-to-call above the fold (`HeroCtas` in `components/ui.tsx`) and repeated down the page
- **Two lead forms**: full 5-step quote (`components/QuoteForm.tsx`) and a 4-field callback form (`components/CallbackForm.tsx`)
- **Inline lead capture** on long pages (`components/LeadCaptureBlock.tsx`): quote CTA + callback form + trust signals
- **Sticky mobile bar** with Call + Get a free quote (`components/StickyMobileBar.tsx`), hidden from tablet up
- **Exit-intent popup** (`components/ExitIntent.tsx`): desktop with a mouse only, once per session, never on `/quote` or `/thank-you`, closes on Esc or backdrop click
- **Rebate checker → quote**: after picking a state, the checker ends in a quote form prefilled with that state; the programs shown are sent with the lead as `rebatesViewed`
- **Trust signals** next to every form (`components/FormTrust.tsx`); copy lives in `lib/site.ts` (`formTrustPoints`, `responseTime`, `privacyNote`)
- **Thank-you page** (`/thank-you`) with next steps for quote vs callback
- Each successful submit pushes `{ event: "lead_submitted", lead_type }` to `window.dataLayer` if GTM is added later

## Leads

Both forms POST to `POST /api/leads` (`type: "quote"` or `type: "callback"`), which validates with zod
(`lib/lead.ts`) and checks a honeypot field. Each lead is:

- logged to the console as `[lead] {...}` (on Vercel, check the function logs), and
- appended to `data/leads.json` locally, or `/tmp/leads.json` on Vercel. That file is ephemeral and per-instance.

Replace with a CRM, database or email hook before going live.

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

- [ ] Verified models + prices in `lib/models.ts`
- [ ] Verified rebate amounts/eligibility in `lib/rebates.ts`
- [ ] Real phone, email, ABN in `lib/site.ts`
- [ ] Privacy policy reviewed against the Australian Privacy Principles
- [ ] Real lead storage / CRM delivery
- [ ] Remove noindex (`next.config.ts`, `app/layout.tsx`, `app/robots.ts`) and the `vercel.json` main-branch block
