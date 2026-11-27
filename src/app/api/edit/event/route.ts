import { sameOrigin, sessionEmail } from "@/edit/auth";
import { commitFiles, readFile, snapshot, type FileChange, type Snapshot } from "@/edit/github";
import { type ChurchEvent, type ScheduleDay, isRealDate, slugId, sortEvents, telFor, whenFor } from "@/lib/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIST = "src/content/events.json";
const DIR = "public/events";
const MAX_PHOTOS = 4;

const tidy = (s: unknown, max: number) => (typeof s === "string" ? s.replace(/\s+/g, " ").trim().slice(0, max) : "");

type IncomingPhoto = { src: string } | { sha: string };
type Incoming = {
  replaceId?: string;
  title: string;
  start: string;
  end?: string;
  time?: string;
  description: string;
  where?: string;
  link?: string;
  speakers?: string;
  schedule?: ScheduleDay[];
  note?: string;
  contactName?: string;
  contactPhone?: string;
  highlight?: boolean;
  photos: IncomingPhoto[];
};

async function readList(snap: Snapshot) {
  const text = await readFile(LIST, snap);
  if (text === null) throw new Error(`${LIST} is missing`);
  return JSON.parse(text) as ChurchEvent[];
}

const write = (list: ChurchEvent[]): FileChange => ({ path: LIST, content: `${JSON.stringify(sortEvents(list), null, 2)}\n` });

/** Photo files this editor created, so removing an event (or a photo) can clean them up. */
const ownPhotos = (ev: ChurchEvent | undefined, snap: Snapshot) =>
  (ev?.photos ?? []).map((p) => `public${p.src}`).filter((p) => p.startsWith(`${DIR}/`) && snap.paths.has(p));

