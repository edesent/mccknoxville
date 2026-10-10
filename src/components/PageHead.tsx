import Ridges from "./Ridges";

/** The masthead on every inside page: the same dusk ridges, shorter. */
export default function PageHead({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-plum text-white">
      {/* Hang the ridges below the fold of the masthead so the words sit in open sky. */}
      <div className="absolute inset-x-0 -bottom-40 top-0 -z-10">
        <Ridges sun={false} />
      </div>
      <div className="wrap pb-36 pt-36 sm:pb-40 sm:pt-40">
        <p className="kicker text-r3">{kicker}</p>
        <h1 className="display mt-4 max-w-4xl text-[clamp(2.8rem,7.5vw,6rem)] [text-shadow:0_4px_30px_rgb(14_8_41/0.5)]">
          {title}
        </h1>
        {lede && <p className="mt-6 max-w-2xl text-lg font-medium text-white [text-shadow:0_2px_18px_rgb(14_8_41/0.7)] sm:text-xl">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
