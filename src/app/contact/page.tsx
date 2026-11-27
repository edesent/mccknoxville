import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/Forms";
import { Obf, ObfEmail } from "@/components/Obf";
import PageHead from "@/components/PageHead";
import { contacts, links, mapsUrl, officeEmailB64, org } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with MCC Knoxville, 7820 Redeemer Lane, Knoxville, TN.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHead kicker="Contact" title="Say hello." lede="A question, a visit, a pastor’s time, or something for the weekly email. We read every message." />
      <section className="py-20 sm:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="card p-7 sm:p-10" data-reveal>
            <ContactForm />
          </div>
          <aside className="grid content-start gap-5" data-reveal style={{ ["--d" as string]: "120ms" }}>
            <div className="rounded-[1.75rem] bg-night p-7 text-white">
              <p className="kicker text-white/50">Church office</p>
              <Obf b64={org.phoneB64} className="mt-2 block text-3xl font-extrabold tracking-tight hover:text-r3" />
              <p className="mt-3 text-white/70">
                Staffed by volunteers, without set hours. Call or send a message and we’ll set up a time. Pastor
                Colleen’s office hours are by appointment.
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-mist p-7">
              <p className="kicker text-muted">Find us</p>
              <a href={mapsUrl} className="mt-2 block text-xl font-extrabold hover:text-flame">
                {org.street}
                <br />
                {org.city}, {org.stateCode} {org.zip}
              </a>
              <Link href="/visit#directions" className="mt-3 inline-block font-bold text-flame">
                Directions from I-40 →
              </Link>
            </div>
            <div className="rounded-[1.75rem] bg-mist p-7">
              <p className="kicker text-muted">Stay in the loop</p>
              <ul className="mt-3 grid gap-2 font-bold">
                <li><a href={links.weeklyEmail} className="hover:text-flame">Get the Friday email →</a></li>
                <li><a href={links.updateInfo} className="hover:text-flame">Update your contact info →</a></li>
                <li><a href={links.facebook} className="hover:text-flame">Facebook →</a></li>
                <li><a href={links.youtube} className="hover:text-flame">YouTube →</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-28">
        <div className="wrap">
          <h2 className="display text-[clamp(2.2rem,5vw,3.8rem)]" data-reveal>Contact us</h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <dl className="grid content-start gap-8" data-reveal>
              <div>
                <dt className="kicker text-muted">Office hours</dt>
                <dd className="mt-2 text-lg text-ink/80">
                  Our office is currently staffed by volunteers, but there is no set schedule. Please call or email
                  the office if you need to meet with someone.
                </dd>
              </div>
              <div>
                <dt className="kicker text-muted">Address</dt>
                <dd className="mt-2 text-lg">
                  <a href={mapsUrl} className="hover:text-flame">
                    <span className="font-bold">{org.long}</span>
                    <br />
                    {org.street}
                    <br />
                    {org.city}, {org.stateCode} {org.zip}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="kicker text-muted">Office</dt>
                <dd className="mt-2 grid gap-1 text-lg">
                  <span>
                    Phone: <Obf b64={org.phoneB64} className="font-bold hover:text-flame" />
                  </span>
                  <span>
                    Email: <ObfEmail b64={officeEmailB64} className="break-all font-bold hover:text-flame" />
                  </span>
                </dd>
              </div>
            </dl>

            <ul className="grid content-start gap-4" data-reveal style={{ ["--d" as string]: "120ms" }}>
              {contacts.map((c) => (
                <li key={c.name} className="rounded-[1.5rem] bg-white p-6 sm:p-7">
                  <p className="text-xl font-extrabold leading-snug">{c.name}</p>
                  <p className="kicker mt-1 text-muted">{c.role}</p>
                  {c.note && <p className="mt-3 text-ink/75">{c.note}</p>}
                  <p className="mt-3">
                    <ObfEmail b64={c.emailB64} className="break-all font-bold text-flame hover:underline" />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
