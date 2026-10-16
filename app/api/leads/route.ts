import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { after, NextResponse } from "next/server";
import { callbackSchema, fieldErrors, HONEYPOT_FIELD, leadSchema } from "@/lib/lead";
import { forwardLead } from "@/lib/leadWebhook";

// Temporary storage: append to a JSON file. Vercel's filesystem is read-only apart
// from /tmp (which is per-instance and short-lived), so on Vercel rely on the
// console log in the function logs. Swap this for a CRM/database before launch.
const LEADS_FILE = process.env.VERCEL
  ? "/tmp/leads.json"
  : path.join(process.cwd(), "data", "leads.json");

let writeQueue: Promise<unknown> = Promise.resolve();

async function appendLead(lead: object) {
  await mkdir(path.dirname(LEADS_FILE), { recursive: true });
  let existing: unknown[] = [];
  try {
    existing = JSON.parse(await readFile(LEADS_FILE, "utf8"));
  } catch {
    // First lead, or unreadable file: start fresh.
  }
  existing.push(lead);
  await writeFile(LEADS_FILE, JSON.stringify(existing, null, 2));
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: real visitors never see this field, so anything in it means a bot.
  // Reject before validating, store nothing, and answer like a success so it doesn't retry.
  const trap = (body as Record<string, unknown> | null)?.[HONEYPOT_FIELD];
  if (typeof trap === "string" ? trap.trim() !== "" : trap != null) {
    console.warn("[lead] honeypot filled; discarded");
    return NextResponse.json({ ok: true });
  }

  const isCallback = (body as { type?: unknown } | null)?.type === "callback";
  const parsed = isCallback ? callbackSchema.safeParse(body) : leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 422 });
  }

  const { company, ...fields } = parsed.data;
  const lead = {
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    ...fields,
    userAgent: req.headers.get("user-agent") ?? undefined,
  };

  console.log("[lead]", JSON.stringify(lead));
  writeQueue = writeQueue.then(() => appendLead(lead)).catch((err) => console.error("[lead] file write failed", err));
  await writeQueue;
  // Forward after the response is sent, so a slow webhook never delays the visitor.
  after(() => forwardLead(lead));

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}
