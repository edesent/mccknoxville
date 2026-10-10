import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import { resources } from "@/lib/site";

export const metadata: Metadata = {
  title: "Community links",
  description: "LGBTQ+ and affirming organizations in Knoxville, East Tennessee and beyond.",
  alternates: { canonical: "/resources" },
};

const tints = ["bg-r1", "bg-r2", "bg-r3", "bg-r4", "bg-r5", "bg-plum"];

export default function ResourcesPage() {
  return (
    <>
      <PageHead
        kicker="Community links"
        title="You’re not alone in East Tennessee."
        lede="Friends, partners and resources for LGBTQ+ people and the people who love them."
      />
      <section className="py-20 sm:py-28">
        <ul className="wrap grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r, i) => (
            <li key={r.name} data-reveal style={{ ["--d" as string]: `${(i % 3) * 70}ms` }}>
              <a href={r.href} target="_blank" rel="noopener" className="card flex h-full gap-4 p-6 transition hover:-translate-y-1">
                <span className={`mt-1 h-10 w-1.5 shrink-0 rounded-full ${tints[i % 6]}`} />
                <span>
                  <span className="block text-lg font-extrabold leading-snug">{r.name}</span>
                  <span className="mt-1 block text-ink/70">{r.note}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
