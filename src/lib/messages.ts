import { CHANNEL_ID } from "./live";
import { sermons } from "./site";

/**
 * Messages for the Watch page. New services are read from the church's
 * YouTube channel, so a Sunday upload shows up here by itself within the hour.
 * The hand-kept list in site.ts follows as the back catalogue, and is what the
 * page shows if YouTube can't be reached.
 */

const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

export type Message = { id: string; title: string; date?: string; series?: string };

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "’")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  month: "short",
  day: "numeric",
  year: "numeric",
});

export async function fetchFeed(): Promise<{ status: number; entries: Message[] }> {
  let status = 0;
  // YouTube throttles Vercel now and then (a 404 or 500, not a real answer), so try a few times.
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(FEED, { headers: { "User-Agent": UA }, next: { revalidate: 3600 } });
      status = res.status;
      const xml = res.ok ? await res.text() : "";
      if (xml.includes("<entry>")) {
        const entries = xml
          .split("<entry>")
          .slice(1)
          .map((e) => {
            const id = e.match(/<yt:videoId>([^<]+)/)?.[1] ?? "";
            const title = decode(e.match(/<title>([^<]*)/)?.[1] ?? "");
            const published = e.match(/<published>([^<]+)/)?.[1];
            return { id, title, date: published ? fmt.format(new Date(published)) : undefined };
          })
          .filter((m) => m.id && m.title);
        return { status, entries };
      }
    } catch {
      status = -1;
    }
    await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
  }
  return { status, entries: [] };
}

export async function getMessages(): Promise<Message[]> {
  const { entries } = await fetchFeed();
  const seenId = new Set<string>();
  const seenTitle = new Set<string>();
  const out: Message[] = [];
  // Newest first. A service that was streamed and then re-posted appears once.
  for (const m of [...entries, ...(sermons as Message[])]) {
    const key = m.title.toLowerCase();
    if (seenId.has(m.id) || seenTitle.has(key)) continue;
    seenId.add(m.id);
    seenTitle.add(key);
    out.push(m);
  }
  return out;
}
