"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Records which URLs 404, so broken links from ads or other sites can be fixed. */
export function NotFoundTracker() {
  useEffect(() => {
    track("page_not_found", { page_path: window.location.pathname });
  }, []);
  return null;
}
