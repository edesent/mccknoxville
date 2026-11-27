# MCC Knoxville — website

Metropolitan Community Church of Knoxville · 7820 Redeemer Lane, Knoxville, TN 37919.
Sunday worship 11:00 AM Eastern, onsite and on Zoom, Facebook Live, YouTube Live and by phone.

Next.js **16.2.1** (App Router) · React 19 · Tailwind CSS **v4** · deployed on
Vercel, which rebuilds automatically on every push to `main`.

Live: https://www.mccknoxville.org
Their current site: https://www.mccknoxville.org (Joomla, 2013 Artisteer template).

## The idea

**The Pride flag, drawn as the Smoky Mountains at dusk.** Six ridgelines layered
red → orange → yellow → green → blue → violet, top to bottom, exactly the way the
flag's stripes run, under the lavender sunset sky from the old site's header
(`src/components/Ridges.tsx`). The ridges rise into place on load and drift at
different speeds as you scroll. Every page masthead uses the same scene.

Their own words carry it: "Come as you are." (from their homepage), "a wellspring of
acceptance, hope and reconciliation" (their mission), and Celebrate · Model · Share
(their purpose statement).

Other pieces built from their material:

- **One service, five ways in** (`src/components/Sunday.tsx`): sanctuary, Zoom,
  Facebook, YouTube and phone as tabs, with a live countdown to Sunday 11 AM
  Eastern that turns into "We’re live right now" during the service.
- **Through the red brick gateposts** (`src/components/Gateposts.tsx`): the last line
  of their own I-40 directions, drawn.
- **Being Christian & Gay** (`/being-christian-and-gay`): Rev. Jim Richards' 1998
  essay, typeset for reading with a table of contents and linked endnotes. Its
  copyright terms require the text to stay **exactly as written**, so
  `src/lib/essay.ts` must not be edited for wording.
- **The MCC flame logo** is redrawn as a vector (`src/components/Mark.tsx`,
  `src/app/icon.svg`).

Photos are the church's own: staff portraits and the A Place at the Table trailer
from their website, and frames from their own YouTube live streams. There is no
stock and no AI imagery. The hero is vector art, not a photo.

## Where to edit

Nearly everything lives in **`src/lib/site.ts`**: service info, the five ways to join,
pastors, weekly and monthly gatherings, one-off events, ministries, recent sermons,
documents and community links.

### Events expire by themselves

- `weekly`: never expire.
- `monthly`: "2nd Thursday" style rules; the next dates are computed, so they never
  go stale.
- `events`: one-offs. Each has `endsOn: "YYYY-MM-DD"`, and the day after, it drops off
  the site. Pages that list events set `export const revalidate = 3600`. Keep that, or
  the list freezes at build time.

### Recent sermons

`sermons` in `site.ts` is a hand-kept list of YouTube video IDs, newest first. Add the
new Sunday's ID to the top.

## Conventions (read before editing)

- **Next 16:** dynamic route `params` and `searchParams` are Promises, so `await` them.
  Don't copy Next 13/14 page signatures.
- **Never name a component prop `ref` or `key`** (React 19 reserves them).
- **Don't import constants from a `"use client"` file into a server page.** Shared data
  lives in `src/lib/`.
- **Custom CSS classes go inside `@layer components`** in `globals.css`.
- **Scroll reveal** (`src/components/Reveal.tsx`) watches the page for new
  `[data-reveal]` elements. Keep the MutationObserver, or pages reached by clicking a
  link stay invisible until a refresh.
- **Phone numbers** (the office line and Text2Give) are stored base64'd in `site.ts`
  and assembled in the browser (`src/components/Obf.tsx`) so scrapers can't harvest
  them. Don't paste raw digits into pages. There are **no raw email addresses** on the
  site; the contact form's topic menu replaces the old list of office emails.
- **Fonts are self-hosted** in `src/fonts/` (Bricolage Grotesque, Newsreader). Don't
  switch to `next/font/google`.
- **Photos:** real photos of this church only. No stock and no AI images.

## Forms

Contact, Prayer request and "Let us know you're coming" post to `/api/form`, which
forwards each one to **`FORM_WEBHOOK_URL`** (a Slack incoming webhook). Until that env
var is set in Vercel, the forms answer 503 and tell visitors to call the church. You
can also set `FORM_SECRET` for the anti-spam token. Prayer requests are marked
"pastoral team only" unless the person ticks "share in the weekly email".

## Going live

While the site is on a preview address, it hides itself from search engines. When
mccknoxville.org is connected, set `NEXT_PUBLIC_SITE_URL=https://www.mccknoxville.org`
in Vercel and redeploy. Their PDFs are linked from `www.mccknoxville.org/documents/`,
so copy them into `public/documents/` and update `documents` in `site.ts` before the
old host goes away.

## To confirm with the church

- **Digital Pastor:** the staff page says Rev. Marie Alford-Harkey, but the Virtual
  Services page still says Rev. Caedmon Grace. The site uses Marie.
- **Photos from the live stream:** the red-shirt preaching frame (homepage) is captioned
  as Rev. Colleen Darraugh. The teal-vestment frame on /about is uncaptioned, so
  confirm who it is.
- **Communion:** /visit says the Table is open to all, which is MCC practice. Confirm
  the wording.
- **A Place at the Table:** the old page's serving location (St. John's Lutheran, 544 N.
  Broadway, Mondays 6 PM) was a COVID-era note. The site only says "downtown, Monday
  nights".
- **Food pantry numbers** (218 boxes, 292 adults, 182 children) are from the old page
  and probably years old.
- **Founding year:** not found. A 2022 WATE story quotes a member saying 45 years in
  Knoxville (around 1977). The site says only "one of the oldest LGBTQ+ communities in
  Knoxville".
- **Phone:** the site uses the church office (865) 531-2539. The CRM's (940) 367-3479
  is a pastor's personal line and is not published.
- **Community links:** dead ones from the old page (a Yahoo group, a UT ~lambda page,
  NOW Knoxville, Spectrum Cafe, Swans) were left off.
