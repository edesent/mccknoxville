import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHead from "@/components/PageHead";
import { ministries } from "@/lib/site";

export const metadata: Metadata = {
  title: "Serve",
  description:
    "A Place at the Table, the Michael T. Irwin Food Pantry, music and children’s ministry at MCC Knoxville.",
  alternates: { canonical: "/serve" },
};

const bar = ["bg-r2", "bg-r4", "bg-r5", "bg-r1"];

export default function ServePage() {
  const [table, ...others] = ministries;
  return (
    <>
      <PageHead
        kicker="Serve"
        title={
          <>
            God’s hands,
            <br />
            feet & voice.
          </>
        }
        lede="Following Christ’s teaching on service to others, there’s a place for you to help, whatever your gifts."
      />

      <section className="py-20 sm:py-28">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="overflow-hidden rounded-[2rem]" data-reveal>
            <Image
              src={table.photo!}
              alt="Two volunteers beside the A Place at the Table trailer"
              width={1800}
              height={1013}
              className="w-full object-cover"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </div>
          <div data-reveal style={{ ["--d" as string]: "120ms" }}>
            <p className="kicker text-r2">{table.kicker}</p>
            <h2 className="display mt-3 text-[clamp(2.4rem,5vw,4rem)]">{table.name}</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/80">{table.body}</p>
            <p className="mt-4 font-bold">{table.how}</p>
            <a href={table.href} target="_blank" rel="noopener" className="btn btn-ember mt-7">
              Volunteer at {table.hrefLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-28">
        <div className="wrap grid gap-6 lg:grid-cols-3">
          {others.map((m, i) => (
            <article key={m.id} id={m.id} className="card scroll-mt-28 overflow-hidden" data-reveal style={{ ["--d" as string]: `${i * 90}ms` }}>
              <div className={`h-2 ${bar[i + 1]}`} />
              <div className="p-8">
                <p className="kicker text-muted">{m.kicker}</p>
                <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight">{m.name}</h2>
                <p className="mt-4 leading-relaxed text-ink/80">{m.body}</p>
                {m.list && (
                  <div className="mt-5 rounded-2xl bg-mist p-5">
                    <p className="text-sm font-bold">The pantry grocery list</p>
                    <ul className="mt-2 grid gap-1 text-sm text-ink/80">
                      {m.list.map((x) => (
                        <li key={x} className="flex gap-2">
                          <span className="text-r4">✓</span>
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="mt-5 font-bold">{m.how}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="wrap mt-12 text-center" data-reveal>
          <Link href="/contact" className="btn btn-ink">
            Tell us where you’d like to help
          </Link>
        </div>
      </section>
    </>
  );
}
