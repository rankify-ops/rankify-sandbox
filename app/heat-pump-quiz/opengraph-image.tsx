import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Which heat pump suits my home? 60-second quiz";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "60-second quiz", title: "Which heat pump suits my home?", subtitle: "Five questions. One or two matched systems, with the price after STCs." });
}
