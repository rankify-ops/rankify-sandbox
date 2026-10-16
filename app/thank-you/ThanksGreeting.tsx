"use client";

import { useSyncExternalStore } from "react";
import { THANKS_KEY } from "@/lib/site";

function read(): string {
  try {
    return sessionStorage.getItem(THANKS_KEY) ?? "";
  } catch {
    return "";
  }
}

/** Personalises the heading with the first name the visitor just entered (kept in this tab only). */
export function ThanksGreeting({ fallback }: { fallback: string }) {
  const raw = useSyncExternalStore(() => () => {}, read, () => "");
  let firstName = "";
  try {
    firstName = raw ? String(JSON.parse(raw).firstName ?? "") : "";
  } catch {}
  return <>{firstName ? `Thanks ${firstName}, ${fallback.charAt(0).toLowerCase()}${fallback.slice(1)}` : fallback}</>;
}
