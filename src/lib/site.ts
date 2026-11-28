import eventList from "@/content/events.json";
import type { ChurchEvent } from "./events";

/**
 * Everything the church might want to change lives in this file. Pages read
 * from here, so an edit here updates the whole site.
 */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.mccknoxville.org";

/**
 * While the site lives on a preview address it asks search engines to stay
 * away. Setting NEXT_PUBLIC_SITE_URL to the real domain turns indexing on.
 */
export const isDemo = /\.(dfd\.llc|vercel\.app|elijahdesent\.com)$/.test(
  new URL(siteUrl).hostname,
);

export const org = {
  name: "MCC Knoxville",
  long: "Metropolitan Community Church of Knoxville",
  denomination: "Metropolitan Community Churches",
  street: "7820 Redeemer Lane",
  city: "Knoxville",
  state: "Tennessee",
  stateCode: "TN",
  zip: "37919",
  /** The church office line, base64'd and put together in the browser (see Obf). */
  phoneB64: "ODY1NTMxMjUzOQ==",
  /** Text an amount to this number to give. */
  text2giveB64: "ODY1NTA5OTk4MA==",
};

export const mapsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=Metropolitan+Community+Church+7820+Redeemer+Ln+Knoxville+TN+37919";

export const links = {
  zoomRegister: "https://zoom.us/meeting/register/v5Ysf-6gqzst116c1dYPvxfVDO0tUCP5Ow",
  facebook: "https://www.facebook.com/MCCKnoxville",
  facebookLive: "https://www.facebook.com/MCCKnoxville/live_videos",
  youtube: "https://www.youtube.com/@mccknoxville",
  youtubeLive: "https://www.youtube.com/@mccknoxville/streams",
  give: "https://mcck.breezechms.com/give/online",
  updateInfo: "https://mcck.breezechms.com/form/ContactUpdate",
  weeklyEmail: "https://eepurl.com/dfW1XP",
  denomination: "https://visitmccchurch.com/",
  placeAtTheTable: "https://apattknox.com/",
  course:
    "https://mobilizing-love1.teachable.com/p/homosexuality-and-the-bible-does-the-bible-really-condemn-homosexuality",
  googleCalendar:
    "https://calendar.google.com/calendar/embed?src=01inr5lfojv3tpqt172l5mrejo%40group.calendar.google.com&src=8smhpcmdcl1nlep8phqq1od4pg%40group.calendar.google.com&src=jsri0t9rcavh83n5as9u6vcd9c%40group.calendar.google.com&ctz=America%2FNew_York",
};

/** Their own words, from the old website. */
export const mission =
  "With God’s help, the Metropolitan Community Church of Knoxville strives to be a wellspring of acceptance, hope and reconciliation for the diverse people of East Tennessee, with a special focus on LGBTQ&I communities. Anchored in Christ’s teachings, we actively promote, nurture and sustain spiritual growth, peace, compassion, and economic, ecological and social justice. We provide a safe place of worship for all persons seeking a spiritual home, accepting one another just as we are.";

export const purpose = [
  { verb: "Celebrate", rest: "God manifested in every single person." },
  { verb: "Model", rest: "Christ and share God’s immutable love." },
  { verb: "Share", rest: "the story of Love, as God’s hands, feet, and voice." },
];

export const vision = [
  "Technological advancement that reaches a broader audience, those in remote areas, and those still closeted.",
  "A thriving ministry to a larger youth population.",
  "Community engagement that nurtures an ongoing sense of mission, purpose, and fellowship.",
  "Development of leaders and disciples who can guide non-traditional activities and environments that broaden and expand the boundaries of “church.”",
];

/** Sunday worship. Times are Eastern. */
export const worship = { day: "Sunday", hour: 11, minute: 0, label: "11:00 AM" };

