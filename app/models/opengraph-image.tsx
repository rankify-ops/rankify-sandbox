import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Heat pump models and guide prices";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "Models & prices", title: "Six proven heat pumps. Clear guide prices, installed.", subtitle: "Supply and standard installation, before rebates." });
}
