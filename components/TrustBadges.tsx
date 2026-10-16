import { Check, Shield, Users } from "./icons";

/**
 * PLACEHOLDER trust badges. Each one is visibly marked "Placeholder" until it's backed by
 * real, checkable details (licence numbers, insurer, network size). Don't remove the label
 * without replacing the content with verified facts.
 */
const badges = [
  { icon: Shield, title: "Licensed installers", detail: "Plumbing & electrical licence numbers TBC" },
  { icon: Check, title: "Fully insured", detail: "Public liability insurer & cover TBC" },
  { icon: Users, title: "Partner installer network", detail: "Licensed partners, network size and coverage TBC" },
];

export function TrustBadges({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <ul className={`grid gap-3 sm:grid-cols-3 ${className}`} aria-label="Trust badges (placeholders)">
      {badges.map(({ icon: Icon, title, detail }) => (
        <li
          key={title}
          className={`flex items-start gap-3 rounded-2xl border border-dashed p-4 ${dark ? "border-white/25 bg-white/5" : "border-ink-200 bg-white"}`}
        >
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${dark ? "bg-white/10 text-ember-300" : "bg-gum-50 text-gum-600"}`}>
            <Icon className="h-5 w-5" />
          </span>
          <span>
            <span className={`block font-semibold ${dark ? "text-white" : "text-ink-900"}`}>{title}</span>
            <span className={`block text-xs ${dark ? "text-ink-200" : "text-ink-600"}`}>{detail}</span>
            <span className="mt-1.5 inline-flex rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-bold tracking-wide text-amber-800 uppercase">
              Placeholder
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
