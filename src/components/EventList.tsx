import { prettyDate, type Dated } from "@/lib/site";

const modeTint: Record<string, string> = {
  "In person": "bg-r4/12 text-r4",
  Online: "bg-r5/12 text-r5",
  "In person & online": "bg-r2/15 text-[#b4521c]",
};

/** Dated events as tear-off calendar leaves. Past ones never reach this list. */
export default function EventList({ items, detail = false }: { items: Dated[]; detail?: boolean }) {
  if (items.length === 0) {
    return (
      <div className="card p-8 text-center text-muted">
        Nothing special on the calendar just now. Sunday at 11 is always on.
      </div>
    );
  }
  return (
    <ul className="grid gap-4">
      {items.map((e, i) => {
        const d = prettyDate(e.date);
        const external = e.href?.startsWith("http");
        return (
          <li key={`${e.date}-${e.title}`} data-reveal style={{ ["--d" as string]: `${i * 60}ms` }}>
            <div className="card flex gap-5 p-5 sm:gap-7 sm:p-6">
              <div className="w-[4.5rem] shrink-0 overflow-hidden rounded-2xl text-center shadow-sm ring-1 ring-ink/10">
                <div className="bg-ink py-1 text-[0.7rem] font-bold uppercase tracking-widest text-white">{d.month}</div>
                <div className="bg-white py-1.5 text-3xl font-extrabold leading-none tracking-tight">{d.day}</div>
                <div className="bg-white pb-1.5 text-[0.65rem] font-semibold uppercase text-muted">{d.weekday.slice(0, 3)}</div>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-bold">{e.time}</span>
                  {e.mode && <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${modeTint[e.mode]}`}>{e.mode}</span>}
                </div>
                <h3 className="mt-1.5 text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">{e.title}</h3>
                <p className="mt-1 text-sm text-muted">{e.where}</p>
                {detail && <p className="mt-3 leading-relaxed text-ink/80">{e.blurb}</p>}
                {detail && e.href && (
                  <a
                    href={e.href}
                    className="mt-3 inline-block font-bold text-flame underline decoration-flame/30 underline-offset-4 hover:decoration-flame"
                    {...(external ? { target: "_blank", rel: "noopener" } : {})}
                  >
                    {e.href.includes("zoom.us") ? "Join on Zoom →" : "Details →"}
                  </a>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
