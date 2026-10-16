"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { Close, Menu, Phone } from "./icons";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex min-h-11 min-w-11 items-center gap-2" aria-label={`${site.name} home`}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ember-400 to-ember-600 shadow-[0_6px_16px_-6px_rgb(242_107_29/0.8)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.5 2 1.5 3 3 3-1-3 0-5.5 0-7.5Z" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={`font-display text-[1.05rem] font-semibold tracking-tight whitespace-nowrap max-[439px]:sr-only sm:text-lg ${light ? "text-white" : "text-ink-900"}`}>
        Aussie Heat Pumps
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/60 bg-cream-50/85 backdrop-blur-lg">
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <Logo />
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith(n.href) ? "bg-ink-900/5 text-ink-900" : "text-ink-600 hover:text-ink-900"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href={site.phoneHref} className="flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-ink-900">
            <Phone className="h-4 w-4" /> {site.phone}
          </a>
          <Link href="/quote" className="btn-primary py-2.5">
            Free quote <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-bold">60s</span>
          </Link>
        </div>
        <div className="flex items-center gap-1.5 lg:hidden">
          <a
            href={site.phoneHref}
            className="grid h-11 w-11 place-items-center rounded-full border border-ink-200 text-ink-800"
            aria-label={`Call ${site.phone}`}
          >
            <Phone className="h-4 w-4" />
          </a>
          <Link href="/quote" className="flex h-11 items-center rounded-full bg-ember-600 px-3.5 text-sm font-semibold whitespace-nowrap text-white">
            Free quote
          </Link>
          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-ink-200"
            onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="border-t border-ink-200/60 bg-cream-50 lg:hidden">
          <nav className="container-x flex flex-col py-3" aria-label="Mobile">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-xl px-3 py-3 font-medium text-ink-800 hover:bg-ink-900/5">
                {n.label}
              </Link>
            ))}
            <Link href="/quote" className="btn-primary mt-3">
              Get a free quote in 60 seconds
            </Link>
            <a href={site.phoneHref} className="btn-ghost mt-2">
              <Phone className="h-4 w-4" /> Call {site.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
