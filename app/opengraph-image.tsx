import { ogContentType, ogImage, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: heat pump hot water, installed for a fixed price`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "Heat pump hot water", title: "Cut your hot water bill. Let rebates cover part of the switch.", subtitle: "Compare six systems, check STCs and state rebates, get a fixed price." });
}
