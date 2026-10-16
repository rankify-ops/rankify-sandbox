import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead";

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

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    // A filled honeypot is a bot: pretend success so it doesn't retry.
    if (errors.company) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, errors }, { status: 422 });
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

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}
