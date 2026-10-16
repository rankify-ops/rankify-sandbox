import { ogContentType, ogImage, ogSize } from "@/lib/og";
import { programsFor, rebateStates, stateNames } from "@/lib/rebates";

export const alt = "Heat pump hot water rebates by state";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return rebateStates.map((s) => ({ state: s.toLowerCase() }));
}

export default async function Image({ params }: { params: Promise<{ state: string }> }) {
  const slug = (await params).state;
  const s = rebateStates.find((x) => x.toLowerCase() === slug) ?? "NSW";
  const name = stateNames[s].replace(/^the /, "").replace(/^./, (c) => c.toUpperCase());
  const confirmed = programsFor(s).filter((p) => p.amountConfirmed);
  return ogImage({
    eyebrow: `Rebates · ${s}`,
    title: `Heat pump hot water rebates in ${name} (2026)`,
    subtitle: confirmed.length ? `${confirmed[0].name}: ${confirmed[0].amount}. Plus federal STCs.` : "Federal STCs, plus what we found on the official state pages.",
  });
}
