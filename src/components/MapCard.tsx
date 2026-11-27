import { mapsUrl, org } from "@/lib/site";

/** Google's own map of the church, framed like the rest of the site. */
const embed =
  "https://www.google.com/maps?q=" +
  encodeURIComponent(`Metropolitan Community Church, ${org.street}, ${org.city}, ${org.stateCode} ${org.zip}`) +
  "&z=16&output=embed";

export default function MapCard() {
  return (
    <figure className="relative overflow-hidden rounded-[2.2rem] bg-mist shadow-2xl ring-1 ring-ink/10">
      <iframe
        src={embed}
        title={`Map to ${org.long}, ${org.street}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="block aspect-[4/5] w-full border-0 sm:aspect-[6/5]"
      />
      <figcaption className="pointer-events-none absolute bottom-4 left-4 right-4 flex">
        <a
          href={mapsUrl}
          className="pointer-events-auto rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-ink shadow-lg backdrop-blur"
        >
          Parking is at the top of the hill
        </a>
      </figcaption>
    </figure>
  );
}
