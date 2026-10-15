import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { isDemo, org, siteUrl } from "@/lib/site";
import "./globals.css";

// Fonts are self-hosted so the build never depends on reaching Google.
const bricolage = localFont({
  src: [{ path: "../fonts/bricolage.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-bricolage",
  display: "swap",
});

const newsreader = localFont({
  src: [
    { path: "../fonts/newsreader.woff2", weight: "400 600", style: "normal" },
    { path: "../fonts/newsreader-italic.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-newsreader",
  display: "swap",
});

const description =
  "Metropolitan Community Church of Knoxville is a Christian church serving the LGBTQ+ and straight communities of Knoxville and East Tennessee. Sunday worship at 11 AM Eastern, in the sanctuary on Redeemer Lane and online on Zoom, Facebook and YouTube.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${org.name} · Metropolitan Community Church of Knoxville, TN`,
    template: `%s · ${org.name}`,
  },
  description,
  openGraph: {
    type: "website",
    siteName: org.long,
    title: "Come as you are. MCC Knoxville",
    description,
    images: [{ url: "/photos/colleen-preaching.jpg" }],
  },
  robots: isDemo ? { index: false, follow: false } : undefined,
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#120b33",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: org.long,
  alternateName: org.name,
  url: siteUrl,
  image: `${siteUrl}/photos/colleen-preaching.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "7820 Redeemer Ln",
    addressLocality: org.city,
    addressRegion: org.stateCode,
    postalCode: org.zip,
    addressCountry: "US",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "11:00", closes: "12:15" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${newsreader.variable}`}>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Reveal />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* Demo tracking (CRM → Demo Tracking). Remove at go-live. */}
        <script async src="https://www.elijahdesent.com/demo.js" />
      </body>
    </html>
  );
}
