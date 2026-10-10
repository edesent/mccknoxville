import type { Metadata } from "next";
import Gateposts from "@/components/Gateposts";
import { VisitForm } from "@/components/Forms";
import PageHead from "@/components/PageHead";
import { WaysToJoin } from "@/components/Sunday";
import { mapsUrl, org } from "@/lib/site";

export const metadata: Metadata = {
  title: "Plan a visit",
  description:
    "Sunday worship at 11 AM Eastern at 7820 Redeemer Lane, Knoxville, and online on Zoom, Facebook Live, YouTube Live and by phone.",
  alternates: { canonical: "/visit" },
};

const expect = [
  {
    t: "Come as you are",
    d: "Jeans or your Sunday best, partnered or single, out or still figuring it out. Nobody here needs you to be anyone else.",
    c: "bg-r1",
  },
  {
    t: "About an hour",
    d: "Worship starts at 11:00 Eastern: hymns and songs, Scripture, a sermon, prayer. Folks on Zoom are part of it, on the screen in the sanctuary.",
    c: "bg-r2",
  },
  {
    t: "Everyone’s welcome at the Table",
    d: "Communion is open to all. You don’t need to be a member, or MCC, or sure of anything, to come forward.",
    c: "bg-r3",
  },
  {
    t: "Kids are welcome",
    d: "Children 2 to 12 have their own lesson with our Children’s Ministry volunteers.",
    c: "bg-r4",
  },
];

const fromWest = [
  "Take Exit 380 (West Hills)",
  "Continue straight through the first stop light (West Town Way)",
];
const fromEast = [
  "Take Exit 380 (West Hills)",
  "Turn right at the first stop light (the unlabeled road to Montvue Rd.)",
];
const thenAll = [
  "Turn left at the next stop light (Kingston Pike)",
  "Continue straight through the next stop light (Leonard Rogers St.)",
  "Turn right at the next stop light (Morrell Rd.)",
  "Continue straight through the next five stop lights, 1.3 miles, finally crossing Westland Dr.",
  "Turn right at the next 4-way stop (Nubbins Ridge Rd.)",
  "Continue 3 blocks",
  "Turn left on Tranquilla Dr. at the crest of the hill",
  "Turn right on Redeemer Lane",
  "The parking lot is at the top of the hill, through two red brick gateposts",
];

export default function VisitPage() {
  return (
    <>
      <PageHead
        kicker="Plan a visit"
        title={
          <>
            Your first Sunday
            <br />
            starts at 11.
          </>
        }
        lede="In the sanctuary on Redeemer Lane, or from wherever you are. Here’s everything you need to know."
      />

      <section className="py-20 sm:py-28">
        <div className="wrap">
          <h2 className="display text-[clamp(2.2rem,5vw,3.8rem)]" data-reveal>What to expect</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {expect.map((x, i) => (
              <li key={x.t} className="card overflow-hidden" data-reveal style={{ ["--d" as string]: `${i * 80}ms` }}>
                <div className={`h-2 ${x.c}`} />
                <div className="p-7">
                  <h3 className="text-2xl font-extrabold leading-tight tracking-tight">{x.t}</h3>
                  <p className="mt-3 leading-relaxed text-ink/75">{x.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="online" className="scroll-mt-20 bg-plum py-20 text-white sm:py-28">
        <div className="wrap">
          <div className="max-w-3xl" data-reveal>
            <p className="kicker text-r3">Can’t make it in?</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,5vw,3.8rem)]">Worship from wherever you are.</h2>
            <p className="mt-4 text-lg text-white/80">
              Zoom is the best way to really take part: you can see and be seen, talk with folks in the room, and
              visit with our Digital Pastor before the service. Replays go up on YouTube Sunday afternoon.
            </p>
          </div>
          <div className="mt-12" data-reveal>
            <WaysToJoin />
          </div>
        </div>
      </section>

      <section id="directions" className="scroll-mt-20 py-20 sm:py-28">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.05fr]">
          <div data-reveal>
            <p className="kicker text-muted">Directions</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,5vw,3.8rem)]">From I-40</h2>
            <address className="mt-6 not-italic">
              <p className="text-xl font-extrabold">{org.street}</p>
              <p className="text-muted">
                {org.city}, {org.state} {org.zip}
              </p>
            </address>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="font-extrabold">Heading west</p>
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-ink/80">
                  {fromWest.map((s) => <li key={s}>{s}</li>)}
                </ol>
              </div>
              <div>
                <p className="font-extrabold">Heading east</p>
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-ink/80">
                  {fromEast.map((s) => <li key={s}>{s}</li>)}
                </ol>
              </div>
            </div>
            <p className="mt-6 font-extrabold">Then, either way</p>
            <ol className="mt-2 space-y-2" start={3}>
              {thenAll.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">
                    {i + 3}
                  </span>
                  <span className={`pt-0.5 ${i === thenAll.length - 1 ? "font-bold" : "text-ink/80"}`}>{s}</span>
                </li>
              ))}
            </ol>
            <a href={mapsUrl} className="btn btn-ember mt-8">
              Directions from where you are
            </a>
          </div>
          <div className="lg:pt-16" data-reveal style={{ ["--d" as string]: "120ms" }}>
            <Gateposts />
          </div>
        </div>
      </section>

      <section id="plan" className="scroll-mt-20 bg-mist py-20 sm:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div data-reveal>
            <p className="kicker text-muted">Optional, never required</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,5vw,3.8rem)]">Let us know you’re coming.</h2>
            <p className="mt-5 max-w-md text-lg text-ink/75">
              Walking into a new church can take courage, especially if church hasn’t been kind to you before. Tell us
              you’re on the way and someone will be watching for you, in the parking lot or on Zoom.
            </p>
          </div>
          <div className="card p-7 sm:p-10" data-reveal style={{ ["--d" as string]: "120ms" }}>
            <VisitForm />
          </div>
        </div>
      </section>
    </>
  );
}
