import type { Metadata } from "next";
import Link from "next/link";
import { Obf } from "@/components/Obf";
import PageHead from "@/components/PageHead";
import { essay } from "@/lib/essay";
import { links, org } from "@/lib/site";

export const metadata: Metadata = {
  title: "Being Christian & Gay",
  description:
    "Rev. Jim Richards on what the Bible does and doesn’t say about homosexuality: Genesis, Sodom, Leviticus, Paul, David and Jonathan, Ruth and Naomi.",
  alternates: { canonical: "/being-christian-and-gay" },
};

const slug = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Renders _italic_ and [[n]] endnote markers. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[\[\d+\]\]|_[^_]+_)/g);
  return (
    <>
      {parts.map((p, i) => {
        const note = p.match(/^\[\[(\d+)\]\]$/);
        if (note)
          return (
            <sup key={i} id={`ref-${note[1]}`}>
              <a href={`#note-${note[1]}`} className="ml-0.5 font-sans text-[0.7em] font-bold text-flame no-underline">
                {note[1]}
              </a>
            </sup>
          );
        if (/^_[^_]+_$/.test(p)) return <em key={i}>{p.slice(1, -1)}</em>;
        return p;
      })}
    </>
  );
}

const headTint = ["text-r1", "text-r2", "text-[#d9971a]", "text-r4", "text-r5", "text-plum"];

export default function EssayPage() {
  const heads = essay.blocks.filter((b) => b.k === "h") as { k: "h"; t: string }[];
  let h = -1;
  return (
    <>
      <PageHead
        kicker="Faith & Pride"
        title={
          <>
            Being Christian
            <br />
            & Gay
          </>
        }
        lede={`By ${essay.author} · Revised ${essay.revised} · Written for Metropolitan Community Church of Knoxville`}
      />

      <section className="py-16 sm:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="kicker text-muted">In this essay</p>
            <ol className="mt-4 grid gap-1 border-l-2 border-ink/10">
              {heads.map((x) => (
                <li key={x.t}>
                  <a href={`#${slug(x.t)}`} className="-ml-0.5 block border-l-2 border-transparent py-1.5 pl-4 text-xs font-bold tracking-wide text-ink/70 hover:border-plum hover:text-ink">
                    {x.t}
                  </a>
                </li>
              ))}
              <li>
                <a href="#notes" className="-ml-0.5 block border-l-2 border-transparent py-1.5 pl-4 text-sm font-semibold text-ink/70 hover:border-plum hover:text-ink">
                  Endnotes
                </a>
              </li>
            </ol>
            <div className="mt-8 rounded-[1.5rem] bg-night p-6 text-white">
              <p className="font-extrabold">Want to go deeper?</p>
              <p className="mt-2 text-sm text-white/75">
                Rev. Colleen Darraugh’s 10-session course, free with code <span className="font-mono font-bold text-r3">FREEMCC</span>.
              </p>
              <a href={links.course} target="_blank" rel="noopener" className="mt-4 inline-block text-sm font-bold text-r3">
                Homosexuality and the Bible →
              </a>
            </div>
          </aside>

          <article className="max-w-[44rem] font-serif text-[1.2rem] leading-[1.8] text-ink/90">
            <p className="mb-10 rounded-2xl bg-mist p-5 font-sans text-sm leading-relaxed text-muted">
              Copyright permission to duplicate is hereby granted only if the text remains exactly as is, without
              editing, with credit, and without cost to any recipient. The church is to be notified upon the
              duplication and use of this text. Footnotes appear as endnotes at the end of the text.
            </p>
            {essay.blocks.map((b, i) => {
              switch (b.k) {
                case "h":
                  h++;
                  return (
                    <h2
                      key={i}
                      id={slug(b.t)}
                      className={`display scroll-mt-28 pt-12 font-sans text-[clamp(1.7rem,3.4vw,2.5rem)] leading-[1.02] ${headTint[h % 6]}`}
                    >
                      {b.t}
                    </h2>
                  );
                case "h3":
                  return (
                    <h3 key={i} className="mt-10 font-sans text-2xl font-extrabold tracking-tight text-ink">
                      {b.t}
                    </h3>
                  );
                case "sign":
                  return (
                    <div key={i} className="my-10 flex justify-center">
                      <div className="-rotate-2 rounded-xl border-4 border-ink bg-r3 px-8 py-6 text-center font-sans shadow-[8px_8px_0_rgb(29_20_66)]">
                        {b.lines.map((l) => (
                          <p key={l} className="text-xl font-extrabold uppercase leading-tight tracking-tight text-ink sm:text-2xl">
                            {l}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                case "verse":
                  return (
                    <blockquote key={i} className="my-6 border-l-4 border-r5 pl-6 italic text-ink">
                      {b.lines.map((l) => (
                        <p key={l}>{l}</p>
                      ))}
                    </blockquote>
                  );
                default:
                  return (
                    <p key={i} className="mt-5">
                      <Rich text={b.t} />
                    </p>
                  );
              }
            })}

            <div className="mt-14 rounded-[1.75rem] bg-night p-8 font-sans text-white">
              <p className="text-2xl font-extrabold">Questions?</p>
              <p className="mt-2 text-white/80">You may call MCC Knoxville if you have any questions.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Obf b64={org.phoneB64} className="btn btn-ember" fallback="Call the church office" />
                <Link href="/contact" className="btn btn-ghost">
                  Send a message
                </Link>
              </div>
            </div>

            <section id="notes" className="mt-16 scroll-mt-28 border-t border-ink/10 pt-10 font-sans">
              <h2 className="kicker text-muted">Endnotes</h2>
              <ol className="mt-5 grid gap-2 text-sm leading-relaxed text-ink/75">
                {essay.notes.map((n, i) => (
                  <li key={i} id={`note-${i + 1}`} className="scroll-mt-28">
                    <a href={`#ref-${i + 1}`} className="mr-2 font-bold text-flame">
                      {i + 1}.
                    </a>
                    {n}
                  </li>
                ))}
              </ol>
            </section>
          </article>
        </div>
      </section>
    </>
  );
}
