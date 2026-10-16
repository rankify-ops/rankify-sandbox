"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";

/**
 * Site-wide: records ad attribution on the first page load, and fires `click_to_call`
 * for every tel: link (header, sticky bar, footer, CTAs) via one delegated listener.
 */
export function Analytics() {
  useEffect(() => {
    captureAttribution();
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="tel:"]');
      if (!link) return;
      const where = link.closest("[data-track-location], header, footer, nav, section, aside, dialog");
      track("click_to_call", {
        link_location: where?.getAttribute("data-track-location") ?? where?.tagName.toLowerCase() ?? "page",
        page_path: window.location.pathname,
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
