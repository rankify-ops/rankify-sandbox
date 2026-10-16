/** Decorative, brand-neutral illustration of an integrated heat pump unit. */
export function HeatPumpArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 420" className={className} role="img" aria-label="Illustration of a heat pump hot water system">
      <defs>
        <linearGradient id="tank" x1="0" x2="1">
          <stop offset="0" stopColor="#e9edf1" />
          <stop offset="0.45" stopColor="#ffffff" />
          <stop offset="1" stopColor="#cfd8e1" />
        </linearGradient>
        <linearGradient id="top" x1="0" x2="1">
          <stop offset="0" stopColor="#13283d" />
          <stop offset="0.5" stopColor="#1f3a54" />
          <stop offset="1" stopColor="#0b1b2b" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f26b1d" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f26b1d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="395" rx="110" ry="14" fill="#0b1b2b" opacity="0.12" />
      <circle cx="160" cy="250" r="150" fill="url(#glow)" />
      {/* Tank body */}
      <rect x="85" y="120" width="150" height="265" rx="26" fill="url(#tank)" stroke="#c3ccd6" />
      {/* Heat pump head */}
      <rect x="78" y="40" width="164" height="110" rx="30" fill="url(#top)" />
      {/* Fan grille */}
      <circle cx="160" cy="95" r="36" fill="#0b1b2b" stroke="#3a556f" strokeWidth="2" />
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <path
          key={r}
          d="M160 95 C 168 78, 182 74, 190 80"
          stroke="#7f93a7"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          transform={`rotate(${r} 160 95)`}
        />
      ))}
      <circle cx="160" cy="95" r="6" fill="#f26b1d" />
      {/* Display */}
      <rect x="128" y="185" width="64" height="34" rx="9" fill="#0b1b2b" />
      <text x="160" y="208" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fb923c" fontFamily="ui-sans-serif, system-ui">
        60°
      </text>
      {/* Pipes */}
      <path d="M235 330 h28 v40" stroke="#b4420a" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M235 350 h14 v20" stroke="#3a556f" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Highlight */}
      <rect x="100" y="140" width="10" height="220" rx="5" fill="#ffffff" opacity="0.8" />
    </svg>
  );
}
