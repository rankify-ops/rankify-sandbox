import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Heat pump hot water guides by city";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "Local guides", title: "Heat pump hot water in your city", subtitle: "Climate, STC zone, state rebates and the right system for 20 cities." });
}
