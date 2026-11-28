import Image from "next/image";
import Link from "next/link";
import EventList from "@/components/EventList";
import MapCard from "@/components/MapCard";
import Ridges from "@/components/Ridges";
import { LiveBadge, WaysToJoin } from "@/components/Sunday";
import { links, mapsUrl, ministries, org, purpose, staff, upcoming, weekly } from "@/lib/site";

// Re-checked hourly so past events fall off by themselves.
export const revalidate = 3600;

const purposeTint = ["text-r1", "text-r2", "text-r5"];

export default function Home() {
  const soon = upcoming(60).slice(0, 3);
  const table = ministries[0];
  return (
    <>
      {/* ---------- Hero: the flag, drawn as the Smokies ---------- */}
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-plum text-white">
        <Ridges className="-z-10" />
        <div className="wrap flex flex-1 flex-col pt-32 sm:pt-36">
          <p className="kicker text-white/75" data-reveal>
            Metropolitan Community Church of Knoxville
          </p>
          <h1
            className="display mt-5 text-[clamp(3.8rem,10vw,9rem)] [text-shadow:0_6px_40px_rgb(14_8_41/0.45)]"
            data-reveal
            style={{ ["--d" as string]: "120ms" }}
          >
            Come as
            <br />
            you are.
          </h1>
          <p
            className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-white [text-shadow:0_2px_18px_rgb(14_8_41/0.7)] sm:text-xl"
            data-reveal
            style={{ ["--d" as string]: "240ms" }}
          >
            A wellspring of acceptance, hope and reconciliation for the LGBTQ+ and straight communities of
            Knoxville, East Tennessee, and beyond.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3" data-reveal style={{ ["--d" as string]: "360ms" }}>
            <Link href="/visit" className="btn btn-ember text-lg">
              Plan your first Sunday <span aria-hidden="true">→</span>
            </Link>
            <a href="#sunday" className="btn btn-ghost text-lg">
              Join online
            </a>
          </div>
          <div className="flex-1" />
          <div className="mb-8 flex flex-col gap-4 pt-16 sm:flex-row sm:items-center sm:justify-between">
            <LiveBadge />
            <p className="text-sm font-semibold text-white/80 sm:text-base">
              Sundays 11:00 AM Eastern · {org.street}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Sunday, five ways in ---------- */}
      <section id="sunday" className="scroll-mt-20 bg-plum pb-24 pt-10 text-white sm:pb-32">
        <div className="wrap">
          <div className="max-w-3xl" data-reveal>
            <p className="kicker text-r3">Every Sunday at 11</p>
            <h2 className="display mt-4 text-[clamp(2.6rem,6vw,5rem)]">
              One service.
              <br />
              Five ways in.
            </h2>
            <p className="mt-5 max-w-2xl text-lg text-white/80">
              Sit with us on Redeemer Lane, or worship from your kitchen table on Zoom, Facebook, YouTube or the
              phone. Same prayers, same sermon, same welcome, wherever you are.
            </p>
          </div>
          <div className="mt-12" data-reveal>
            <WaysToJoin />
          </div>
        </div>
      </section>

      {/* ---------- Who we are ---------- */}
      <section className="py-24 sm:py-32">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div data-reveal>
            <p className="kicker text-muted">Why we’re here</p>
            <ul className="mt-6 grid gap-5">
              {purpose.map((p, i) => (
                <li key={p.verb}>
                  <span className={`display block text-[clamp(3rem,7vw,5.6rem)] ${purposeTint[i]}`}>{p.verb}</span>
                  <span className="mt-1 block text-xl text-ink/75">{p.rest}</span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="btn btn-line mt-10">
              Our story & mission
            </Link>
          </div>
          <figure className="relative" data-reveal style={{ ["--d" as string]: "150ms" }}>
            <div className="absolute -inset-3 -rotate-2 rounded-[2.5rem] bg-gradient-to-br from-r1 via-r3 to-r5 opacity-90" />
            <div className="relative overflow-hidden rounded-[2.2rem] shadow-2xl">
              <Image
                src="/photos/colleen-preaching.jpg"
                alt="Rev. Colleen Darraugh preaching on a Sunday morning at MCC Knoxville"
                width={1280}
                height={640}
                className="aspect-[4/3] w-full object-cover object-[50%_30%]"
                sizes="(min-width: 1024px) 45vw, 100vw"
                priority={false}
              />
            </div>
            <blockquote className="card relative -mt-16 ml-6 mr-2 p-6 sm:ml-12 sm:p-7">
              <p className="font-serif text-xl italic leading-snug sm:text-2xl">
                “Metropolitan Community Church is a church that practices the radically inclusive love of God, and we
                welcome all people.”
              </p>
              <footer className="mt-3 text-sm font-semibold text-muted">Rev. Colleen Darraugh, Lead Pastor</footer>
            </blockquote>
          </figure>
        </div>
      </section>

      {/* ---------- This week ---------- */}
      <section className="bg-mist py-24 sm:py-32">
        <div className="wrap grid gap-14 lg:grid-cols-2">
          <div data-reveal>
            <p className="kicker text-muted">Every week</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,5vw,4rem)]">Church isn’t just Sunday.</h2>
            <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {weekly.map((w) => (
                <li key={w.title} className="grid grid-cols-[6.5rem_1fr] gap-4 py-5 sm:grid-cols-[8rem_1fr]">
                  <div>
                    <p className="font-extrabold">{w.day}</p>
                    <p className="text-sm text-muted">{w.time}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{w.title}</p>
                    <p className="text-sm text-muted">{w.where}</p>
                    <p className="mt-1.5 text-ink/80">{w.blurb}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal style={{ ["--d" as string]: "120ms" }}>
            <p className="kicker text-muted">Coming up</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,5vw,4rem)]">Mark your calendar.</h2>
            <div className="mt-10">
              <EventList items={soon} />
            </div>
            <Link href="/events" className="btn btn-ink mt-8">
              Everything on the calendar <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Faith & Pride ---------- */}
      <section className="relative overflow-hidden bg-night py-24 text-white sm:py-32">
        <div
          aria-hidden="true"
          className="absolute -right-40 top-1/2 h-[46rem] w-[46rem] -translate-y-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: "conic-gradient(from 90deg, #e8455f, #f57f39, #f6bd3f, #2f9c6a, #2f5fd0, #8a5cf0, #e8455f)" }}
        />
        <div className="wrap relative">
          <div className="max-w-4xl" data-reveal>
            <p className="kicker text-r3">Being Christian & gay</p>
            <h2 className="display mt-5 text-[clamp(2.6rem,6.5vw,5.6rem)]">
              Does the Bible really condemn <span className="rainbow-text">who you are?</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-white/80">
              Plenty of us were told we were unwelcome, an abomination, unworthy of God. We’ve read the passages
              closely, in their own language and their own world, and we’d love to walk through them with you.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <Link
              href="/being-christian-and-gay"
              className="group rounded-[2rem] bg-white/[0.07] p-8 ring-1 ring-white/15 transition hover:bg-white/[0.12]"
              data-reveal
            >
              <p className="kicker text-white/60">Read · free</p>
              <h3 className="mt-3 text-3xl font-extrabold tracking-tight">Being Christian & Gay</h3>
              <p className="mt-3 text-white/75">
                Rev. Jim Richards’ classic walk through Genesis, Sodom, Leviticus, Paul, David & Jonathan, and Ruth &
                Naomi. Written for MCC Knoxville and shared here in full.
              </p>
              <span className="mt-6 inline-block font-bold text-r3 group-hover:translate-x-1 transition-transform">
                Start reading →
              </span>
            </Link>
            <a
              href={links.course}
              className="group rounded-[2rem] bg-white p-8 text-ink transition hover:-translate-y-1"
              data-reveal
              style={{ ["--d" as string]: "120ms" }}
            >
              <p className="kicker text-muted">Online course · 10 sessions</p>
              <h3 className="mt-3 text-3xl font-extrabold tracking-tight">Homosexuality and the Bible</h3>
              <p className="mt-3 text-ink/75">
                A self-paced course by Rev. Colleen Darraugh through Mobilizing Love Ministries. Use code{" "}
                <span className="rounded-md bg-r3/30 px-1.5 py-0.5 font-mono font-bold">FREEMCC</span> and it’s
                free. (Want to support the outreach? Skip the code. Wink, wink.)
              </p>
              <span className="mt-6 inline-block font-bold text-flame group-hover:translate-x-1 transition-transform">
                Take the course →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Hands, feet and voice ---------- */}
      <section className="py-24 sm:py-32">
        <div className="wrap">
          <div className="max-w-3xl" data-reveal>
            <p className="kicker text-muted">Hands, feet & voice</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,5.5vw,4.6rem)]">Love you can eat.</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <a href={table.href} className="group relative min-h-[24rem] overflow-hidden rounded-[2rem] bg-night text-white" data-reveal>
              <div className="relative overflow-hidden">
                <Image
                  src="/photos/ready-to-serve-1.png"
                  alt="Volunteers with trays of hot food ready to serve, making sandwiches for hungry neighbors, and rows of grocery bags ready to go out"
                  width={1200}
                  height={630}
                  className="h-auto w-full transition duration-700 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-night via-night/80 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10">
                <p className="display text-[clamp(4rem,9vw,7rem)] text-r3">100+</p>
                <p className="mt-1 text-2xl font-extrabold">hot meals, every Monday night</p>
                <p className="mt-2 max-w-lg text-white/80">
                  A Place at the Table began here in 2015 and now feeds downtown Knoxville as its own nonprofit.
                </p>
              </div>
            </a>
            <div className="grid gap-6">
              <div className="card p-8" data-reveal style={{ ["--d" as string]: "100ms" }}>
                <p className="display text-6xl text-r4">2,199</p>
                <p className="mt-2 text-lg font-bold">neighbors fed by our food pantry so far this year</p>
                <p className="mt-2 text-ink/70">
                  We have served 1823 adults and 376 children so far this year. Our pantry is named in memory of Mike Irwin. Bring groceries the third Sunday of the month.
                </p>
              </div>
              <div className="card p-8" data-reveal style={{ ["--d" as string]: "200ms" }}>
                <p className="kicker text-muted">Also</p>
                <p className="mt-2 text-lg font-bold">Pianists, instrumentalists, singers, all welcome to share their gifts</p>
                <p className="mt-2 text-lg font-bold">Youth ministry, preschool to middle school ages</p>
                <Link href="/serve" className="btn btn-line mt-6">
                  Find your place to serve
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Pastors ---------- */}
      <section className="bg-mist py-24 sm:py-28">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
            <div>
              <p className="kicker text-muted">Your pastors</p>
              <h2 className="display mt-4 text-[clamp(2.4rem,5vw,4rem)]">Glad you found us.</h2>
            </div>
            <Link href="/about#pastors" className="btn btn-line">
              Meet the team
            </Link>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {staff.map((s, i) => (
              <li key={s.name} data-reveal style={{ ["--d" as string]: `${i * 80}ms` }}>
                <div className="overflow-hidden rounded-[1.75rem] bg-white">
                  <Image
                    src={s.photo}
                    alt={s.name}
                    width={600}
                    height={750}
                    className="aspect-[4/5] w-full object-cover object-top"
                    sizes="(min-width: 1024px) 22vw, 45vw"
                  />
                </div>
                <p className="mt-4 text-lg font-extrabold leading-tight">{s.name}</p>
                <p className="text-sm text-muted">{s.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Benediction ---------- */}
      <section className="relative isolate overflow-hidden bg-night py-28 text-center text-white sm:py-40">
        <div className="rainbow-rule absolute inset-x-0 top-0" />
        <div className="wrap" data-reveal>
          <p className="kicker text-white/50">From our benediction</p>
          <p className="mx-auto mt-8 max-w-5xl font-serif text-[clamp(2rem,4.8vw,4rem)] italic leading-[1.15]">
            We go forth as people beloved by God, created in beauty, called to courage, and{" "}
            <span className="rainbow-text not-italic font-sans font-extrabold tracking-tight">empowered for justice.</span>
          </p>
        </div>
      </section>

      {/* ---------- Find us ---------- */}
      <section className="py-24 sm:py-32">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <div data-reveal>
            <p className="kicker text-muted">Finding us</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,5.5vw,4.6rem)]">Through the red brick gateposts.</h2>
            <p className="mt-6 max-w-lg text-lg text-ink/75">
              We’re tucked away in West Knoxville, a few minutes off I-40 at Exit 380. Turn onto Redeemer Lane from
              Tranquilla Drive and the parking lot is at the top of the hill.
            </p>
            <address className="mt-8 not-italic">
              <p className="text-2xl font-extrabold">{org.street}</p>
              <p className="text-lg text-muted">
                {org.city}, {org.state} {org.zip}
              </p>
            </address>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={mapsUrl} className="btn btn-ember">
                Open in Maps
              </a>
              <Link href="/visit#directions" className="btn btn-line">
                Turn-by-turn from I-40
              </Link>
            </div>
          </div>
          <div data-reveal style={{ ["--d" as string]: "120ms" }}>
            <MapCard />
          </div>
        </div>
      </section>
    </>
  );
}
