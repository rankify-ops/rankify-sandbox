import { ImageResponse } from "next/og";
import { site } from "./site";

/**
 * Shared Open Graph / share image (1200×630). Every main page uses this layout with its own
 * eyebrow, title and subtitle, so links shared to Facebook, LinkedIn, iMessage etc. say what
 * the page offers and carry the quote call to action.
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function ogImage({ eyebrow, title, subtitle, stat }: { eyebrow: string; title: string; subtitle?: string; stat?: { value: string; label: string } }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "#0b1b2b", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 32, fontWeight: 700 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#fb923c,#c2410c)" }} />
            {site.name}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#fdba74", textTransform: "uppercase", letterSpacing: 3 }}>{eyebrow}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: stat ? 760 : 1060 }}>
            <div style={{ fontSize: title.length > 60 ? 54 : 64, fontWeight: 700, lineHeight: 1.08 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 28, color: "#d3dce5", lineHeight: 1.3 }}>{subtitle}</div>}
          </div>
          {stat && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", padding: "24px 28px", borderRadius: 24, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ fontSize: 56, fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: 22, color: "#d3dce5" }}>{stat.label}</div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26 }}>
          <div style={{ display: "flex", padding: "14px 28px", borderRadius: 999, background: "#ea580c", fontWeight: 700 }}>Free quote in 60 seconds</div>
          <div style={{ display: "flex", color: "#d3dce5" }}>Licensed local installers · Rebates applied</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
