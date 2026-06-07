const RADAR_SKILLS = [
  { key: "anticipation", label: "ANTICIPATION", trend: "up",   pct: "1%"  },
  { key: "shot_power",   label: "SHOT POWER",   trend: "down", pct: "2%"  },
  { key: "tackling",     label: "TACKLING",     trend: "up",   pct: "8%"  },
  { key: "ball_control", label: "BALL CONTROL", trend: "up",   pct: "10%" },
  { key: "dribbling",    label: "DRIBBLING",    trend: "up",   pct: "20%" },
  { key: "passing",      label: "PASSING",      trend: "up",   pct: "30%" },
];

const DEFAULT_SKILLS = {
  dribbling: 5, passing: 5, shot_power: 5,
  ball_control: 5, tackling: 5, anticipation: 5,
};

export default function PerformanceRadarChart({ skills = DEFAULT_SKILLS }) {
  const CX = 150, CY = 155, R = 80;
  const N = RADAR_SKILLS.length;

  function pt(index, scale) {
    const angle = -Math.PI / 2 + (2 * Math.PI * index / N);
    return { x: CX + R * scale * Math.cos(angle), y: CY + R * scale * Math.sin(angle) };
  }

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const currentPts = RADAR_SKILLS.map((s, i) => {
    const p = pt(i, (skills[s.key] ?? 5) / 10);
    return `${p.x},${p.y}`;
  }).join(" ");

  const lastPts = RADAR_SKILLS.map((s, i) => {
    const p = pt(i, Math.max(1, (skills[s.key] ?? 5) - 1) / 10);
    return `${p.x},${p.y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 300 310" style={{ width: "100%", overflow: "visible" }}>
      {gridLevels.map((scale) => (
        <polygon key={scale}
          points={RADAR_SKILLS.map((_, i) => { const p = pt(i, scale); return `${p.x},${p.y}`; }).join(" ")}
          fill="none" stroke="var(--neutral-200)" strokeWidth="1" />
      ))}
      {RADAR_SKILLS.map((_, i) => {
        const outer = pt(i, 1);
        return <line key={i} x1={CX} y1={CY} x2={outer.x} y2={outer.y} stroke="var(--neutral-200)" strokeWidth="1" />;
      })}
      <polygon points={lastPts} fill="none" stroke="var(--neutral-400)" strokeWidth="1.5" strokeDasharray="4 2" />
      <polygon points={currentPts} fill="rgba(64,81,253,0.12)" stroke="var(--primary-default)" strokeWidth="2" />
      {RADAR_SKILLS.map((s, i) => {
        const p = pt(i, (skills[s.key] ?? 5) / 10);
        return <circle key={i} cx={p.x} cy={p.y} r={4} fill="var(--primary-default)" />;
      })}
      {RADAR_SKILLS.map((s, i) => {
        const angle = -Math.PI / 2 + (2 * Math.PI * i / N);
        const labelR = R + 28;
        const lx = CX + labelR * Math.cos(angle);
        const ly = CY + labelR * Math.sin(angle);
        const anchor = Math.abs(Math.cos(angle)) < 0.25 ? "middle" : Math.cos(angle) > 0 ? "start" : "end";
        const val = skills[s.key] ?? 5;
        const trendColor = s.trend === "up" ? "var(--success-default)" : "var(--negative-default)";
        const trendSign = s.trend === "up" ? "▲" : "▼";
        return (
          <g key={i}>
            <text x={lx} textAnchor={anchor} fontFamily="Barlow, sans-serif">
              <tspan y={ly} fontSize="8.5" fontWeight="700" fill="var(--black)" letterSpacing="0.04em">
                {s.label}
              </tspan>
              <tspan x={lx} dy="12" fontSize="9" fontWeight="600" fill="var(--primary-default)">
                {val}/10{"  "}
              </tspan>
              <tspan fontSize="9" fontWeight="600" fill={trendColor}>
                {trendSign}{s.pct}
              </tspan>
            </text>
          </g>
        );
      })}
      <g transform="translate(42, 292)">
        <line x1="0" y1="5" x2="18" y2="5" stroke="var(--primary-default)" strokeWidth="2" />
        <text x="22" y="9" fontSize="10" fill="var(--muted)" fontFamily="Barlow, sans-serif">This season</text>
      </g>
      <g transform="translate(152, 292)">
        <line x1="0" y1="5" x2="18" y2="5" stroke="var(--neutral-400)" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="22" y="9" fontSize="10" fill="var(--muted)" fontFamily="Barlow, sans-serif">Last season</text>
      </g>
    </svg>
  );
}
