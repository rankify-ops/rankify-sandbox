import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: heat pump hot water, installed for a fixed price`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0b1b2b", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 36, fontWeight: 700 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg,#fb923c,#c2410c)" }} />
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, maxWidth: 950 }}>Hot water that costs less to run. Installed for a fixed price.</div>
          <div style={{ fontSize: 32, color: "#d3dce5" }}>Free, no-obligation quotes from licensed local installers</div>
        </div>
      </div>
    ),
    size,
  );
}
