import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import { LiveBadge } from "@/components/Sunday";
import { getMessages } from "@/lib/messages";
import { links, queerFacesOfFaith } from "@/lib/site";

// Re-checked hourly so a new Sunday upload appears by itself.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Watch",
  description: "Watch MCC Knoxville live every Sunday at 11 AM Eastern on YouTube, Facebook and Zoom, or catch up on recent messages.",
  alternates: { canonical: "/watch" },
};

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export default async function WatchPage() {
  const [latest, ...rest] = (await getMessages()).slice(0, 19);
  return (
    <>
      <PageHead
        kicker="Watch & listen"
        title="Church, wherever you are."
        lede="Every Sunday at 11 Eastern we’re live on YouTube, Facebook and Zoom. Full services and highlights go up on YouTube Sunday afternoon."
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <LiveBadge />
          <a href={links.youtubeLive} className="btn btn-ember" target="_blank" rel="noopener">
            YouTube Live
          </a>
          <a href={links.facebookLive} className="btn btn-ghost" target="_blank" rel="noopener">
            Facebook Live
          </a>
          <a href={links.zoomRegister} className="btn btn-ghost" target="_blank" rel="noopener">
            Zoom
          </a>
        </div>
      </PageHead>

      <section className="py-20 sm:py-28">
        <div className="wrap">
          <a
            href={yt(latest.id)}
            target="_blank"
            rel="noopener"
            className="group grid overflow-hidden rounded-[2rem] bg-night text-white lg:grid-cols-[1.4fr_1fr]"
            data-reveal
          >
            <div className="relative aspect-video overflow-hidden">
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
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <p className="kicker text-r3">Latest · {latest.date}</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{latest.title}</h2>
              <p className="mt-4 text-white/70">The full Sunday service from MCC Knoxville.</p>
            </div>
          </a>

          <h2 className="display mt-20 text-[clamp(2rem,4.5vw,3.4rem)]" data-reveal>Recent messages</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((s, i) => (
              <li key={s.id} data-reveal style={{ ["--d" as string]: `${(i % 3) * 70}ms` }}>
                <a href={yt(s.id)} target="_blank" rel="noopener" className="group block">
                  <div className="aspect-video overflow-hidden rounded-[1.25rem] bg-mist">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${s.id}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-muted">{s.date ?? (s.series ? `${s.series} series` : "Sunday service")}</p>
                  <h3 className="text-lg font-extrabold leading-snug group-hover:text-flame">{s.title}</h3>
                </a>
              </li>
            ))}
          </ul>
          <a href={links.youtubeLive} target="_blank" rel="noopener" className="btn btn-ink mt-12">
            Every service on YouTube <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="bg-night py-20 text-white sm:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div data-reveal>
            <p className="kicker text-r3">A series worth your evening</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,5vw,3.8rem)]">
              <span className="rainbow-text">Queer Faces</span> of Faith
            </h2>
            <p className="mt-5 max-w-md text-lg text-white/75">
              The saints and scholars who made room for LGBTQ+ people in the church, told from our pulpit.
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {queerFacesOfFaith.map((v) => (
              <li key={v.id} data-reveal>
                <a href={yt(v.id)} target="_blank" rel="noopener" className="group block">
                  <div className="aspect-video overflow-hidden rounded-[1.25rem]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <h3 className="mt-3 text-xl font-extrabold">{v.title}</h3>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
