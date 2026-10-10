/**
 * The last line of the church's own directions, drawn: up Redeemer Lane,
 * through two red brick gateposts, to the top of the hill.
 */

function Post({ x }: { x: number }) {
  const rows = 11;
  return (
    <g>
      <rect x={x - 4} y={238} width={60} height={14} rx={2} fill="#7e2f2b" />
      <rect x={x} y={252} width={52} height={150} fill="#b5473d" />
      {Array.from({ length: rows }, (_, r) => (
        <g key={r}>
          <line x1={x} x2={x + 52} y1={252 + r * 13.6} y2={252 + r * 13.6} stroke="#8f3530" strokeWidth={1.6} />
          {[0, 1].map((c) => (
            <line
              key={c}
              x1={x + (r % 2 ? 13 : 26) + c * 26}
              x2={x + (r % 2 ? 13 : 26) + c * 26}
              y1={252 + r * 13.6}
              y2={252 + (r + 1) * 13.6}
              stroke="#8f3530"
              strokeWidth={1.6}
            />
          ))}
        </g>
      ))}
      <rect x={x + 52} y={252} width={8} height={150} fill="#8f3530" opacity={0.6} />
      <path d={`M${x - 6} 238 L${x + 26} 222 L${x + 62} 238 Z`} fill="#6c2724" />
    </g>
  );
}

export default function Gateposts() {
  return (
    <figure className="relative overflow-hidden rounded-[2.2rem] shadow-2xl ring-1 ring-ink/10">
      <svg viewBox="0 0 600 520" className="block h-auto w-full" role="img" aria-labelledby="gp-t">
        <title id="gp-t">Redeemer Lane winding up the hill through two red brick gateposts</title>
        <defs>
          <linearGradient id="gp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5b3a9c" />
            <stop offset="0.5" stopColor="#d77a98" />
            <stop offset="1" stopColor="#ffd6a8" />
          </linearGradient>
          <linearGradient id="gp-hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4c9a5f" />
            <stop offset="1" stopColor="#2c6b45" />
          </linearGradient>
        </defs>
        <rect width="600" height="520" fill="url(#gp-sky)" />
        <circle cx="440" cy="150" r="46" fill="#fff1cf" opacity="0.95" />
        {/* far ridges, the flag again */}
        <path d="M0 200 Q 80 150 170 185 T 340 170 T 500 160 T 600 175 V520 H0Z" fill="#ef5a6f" opacity="0.75" />
        <path d="M0 220 Q 100 180 200 210 T 400 195 T 600 205 V520 H0Z" fill="#f8904a" opacity="0.8" />
        <path d="M0 240 Q 120 205 230 232 T 450 220 T 600 230 V520 H0Z" fill="#f8c94f" opacity="0.85" />
        <path d="M0 262 Q 130 228 260 255 T 480 245 T 600 252 V520 H0Z" fill="#3566d6" opacity="0.55" />
        {/* the hill */}
        <path d="M0 300 Q 150 240 300 262 T 600 290 V520 H0Z" fill="url(#gp-hill)" />
        {/* trees */}
        {[60, 92, 128, 470, 505, 540, 572].map((x, i) => (
          <g key={x} transform={`translate(${x} ${282 - (i % 3) * 6})`}>
            <rect x="-2" y="18" width="4" height="12" fill="#2a3b2a" />
            <path d="M0 -14 L13 20 L-13 20 Z" fill={i % 2 ? "#245c3c" : "#1f5034"} />
          </g>
        ))}
        {/* Redeemer Lane */}
        <path
          d="M250 530 C 260 450, 380 430, 340 360 C 318 322, 284 300, 302 276"
          fill="none"
          stroke="#3d3550"
          strokeWidth="58"
          strokeLinecap="butt"
        />
        <path
          d="M250 530 C 260 450, 380 430, 340 360 C 318 322, 284 300, 302 276"
          fill="none"
          stroke="#f6bd3f"
          strokeWidth="3"
          strokeDasharray="14 14"
        />
        <Post x={212} />
        <Post x={392} />
        {/* street sign */}
        <g transform="translate(98 330)">
          <rect x="-2" y="0" width="5" height="110" fill="#5a5a66" />
          <rect x="-58" y="-8" width="122" height="28" rx="4" fill="#1f6b4a" stroke="#fff" strokeWidth="2" />
          <text x="3" y="11" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="var(--font-bricolage)">
            REDEEMER LN
          </text>
        </g>
      </svg>
      <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-ink backdrop-blur">
        Parking’s at the top of the hill
      </figcaption>
    </figure>
  );
}
