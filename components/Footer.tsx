import Link from "next/link";
import { referralDisclosure, site } from "@/lib/site";
import { models } from "@/lib/models";
import { cities, cityPath } from "@/lib/cities";
import { Logo } from "./Header";
import { FooterQuote } from "./FooterQuote";
import { Phone } from "./icons";

export function Footer() {
  return (
    <footer className="bg-ink-950 pb-24 text-ink-200 md:pb-0">
      <FooterQuote />
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">{site.tagline}</p>
          <a href={site.phoneHref} className="tap mt-4 gap-2 text-lg font-semibold text-white hover:text-ember-300">
            <Phone className="h-5 w-5 text-ember-400" /> {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="tap block text-sm text-ink-400 hover:text-white">{site.email}</a>
        </div>
        <FooterCol title="Models">
          {models.map((m) => (
            <FooterLink key={m.slug} href={`/models/${m.slug}`}>{m.name}</FooterLink>
          ))}
        </FooterCol>
        <FooterCol title="Rebates">
          <FooterLink href="/rebates">Postcode rebate checker</FooterLink>
          <FooterLink href="/blog/heat-pump-hot-water-rebates-by-state">Rebates by state</FooterLink>
          <FooterLink href="/blog/heat-pump-hot-water-cost-australia">Installed price guide</FooterLink>
        </FooterCol>
        <FooterCol title="Company">
          <FooterLink href="/best-heat-pump-hot-water-systems">Compare systems</FooterLink>
          <FooterLink href="/how-it-works">How it works</FooterLink>
          <FooterLink href="/about">About &amp; disclosure</FooterLink>
          <FooterLink href="/blog">Guides</FooterLink>
          <FooterLink href="/quote">Get a free quote</FooterLink>
          <FooterLink href="/privacy">Privacy</FooterLink>
        </FooterCol>
      </div>
      <nav className="border-t border-white/10" aria-label="Local guides">
        <div className="container-x py-6">
          <h3 className="text-sm font-semibold text-white">
            <Link href="/heat-pump-hot-water" className="hover:text-ember-300">Heat pump hot water near you</Link>
          </h3>
          <ul className="mt-2 flex flex-wrap gap-x-4 text-sm">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link href={cityPath(c)} className="tap text-ink-400 transition-colors hover:text-white">
                  {c.name} <span className="text-xs">{c.state}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="border-t border-white/10">
        <div className="container-x space-y-3 py-6 text-xs leading-relaxed text-ink-400">
          <p>
            <strong className="text-ink-200">Disclosure:</strong> {referralDisclosure}{" "}
            <Link href="/how-it-works" className="underline hover:text-white">How it works</Link>.
          </p>
          <p>
            Model prices are guide prices for standard supply and installation before rebates, confirmed by your installer after a site check. Neither is an offer.
            Rebate eligibility is set by each government program, so always confirm it on the official page.
          </p>
          <p>© {new Date().getFullYear()} {site.name} · {site.abn}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-3 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="tap text-ink-400 transition-colors hover:text-white">{children}</Link>
    </li>
  );
}
