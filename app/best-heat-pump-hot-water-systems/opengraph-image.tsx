import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Best heat pump hot water systems in Australia (2026)";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "Buying guide", title: "Best heat pump hot water systems in Australia (2026)", subtitle: "Six systems compared on size, efficiency, noise, warranty and price." });
}
