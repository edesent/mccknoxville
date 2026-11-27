/**
 * The MCC flame inside its banded globe, redrawn as a vector from the old
 * site's header graphic. `tone="light"` is for dark backgrounds.
 */
export function Flame({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const band = tone === "light" ? "#ffffff" : "#2e4fd6";
  const flame = tone === "light" ? "#ffffff" : "#2e4fd6";
  const cut = tone === "light" ? "#3b2384" : "#f7f4fc";
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <clipPath id={`globe-${tone}`}>
          <circle cx="32" cy="34" r="25" />
        </clipPath>
      </defs>
      <g clipPath={`url(#globe-${tone})`} fill={band} opacity={tone === "light" ? 0.75 : 0.85}>
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x="0" y={10 + i * 5.6} width="64" height="3.2" />
        ))}
      </g>
      {/* the flame cuts a clean channel through the bands */}
      <path
        d="M32 63 C 17 54, 15 40, 24 29 C 30 22, 29 12, 35 1 C 49 17, 50 32, 42 43 C 38 49, 39 56, 32 63 Z"
        fill={cut}
      />
      <path
        d="M32 59 C 20 51, 19 40, 26 31 C 31 25, 31 16, 35 7 C 45 20, 46 32, 40 41 C 37 46, 37 52, 32 59 Z"
        fill={flame}
      />
      <path d="M31.5 52 C 26 46, 27 38, 34 31 C 36 38, 33 44, 31.5 52 Z" fill={cut} />
    </svg>
  );
}

export function Wordmark({ tone = "light", size = "md" }: { tone?: "light" | "dark"; size?: "md" | "lg" }) {
  const lg = size === "lg";
  return (
    <span className={`flex items-center ${lg ? "gap-4" : "gap-2.5"}`}>
      <Flame className={`${lg ? "h-20 w-20" : "h-10 w-10"} shrink-0`} tone={tone} />
      <span className="leading-none">
        <span className={`block font-serif font-semibold tracking-[0.04em] ${lg ? "text-[3.2rem]" : "text-[1.65rem]"}`}>
          MCC
        </span>
        <span
          className={`block font-bold uppercase tracking-[0.24em] opacity-80 ${lg ? "mt-1.5 text-[1.05rem]" : "mt-0.5 text-[0.66rem]"}`}
        >
          Knoxville
        </span>
      </span>
    </span>
  );
}
