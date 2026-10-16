"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { Arrow, Phone } from "./icons";

/** Always-visible Call + Get a Quote bar on mobile. Hidden from md up. */
export function StickyMobileBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/thank-you")) return null;
  const onQuote = pathname.startsWith("/quote");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-200/70 bg-white/95 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgb(11_27_43/0.25)] backdrop-blur md:hidden">
      <div className="flex gap-2.5">
        <a href={site.phoneHref} className="btn-ghost flex-1 py-3 text-base" aria-label={`Call ${site.phone}`}>
          <Phone className="h-4 w-4" /> Call
        </a>
        {onQuote ? (
          <a href="#callback" className="btn-dark flex-[1.6] py-3 text-base">Request a callback</a>
        ) : (
          <Link href="/quote" className="btn-primary flex-[1.6] py-3 text-base">
            Get a free quote <Arrow className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
