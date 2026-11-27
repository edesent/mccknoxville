/**
 * The events list lives in src/content/events.json. The pastor adds, changes
 * and removes entries from the editor at /edit (src/edit), and the home
 * pages Coming up section reads the same file.
 */

export type Photo = { src: string; alt: string };
export type ScheduleDay = { day: string; items: string[] };
export type ChurchEvent = {
  id: string;
  title: string;
  /** First day, YYYY-MM-DD. */
  start: string;
  /** Last day, YYYY-MM-DD — left out for a one-day event. */
  end?: string;
  /** How the dates/times read on the card. Derived from the dates when left out. */
  time?: string;
  description: string;
  /** Where it happens: "MCC Knoxville & Zoom". */
  where?: string;
  /** A Zoom or sign-up link. */
  link?: string;
  speakers?: string;
  schedule?: ScheduleDay[];
  note?: string;
  contact?: { name: string; phone: string; tel: string };
  photos?: Photo[];
  /** Navy date badge instead of the lighter one. */
  highlight?: boolean;
};

/** An event stays on the site through its last day, then drops off by itself. */
export const GRACE_DAYS = 0;
export const TIME_ZONE = "America/New_York";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function isRealDate(d: unknown): d is string {
  if (typeof d !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const t = new Date(`${d}T12:00:00Z`);
  // An impossible date (2026-13-40) parses as Invalid Date, whose toISOString() throws.
  return !Number.isNaN(t.getTime()) && t.toISOString().slice(0, 10) === d;
}

/** Today’s date in Knoxville, as YYYY-MM-DD. */
export function todayISO(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export const lastDay = (ev: Pick<ChurchEvent, "start" | "end">) => ev.end ?? ev.start;

export function addDays(date: string, n: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Still worth showing visitors: not over yet. */
export const isShowing = (ev: Pick<ChurchEvent, "start" | "end">, today: string) => addDays(lastDay(ev), GRACE_DAYS) >= today;
export const isPast = (ev: Pick<ChurchEvent, "start" | "end">, today: string) => lastDay(ev) < today;

export const sortEvents = <T extends Pick<ChurchEvent, "start">>(list: T[]) => [...list].sort((a, b) => a.start.localeCompare(b.start));

function parts(date: string) {
  const d = new Date(`${date}T12:00:00Z`);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), date: d };
}

/** The date badge on the card: "OCT / 21-23 / 2026". */
export function badgeFor(ev: Pick<ChurchEvent, "start" | "end">) {
  const a = parts(ev.start);
  const b = parts(lastDay(ev));
  const sameMonth = a.y === b.y && a.m === b.m;
  return {
    month: MONTHS[a.m],
    day: ev.end && ev.end !== ev.start && sameMonth ? `${a.d}-${b.d}` : String(a.d),
    label: String(a.y),
  };
}

const long = (date: Date, withYear: boolean) =>
  date.toLocaleDateString("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric", ...(withYear ? { year: "numeric" } : {}) });

/** "Wednesday, October 21 – Friday, October 23, 2026" — used when the card has no wording of its own. */
export function whenFor(ev: Pick<ChurchEvent, "start" | "end" | "time">) {
  if (ev.time?.trim()) return ev.time.trim();
  const a = parts(ev.start);
  const b = parts(lastDay(ev));
  if (ev.start === lastDay(ev)) return long(a.date, true);
  return `${long(a.date, a.y !== b.y)} – ${long(b.date, true)}`;
}

/** A stable file-safe id for a new event: "youth-conference-2027". */
export function slugId(title: string, start: string) {
  const words = title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)
    .replace(/-$/, "");
  return `${words || "event"}-${start.slice(0, 4)}`;
}

/** "(734) 674-0250" → "+17346740250" for a tel: link. */
export function telFor(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits ? `+${digits}` : "";
}