/** The five ways to be in the room on a Sunday. */
export const ways = [
  {
    id: "onsite",
    name: "In the sanctuary",
    short: "In person",
    how: "Come up Redeemer Lane, through the two red brick gateposts, and park at the top of the hill. Come as you are.",
    cta: { label: "Get directions", href: mapsUrl },
  },
  {
    id: "zoom",
    name: "On Zoom",
    short: "Zoom",
    how: "The best way to really take part from home. You can see and talk with the folks in the room, and they can see you. Register once and you’ll get a link by email that works every Sunday. Join a few minutes early to say hello.",
    cta: { label: "Register once for Zoom", href: links.zoomRegister },
  },
  {
    id: "facebook",
    name: "On Facebook Live",
    short: "Facebook",
    how: "A few minutes before 11, the service goes live on our Facebook page. Share your reactions and prayer requests in the comments with the pastors and each other.",
    cta: { label: "Open Facebook Live", href: links.facebookLive },
  },
  {
    id: "youtube",
    name: "On YouTube Live",
    short: "YouTube",
    how: "Same service, same time, streamed from our YouTube channel right onto this site, with replays posted Sunday afternoon. Hit Subscribe and YouTube will tell you when we’re live.",
    cta: { label: "Watch here", href: "/watch#player" },
  },
  {
    id: "phone",
    name: "By phone",
    short: "Phone",
    how: "No computer needed. Register for Zoom and the email includes dial-in numbers, or call the church office and someone will get you the number, meeting ID and passcode, but please call a few days ahead of Sunday.",
    cta: { label: "Ask the office", href: "/contact" },
  },
] as const;

/** Who to write to. Addresses are base64'd and put together in the browser (see ObfEmail). */
export const officeEmailB64 = "T2ZmaWNlQG1jY2tub3h2aWxsZS5vcmc=";
export const contacts = [
  { name: "Rev. Colleen Darraugh", role: "Lead Pastor", note: "Office hours by appointment", emailB64: "UGFzdG9yQG1jY2tub3h2aWxsZS5vcmc=" },
  { name: "Rev. Marie Alford-Harkey", role: "Digital Pastor", emailB64: "RGlnaXRhbFBhc3RvckBtY2Nrbm94dmlsbGUub3Jn" },
  { name: "Rev. Bodhi Kahlil Der Parunakian", role: "Pastoral Care Lead", emailB64: "UGFzdG9yYWxDYXJlQG1jY2tub3h2aWxsZS5vcmc=" },
];

export const staff = [
  {
    name: "Rev. Colleen Darraugh",
    role: "Lead Pastor",
    photo: "/photos/2025-colleen.jpeg",
    note: "Office hours by appointment.",
  },
  {
    name: "Rev. Marie Alford-Harkey",
    role: "Digital Pastor",
    photo: "/photos/marie-alford-harkey.jpg",
    note: "Pastor to everyone who worships with us online.",
  },
  {
    name: "Rev. Bodhi Kahlil Der Parunakian",
    role: "Associate Pastor of Pastoral Care",
    photo: "/photos/bodhi-der-parunakian.jpg",
    note: "Leads our care for the sick, the grieving and the struggling.",
  },
  {
    name: "Rev. Bob Galloway",
    role: "Pastor Emeritus (Retired)",
    photo: "/photos/bob-galloway.jpg",
    note: "",
  },
];

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

export type Mode = "In person" | "Online" | "In person & online";

/** Things that happen every week. These never expire. */
export const weekly = [
  {
    day: "Sundays",
    time: "11:00 AM",
    title: "Sunday Worship",
    mode: "In person & online" as Mode,
    where: "The sanctuary, Zoom, Facebook & YouTube",
    blurb: "Come as you are. All are welcome at the Table.",
  },
  {
    day: "Mondays",
    time: "Evening",
    title: "A Place at the Table",
    mode: "In person" as Mode,
    where: "Downtown Knoxville",
    blurb: "Volunteers serve 100+ hot meals to neighbors on the margins.",
    href: links.placeAtTheTable,
  },
  {
    day: "Tuesdays",
    time: "Noon",
    title: "Touchstone Group",
    mode: "Online" as Mode,
    where: "Zoom",
    blurb: "Now studying “Songs of Resistance”: songs in Scripture sung as socio-political resistance.",
    href: "https://us02web.zoom.us/j/8644385469?pwd=S3VHY0xOcnFXUlFEZUx2ek11TGtvZz09",
  },
  {
    day: "Wednesdays",
    time: "Noon",
    title: "Lunch ’n Learn",
    mode: "In person" as Mode,
    where: "The Annex, behind the sanctuary",
    blurb: "Bring a lunch and a Bible. We’re reading Esther, the only book of the Bible that never mentions God.",
  },
];

