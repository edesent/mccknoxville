"use client";

import { useEffect, useState } from "react";
import { ways } from "@/lib/site";

/** Minutes since midnight and weekday, in Knoxville. */
function nowET() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { dow, mins: Number(get("hour")) * 60 + Number(get("minute")) };
}

const START = 11 * 60;
const END = 12 * 60 + 20;

/** "Live now", or how long until the next Sunday at 11 Eastern. */
export function useSunday() {
  const [state, setState] = useState<{ live: boolean; label: string } | null>(null);
  useEffect(() => {
    const tick = () => {
      const { dow, mins } = nowET();
      if (dow === 0 && mins >= START - 10 && mins < END) {
        setState({ live: true, label: "We’re live right now" });
        return;
      }
      let until = ((7 - dow) % 7) * 1440 + START - mins;
      if (until <= 0) until += 7 * 1440;
      const d = Math.floor(until / 1440);
      const h = Math.floor((until % 1440) / 60);
      const m = until % 60;
      const label =
        d > 0
          ? `Next service in ${d} day${d > 1 ? "s" : ""}, ${h} hr${h === 1 ? "" : "s"}`
          : h > 0
            ? `Next service in ${h} hr${h === 1 ? "" : "s"} ${m} min`
            : `Starting in ${m} min`;
      setState({ live: false, label });
    };
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);
  return state;
}

export function LiveBadge({ className = "" }: { className?: string }) {
  const s = useSunday();
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-bold ${
        s?.live ? "bg-r1 text-white" : "bg-white/12 text-white backdrop-blur"
      } ${className}`}
    >
      <span className={`live-dot h-2.5 w-2.5 rounded-full ${s?.live ? "bg-white text-white" : "bg-r3 text-r3"}`} />
      {s ? s.label : "Sundays at 11:00 AM Eastern"}
    </span>
  );
}

const icons: Record<string, React.ReactNode> = {
  onsite: <path d="M12 3 3 9v12h6v-6h6v6h6V9l-9-6Zm0 3.2L18.5 10H5.5L12 6.2Z" />,
  zoom: <path d="M3 7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v2.3l4.4-3.1A1 1 0 0 1 22 7v10a1 1 0 0 1-1.6.8L16 14.7V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
  facebook: <path d="M14 8V6.5c0-.7.5-1 1-1h2V2h-3c-3 0-4 2-4 4.3V8H7.5v3.5H10V22h4V11.5h2.8L17 8h-3Z" />,
  youtube: <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.4-1.2.4-3.8.4-3.8s0-2.6-.4-3.8ZM10 15.1V8.9l5.2 3.1L10 15.1Z" />,
  phone: <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z" />,
};

const tints = ["bg-r1", "bg-r2", "bg-r3", "bg-r4", "bg-r5"];

/** Five ways into the same Sunday service; pick one and it explains itself. */
export function WaysToJoin() {
  const [pick, setPick] = useState(0);
  const w = ways[pick];
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10">
      <div role="tablist" aria-label="Ways to join on Sunday" className="grid grid-cols-5 gap-2 lg:grid-cols-1 lg:gap-3">
        {ways.map((x, i) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={pick === i}
            aria-controls="way-panel"
            onClick={() => setPick(i)}
            className={`group flex flex-col items-center gap-2 rounded-2xl p-3 text-center transition-all lg:flex-row lg:gap-4 lg:p-4 lg:text-left ${
              pick === i ? "bg-white text-ink shadow-xl" : "bg-white/[0.06] text-white hover:bg-white/[0.12]"
            }`}
          >
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white ${tints[i]}`}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                {icons[x.id]}
              </svg>
            </span>
            <span className="text-[0.72rem] font-bold leading-tight sm:text-sm lg:text-lg">
              <span className="lg:hidden">{x.short}</span>
              <span className="hidden lg:inline">{x.name}</span>
            </span>
          </button>
        ))}
      </div>

      <div id="way-panel" role="tabpanel" className="relative overflow-hidden rounded-[2rem] bg-white p-7 text-ink sm:p-10">
        <div className={`absolute inset-x-0 top-0 h-2 ${tints[pick]}`} />
        <p className="kicker text-muted">Sundays · 11:00 AM Eastern</p>
        <h3 className="display mt-3 text-4xl sm:text-5xl">{w.name}</h3>
        <p className="mt-5 text-lg leading-relaxed text-ink/80">{w.how}</p>
        <a
          href={w.cta.href}
          className="btn btn-ink mt-7"
          {...(w.cta.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
        >
          {w.cta.label}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
