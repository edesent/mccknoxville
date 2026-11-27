"use client";

import "./editor.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { type ChurchEvent, isPast, todayISO, whenFor } from "@/lib/events";

/**
 * The pastor's editor, opened at /edit.
 *
 * Text: any text on the page that the server can trace to exactly one place
 * in the source gets outlined on hover. Clicking it opens a box to rewrite it;
 * Publish sends every change (with the text around it, to tell repeats apart)
 * to /api/edit/text, which commits them. The site itself is never restructured
 * for this — the page's own text nodes are read and updated in place.
 *
 * Events: the Events button lists what's in src/content/events.json, with
 * Add / Edit / Remove. Photos are shrunk in the browser and committed with the
 * entry (/api/edit/event).
 */

type Note = { tone: "info" | "good" | "bad"; text: string };
type Landmark = "footer" | "nav" | "header" | "main";
type Edit = { path: string; text: string; to: string; context: string[]; where: string; landmark?: Landmark };
type Deploy = {
  commit: string;
  state: "pending" | "live" | "failed";
  startedAt: number;
  what: string;
  /** Text edits to look for on the live pages once deployed. */
  check?: { path: string; to: string }[];
  /** Where the change will appear. */
  link?: string;
};
type Confirm = { kind: "publish"; problems?: Record<string, string> } | { kind: "exit" } | { kind: "events" };
type FormPhoto = { key: string; url: string; src?: string; blob?: Blob; sha?: string };
type Form = {
  replaceId?: string;
  title: string;
  start: string;
  end: string;
  time: string;
  description: string;
  where: string;
  link: string;
  speakers: string;
  schedule: string;
  note: string;
  contactName: string;
  contactPhone: string;
  highlight: boolean;
  photos: FormPhoto[];
};

const DRAFT_KEY = "mcck-edit-draft";
/** What we tell people a publish takes to reach the live site (Vercel build + deploy). */
const LIVE_SECONDS = 90;
const MAX_PHOTOS = 4;

const tidy = (s: string) => s.replace(/\s+/g, " ").trim();
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
const clip = (s: string, n = 140) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
const keyOf = (path: string, text: string, context: string[]) => `${path}\u0000${text}\u0000${context.join("\u0001")}`;
/** /edit shows the home page. */
const pagePath = (p: string) => (p === "/edit" ? "/" : p);

const btn =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[14.5px] font-semibold tracking-wide transition-colors disabled:cursor-progress disabled:opacity-60";
const solid = `${btn} bg-flame text-white hover:bg-plum`;
const outline = `${btn} border border-flame text-flame hover:bg-flame hover:text-white`;
const onDark = `${btn} border border-white/30 text-white hover:bg-white/10`;
const field =
  "w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-[16px] text-ink placeholder:text-muted focus:border-flame focus:outline-none";
const eyebrow = "block text-xs font-bold tracking-[0.2em] uppercase text-flame";
const danger = "text-[#b3261e]";

function loadDraft(): Edit[] {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "[]") as Edit[];
  } catch {
    return [];
  }
}
function saveDraft(list: Edit[]) {
  try {
    if (list.length) localStorage.setItem(DRAFT_KEY, JSON.stringify(list));
    else localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

/* ── Reading the page ───────────────────────────────────────────────────── */

const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "OPTION", "SELECT", "TEMPLATE"]);

/** Every text node on the page except the editor's own ([data-edit-skip]). */
function textNodes(root: Node) {
  const out: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const el = n.parentElement;
      if (!el || SKIP.has(el.tagName) || el.closest("svg, [data-edit-skip]")) return NodeFilter.FILTER_REJECT;
      return /[A-Za-z0-9]/.test(n.nodeValue ?? "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) out.push(n as Text);
  return out;
}

/** The texts nearest this one on the page — up to four levels out, closest first. */
function contextOf(node: Text, all: Text[], original: (t: Text) => string) {
  const order = new Map(all.map((n, i) => [n, i]));
  const here = order.get(node) ?? 0;
  const seen = new Set<Text>([node]);
  const out: string[] = [];
  let el: Element | null = node.parentElement;
  for (let level = 0; el && level < 4 && out.length < 8; level++, el = el.parentElement) {
    const inside = all.filter((n) => !seen.has(n) && el!.contains(n));
    inside.sort((a, b) => Math.abs((order.get(a) ?? 0) - here) - Math.abs((order.get(b) ?? 0) - here));
    for (const n of inside) {
      seen.add(n);
      out.push(tidy(original(n)));
      if (out.length >= 8) break;
    }
  }
  return out;
}

/** Which part of the page a text sits in — footer text comes from the footer's file, menu text from the menu's. */
function landmarkOf(node: Text): Landmark | undefined {
  const tag = node.parentElement?.closest("footer, nav, header, main")?.tagName.toLowerCase();
  return tag === "footer" || tag === "nav" || tag === "header" || tag === "main" ? tag : undefined;
}

/* ── Photos ─────────────────────────────────────────────────────────────── */

function toJpeg(canvas: HTMLCanvasElement, quality = 0.84) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode"))), "image/jpeg", quality),
  );
}

