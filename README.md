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

## Leads

The quote form (`/quote`, 5 steps) POSTs to `POST /api/leads`, which validates the input with zod (`lib/lead.ts`)
and checks a honeypot field. Each lead is:

- logged to the console as `[lead] {...}` (on Vercel, check the function logs), and
- appended to `data/leads.json` locally, or `/tmp/leads.json` on Vercel. That file is ephemeral and per-instance.

Replace with a CRM, database or email hook before going live.

## Deploying (preview only)

`vercel.json` disables deployments from `main`/`master`, so connecting the repo to Vercel produces **preview
deployments only** (one per branch/PR) and never a production deployment. The site also sends
`X-Robots-Tag: noindex`, uses noindex metadata, and serves a `robots.txt` that disallows everything.
Remove all three at launch.

## Before launch checklist

- [ ] Verified models + prices in `lib/models.ts`
- [ ] Verified rebate amounts/eligibility in `lib/rebates.ts`
- [ ] Real phone, email, ABN in `lib/site.ts`
- [ ] Privacy policy reviewed against the Australian Privacy Principles
- [ ] Real lead storage / CRM delivery
- [ ] Remove noindex (`next.config.ts`, `app/layout.tsx`, `app/robots.ts`) and the `vercel.json` main-branch block
