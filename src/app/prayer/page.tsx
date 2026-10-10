import type { Metadata } from "next";
import { PrayerForm } from "@/components/Forms";
import { Obf } from "@/components/Obf";
import PageHead from "@/components/PageHead";
import { org } from "@/lib/site";

export const metadata: Metadata = {
  title: "Prayer requests",
  description: "Send a prayer request to the pastors and prayer team at MCC Knoxville.",
  alternates: { canonical: "/prayer" },
};

export default function PrayerPage() {
  return (
    <>
      <PageHead
        kicker="Prayer"
        title="We’ll hold it with you."
        lede="Whatever you’re carrying, you don’t have to carry it alone. Tell us how we can pray."
      />
      <section className="py-20 sm:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="card p-7 sm:p-10" data-reveal>
            <PrayerForm />
          </div>
          <aside className="grid content-start gap-5" data-reveal style={{ ["--d" as string]: "120ms" }}>
            <div className="rounded-[1.75rem] bg-mist p-7">
              <p className="font-extrabold">Who sees it</p>
              <p className="mt-2 text-ink/75">
                Requests go to our pastors, Board and prayer team. The whole congregation only hears about it if you
                tick the box to share it in the weekly email.
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-r1/10 p-7">
              <p className="font-extrabold text-[#b02a43]">Need someone now?</p>
              <p className="mt-2 text-ink/75">
                This form is for non-urgent requests. If it can’t wait, please call the church office at{" "}
                <Obf b64={org.phoneB64} className="font-bold text-ink underline" fallback="our office line" />. In a
                crisis, call or text 988.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