/** Monthly gatherings on the nth weekday of the month. Computed, so they never go stale. */
export const monthly = [
  {
    nth: 2,
    weekday: 4, // Thursday
    time: "10:00 AM",
    title: "Board Meeting",
    mode: "Online" as Mode,
    where: "Zoom",
    blurb: "Open to members.",
  },
  {
    nth: 2,
    weekday: 5, // Friday
    time: "1:00 PM",
    title: "Adult Coloring & Conversation",
    mode: "In person" as Mode,
    where: "MCC Knoxville",
    blurb: "Relax and chat. Bring supplies or use ours; there’s always plenty to share.",
  },
  {
    nth: 3,
    weekday: 0, // Sunday
    time: "11:00 AM",
    title: "Food Pantry Sunday",
    mode: "In person" as Mode,
    where: "MCC Knoxville",
    blurb: "Bring a bag of groceries for the Michael T. Irwin Food Pantry.",
  },
];

/**
 * One-off events live in src/content/events.json, where the editor at /edit
 * adds, changes and removes them. The day after an event's last day, it drops
 * off the site by itself.
 */
export const events: (Dated & { endsOn: string })[] = (eventList as ChurchEvent[]).map((e) => ({
  date: e.start,
  endsOn: e.end ?? e.start,
  time: e.time ?? "",
  title: e.title,
  where: e.where ?? "MCC Knoxville",
  blurb: e.description,
  href: e.link,
}));

/** Today's date in Knoxville, as YYYY-MM-DD. */
export function todayET(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(now);
}