/** The events as they are on the branch right now (the editor's list). */
export async function GET() {
  if (!(await sessionEmail())) return Response.json({ error: "Sign in again." }, { status: 401 });
  try {
    const snap = await snapshot({ withFiles: false });
    return Response.json({ events: sortEvents(await readList(snap)) }, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    console.error("events read", e);
    return Response.json({ error: "Couldn’t read the events. Try again in a minute." }, { status: 502 });
  }
}

/** Reads the form the editor sent, or says what's wrong with it. */
function parse(body: unknown): { ok: true; ev: Incoming } | { ok: false; error: string } {
  const b = (body ?? {}) as Record<string, unknown>;
  const title = tidy(b.title, 120);
  if (!title) return { ok: false, error: "Give the event a name." };
  if (!isRealDate(b.start)) return { ok: false, error: "Pick the day the event starts." };
  const start = b.start;
  const end = b.end ? b.end : undefined;
  if (end !== undefined && !isRealDate(end)) return { ok: false, error: "The end date isn’t a real date." };
  if (end && end < start) return { ok: false, error: "The event can’t end before it starts." };
  const description = tidy(b.description, 1500);
  if (!description) return { ok: false, error: "Add a sentence or two about the event." };

  const schedule: ScheduleDay[] = [];
  if (Array.isArray(b.schedule)) {
    for (const d of b.schedule.slice(0, 7) as Partial<ScheduleDay>[]) {
      const day = tidy(d?.day, 60);
      const items = Array.isArray(d?.items) ? d.items.map((i) => tidy(i, 80)).filter(Boolean).slice(0, 8) : [];
      if (day && items.length) schedule.push({ day, items });
    }
  }

  const photos: IncomingPhoto[] = [];
  if (Array.isArray(b.photos)) {
    for (const p of b.photos.slice(0, MAX_PHOTOS) as Record<string, unknown>[]) {
      if (typeof p?.sha === "string" && /^[0-9a-f]{40}$/.test(p.sha)) photos.push({ sha: p.sha });
      else if (typeof p?.src === "string" && /^\/[\w./-]+$/.test(p.src)) photos.push({ src: p.src });
    }
  }

  return {
    ok: true,
    ev: {
      replaceId: typeof b.replaceId === "string" ? b.replaceId : undefined,
      title,
      start,
      end: end && end !== start ? end : undefined,
      time: tidy(b.time, 120) || undefined,
      description,
      where: tidy(b.where, 120) || undefined,
      link: typeof b.link === "string" && /^(https:\/\/|\/)[^\s"<>]{1,500}$/.test(b.link.trim()) ? b.link.trim() : undefined,
      speakers: tidy(b.speakers, 300) || undefined,
      schedule,
      note: tidy(b.note, 500) || undefined,
      contactName: tidy(b.contactName, 80),
      contactPhone: tidy(b.contactPhone, 30),
      highlight: b.highlight === true,
      photos,
    },
  };
}

/**
 * Add an event, or replace one (replaceId). New photos arrive as blob ids
 * from /api/edit/event/photo and are committed with the list in one commit;
 * photos kept from the old version are referenced by their existing path.
 */
export async function POST(req: Request) {
  const email = await sessionEmail();
  if (!email) return Response.json({ error: "Your sign-in ran out. Sign in again to save." }, { status: 401 });
  if (!sameOrigin(req)) return Response.json({ error: "Bad origin." }, { status: 403 });

  const parsed = parse(await req.json().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  const form = parsed.ev;

  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      const snap = await snapshot({ withFiles: false });
      const list = await readList(snap);
      const existing = form.replaceId ? list.find((e) => e.id === form.replaceId) : undefined;
      if (form.replaceId && !existing) return Response.json({ error: "That event is no longer on the site. Close this and open the list again." }, { status: 409 });

      let id = existing?.id ?? slugId(form.title, form.start);
      for (let n = 2; !existing && list.some((e) => e.id === id); n++) id = `${slugId(form.title, form.start)}-${n}`;

      // Photos: kept ones must be the old event's own; new ones get fresh names so no browser shows a stale image.
      const stamp = Date.now().toString(36);
      const changes: FileChange[] = [];
      const photos = form.photos.flatMap((p, i) => {
        if ("src" in p) {
          const old = existing?.photos?.find((o) => o.src === p.src);
          return old ? [old] : [];
        }
        const name = `${id}-${i + 1}-${stamp}.jpg`;
        changes.push({ path: `${DIR}/${name}`, sha: p.sha });
        return [{ src: `/events/${name}`, alt: `${form.title} at MCC Knoxville` }];
      });
      const kept = new Set(photos.map((p) => `public${p.src}`));
      for (const path of ownPhotos(existing, snap)) if (!kept.has(path)) changes.push({ path, remove: true });

      const ev: ChurchEvent = {
        id,
        title: form.title,
        start: form.start,
        ...(form.end ? { end: form.end } : {}),
        ...(form.time ? { time: form.time } : {}),
        description: form.description,
        ...(form.where ? { where: form.where } : {}),
        ...(form.link ? { link: form.link } : {}),
        ...(form.speakers ? { speakers: form.speakers } : {}),
        ...(form.schedule?.length ? { schedule: form.schedule } : {}),
        ...(form.note ? { note: form.note } : {}),
        ...(form.contactName && form.contactPhone
          ? { contact: { name: form.contactName, phone: form.contactPhone, tel: telFor(form.contactPhone) } }
          : {}),
        ...(photos.length ? { photos } : {}),
        ...(form.highlight ? { highlight: true } : {}),
      };

      changes.push(write([...list.filter((e) => e.id !== id), ev]));
      const message = `${existing ? "Update" : "Add"} event: ${ev.title} (${whenFor(ev)})\n\n${existing ? "Updated" : "Added"} by ${email} on ${req.headers.get("host")}.`;
      const done = await commitFiles(snap.commit, changes, message);
      if (done) return Response.json({ ok: true, commit: done.commit, id, path: "/events" });
    }
    return Response.json({ error: "The site changed while saving. Save again." }, { status: 409 });
  } catch (e) {
    console.error("event save", e);
    return Response.json({ error: "Saving failed — nothing was changed. Try again in a minute." }, { status: 502 });
  }
}

/** Remove an event and the photos the editor uploaded for it. */
export async function DELETE(req: Request) {
  const email = await sessionEmail();
  if (!email) return Response.json({ error: "Your sign-in ran out. Sign in again." }, { status: 401 });
  if (!sameOrigin(req)) return Response.json({ error: "Bad origin." }, { status: 403 });
  const body = (await req.json().catch(() => null)) as { id?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) return Response.json({ error: "Which event?" }, { status: 400 });

  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      const snap = await snapshot({ withFiles: false });
      const list = await readList(snap);
      const existing = list.find((e) => e.id === id);
      if (!existing) return Response.json({ error: "That event is already gone." }, { status: 409 });
      const changes: FileChange[] = [...ownPhotos(existing, snap).map((path) => ({ path, remove: true as const })), write(list.filter((e) => e.id !== id))];
      const message = `Remove event: ${existing.title} (${whenFor(existing)})\n\nRemoved by ${email} on ${req.headers.get("host")}.`;
      const done = await commitFiles(snap.commit, changes, message);
      if (done) return Response.json({ ok: true, commit: done.commit, path: "/events" });
    }
    return Response.json({ error: "The site changed while saving. Try again." }, { status: 409 });
  } catch (e) {
    console.error("event remove", e);
    return Response.json({ error: "Removing failed — nothing was changed. Try again in a minute." }, { status: 502 });
  }
}
