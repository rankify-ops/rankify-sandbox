import Link from "next/link";
import { Arrow } from "./icons";

/** The closing CTA pair for a section: 60-second quote (primary) + callback (secondary). */
export function SectionCta({ align = "start", note, tone = "light", className = "" }: { align?: "start" | "center"; note?: string; tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <div className={`flex flex-col gap-3 ${align === "center" ? "items-center text-center" : "items-start"} ${className}`}>
      <div className={`flex w-full flex-col gap-3 sm:w-auto sm:flex-row ${align === "center" ? "sm:justify-center" : ""}`}>
        <Link href="/quote" className="btn-primary px-7 py-3.5 text-base">
          Get my free 60-second quote <Arrow className="h-4 w-4" />
        </Link>
        <Link
          href="/quote#callback"
          className={dark ? "btn border border-white/25 px-7 py-3.5 text-base text-white hover:bg-white/10" : "btn-ghost px-7 py-3.5 text-base"}
        >
          Request a callback
        </Link>
      </div>
      {note && <p className={`text-sm ${dark ? "text-ink-200" : "text-ink-600"}`}>{note}</p>}
    </div>
  );
}