function nthWeekday(year: number, month: number, weekday: number, nth: number) {
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const day = 1 + ((weekday - first + 7) % 7) + (nth - 1) * 7;
  return new Date(Date.UTC(year, month, day));
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

export type Dated = {
  date: string;
  time: string;
  title: string;
  mode?: Mode;
  where: string;
  blurb: string;
  href?: string;
};

/** Every upcoming dated event (one-offs plus the next monthly ones), soonest first. */
export function upcoming(days = 75, now = new Date()): Dated[] {
  const today = todayET(now);
  const [y, m] = today.split("-").map(Number);
  const limit = iso(new Date(Date.parse(today) + days * 864e5));
  const out: Dated[] = events.filter((e) => e.endsOn >= today && e.date <= limit);
  for (let k = 0; k < 3; k++) {
    for (const r of monthly) {
      const d = iso(nthWeekday(y, m - 1 + k, r.weekday, r.nth));
      if (d >= today && d <= limit) out.push({ ...r, date: d });
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

export function prettyDate(d: string) {
  const date = new Date(`${d}T12:00:00Z`);
  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }),
    month: date.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
    day: date.getUTCDate(),
  };
}

/* ------------------------------------------------------------------ */
/* Ministries                                                          */
/* ------------------------------------------------------------------ */

export const ministries = [
  {
    id: "table",
    name: "A Place at the Table",
    kicker: "Every Monday night since 2015",
    body: "What began as a ministry of MCC Knoxville is now its own 501(c)(3). Each Monday our volunteers serve more than 100 hot meals downtown, along with toiletries, clothing and other necessities, to neighbors who are homeless, between jobs, or working and still can’t make rent. The goal is a full stomach and a little dignity, too.",
    how: "Cook, serve, sort donated clothing, or give toiletries.",
    href: links.placeAtTheTable,
    hrefLabel: "apattknox.com",
    photo: "/photos/place-at-the-table.jpg",
  },
  {
    id: "pantry",
    name: "Michael T. Irwin Food Pantry",
    kicker: "Food baskets for anyone who’s hungry",
    body: "Named for Mike Irwin, a member for most of his adult life who died in 2006. The pantry assembles food boxes for hungry neighbors inside the LGBTQ community and across Knox County. That’s 218 boxes feeding 292 adults and 182 children at last count, and every Thanksgiving and Christmas it fills holiday baskets. Alongside it, our Benevolence Fund helps families with rent, utilities and car repairs.",
    how: "Bring groceries on the third Sunday of each month, or use the marked envelopes at the back of the sanctuary.",
    list: [
      "8.5 oz corn bread or muffin mix",
      "1 lb box of saltine crackers",
      "14 oz box of whole-grain cereal",
      "1 lb bag of rice",
    ],
  },
  {
    id: "music",
    name: "Music Ministry",
    kicker: "Everyone’s in it",
    body: "Whether you sing in the choir, play an instrument, sing from the hymnal or just listen well, you’re part of the music here. The choir leads worship most of the year (we take summers off) and sings for Christmas, Easter and special days. We need cantors, soloists, and instrumentalists for a worship band we’re building: guitars, keys, drums, winds and strings.",
    how: "Choir rehearses Wednesdays at 6:30 PM and Sundays at 10:00 AM during the school year.",
  },
  {
    id: "children",
    name: "Children’s Ministry",
    kicker: "Ages 2 to 12",
    body: "Kids get their own lesson on Sunday mornings, led by volunteers from the congregation. We’re always looking for lesson leaders and helpers, about one Sunday a month.",
    how: "Write “children” in the volunteer blank on your generosity card, or send us a note.",
  },
];

/* ------------------------------------------------------------------ */
/* Watch                                                               */
/* ------------------------------------------------------------------ */

/**
 * Back catalogue of services. New uploads are added automatically from the
 * YouTube channel (see messages.ts); this list fills in behind them.
 */
export const sermons = [
  { id: "WuJydX7vWIE", title: "Love One Another: Replacing “Othering” with “Neighboring”", date: "Oct 4, 2026" },
  { id: "aBkjrmzyN9U", title: "Lead Me to the Rock", date: "Sept 27, 2026" },
  { id: "AhlqJf29U2E", title: "Shake Off the Dust and Move On", date: "Sept 20, 2026" },
  { id: "1TW3mehc2mo", title: "The Solid Rock", date: "Sept 13, 2026" },
  { id: "-aV9KlmTjCs", title: "Wild Grace: Grace that Sends Us Out", series: "Wild Grace" },
  { id: "7LzItqIjsWY", title: "Wild Grace: Grace that Frees Us", series: "Wild Grace" },
  { id: "Gi7b4M5yO4g", title: "Wild Grace: Grace in the Ordinary Wild", series: "Wild Grace" },
  { id: "1liEFY2glb4", title: "Wild Grace: Grace in the Growing Places", series: "Wild Grace" },
  { id: "stcjWHWatTU", title: "Wild Grace: Grace in the Storm", series: "Wild Grace" },
  { id: "MM9VYPsBmZE", title: "Wild Grace: Grace That Finds Us", series: "Wild Grace" },
  { id: "moS9X6M37DA", title: "Freedom’s Unfinished Work" },
  { id: "Am6OdRv2kL8", title: "Faith Greater Than Opposition" },
  { id: "zDicWf3gyL0", title: "Beloved, Brave, and Free" },
  { id: "qm7uDQG0U1k", title: "When Resistance Becomes Worship" },
  { id: "avUUqbYbFuA", title: "Nevertheless She Persisted" },
  { id: "V7FAUuo522Y", title: "Easter Celebration: The First Meal, Again" },
];

export const queerFacesOfFaith = [
  { id: "JsNIHpvedN0", title: "Virginia Ramey Mollenkott" },
  { id: "gzt8qJsntUE", title: "Dr. Ibrahim Farajajé" },
];

/* ------------------------------------------------------------------ */
/* Documents & resources                                               */
/* ------------------------------------------------------------------ */

const doc = (f: string) => `https://www.mccknoxville.org/documents/${f}`;

export const documents = [
  {
    group: "Congregational Forum & Meeting",
    items: [
      { title: "Congregational Forum & Meeting Packet", note: "Updated Apr 9, 2026", href: doc("CongMtg2026.05.03MeetingPacket.pdf") },
      { title: "Pastor’s Report", note: "Updated Apr 16, 2026", href: doc("CongMtg2026.05.03PastorsReport.pdf") },
    ],
  },
  {
    group: "Bylaws",
    items: [
      { title: "MCC Knoxville Local Bylaws", note: "Approved May 21, 2023", href: doc("MCCKBylaws_20230521.pdf") },
      { title: "MCC Knoxville Local Bylaws", note: "Approved Sept 29, 2019", href: doc("MCCKBylaws_20190929.pdf") },
      { title: "UFMCC Denomination Bylaws", note: "Effective July 2, 2019", href: doc("UFMCCBylaws_20190702.pdf") },
    ],
  },
  {
    group: "Membership",
    items: [
      { title: "Membership Commitment Letter", note: "March 2021", href: doc("MCCKMembershipCommitmentLetter2021.pdf") },
      { title: "Membership Renewal Rationale", note: "March 2021", href: doc("MCCKMembershipRenewalRationale2021.pdf") },
      { title: "Renewal of Membership Covenant Form (PDF)", note: "April 2022", href: doc("MCCKRenewalOfMembershipCovenantForm2022.pdf") },
      { title: "Renewal of Membership Covenant Form (Word)", note: "April 2022", href: doc("MCCKRenewalOfMembershipCovenantForm2022.docx") },
    ],
  },
  {
    group: "Policies",
    items: [
      { title: "Animal Policy", note: "Approved Jan 3, 2019", href: doc("MCCKAnimalPolicy_20190103.pdf") },
      { title: "Building Use Policy", note: "Approved May 4, 2015", href: doc("MCCKBuildingUsePolicy_20150504.pdf") },
      { title: "Electronic Media Policy", note: "Approved Dec 14, 2014", href: doc("MCCKElectronicMediaPolicy_20141214.pdf") },
      { title: "Key Policy", note: "Approved Nov 14, 2019", href: doc("MCCKKeyPolicy_20191114.pdf") },
    ],
  },
  {
    group: "Outreach",
    items: [{ title: "Blessing Bags / Grace Bags", note: "Nov 21, 2020", href: doc("BlessingAndGraceBags.pdf") }],
  },
];

export const resources = [
  { name: "Knoxville Pride", href: "https://knoxpride.com/", note: "Pride Fest, the parade, and year-round community." },
  { name: "PFLAG Knoxville", href: "http://pflagknoxville.org", note: "Parents, families and friends of LGBTQ+ people." },
  { name: "Tennessee Equality Project", href: "http://tnequalityproject.org/", note: "Statewide LGBTQ+ advocacy." },
  { name: "Appalachian Equality Chorus", href: "https://appalachianequalitychorus.org/", note: "Formerly the Knoxville Gay Men’s Chorus." },
  { name: "Knoxville Gay Men’s Discussion Group", href: "http://www.gaygroupknoxville.org", note: "Mondays 7:30–9 PM at TVUUC, 2931 Kingston Pike, and on Zoom." },
  { name: "Knox LGBTQ Business Directory", href: "https://www.knoxlgbtbusinesses.com/knox-lgbtq-directory", note: "700+ LGBTQ-friendly businesses and resources." },
  { name: "Community of Saint Ninian", href: "http://www.saintninianswell.org", note: "A small Christian covenant community devoted to hospitality." },
  { name: "Damon & Stella Foundation", href: "http://www.theDASfoundation.org", note: "Mental-health awareness and suicide prevention." },
  { name: "Whosoever.org", href: "http://whosoever.org", note: "An online magazine for LGBTQ+ Christians." },
  { name: "Out & About Newspaper", href: "http://www.outandaboutnewspaper.com", note: "Regional news for our community." },
  { name: "Metropolitan Community Churches", href: links.denomination, note: "Our denomination, worldwide since 1968." },
];