/** A photo as a JPEG no wider than 1800px, the way it will be committed. */
async function shrink(file: File) {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return toJpeg(canvas);
}

/* ── Event form helpers ─────────────────────────────────────────────────── */

const blankForm = (): Form => ({
  title: "",
  start: "",
  end: "",
  time: "",
  description: "",
  where: "",
  link: "",
  speakers: "",
  schedule: "",
  note: "",
  contactName: "",
  contactPhone: "",
  highlight: false,
  photos: [],
});

function formFrom(ev: ChurchEvent): Form {
  return {
    replaceId: ev.id,
    title: ev.title,
    start: ev.start,
    end: ev.end ?? "",
    time: ev.time ?? "",
    description: ev.description,
    where: ev.where ?? "",
    link: ev.link ?? "",
    speakers: ev.speakers ?? "",
    schedule: (ev.schedule ?? []).map((d) => `${d.day}: ${d.items.join(", ")}`).join("\n"),
    note: ev.note ?? "",
    contactName: ev.contact?.name ?? "",
    contactPhone: ev.contact?.phone ?? "",
    highlight: Boolean(ev.highlight),
    photos: (ev.photos ?? []).map((p) => ({ key: p.src, url: p.src, src: p.src })),
  };
}

/** "Thursday, Oct 22: Dinner — 6:00 PM, Service — 7:00 PM" → one schedule day. */
function parseSchedule(text: string) {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const at = line.indexOf(":");
      const day = at > 0 ? line.slice(0, at).trim() : line;
      const items = (at > 0 ? line.slice(at + 1) : "")
        .split(/[,;]|\s{2,}/)
        .map((i) => i.trim())
        .filter(Boolean);
      return { day, items };
    })
    .filter((d) => d.day && d.items.length);
}

/* ── The dialog shell ───────────────────────────────────────────────────── */

