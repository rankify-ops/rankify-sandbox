import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Compare heat pump hot water systems side by side";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "Compare", title: "Compare heat pump hot water systems side by side", subtitle: "Tank size, climate fit, guide price, STCs for your postcode and noise." });
}
