import { cities, cityDetails, getCity } from "@/lib/cities";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Heat pump hot water local guide";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ city: string }> }) {
  const c = getCity((await params).city);
  if (!c) return ogImage({ eyebrow: "Local guides", title: "Heat pump hot water in your city" });
  const d = cityDetails(c);
  return ogImage({
    eyebrow: `${c.name}, ${c.state}`,
    title: `Heat pump hot water in ${c.name}`,
    subtitle: `STC zone ${d.zone} · July mean minimum ${c.bom.julyMeanMin} °C · recommended models and guide prices`,
    stat: { value: `${d.stcLo}–${d.stcHi}`, label: `STCs, ${d.year} install` },
  });
}
