import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Hot water broken? Fast heat pump replacement quotes";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "Hot water stopped?", title: "Hot water broken? Get a fast heat pump replacement quote", subtitle: "Call, request a callback, or send a 30-second urgent request." });
}
