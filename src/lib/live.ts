export const CHANNEL_ID = "UCxFCg3GVxmEgcRD4lai-mnQ";

export type LiveStatus = { isLive: boolean; isUpcoming: boolean; videoId: string | null };

const OFF: LiveStatus = { isLive: false, isUpcoming: false, videoId: null };

/**
 * Is MCC Knoxville streaming on YouTube right now? Same idea as
 * bellinghambbc.com: fetch the channel's /live page like a browser and read
 * the player data. No API key. Cached for 5 seconds.
 *
 * YouTube's markers as of Oct 2026 (checked against a channel that streams
 * 24/7 ): a stream that is
 * on air has "isLive":true without "isUpcoming":true and without the
 * LIVE_STREAM_OFFLINE status; a scheduled stream has "isUpcoming":true. The
 * older "hlsManifestUrl" marker is no longer served.
 */
export async function getLiveStatus(channelId = CHANNEL_ID): Promise<LiveStatus> {
  try {
    const res = await fetch(`https://www.youtube.com/channel/${channelId}/live`, {
      next: { revalidate: 5 },
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (!res.ok) return OFF;
    const html = await res.text();
    // The id of the stream this page is playing. YouTube stopped putting it in
    // the canonical link in Nov 2026 (it now reads "undefined" while live), so
    // read the player endpoint first and keep the canonical link as a backup.
    const endpoint = html.match(/"currentVideoEndpoint":\{.{0,400}?"videoId":"([A-Za-z0-9_-]{11})"/);
    const canonical = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]+)"/);
    const videoId = endpoint?.[1] ?? canonical?.[1] ?? null;
    if (!videoId) return OFF;
    const isUpcoming = html.includes('"isUpcoming":true') || html.includes("LIVE_STREAM_OFFLINE");
    const isLive = !isUpcoming && (html.includes('"isLive":true') || html.includes('"isLiveNow":true') || html.includes('"hlsManifestUrl"'));
    return { isLive, isUpcoming, videoId };
  } catch {
    return OFF;
  }
}
