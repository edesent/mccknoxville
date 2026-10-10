import type { Metadata } from "next";
import EventList from "@/components/EventList";
import PageHead from "@/components/PageHead";
import { links, upcoming, weekly } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events",
  description: "What’s happening at MCC Knoxville: weekly groups, game nights, congregational meetings and more.",
  alternates: { canonical: "/events" },
};

// Re-checked hourly so past events fall off by themselves.
export const revalidate = 3600;

export default function EventsPage() {
  const items = upcoming(120);
  return (
    <>
      <PageHead
        kicker="Events"
        title="Pull up a chair."
        lede="Trivia nights, Bible study over lunch, coloring and conversation. Most of it is open to everyone, and much of it is on Zoom too."
      />

      <section className="py-20 sm:py-28">
        <div className="wrap grid gap-14 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <h2 className="display text-[clamp(2rem,4.5vw,3.4rem)]" data-reveal>Coming up</h2>
            <div className="mt-8">
              <EventList items={items} detail />
            </div>
            <a href={links.googleCalendar} target="_blank" rel="noopener" className="btn btn-line mt-8">
              Open the full Google Calendar
            </a>
          </div>

          <aside>
            <h2 className="display text-[clamp(2rem,4.5vw,3.4rem)]" data-reveal>Every week</h2>
            <ul className="mt-8 grid gap-4">
              {weekly.map((w) => (
                <li key={w.title} className="card p-6" data-reveal>
                  <p className="kicker text-muted">
                    {w.day} · {w.time}
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold">{w.title}</h3>
                  <p className="text-sm text-muted">{w.where}</p>
                  <p className="mt-2 text-ink/80">{w.blurb}</p>
                  {w.href && (
                    <a href={w.href} target="_blank" rel="noopener" className="mt-2 inline-block font-bold text-flame">
                      {w.href.includes("zoom.us") ? "Join on Zoom →" : "Learn more →"}
                    </a>
                  )}
                </li>
              ))}
              <li className="rounded-[1.75rem] border-2 border-dashed border-ink/15 p-6" data-reveal>
                <p className="kicker text-muted">Mondays · 7:30–9 PM · Community partner</p>
                <h3 className="mt-2 text-xl font-extrabold">Knoxville Gay Men’s Discussion Group</h3>
                <p className="text-sm text-muted">TVUUC, 2931 Kingston Pike, and Zoom</p>
                <p className="mt-2 text-ink/80">
                  Topics and issues relevant to gay, bi and pan men, in a safe and open place. New members always
                  welcome.
                </p>
                <a href="http://www.gaygroupknoxville.org" target="_blank" rel="noopener" className="mt-2 inline-block font-bold text-flame">
                  gaygroupknoxville.org →
                </a>
              </li>
            </ul>
            <p className="mt-6 text-sm text-muted">
              Want something on the calendar? <a href="/contact" className="font-bold text-ink underline">Send it to us</a>.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
