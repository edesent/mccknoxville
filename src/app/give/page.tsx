import type { Metadata } from "next";
import { Obf } from "@/components/Obf";
import PageHead from "@/components/PageHead";
import { links, org } from "@/lib/site";

export const metadata: Metadata = {
  title: "Give",
  description: "Give to MCC Knoxville online, by text, by mail or in the offering plate. Gifts are tax-deductible.",
  alternates: { canonical: "/give" },
};

export default function GivePage() {
  return (
    <>
      <PageHead
        kicker="Give"
        title="Giving is a blessing both ways."
        lede="Your gifts keep a safe, affirming church open for the LGBTQ+ and ally communities of Knoxville and East Tennessee, and keep the pantry stocked."
      />

      <section className="py-20 sm:py-28">
        <div className="wrap grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-night p-8 text-white sm:p-12" data-reveal>
            <div aria-hidden="true" className="rainbow-rule absolute inset-x-0 top-0" />
            <p className="kicker text-r3">The easiest way</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,5vw,4rem)]">Give online</h2>
            <p className="mt-5 max-w-md text-lg text-white/80">
              One time or recurring, to the General Fund or another fund. The first time, you’ll set up a quick account.
            </p>
            <a href={links.give} target="_blank" rel="noopener" className="btn btn-ember mt-8 text-lg">
              Give securely online <span aria-hidden="true">→</span>
            </a>
            <p className="mt-10 rounded-2xl bg-white/[0.07] p-5 text-white/80">
              <span className="font-bold text-white">Give weekly or monthly?</span> Set up a recurring gift once and
              it’s done. Recurring gifts are a real help to the church’s cash flow.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="card p-8" data-reveal style={{ ["--d" as string]: "100ms" }}>
              <p className="kicker text-muted">Text2Give</p>
              <p className="mt-3 text-lg">Text the amount you’d like to give to</p>
              <Obf b64={org.text2giveB64} as="sms" className="mt-1 block text-3xl font-extrabold tracking-tight text-flame" fallback="our Text2Give number" />
            </div>
            <div className="card p-8" data-reveal style={{ ["--d" as string]: "200ms" }}>
              <p className="kicker text-muted">By check</p>
              <p className="mt-3 text-lg">Drop it in the offering plate, or mail it to</p>
              <address className="mt-2 not-italic font-bold">
                {org.long}
                <br />
                {org.street}
                <br />
                {org.city}, {org.stateCode} {org.zip}
              </address>
              <p className="mt-4 text-sm text-muted">
                You can also have your bank mail us a check through auto bill pay.
              </p>
            </div>
          </div>
        </div>
        <p className="wrap mt-10 text-center text-sm text-muted">
          {org.long} is a 501(c)(3) nonprofit. Your donations are tax-deductible.
        </p>
      </section>
    </>
  );
}
