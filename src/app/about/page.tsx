import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHead from "@/components/PageHead";
import { links, mission, purpose, staff, vision } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "MCC Knoxville is a Christian church serving the gay, lesbian, bisexual, transgender and straight communities of Knoxville and East Tennessee, part of the worldwide Metropolitan Community Churches.",
  alternates: { canonical: "/about" },
};

const tint = ["text-r1", "text-r2", "text-r5"];

export default function AboutPage() {
  return (
    <>
      <PageHead
        kicker="About MCC Knoxville"
        title="A community of faith."
        lede="We come together from a rich variety of religious experiences and denominational backgrounds, and we welcome all to join us, regardless of denomination or background."
      />

      <section className="py-20 sm:py-28">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div data-reveal>
            <p className="kicker text-muted">Our mission</p>
            <p className="mt-5 font-serif text-[clamp(1.5rem,2.6vw,2.1rem)] leading-snug">{mission}</p>
          </div>
          <div className="grid content-start gap-8" data-reveal style={{ ["--d" as string]: "120ms" }}>
            <div className="overflow-hidden rounded-[2rem]">
              <Image
                src="/photos/colleen-pulpit.jpg"
                alt="Preaching from the pulpit at MCC Knoxville, with the altar dressed for fall"
                width={1280}
                height={640}
                className="aspect-[16/9] w-full object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div>
              <p className="kicker text-muted">Our purpose</p>
              <ul className="mt-4 grid gap-3">
                {purpose.map((p, i) => (
                  <li key={p.verb} className="text-xl">
                    <span className={`font-extrabold ${tint[i]}`}>To {p.verb.toLowerCase()}</span> {p.rest}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div data-reveal>
            <p className="kicker text-muted">Our story</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,5vw,3.8rem)]">Our stories are the church.</h2>
          </div>
          <div className="prose-mcc text-lg text-ink/80" data-reveal style={{ ["--d" as string]: "120ms" }}>
            <p>
              The Metropolitan Community Churches began in 1968, when Rev. Troy Perry, a Pentecostal preacher put out
              of his pulpit for being gay, held a worship service for twelve people in his living room in Southern
              California. Gay and straight, black and white sat side by side. MCC has been building churches like that ever since, and
              today it is a worldwide denomination.
            </p>
            <p>
              MCC Knoxville is one of the oldest LGBTQ+ communities of any kind in Knoxville. For decades it has been a
              spiritual home for people who were told by other churches that they were unwelcome, an abomination, or
              unworthy, and a place where a good many of us found each other.
            </p>
            <p className="font-serif text-xl italic text-ink">
              Communal memory takes shape when we share our stories. In those stories is our longing and yearning for
              peace, for love, for acceptance, for freedom, equality and justice. In those yearnings is a search for
              the truth of Spirit.
            </p>
            <p>
              If you are looking for a spiritual home, come visit us and listen to the voice of the Holy speak to you
              through the voices of diversity, community, social justice and prayer.
            </p>
          </div>
        </div>
      </section>

      <section id="pastors" className="scroll-mt-20 py-20 sm:py-28">
        <div className="wrap">
          <p className="kicker text-muted" data-reveal>Our pastors</p>
          <h2 className="display mt-4 text-[clamp(2.2rem,5vw,3.8rem)]" data-reveal>The people who’ll greet you.</h2>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {staff.map((s, i) => (
              <li key={s.name} data-reveal style={{ ["--d" as string]: `${i * 80}ms` }}>
                <Image
                  src={s.photo}
                  alt={s.name}
                  width={600}
                  height={750}
                  className="aspect-[4/5] w-full rounded-[1.75rem] object-cover object-top"
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                />
                <h3 className="mt-4 text-xl font-extrabold leading-tight">{s.name}</h3>
                <p className="font-semibold text-flame">{s.role}</p>
                {s.note && <p className="mt-1 text-ink/70">{s.note}</p>}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-ink/70" data-reveal>
            The church office is staffed by volunteers, without set hours.{" "}
            <Link href="/contact" className="font-bold text-ink underline">Get in touch</Link> to meet with a pastor.
          </p>
        </div>
      </section>

      <section className="bg-night py-20 text-white sm:py-28">
        <div className="wrap">
          <p className="kicker text-r3" data-reveal>Where we’re headed</p>
          <h2 className="display mt-4 max-w-3xl text-[clamp(2.2rem,5vw,3.8rem)]" data-reveal>
            Broadening the boundaries of “church.”
          </h2>
          <ol className="mt-12 grid gap-5 md:grid-cols-2">
            {vision.map((v, i) => (
              <li key={v} className="flex gap-5 rounded-[1.75rem] bg-white/[0.06] p-7 ring-1 ring-white/10" data-reveal style={{ ["--d" as string]: `${i * 80}ms` }}>
                <span className={`display text-5xl ${["text-r1", "text-r2", "text-r3", "text-r4"][i]}`}>{i + 1}</span>
                <span className="pt-1 text-lg text-white/85">{v}</span>
              </li>
            ))}
          </ol>
          <div className="mt-14 flex flex-wrap gap-3">
            <a href={links.denomination} target="_blank" rel="noopener" className="btn btn-ember">
              About Metropolitan Community Churches
            </a>
            <Link href="/documents" className="btn btn-ghost">
              Bylaws & documents
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
