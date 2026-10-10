import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { org } from "@/lib/site";

/**
 * The endpoint behind every form: contact, prayer requests and "save us a
 * seat" visits.
 *
 * Messages go to FORM_WEBHOOK_URL — a Slack (or Teams) incoming webhook — so
 * they reach the pastor's phone in seconds. Until that is set the endpoint
 * answers 503 and the form honestly tells people to call the church.
 *
 * Spam defences: a signed load-time token (GET) that must be at least 3
 * seconds old, a honeypot field, a per-IP rate limit, and a rule that
 * free-text answers may not contain links. Anything that trips a defence gets
 * a fake success and is dropped.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECRET = process.env.FORM_SECRET || process.env.FORM_WEBHOOK_URL || "";
const MIN_FILL_MS = 3000;
const MAX_AGE_MS = 1000 * 60 * 60 * 6;

function sign(ts: string) {
  return createHmac("sha256", SECRET).update(ts).digest("hex");
}

function tokenOk(token: unknown) {
  if (!SECRET) return true; // nothing to sign with yet; the webhook is unset too
  if (typeof token !== "string") return false;
  const [ts, sig] = token.split(".");
  if (!ts || !sig) return false;
  const expected = Buffer.from(sign(ts));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  const age = Date.now() - Number(ts);
  return age >= MIN_FILL_MS && age <= MAX_AGE_MS;
}

export async function GET() {
  const ts = String(Date.now());
  return NextResponse.json(
    { token: SECRET ? `${ts}.${sign(ts)}` : `${ts}.${randomBytes(8).toString("hex")}` },
    { headers: { "Cache-Control": "no-store" } },
  );
}

// Best-effort, per serverless instance.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const clean = (v: unknown, max = 2000) =>
  typeof v === "string"
    ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max)
    : "";

const hasLink = (s: string) => /(https?:\/\/|www\.|\.(com|net|ru|xyz|top)\b)/i.test(s);
/** A phone-or-email field: an email address is fine, a web link is not. */
const badContact = (s: string) =>
  /(https?:\/\/|www\.)/i.test(s) || (/\.(com|net|ru|xyz|top)\b/i.test(s) && !s.includes("@"));
const fake = () => NextResponse.json({ ok: true });

type Body = Record<string, unknown>;
type Built = { text: string } | { error: string } | { spam: true };

function fullName(name: string) {
  return name.split(/\s+/).filter(Boolean).length >= 2;
}

function contactMessage(b: Body): Built {
  const name = clean(b.name, 80);
  const contact = clean(b.contact, 120);
  const topic = clean(b.topic, 60);
  const message = clean(b.message, 4000);
  if (!fullName(name)) return { error: "Please give your first and last name." };
  if (!contact) return { error: "Leave a phone number or email so we can reply." };
  if (!message) return { error: "Please write a message." };
  if ([name, message, topic].some(hasLink) || badContact(contact)) return { spam: true };
  return {
    text: [
      `*New message — ${org.name} website*`,
      `*Name:* ${name}`,
      `*Reach them at:* ${contact}`,
      ...(topic ? [`*About:* ${topic}`] : []),
      "",
      message,
    ].join("\n"),
  };
}

function prayerMessage(b: Body): Built {
  const request = clean(b.request, 4000);
  const name = clean(b.name, 80);
  const contact = clean(b.contact, 120);
  const share = b.share === true;
  if (!request) return { error: "Please tell us how we can pray." };
  if ([request, name].some(hasLink) || (contact && badContact(contact))) return { spam: true };
  return {
    text: [
      `*Prayer request — ${share ? "OK to share in the weekly email" : "pastoral team only"}*`,
      `*From:* ${name || "Anonymous"}`,
      ...(contact ? [`*Call back:* ${contact}`] : []),
      "",
      request,
    ].join("\n"),
  };
}

function visitMessage(b: Body): Built {
  const name = clean(b.name, 80);
  const contact = clean(b.contact, 120);
  const when = clean(b.when, 80);
  const party = Math.max(1, Math.min(20, Number(b.party) || 1));
  const needs = Array.isArray(b.needs)
    ? b.needs.map((n) => clean(n, 60)).filter(Boolean)
    : clean(b.needs, 60)
      ? [clean(b.needs, 60)]
      : [];
  if (!fullName(name)) return { error: "Please give your first and last name." };
  if (!contact) return { error: "Leave a phone number or email so we can say hello." };
  if ([name, when].some(hasLink) || badContact(contact)) return { spam: true };
  return {
    text: [
      `*Someone’s coming to visit!*`,
      `*Name:* ${name}`,
      `*Reach them at:* ${contact}`,
      `*Party of:* ${party}`,
      when && `*When:* ${when}`,
      needs.length > 0 && `*Notes:* ${needs.join(", ")}`,
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > 12_000) return NextResponse.json({ error: "Too long." }, { status: 413 });

  let body: Body;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.website) return fake();
  if (!tokenOk(body.token)) return fake();

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(`${body.kind}:${ip}`)) return fake();

  const built =
    body.kind === "contact"
      ? contactMessage(body)
      : body.kind === "prayer"
        ? prayerMessage(body)
        : body.kind === "visit"
          ? visitMessage(body)
          : null;
  if (!built) return NextResponse.json({ error: "Unknown form." }, { status: 400 });
  if ("spam" in built) return fake();
  if ("error" in built) return NextResponse.json({ error: built.error }, { status: 400 });

  const webhook = process.env.FORM_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      {
        error:
          "Our online form isn’t connected yet. Please call the church office. We’d love to hear from you.",
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: built.text }),
    });
    if (!res.ok) throw new Error(String(res.status));
  } catch {
    return NextResponse.json(
      { error: "We couldn’t send that just now. Please call the church office instead." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