function Dialog({ title, wide, children }: { title: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div data-edit-skip className="fixed inset-0 z-[95] flex items-center justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-dialog-title"
        className={`my-auto w-full ${wide ? "max-w-[680px]" : "max-w-[500px]"} rounded-2xl border-t-4 border-flame bg-white p-7 shadow-[0_30px_80px_-20px_rgba(20,34,68,0.55)] sm:p-9`}
      >
        <h2 id="edit-dialog-title" className="display-sm text-[27px] leading-tight text-ink">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

/** `onClose` leaves edit mode (EditGate reloads the page fresh, without the editor). */
export function Editor({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [preview, setPreview] = useState(false);
  const [edits, setEdits] = useState<Edit[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<Note | null>(null);
  const [deploy, setDeploy] = useState<Deploy | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [addr, setAddr] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);
  // The text box for one piece of text.
  const [open, setOpen] = useState<{ node: Text; text: string; context: string[]; where: string; landmark?: Landmark; value: string } | null>(null);
  // Events: the list from the server, the form being filled in, and the one about to be removed.
  const [evList, setEvList] = useState<ChurchEvent[] | null>(null);
  const [evError, setEvError] = useState<string | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [evWork, setEvWork] = useState<string | null>(null);
  const [removing, setRemoving] = useState<ChurchEvent | null>(null);

  /** Per text node: its words as the source has them (before any edit here) and where they live. */
  const original = useRef(new WeakMap<Text, string>());
  const placed = useRef(new WeakMap<Text, { where: string; context: string[]; landmark?: Landmark }>());
  const answers = useRef(new Map<string, string | null>());
  const editsRef = useRef<Edit[]>([]);
  editsRef.current = edits;

  const textOf = useCallback((n: Text) => original.current.get(n) ?? n.nodeValue ?? "", []);

  const writeEdits = useCallback((next: Edit[]) => {
    setEdits(next);
    saveDraft(next);
  }, []);

  /** Show every change on the page, amber-outlined; anything else shows its original words. */
  const paint = useCallback(() => {
    const path = location.pathname;
    for (const node of textNodes(document.body)) {
      const info = placed.current.get(node);
      if (!info) continue;
      const was = textOf(node);
      const edit = editsRef.current.find((e) => e.path === path && e.text === tidy(was) && e.context.join() === info.context.join());
      const raw = node.nodeValue ?? "";
      const lead = raw.match(/^\s*/)![0];
      const trail = raw.match(/\s*$/)![0];
      const want = edit ? `${lead}${edit.to}${trail}` : was;
      if (!original.current.has(node)) original.current.set(node, raw);
      if (raw !== want) node.nodeValue = want;
      node.parentElement?.toggleAttribute("data-txt-changed", Boolean(edit));
    }
  }, [textOf]);

  /** Ask which texts on this page can be edited, then mark them. */
  const scan = useCallback(async () => {
    const path = location.pathname;
    const nodes = textNodes(document.body);
    const items = nodes.map((n) => {
      const text = tidy(textOf(n));
      const context = contextOf(n, nodes, textOf);
      const landmark = landmarkOf(n);
      return { n, text, context, landmark, key: keyOf(path, text, context) };
    });
    const unknown = items.filter((it) => !answers.current.has(it.key));
    if (unknown.length) {
      setScanning(true);
      try {
        const r = await fetch("/api/edit/locate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ path: pagePath(path), items: unknown.map(({ text, context, landmark }) => ({ text, context, landmark })) }),
        });
        if (r.status === 401) return setEmail(null);
        const j = (await r.json()) as { results?: (string | null)[]; error?: string };
        if (!r.ok || !j.results) throw new Error(j.error);
        unknown.forEach((it, i) => answers.current.set(it.key, j.results![i] ?? null));
      } catch {
        setNote({ tone: "bad", text: "Couldn’t check which text is editable. Reload the page to try again." });
        return;
      } finally {
        setScanning(false);
      }
    }
    if (location.pathname !== path) return;
    for (const it of items) {
      const where = answers.current.get(it.key);
      if (where) {
        placed.current.set(it.n, { where, context: it.context, landmark: it.landmark });
        it.n.parentElement?.setAttribute("data-txt", "");
      }
    }
    paint();
    // Changes waiting for a page that shows them; flag any this page can no longer place.
    setMissing(
      editsRef.current
        .filter((e) => e.path === path && !items.some((it) => it.text === e.text && answers.current.get(it.key)))
        .map((e) => e.text),
    );
  }, [paint, textOf]);

  /* ── Session ── */

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.editor = "";
    const url = new URL(location.href);
    if (url.searchParams.get("signin") === "expired") {
      setNote({ tone: "bad", text: "That sign-in link has expired. Send yourself a new one." });
      url.searchParams.delete("signin");
      history.replaceState(history.state, "", url);
    }
    fetch("/api/edit/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: { email?: string | null }) => setEmail(j.email ?? null))
      .catch(() => setEmail(null));
    const draft = loadDraft();
    if (draft.length) {
      setEdits(draft);
      setNote({ tone: "info", text: `${plural(draft.length, "change")} you hadn’t published yet ${draft.length === 1 ? "is" : "are"} back, outlined in amber.` });
    }
    return () => {
      delete html.dataset.editor;
    };
  }, []);

  const editing = Boolean(email) && !preview;

  /* ── Edit mode: mark text, follow page changes, catch clicks ── */

  useEffect(() => {
    if (!editing) return;
    const html = document.documentElement;
    html.dataset.editing = "";
    scan();

    let timer = 0;
    let lastPath = location.pathname;
    const mo = new MutationObserver((records) => {
      // The editor's own bar and dialogs change constantly; only the page matters.
      if (records.every((r) => r.target instanceof Element && r.target.closest("[data-edit-skip]"))) return;
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (location.pathname !== lastPath) lastPath = location.pathname;
        scan();
      }, 350);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    let hovered: Element | null = null;
    const onOver = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target.closest("[data-txt]") : null;
      if (el === hovered) return;
      hovered?.removeAttribute("data-txt-hover");
      hovered = el;
      el?.setAttribute("data-txt-hover", "");
    };
    const onClick = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target.closest("[data-txt]") : null;
      if (!el) return;
      // Which of this element's own texts was clicked.
      const own = [...el.childNodes].filter((n): n is Text => n.nodeType === Node.TEXT_NODE && placed.current.has(n as Text));
      // The text under the pointer; an element with just one text counts anywhere on it.
      const node =
        own.find((n) => {
          const range = document.createRange();
          range.selectNodeContents(n);
          return [...range.getClientRects()].some((r) => e.clientX >= r.left - 2 && e.clientX <= r.right + 2 && e.clientY >= r.top - 2 && e.clientY <= r.bottom + 2);
        }) ?? (own.length === 1 ? own[0] : undefined);
      if (!node) return;
      e.preventDefault();
      e.stopPropagation();
      setNote(null);
      const info = placed.current.get(node)!;
      setOpen({ node, text: tidy(textOf(node)), context: info.context, where: info.where, landmark: info.landmark, value: tidy(node.nodeValue ?? "") });
    };
    document.addEventListener("mouseover", onOver);
    window.addEventListener("click", onClick, true);
    return () => {
      delete html.dataset.editing;
      clearTimeout(timer);
      mo.disconnect();
      hovered?.removeAttribute("data-txt-hover");
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("click", onClick, true);
    };
  }, [editing, scan, textOf]);

  /* ── Dialog plumbing ── */

  const dialogOpen = email === null || confirm !== null || open !== null;
  useEffect(() => {
    if (!dialogOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [dialogOpen]);

  useEffect(() => {
    if (!confirm && !open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || busy || evWork) return;
      if (form) return setForm(null);
      setConfirm(null);
      setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirm, open, busy, evWork, form]);

  const formDirty = Boolean(form && (form.title || form.description || form.photos.some((p) => p.blob)));
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (editsRef.current.length || formDirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [formDirty]);

  /* ── After publishing: count down, watch the deploy, then check the page ── */

  useEffect(() => {
    if (deploy?.state !== "pending") return;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    let tries = 0;
    const poll = setInterval(async () => {
      if (++tries > 72) return clearInterval(poll);
      const j = (await fetch(`/api/edit/status?commit=${deploy.commit}`, { cache: "no-store" })
        .then((r) => r.json())
        .catch(() => null)) as { state?: Deploy["state"] } | null;
      if (!j?.state || j.state === "pending") return;
      setDeploy({ ...deploy, state: j.state });
      if (j.state !== "live" || !deploy.check?.length) return;
      // Make sure each change shows up on the page it was made on.
      const notShown: string[] = [];
      for (const c of deploy.check) {
        const html = await fetch(`${c.path}?fresh=${Date.now()}`, { cache: "no-store" })
          .then((r) => r.text())
          .catch(() => "");
        const doc = new DOMParser().parseFromString(html, "text/html");
        if (!tidy(doc.body?.textContent ?? "").includes(c.to)) notShown.push(c.to);
      }
      if (notShown.length) {
        setNote({
          tone: "bad",
          text: `Published, but ${plural(notShown.length, "change")} didn’t show up where you made ${notShown.length === 1 ? "it" : "them"}: “${clip(notShown[0], 60)}”. Let Eli know.`,
        });
      }
    }, 5000);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
    };
  }, [deploy]);

  /* ── Actions: sign-in and text ── */

  async function requestLink(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNote(null);
    try {
      const r = await fetch("/api/edit/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: addr }),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      if (r.ok) setSent(addr.trim());
      else setNote({ tone: "bad", text: j.error ?? "Couldn’t send the link. Try again." });
    } catch {
      setNote({ tone: "bad", text: "Couldn’t reach the server. Check your connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  function saveText() {
    if (!open) return;
    const to = tidy(open.value);
    if (!to) return setNote({ tone: "bad", text: "Text can’t be left empty — use Cancel to keep it." });
    const path = location.pathname;
    const rest = edits.filter((e) => !(e.path === path && e.text === open.text && e.context.join() === open.context.join()));
    writeEdits(to === open.text ? rest : [...rest, { path, text: open.text, to, context: open.context, where: open.where, landmark: open.landmark }]);
    setOpen(null);
    setNote(null);
    requestAnimationFrame(paint);
  }

  function undoText() {
    if (!open) return;
    const path = location.pathname;
    writeEdits(edits.filter((e) => !(e.path === path && e.text === open.text && e.context.join() === open.context.join())));
    setOpen(null);
    requestAnimationFrame(paint);
  }

  async function publish() {
    if (!edits.length || busy) return;
    setBusy(true);
    setNote(null);
    try {
      const r = await fetch("/api/edit/text", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ changes: edits.map(({ path, text, to, context, landmark }) => ({ path: pagePath(path), text, to, context, landmark })) }),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string; problems?: { i: number; reason: string }[]; commit?: string };
      if (r.status === 401) {
        setConfirm(null);
        setEmail(null);
        setNote({ tone: "bad", text: "Your sign-in ran out. Sign in again — your changes are saved on this device." });
        return;
      }
      if (j.error === "problems" && j.problems) {
        const problems: Record<string, string> = {};
        for (const p of j.problems) {
          const e = edits[p.i];
          problems[keyOf(e.path, e.text, e.context)] =
            p.reason === "repeated" ? "This text now appears in more than one place." : "This text has changed since you opened the page.";
        }
        setConfirm({ kind: "publish", problems });
        return;
      }
      if (!r.ok || !j.commit) {
        setNote({ tone: "bad", text: j.error ?? "Publishing failed. Try again." });
        setConfirm(null);
        return;
      }
      const check = edits.map((e) => ({ path: pagePath(e.path), to: e.to }));
      // The new words are the page's words now.
      for (const node of textNodes(document.body)) {
        if (placed.current.has(node) && node.parentElement?.hasAttribute("data-txt-changed")) {
          original.current.set(node, node.nodeValue ?? "");
          node.parentElement.removeAttribute("data-txt-changed");
        }
      }
      answers.current.clear();
      writeEdits([]);
      setConfirm(null);
      setDeploy({ commit: j.commit, state: "pending", startedAt: Date.now(), what: "Your changes are", check });
      setNow(Date.now());
      scan();
    } catch {
      setNote({ tone: "bad", text: "Couldn’t reach the server. Nothing was published — try again." });
      setConfirm(null);
    } finally {
      setBusy(false);
    }
  }

  function discardAll() {
    writeEdits([]);
    setNote(null);
    requestAnimationFrame(paint);
  }

  async function exit(signOut: boolean) {
    saveDraft([]);
    editsRef.current = [];
    setEdits([]);
    dropForm();
    if (signOut) await fetch("/api/edit/session", { method: "DELETE" }).catch(() => null);
    onClose();
  }

  /* ── Actions: events ── */

  async function openEvents() {
    setConfirm({ kind: "events" });
    setForm(null);
    setRemoving(null);
    setEvError(null);
    await loadEvents();
  }

  async function loadEvents() {
    setEvList(null);
    try {
      const r = await fetch("/api/edit/event", { cache: "no-store" });
      if (r.status === 401) return setEmail(null);
      const j = (await r.json().catch(() => ({}))) as { events?: ChurchEvent[]; error?: string };
      if (!r.ok || !j.events) throw new Error(j.error);
      setEvList(j.events);
    } catch (e) {
      setEvError(e instanceof Error && e.message ? e.message : "Couldn’t load the events. Try again in a minute.");
    }
  }

  function dropForm() {
    for (const p of form?.photos ?? []) if (p.blob) URL.revokeObjectURL(p.url);
    setForm(null);
    setFormError(null);
  }

  async function addPhotos(files: FileList | null) {
    if (!files?.length || !form) return;
    setEvWork("Getting the photos ready…");
    setFormError(null);
    const added: FormPhoto[] = [];
    try {
      for (const file of [...files]) {
        try {
          const blob = await shrink(file);
          added.push({ key: crypto.randomUUID(), blob, url: URL.createObjectURL(blob) });
        } catch {
          setFormError(
            `“${file.name}” couldn’t be opened. Use a photo (JPG or PNG)${/heic|heif/i.test(file.name) ? " — iPhone HEIC photos need to be saved as JPG first" : ""}.`,
          );
        }
      }
    } finally {
      setEvWork(null);
    }
    setForm((f) => (f ? { ...f, photos: [...f.photos, ...added].slice(0, MAX_PHOTOS) } : f));
  }

  function removePhoto(key: string) {
    setForm((f) => {
      if (!f) return f;
      const p = f.photos.find((x) => x.key === key);
      if (p?.blob) URL.revokeObjectURL(p.url);
      return { ...f, photos: f.photos.filter((x) => x.key !== key) };
    });
  }

  async function saveEvent() {
    if (!form || evWork) return;
    setFormError(null);
    if (!tidy(form.title)) return setFormError("Give the event a name.");
    if (!form.start) return setFormError("Pick the day the event starts.");
    if (form.end && form.end < form.start) return setFormError("The event can’t end before it starts.");
    if (!tidy(form.description)) return setFormError("Add a sentence or two about the event.");
    try {
      const photos: ({ src: string } | { sha: string })[] = [];
      for (const [i, p] of form.photos.entries()) {
        if (p.src) {
          photos.push({ src: p.src });
          continue;
        }
        let sha = p.sha;
        if (!sha) {
          setEvWork(`Uploading photo ${i + 1} of ${form.photos.length}…`);
          const r = await fetch("/api/edit/event/photo", { method: "POST", headers: { "content-type": "image/jpeg" }, body: p.blob });
          const j = (await r.json().catch(() => ({}))) as { sha?: string; error?: string };
          if (r.status === 401) return setEmail(null);
          if (!r.ok || !j.sha) throw new Error(j.error ?? "Uploading a photo failed.");
          sha = j.sha;
          p.sha = sha;
        }
        photos.push({ sha });
      }
      setEvWork(form.replaceId ? "Saving the event…" : "Adding the event…");
      const r = await fetch("/api/edit/event", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          replaceId: form.replaceId,
          title: form.title,
          start: form.start,
          end: form.end || undefined,
          time: form.time,
          description: form.description,
          where: form.where,
          link: form.link,
          speakers: form.speakers,
          schedule: parseSchedule(form.schedule),
          note: form.note,
          contactName: form.contactName,
          contactPhone: form.contactPhone,
          highlight: form.highlight,
          photos,
        }),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string; commit?: string; path?: string };
      if (r.status === 401) return setEmail(null);
      if (!r.ok || !j.commit) throw new Error(j.error ?? "Saving failed.");
      const title = tidy(form.title);
      dropForm();
      setConfirm(null);
      setNote(null);
      setDeploy({ commit: j.commit, state: "pending", startedAt: Date.now(), what: `“${clip(title, 40)}” is`, link: j.path });
      setNow(Date.now());
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Saving failed. Try again.");
    } finally {
      setEvWork(null);
    }
  }

  async function removeEvent(ev: ChurchEvent) {
    if (evWork) return;
    setEvWork("Removing the event…");
    setEvError(null);
    try {
      const r = await fetch("/api/edit/event", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: ev.id }),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string; commit?: string; path?: string };
      if (r.status === 401) return setEmail(null);
      if (!r.ok || !j.commit) throw new Error(j.error ?? "Removing failed.");
      setRemoving(null);
      setConfirm(null);
      setNote(null);
      setDeploy({ commit: j.commit, state: "pending", startedAt: Date.now(), what: `The change (“${clip(ev.title, 40)}” removed) is`, link: j.path });
      setNow(Date.now());
    } catch (e) {
      setEvError(e instanceof Error ? e.message : "Removing failed. Try again.");
      setRemoving(null);
    } finally {
      setEvWork(null);
    }
  }

  /* ── Status line ── */

  const left = deploy ? Math.max(0, LIVE_SECONDS - Math.floor((now - deploy.startedAt) / 1000)) : 0;
  const status: Note | null =
    note ??
    (deploy?.state === "pending"
      ? {
          tone: "info",
          text: left
            ? `Published. ${deploy.what} going onto the live site — about ${clock(left)} to go. Until then it still shows the old version.`
            : "Still updating the live site — almost there.",
        }
      : deploy?.state === "live"
        ? { tone: "good", text: `${deploy.what} live.` }
        : deploy?.state === "failed"
          ? { tone: "bad", text: "Saved, but the live site didn’t rebuild. Let Eli know." }
          : missing.length
            ? { tone: "bad", text: `${plural(missing.length, "unpublished change")} on this page can’t be placed any more — Discard and make ${missing.length === 1 ? "it" : "them"} again.` }
            : null);

  /* ── Signed out: the sign-in box ── */

  if (email === null) {
    return sent ? (
      <Dialog title="Check your email">
        <p className="mt-4 text-[16px] leading-relaxed text-ink/85">
          We sent a sign-in link to <span className="font-semibold text-ink">{sent}</span>. It works for 20 minutes.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Not in your inbox after a minute? Look in Spam and mark it “Not spam” so the next one comes straight through.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button type="button" onClick={() => setSent(null)} className="text-[15px] text-flame underline underline-offset-4">
            Use a different email
          </button>
          <button type="button" onClick={onClose} className="text-[15px] text-muted underline underline-offset-4">
            Close
          </button>
        </div>
      </Dialog>
    ) : (
      <Dialog title="Edit the website">
        <form onSubmit={requestLink}>
          <p className="mt-3 text-[16px] leading-relaxed text-ink/85">Enter your email and we’ll send you a link to sign in.</p>
          <label htmlFor="edit-email" className={`${eyebrow} mt-7`}>
            Email
          </label>
          <input
            id="edit-email"
            type="email"
            required
            autoFocus
            autoComplete="email"
            placeholder="you@example.com"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            className={`${field} mt-2`}
          />
          <button type="submit" disabled={busy} className={`${solid} mt-4 w-full py-3.5`}>
            {busy ? "Sending…" : "Email me a sign-in link"}
          </button>
          <button type="button" onClick={onClose} className="mt-5 text-[14px] text-muted underline underline-offset-4">
            Close
          </button>
        </form>
        {note && <p className={`mt-5 text-[15px] ${note.tone === "bad" ? danger : "text-ink/85"}`}>{note.text}</p>}
      </Dialog>
    );
  }

  /* ── Signed in: the bar and its dialogs ── */

  const today = todayISO();
  const upcoming = (evList ?? []).filter((ev) => !isPast(ev, today));
  const past = (evList ?? []).filter((ev) => isPast(ev, today)).reverse();

  const eventRow = (ev: ChurchEvent, dim: boolean) => (
    <li key={ev.id} className={`flex flex-wrap items-center gap-x-4 gap-y-2 border-l-2 pl-4 ${dim ? "border-ink/15" : "border-flame"}`}>
      <div className="min-w-0 flex-1 basis-[220px]">
        <p className={`text-[15.5px] font-semibold ${dim ? "text-muted" : "text-ink"}`}>{ev.title}</p>
        <p className="text-[13.5px] text-muted">
          {whenFor(ev)}
          {ev.photos?.length ? ` · ${plural(ev.photos.length, "photo")}` : ""}
        </p>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => setForm(formFrom(ev))} className={`${outline} !px-4 !py-1.5 !text-[13.5px]`}>
          Edit
        </button>
        <button type="button" onClick={() => setRemoving(ev)} className="rounded-full px-3 py-1.5 text-[13.5px] text-muted hover:bg-paper hover:text-ink">
          Remove
        </button>
      </div>
    </li>
  );

  return (
    <>
      <div
        data-edit-skip
        role="region"
        aria-label="Website editor"
        className="fixed inset-x-0 bottom-0 z-[90] bg-ink/95 text-[15px] text-white/85 shadow-[0_-12px_40px_rgba(20,34,68,0.35)] backdrop-blur"
      >
        <div className="h-[3px] bg-[#d99a00]" aria-hidden="true" />
        <div className="mx-auto flex min-h-[76px] max-w-7xl flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3 sm:px-6">
          {email === undefined ? (
            <p>Loading the editor…</p>
          ) : (
            <>
              <div className="min-w-0 flex-1 basis-[260px]">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
                  {preview ? "Preview" : "Editing"}
                  {edits.length > 0 && <span className="ml-3 text-[#f0b429]">{plural(edits.length, "unpublished change")}</span>}
                </p>
                <p className="mt-0.5 truncate text-[14px] text-white/60">
                  {preview
                    ? "This is how the page reads. Links work; nothing is editable until you go back."
                    : scanning
                      ? "Finding the text you can change…"
                      : "Point at any text — it lights up — and click to change it."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={openEvents} className={`${onDark} !px-4`}>
                  Events
                </button>
                <button type="button" onClick={() => setPreview((p) => !p)} className={`${onDark} !px-4`}>
                  {preview ? "Back to editing" : "Preview"}
                </button>
                {edits.length > 0 && (
                  <>
                    <button type="button" onClick={discardAll} disabled={busy} className={`${onDark} !px-4`}>
                      Discard
                    </button>
                    <button type="button" onClick={() => setConfirm({ kind: "publish" })} disabled={busy} className={`${solid} !px-5`}>
                      Publish
                    </button>
                  </>
                )}
                <button type="button" onClick={() => setConfirm({ kind: "exit" })} className={`${onDark} !px-4`}>
                  Exit
                </button>
              </div>
            </>
          )}
          {status && (
            <p
              aria-live="polite"
              className={`basis-full text-[14px] ${status.tone === "bad" ? "text-[#f0b429]" : status.tone === "good" ? "text-white" : "text-white/75"}`}
            >
              {status.text}
              {deploy?.state === "live" && !note && (
                <>
                  {" "}
                  <a
                    href={`${deploy.link ?? location.pathname}${deploy.link?.includes("#") ? "" : `?fresh=${deploy.commit.slice(0, 7)}`}`}
                    target="_blank"
                    rel="noopener"
                    className="underline underline-offset-4 hover:text-white"
                  >
                    See it
                  </a>
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {open && (
        <Dialog title="Change this text">
          <p className="mt-2 text-[13.5px] text-muted">Saved in: {open.where}</p>
          <textarea
            autoFocus
            value={open.value}
            onChange={(e) => setOpen({ ...open, value: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                saveText();
              }
            }}
            rows={Math.min(10, Math.max(2, Math.ceil(open.value.length / 48)))}
            className={`${field} mt-5 resize-y leading-relaxed`}
          />
          {open.text !== tidy(open.value) && (
            <p className="mt-3 text-[13.5px] text-muted">
              Was: <span className="line-through">{clip(open.text, 160)}</span>
            </p>
          )}
          {note?.tone === "bad" && <p className={`mt-3 text-[14.5px] ${danger}`}>{note.text}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={saveText} className={solid}>
              Done
            </button>
            <button type="button" onClick={() => setOpen(null)} className={outline}>
              Cancel
            </button>
            {edits.some((e) => e.path === location.pathname && e.text === open.text && e.context.join() === open.context.join()) && (
              <button type="button" onClick={undoText} className="ml-auto text-[14px] text-muted underline underline-offset-4">
                Put back the original
              </button>
            )}
          </div>
          <p className="mt-5 text-[13px] text-muted">Nothing goes live until you press Publish in the bar.</p>
        </Dialog>
      )}

      {confirm?.kind === "publish" && (
        <Dialog title={`Publish ${plural(edits.length, "change")}?`} wide>
          {confirm.problems && (
            <p className="mt-4 rounded-lg border border-[#b3261e]/30 bg-paper p-4 text-[15px] leading-relaxed text-ink">
              Nothing was published. The changes marked below can’t be saved any more — remove them with ✕, then publish the rest.
            </p>
          )}
          <ul className="mt-5 max-h-[40vh] space-y-4 overflow-y-auto pr-1">
            {edits.map((e) => {
              const problem = confirm.problems?.[keyOf(e.path, e.text, e.context)];
              return (
                <li key={keyOf(e.path, e.text, e.context)} className="flex gap-3 border-l-2 border-flame pl-4 text-[15px] leading-snug">
                  <div className="min-w-0 flex-1">
                    <p className="text-muted line-through decoration-muted">{clip(e.text)}</p>
                    <p className="mt-1 text-ink">{clip(e.to)}</p>
                    <p className="mt-1 text-[12.5px] text-muted">
                      {e.where} · {pagePath(e.path)}
                    </p>
                    {problem && <p className={`mt-1 text-[13.5px] font-semibold ${danger}`}>{problem}</p>}
                  </div>
                  <button
                    type="button"
                    aria-label="Remove this change"
                    onClick={() => {
                      const next = edits.filter((x) => x !== e);
                      writeEdits(next);
                      requestAnimationFrame(paint);
                      if (!next.length) setConfirm(null);
                    }}
                    className="h-8 w-8 shrink-0 rounded-full text-muted hover:bg-paper hover:text-ink"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 rounded-lg border border-[#d99a00]/45 bg-[#d99a00]/10 p-4 text-[15px] leading-relaxed text-ink">
            <span className="font-semibold">Give it about 2 minutes.</span> The live site rebuilds after you publish. Until it finishes, the
            website — for visitors and for you — still shows the old wording. The bar counts down and tells you when it’s live.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button type="button" onClick={publish} disabled={busy || !edits.length} className={solid}>
              {busy ? "Publishing…" : "Publish"}
            </button>
            <button type="button" onClick={() => setConfirm(null)} disabled={busy} className={outline}>
              Cancel
            </button>
          </div>
        </Dialog>
      )}

      {confirm?.kind === "events" && !form && (
        <Dialog title="Events" wide>
          <p className="mt-3 text-[15.5px] leading-relaxed text-ink/85">
            These show in the Coming up section on the home page. Each one leaves the site by itself after its last day, but stays here so you can
            edit the dates and use it again next year.
          </p>

          {evError && <p className={`mt-5 text-[15px] ${danger}`}>{evError}</p>}
          {!evList && !evError && <p className="mt-5 text-[15px] text-muted">Loading the events…</p>}

          {evList && (
            <>
              <p className={`${eyebrow} mt-7`}>On the website now</p>
              {upcoming.length ? (
                <ul className="mt-3 space-y-4">{upcoming.map((ev) => eventRow(ev, false))}</ul>
              ) : (
                <p className="mt-3 text-[15px] text-muted">No upcoming events yet.</p>
              )}
              {past.length > 0 && (
                <>
                  <p className={`${eyebrow} mt-7`}>Past</p>
                  <ul className="mt-3 space-y-4">{past.map((ev) => eventRow(ev, true))}</ul>
                </>
              )}
            </>
          )}

          {removing && (
            <div className="mt-6 rounded-lg border border-[#b3261e]/30 bg-paper p-4">
              <p className="text-[15px] leading-relaxed text-ink">
                Remove <span className="font-semibold">{removing.title}</span> from the website? It goes straight to the live site.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={() => removeEvent(removing)} disabled={Boolean(evWork)} className={solid}>
                  {evWork ? "Removing…" : "Remove it"}
                </button>
                <button type="button" onClick={() => setRemoving(null)} disabled={Boolean(evWork)} className={outline}>
                  Keep it
                </button>
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setForm(blankForm())} disabled={!evList} className={solid}>
              Add an event
            </button>
            <button type="button" onClick={() => setConfirm(null)} className={outline}>
              Close
            </button>
          </div>
        </Dialog>
      )}

      {confirm?.kind === "events" && form && (
        <Dialog title={form.replaceId ? "Edit this event" : "Add an event"} wide>
          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className={eyebrow}>Event name</span>
              <input type="text" value={form.title} maxLength={120} placeholder="e.g. Friday Night Game Night" onChange={(e) => setForm({ ...form, title: e.target.value })} className={`${field} mt-2`} autoFocus />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={eyebrow}>First day</span>
                <input type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className={`${field} mt-2`} />
              </label>
              <label className="block">
                <span className={eyebrow}>Last day (if more than one)</span>
                <input type="date" value={form.end} min={form.start || undefined} onChange={(e) => setForm({ ...form, end: e.target.value })} className={`${field} mt-2`} />
              </label>
            </div>
            <label className="block">
              <span className={eyebrow}>Time</span>
              <input
                type="text"
                value={form.time}
                maxLength={120}
                placeholder="e.g. 6:30 PM"
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className={`${field} mt-2`}
              />
            </label>
            <label className="block">
              <span className={eyebrow}>About the event</span>
              <textarea value={form.description} maxLength={1500} rows={3} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${field} mt-2 resize-y leading-relaxed`} />
            </label>
            <label className="block">
              <span className={eyebrow}>Where (optional)</span>
              <input type="text" value={form.where} maxLength={120} placeholder="e.g. MCC Knoxville & Zoom" onChange={(e) => setForm({ ...form, where: e.target.value })} className={`${field} mt-2`} />
            </label>
            <label className="block">
              <span className={eyebrow}>Zoom or sign-up link (optional)</span>
              <input type="url" value={form.link} maxLength={500} placeholder="https://…" onChange={(e) => setForm({ ...form, link: e.target.value })} className={`${field} mt-2`} />
            </label>
          </div>

          {evWork && <p className="mt-5 text-[15px] text-ink/85">{evWork}</p>}
          {formError && !evWork && <p className={`mt-5 text-[15px] ${danger}`}>{formError}</p>}

          <p className="mt-6 rounded-lg border border-[#d99a00]/45 bg-[#d99a00]/10 p-4 text-[14.5px] leading-relaxed text-ink">
            <span className="font-semibold">Saving puts it on the live site</span> — give it about 2 minutes to show on the Events page.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={saveEvent} disabled={Boolean(evWork)} className={solid}>
              {evWork ? "Saving…" : form.replaceId ? "Save changes" : "Add to the website"}
            </button>
            <button type="button" onClick={dropForm} disabled={Boolean(evWork)} className={outline}>
              Back
            </button>
          </div>
        </Dialog>
      )}

      {confirm?.kind === "exit" && (
        <Dialog title="Exit the editor?">
          {edits.length > 0 && (
            <p className="mt-4 text-[16px] leading-relaxed text-ink">
              You have {plural(edits.length, "unpublished change")}. Exiting throws {edits.length === 1 ? "it" : "them"} away.
            </p>
          )}
          {deploy?.state === "pending" && (
            <p className="mt-4 text-[16px] leading-relaxed text-ink">
              Your last publish is still going live{left ? ` — about ${clock(left)} left` : ""}. If you exit now, the site may show the old version until
              then; refresh after that.
            </p>
          )}
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Exiting clears the editor from this browser and reloads the page fresh, the way visitors see it. You stay signed in, so /edit brings you
            straight back.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => exit(false)} className={solid}>
              Exit and clear
            </button>
            <button type="button" onClick={() => setConfirm(null)} className={outline}>
              Keep editing
            </button>
          </div>
          <button type="button" onClick={() => exit(true)} className="mt-5 text-[14px] text-muted underline underline-offset-4">
            Exit and sign out
          </button>
        </Dialog>
      )}
    </>
  );
}
