"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "./Mark";

const nav = [
  { href: "/visit", label: "Visit" },
  { href: "/watch", label: "Watch" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/serve", label: "Serve" },
  { href: "/being-christian-and-gay", label: "Faith & Pride" },
];

/** Floats over the dusk sky at the top of every page, then settles into a night-blue bar. */
export default function Header() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 text-white transition-all duration-300 ${
        solid || open ? "bg-night/92 shadow-[0_10px_30px_-20px_rgb(0_0_0/0.6)] backdrop-blur-md" : ""
      }`}
    >
      <div className="wrap flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label="MCC Knoxville, home">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full px-3.5 py-2 text-[0.92rem] font-semibold transition-colors ${
                pathname === n.href ? "bg-white/15" : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link href="/give" className="btn btn-ember ml-3 !px-5 !py-2.5 text-[0.9rem]">
            Give
          </Link>
        </nav>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="wrap pb-8 lg:hidden" aria-label="Mobile">
          <ul className="grid gap-1 border-t border-white/10 pt-4">
            {[...nav, { href: "/give", label: "Give" }, { href: "/contact", label: "Contact" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="block rounded-2xl px-4 py-3 text-xl font-bold hover:bg-white/10">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div className={`rainbow-rule transition-opacity duration-300 ${solid ? "opacity-100" : "opacity-0"}`} style={{ height: 3 }} />
    </header>
  );
}
