import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Heat pump rebate checker by postcode";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "Rebates", title: "Check your heat pump rebates by postcode", subtitle: "Federal STCs and state programs, from official government pages." });
}
