import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import { documents, todayET } from "@/lib/site";

// Re-checked hourly so the meeting note below disappears after the meeting.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Documents",
  description: "Bylaws, membership forms, policies and congregational meeting packets for MCC Knoxville.",
  alternates: { canonical: "/documents" },
};

export default function DocumentsPage() {
  return (
    <>
      <PageHead
        kicker="For members"
        title="Documents"
        lede={`Bylaws, membership forms, policies and congregational meeting packets.${
          todayET() <= "2026-11-15" ? " Reports for the Fall Forum & Meeting will be posted here by Friday, October 30." : ""
        }`}
      />
      <section className="py-20 sm:py-28">
        <div className="wrap grid gap-10 md:grid-cols-2">
          {documents.map((g) => (
            <div key={g.group} data-reveal>
              <h2 className="text-2xl font-extrabold tracking-tight">{g.group}</h2>
              <ul className="mt-4 grid gap-3">
                {g.items.map((d) => (
                  <li key={d.href}>
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener"
                      className="card flex items-center justify-between gap-4 p-5 transition hover:-translate-y-0.5"
                    >
                      <span>
                        <span className="block font-bold">{d.title}</span>
                        <span className="text-sm text-muted">{d.note}</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-mist px-3 py-1 text-xs font-bold uppercase text-muted">
                        {d.href.endsWith(".docx") ? "Word" : "PDF"}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
