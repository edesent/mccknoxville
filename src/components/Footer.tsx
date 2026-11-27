import Link from "next/link";
import { links, mapsUrl, org } from "@/lib/site";
import { Wordmark } from "./Mark";
import { Obf } from "./Obf";

export default function Footer() {
  return (
    <footer className="relative bg-night text-white">
      <div className="rainbow-rule" />
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Wordmark size="lg" />
          <p className="mt-5 max-w-xs text-white/70">
            A Christian church for the LGBTQ+ and straight communities of Knoxville and East Tennessee.
            Come as you are.
          </p>
          <a href={links.weeklyEmail} className="btn btn-ember mt-6 !py-3 text-sm">
            Get the Friday email
          </a>
        </div>

        <div>
          <p className="kicker text-white/50">Sunday</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight">11:00 AM</p>
          <p className="mt-1 text-white/70">Eastern, onsite & online</p>
          <p className="mt-4 text-white/70">
            <a href={mapsUrl} className="hover:text-white">
              {org.street}
              <br />
              {org.city}, {org.stateCode} {org.zip}
            </a>
          </p>
          <p className="mt-3">
            <Obf b64={org.phoneB64} className="font-semibold hover:text-r3" />
          </p>
        </div>

        <div>
          <p className="kicker text-white/50">Explore</p>
          <ul className="mt-3 grid gap-2 text-white/80">
            {[
              ["/visit", "Plan a visit"],
              ["/watch", "Watch online"],
              ["/events", "Events"],
              ["/about", "About us"],
              ["/serve", "Serve"],
              ["/being-christian-and-gay", "Being Christian & Gay"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="kicker text-white/50">Connect</p>
          <ul className="mt-3 grid gap-2 text-white/80">
            <li><Link href="/give" className="hover:text-white">Give</Link></li>
            <li><Link href="/prayer" className="hover:text-white">Prayer requests</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact us</Link></li>
            <li><Link href="/documents" className="hover:text-white">Documents</Link></li>
            <li><Link href="/resources" className="hover:text-white">Community links</Link></li>
            <li><a href={links.updateInfo} className="hover:text-white">Update your info</a></li>
          </ul>
          <div className="mt-5 flex gap-3">
            <a href={links.facebook} aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M14 8V6.5c0-.7.5-1 1-1h2V2h-3c-3 0-4 2-4 4.3V8H7.5v3.5H10V22h4V11.5h2.8L17 8h-3Z" /></svg>
            </a>
            <a href={links.youtube} aria-label="YouTube" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.4-1.2.4-3.8.4-3.8s0-2.6-.4-3.8ZM10 15.1V8.9l5.2 3.1L10 15.1Z" /></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-6 text-sm text-white/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {org.long}. A 501(c)(3) nonprofit.</p>
          <p>
            Part of the worldwide{" "}
            <a href={links.denomination} className="underline decoration-white/30 underline-offset-4 hover:text-white">
              Metropolitan Community Churches
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
