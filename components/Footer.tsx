import Link from "next/link";
import { referralDisclosure, site } from "@/lib/site";
import { models } from "@/lib/models";
import { Logo } from "./Header";
import { Arrow, Phone } from "./icons";

export function Footer() {
  return (
    <footer className="bg-ink-950 pb-24 text-ink-200 md:pb-0">
      <div className="border-b border-white/10">
        <div className="container-x flex flex-col items-start justify-between gap-5 py-8 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-2xl text-white">Ready for lower hot water bills?</p>
            <p className="mt-1 text-sm text-ink-400">Free, no-obligation quotes from licensed local installers.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a href={site.phoneHref} className="btn border border-white/20 text-white hover:bg-white/10">
              <Phone className="h-4 w-4" /> {site.phone}
            </a>
            <Link href="/quote" className="btn-primary">
              Get a free quote <Arrow className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">{site.tagline}</p>
          <a href={site.phoneHref} className="mt-5 flex items-center gap-2 text-lg font-semibold text-white hover:text-ember-300">
            <Phone className="h-5 w-5 text-ember-400" /> {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="mt-1 block text-sm text-ink-400 hover:text-white">{site.email}</a>
        </div>
        <FooterCol title="Models">
          {models.map((m) => (
            <FooterLink key={m.slug} href={`/models/${m.slug}`}>{m.name}</FooterLink>
          ))}
        </FooterCol>
        <FooterCol title="Rebates">
          <FooterLink href="/rebates?state=QLD">Queensland</FooterLink>
          <FooterLink href="/rebates?state=NSW">New South Wales</FooterLink>
          <FooterLink href="/rebates?state=VIC">Victoria</FooterLink>
          <FooterLink href="/rebates#stc">Federal STCs</FooterLink>
        </FooterCol>
        <FooterCol title="Company">
          <FooterLink href="/about">How we work</FooterLink>
          <FooterLink href="/blog">Guides</FooterLink>
          <FooterLink href="/quote">Get a free quote</FooterLink>
          <FooterLink href="/privacy">Privacy</FooterLink>
        </FooterCol>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x space-y-3 py-6 text-xs leading-relaxed text-ink-400">
          <p>
            <strong className="text-ink-200">Disclosure:</strong> {referralDisclosure}{" "}
            <Link href="/about" className="underline hover:text-white">How our referrals work</Link>.
          </p>
          <p>
            Prices and rebate amounts shown on this preview site are placeholders marked TBC and are not offers.
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
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-ink-400 transition-colors hover:text-white">{children}</Link>
    </li>
  );
}
