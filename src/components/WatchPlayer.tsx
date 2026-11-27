"use client";

import { useEffect, useState } from "react";

type Status = { isLive: boolean; isUpcoming?: boolean; videoId: string | null };
type Message = { id: string; title: string; date?: string };

const allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

/**
 * The player on the Watch page. Most of the week it holds the latest message,
 * which plays in place. When the church goes live on YouTube the stream takes
 * over by itself: /api/live is checked every 30 seconds.
 */
export default function WatchPlayer({ latest }: { latest: Message }) {
  const [status, setStatus] = useState<Status>({ isLive: false, videoId: null });
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let alive = true;
    const check = async () => {
      try {
        const r = await fetch("/api/live", { cache: "no-store" });
        if (!r.ok) return;
        const s = (await r.json()) as Status;
        if (alive) setStatus(s);
      } catch {}
    };
    check();
    const t = window.setInterval(check, 30_000);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, []);

  const live = status.isLive && !!status.videoId;
  const id = live ? status.videoId! : latest.id;

  return (
    <div
      id="player"
      className="grid scroll-mt-28 overflow-hidden rounded-[2rem] bg-night text-white lg:grid-cols-[1.4fr_1fr]"
      data-reveal
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        {live || playing ? (
          <iframe
            key={id}
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
            title={live ? "MCC Knoxville live stream" : latest.title}
            allow={allow}
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group block h-full w-full" aria-label={`Play ${latest.title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${latest.id}/maxresdefault.jpg`}
              alt=""
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-ember shadow-2xl transition group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="flex flex-col justify-center p-8 sm:p-10">
        {live ? (
          <>
            <p className="kicker flex items-center gap-4 pl-1.5 text-r1">
              <span className="live-dot h-2.5 w-2.5 rounded-full bg-r1 text-r1" />
              Live now
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">We’re live. Come on in.</h2>
            <p className="mt-4 text-white/70">The service is streaming right now from the sanctuary on Redeemer Lane.</p>
          </>
        ) : (
          <>
            <p className="kicker text-r3">Latest{latest.date ? ` · ${latest.date}` : ""}</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{latest.title}</h2>
            <p className="mt-4 text-white/70">
              The full Sunday service from MCC Knoxville. When we go live on Sunday at 11, the stream appears right here.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
