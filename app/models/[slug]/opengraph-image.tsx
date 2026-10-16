import { ogContentType, ogImage, ogSize } from "@/lib/og";
import { formatAUD, getModel, models } from "@/lib/models";

export const alt = "Heat pump model guide price and specs";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return models.map((m) => ({ slug: m.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const m = getModel((await params).slug);
  if (!m) return ogImage({ eyebrow: "Models", title: "Heat pump hot water systems" });
  return ogImage({
    eyebrow: `${m.brand} · ${m.type}`,
    title: m.name,
    subtitle: `${m.capacityLitres} L for ${m.households}. Rated from ${String(m.minOperatingC).replace("-", "−")} °C, ${m.compare.noise}.`,
    stat: { value: formatAUD(m.priceFrom), label: m.priceConfirmed ? "installed, before rebates" : "guide price, installed" },
  });
}
