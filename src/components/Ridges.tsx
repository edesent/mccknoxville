import Parallax from "./Parallax";

/**
 * The Great Smoky Mountains at dusk, drawn as the Pride flag: six ridgelines,
 * red at the back to violet in front, the way the stripes run top to bottom.
 *
 * The shapes are generated from a fixed seed, so they come out identical on
 * every build. `--depth` sets how far each layer drifts while scrolling.
 */

const W = 1600;
const H = 1000;

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COLORS = [
  ["#ef5a6f", "#c63a57"],
  ["#f8904a", "#de6a2c"],
  ["#f8c94f", "#e5a52c"],
  ["#36a774", "#227f55"],
  ["#3566d6", "#2448ab"],
  ["#3b2384", "#2a1866"],
];

function ridge(i: number, top: number) {
  const r = rng(1977 + i * 31);
  const amp = 30 + i * 9;
  const waves = [1.2, 2.6, 5.3, 11].map((f, k) => ({
    f: (f * (1 + i * 0.07) * Math.PI * 2) / W,
    a: [1, 0.5, 0.22, 0.08][k],
    p: r() * Math.PI * 2,
  }));
  // Rounded summits, the way the Smokies actually look.
  const peaks = Array.from({ length: 3 }, () => ({
    x: r() * W,
    h: (0.6 + r() * 0.9) * amp,
    w: 120 + r() * 220,
  }));
  const pts: string[] = [];
  for (let x = -20; x <= W + 20; x += 10) {
    let y = 0;
    for (const w of waves) y += Math.sin(x * w.f + w.p) * w.a;
    for (const pk of peaks) y += (pk.h / amp) * Math.exp(-(((x - pk.x) / pk.w) ** 2));
    // The valley opens on the left, where the words sit; the peaks climb toward the sun.
    const tilt = 150 * Math.max(0, 1 - x / (W * 0.72)) ** 1.4;
    pts.push(`${x},${(top + tilt - y * amp).toFixed(1)}`);
  }
  return `M-20,${H} L${pts.join(" L")} L${W + 20},${H} Z`;
}

const TOPS = [585, 650, 715, 785, 855, 930];
const DEPTH = [0.42, 0.34, 0.26, 0.18, 0.1, 0];

const stars = (() => {
  const r = rng(68);
  return Array.from({ length: 46 }, () => ({
    x: r() * W,
    y: r() * 380,
    s: 0.6 + r() * 1.5,
    d: r() * 4,
  }));
})();

export default function Ridges({
  sun = true,
  className = "",
}: {
  sun?: boolean;
  className?: string;
}) {
  return (
    <Parallax className={`pointer-events-none absolute inset-0 ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0e0829" />
            <stop offset="0.28" stopColor="#2a1660" />
            <stop offset="0.45" stopColor="#6a2f86" />
            <stop offset="0.56" stopColor="#c45683" />
            <stop offset="0.64" stopColor="#ff9e7a" />
            <stop offset="0.72" stopColor="#ffd3a1" />
          </linearGradient>
          <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff1c9" stopOpacity="0.95" />
            <stop offset="0.35" stopColor="#ffc98d" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ff9e7a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.6" stopColor="#ffe9f1" stopOpacity="0.22" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          {COLORS.map(([a, b], i) => (
            <linearGradient key={i} id={`rg${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={a} />
              <stop offset="0.5" stopColor={b} />
            </linearGradient>
          ))}
        </defs>

        <rect width={W} height={H} fill="url(#sky)" />

        <g>
          {stars.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.s}
              fill="#fff"
              opacity={0.8}
              className="twinkle"
              style={{ animationDelay: `${s.d}s` }}
            />
          ))}
        </g>

        {sun && (
          <g className="ridge" style={{ ["--depth" as string]: 0.5 }}>
            <g className="sun">
              <circle cx={1150} cy={520} r={420} fill="url(#glow)" />
              <circle cx={1150} cy={540} r={92} fill="#fff4d6" />
            </g>
          </g>
        )}

        {TOPS.map((top, i) => (
          <g
            key={i}
            className="ridge"
            style={{ ["--depth" as string]: DEPTH[i], ["--i" as string]: i }}
          >
            <g>
              <path d={ridge(i, top)} fill={`url(#rg${i})`} />
              {i < 5 && (
                <rect x={-20} y={top + 10} width={W + 40} height={90} fill="url(#haze)" />
              )}
            </g>
          </g>
        ))}
      </svg>
    </Parallax>
  );
}
