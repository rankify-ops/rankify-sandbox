import Link from "next/link";
import { formTrustPoints, privacyNote } from "@/lib/site";
import { Check, Clock, Leaf, Lock, Shield } from "./icons";

const icons = { free: Check, licensed: Shield, rebates: Leaf, response: Clock };

/** Trust signals shown next to every lead form. */
export function FormTrust({ tone = "light", compact = false }: { tone?: "light" | "dark"; compact?: boolean }) {
  const dark = tone === "dark";
  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <ul className={`grid gap-x-5 gap-y-2 text-sm ${compact ? "grid-cols-1" : "sm:grid-cols-2"}`}>
        {formTrustPoints.map((p) => {
          const Icon = icons[p.key];
          return (
            <li key={p.key} className={`flex items-center gap-2 ${dark ? "text-ink-200" : "text-ink-700"}`}>
              <Icon className={`h-4 w-4 shrink-0 ${dark ? "text-ember-400" : "text-gum-500"}`} />
              {p.label}
            </li>
          );
        })}
      </ul>
      <p className={`flex gap-2 text-xs leading-relaxed ${dark ? "text-ink-400" : "text-ink-400"}`}>
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          {privacyNote}{" "}
          <Link href="/privacy" className="underline hover:text-ember-600">Privacy Policy</Link>
        </span>
      </p>
    </div>
  );
}
