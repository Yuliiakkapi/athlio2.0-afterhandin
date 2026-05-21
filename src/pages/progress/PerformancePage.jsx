import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaretRight, SneakerMove, Heartbeat, Barbell } from "@phosphor-icons/react";
import { useSkills } from "../../context/SkillsContext";
import AISuggestion from "../../components/domain/Progress-athletes/AISuggestion";
import NavigationTabs from "../../components/UI/NavTabs";
import Button from "../../components/UI/Button";
import "./PerformancePage.css";

const CHART_TABS = ["Goals", "Assists", "Matches"];

const CHART_DATA = {
  Goals:   { seasons: ["2023/24","2024/25","2025/26","2026/27"], values: [6,4,12,17],  yMax: 20, predicted: 2 },
  Assists: { seasons: ["2023/24","2024/25","2025/26","2026/27"], values: [8,11,15,21], yMax: 25, predicted: 2 },
  Matches: { seasons: ["2023/24","2024/25","2025/26","2026/27"], values: [22,19,24,30],yMax: 35, predicted: 2 },
};

const PREDICTIONS = [
  { label: "GOALS",   value: 15,  sub: "this season", pct: "57% this season" },
  { label: "ASSISTS", value: 21,  sub: "this season", pct: "10% this season" },
  { label: "MINUTES", value: 890, sub: "this season", pct: "6% this season"  },
];

const TRAINING_IMPACT = [
  { Icon: SneakerMove, label: "Weeks with 4+ trainings", sub: "more goal contribution",       pct: "+35%" },
  { Icon: Heartbeat,   label: "Recovery days",           sub: "better average match rating",   pct: "+12%" },
  { Icon: Barbell,     label: "Gym sessions",            sub: "better late-game performance",  pct: "+18%" },
];

const RADAR_SKILLS = [
  { key: "anticipation", label: "ANTICIPATION", trend: "up",   pct: "1%"  },
  { key: "shot_power",   label: "SHOT POWER",   trend: "down", pct: "2%"  },
  { key: "tackling",     label: "TACKLING",     trend: "up",   pct: "8%"  },
  { key: "ball_control", label: "BALL CONTROL", trend: "up",   pct: "10%" },
  { key: "dribbling",    label: "DRIBBLING",    trend: "up",   pct: "20%" },
  { key: "passing",      label: "PASSING",      trend: "up",   pct: "30%" },
];

/* ── Line chart ─────────────────────────────────────────────────── */
function LineChart({ tab }) {
  const { seasons, values, yMax, predicted } = CHART_DATA[tab];
  const W = 300, H = 170;
  const PAD = { top: 24, right: 12, bottom: 52, left: 26 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;
  const n = values.length;
  const splitAt = n - predicted;

  const xOf = (i) => PAD.left + (i / (n - 1)) * cW;
  const yOf = (v) => PAD.top + cH - (v / yMax) * cH;

  const histPts = values.slice(0, splitAt).map((v, i) => `${xOf(i)},${yOf(v)}`).join(" ");
  const predPts = values.slice(splitAt - 1).map((v, i) => `${xOf(splitAt - 1 + i)},${yOf(v)}`).join(" ");

  const areaX1 = xOf(splitAt - 1);
  const areaX2 = xOf(n - 1);
  const areaBottom = PAD.top + cH;
  const areaTopPts = values.slice(splitAt - 1).map((v, i) => `${xOf(splitAt - 1 + i)},${yOf(v)}`).join(" ");
  const areaPath = `${areaX1},${areaBottom} ${areaTopPts} ${areaX2},${areaBottom}`;

  const yTicks = [0, Math.round(yMax / 4), Math.round(yMax / 2), Math.round(3 * yMax / 4), yMax];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", overflow: "visible" }}>
      {/* Predicted area */}
      <polygon points={areaPath} fill="rgba(64,81,253,0.08)" />

      {/* Y-axis ticks */}
      {yTicks.map((v) => (
        <text key={v} x={PAD.left - 4} y={yOf(v) + 3.5} textAnchor="end"
          fontSize="9" fill="var(--muted)" fontFamily="Barlow, sans-serif">{v}</text>
      ))}

      {/* Historical line */}
      <polyline points={histPts} fill="none" stroke="var(--primary-default)" strokeWidth="2" strokeLinejoin="round" />

      {/* Predicted line */}
      <polyline points={predPts} fill="none" stroke="var(--primary-default)" strokeWidth="2"
        strokeDasharray="5 3" strokeLinejoin="round" />

      {/* Dots */}
      {values.map((v, i) => (
        <circle key={i} cx={xOf(i)} cy={yOf(v)} r={4}
          fill={i < splitAt ? "var(--primary-default)" : "var(--neutral-50-bg)"}
          stroke="var(--primary-default)" strokeWidth="2" />
      ))}

      {/* Value labels */}
      {values.map((v, i) => (
        <text key={i} x={xOf(i)} y={yOf(v) - 8} textAnchor="middle"
          fontSize="10.5" fill="var(--black)" fontWeight="600" fontFamily="Barlow, sans-serif">{v}</text>
      ))}

      {/* X-axis labels */}
      {seasons.map((s, i) => {
        const isPred = i >= splitAt;
        return (
          <g key={i}>
            <text x={xOf(i)} y={PAD.top + cH + 14} textAnchor="middle"
              fontSize="9.5" fill={isPred ? "var(--primary-default)" : "var(--muted)"}
              fontFamily="Barlow, sans-serif">{s}</text>
            {isPred && (
              <text x={xOf(i)} y={PAD.top + cH + 28} textAnchor="middle"
                fontSize="8" fill="var(--primary-default)" fontFamily="Barlow, sans-serif"
                fontWeight="700" letterSpacing="0.06em">PREDICTED</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Radar chart ────────────────────────────────────────────────── */
function RadarChart({ skills }) {
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
      {/* Grid hexagons */}
      {gridLevels.map((scale) => (
        <polygon key={scale}
          points={RADAR_SKILLS.map((_, i) => { const p = pt(i, scale); return `${p.x},${p.y}`; }).join(" ")}
          fill="none" stroke="var(--neutral-200)" strokeWidth="1" />
      ))}

      {/* Axis spokes */}
      {RADAR_SKILLS.map((_, i) => {
        const outer = pt(i, 1);
        return <line key={i} x1={CX} y1={CY} x2={outer.x} y2={outer.y} stroke="var(--neutral-200)" strokeWidth="1" />;
      })}

      {/* Last season polygon */}
      <polygon points={lastPts} fill="none" stroke="var(--neutral-400)" strokeWidth="1.5" strokeDasharray="4 2" />

      {/* Current season polygon */}
      <polygon points={currentPts} fill="rgba(64,81,253,0.12)" stroke="var(--primary-default)" strokeWidth="2" />

      {/* Dots */}
      {RADAR_SKILLS.map((s, i) => {
        const p = pt(i, (skills[s.key] ?? 5) / 10);
        return <circle key={i} cx={p.x} cy={p.y} r={4} fill="var(--primary-default)" />;
      })}

      {/* Labels */}
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

      {/* Legend */}
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

/* ── Page ───────────────────────────────────────────────────────── */
export default function PerformancePage() {
  const navigate = useNavigate();
  const { skills } = useSkills();
  const [tab, setTab] = useState("Goals");

  return (
    <div className="perf-page">

      {/* Chart card */}
      <div className="perf-chart-card">
        <NavigationTabs variant="segment" tabs={CHART_TABS} activeTab={tab} onTabChange={setTab} />
        <div className="perf-chart-wrap">
          <LineChart tab={tab} />
        </div>
      </div>

      {/* AI suggestion */}
      <AISuggestion
        title="You're on track to your best season yet!"
        desc="Keep up the great work!"
      />

      {/* Performance predictions */}
      <section className="perf-section">
        <h2 className="perf-section-title">Performance predictions</h2>
        <div className="perf-predictions">
          {PREDICTIONS.map((p) => (
            <div key={p.label} className="perf-pred-card">
              <span className="perf-pred-label">{p.label}</span>
              <span className="perf-pred-value">{p.value}</span>
              <span className="perf-pred-sub">{p.sub}</span>
              <div className="perf-pred-trend">
                <div className="perf-pred-arrow" aria-hidden="true" />
                <span>{p.pct}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skill trends */}
      <section className="perf-section">
        <h2 className="perf-section-title">Skill trends</h2>
        <div className="perf-radar-card">
          <RadarChart skills={skills} />
        </div>
      </section>

      {/* Training impact */}
      <section className="perf-section">
        <h2 className="perf-section-title">Training impact</h2>
        <div className="perf-impact-card">
          {TRAINING_IMPACT.map(({ Icon, label, sub, pct }, idx) => (
            <div key={label} className={`perf-impact-row${idx < TRAINING_IMPACT.length - 1 ? " perf-impact-row--border" : ""}`}>
              <div className="perf-impact-icon">
                <Icon size={20} weight="regular" color="var(--primary-default)" />
              </div>
              <div className="perf-impact-info">
                <p className="perf-impact-label">{label}</p>
                <p className="perf-impact-sub">{sub}</p>
              </div>
              <span className="perf-impact-pct">{pct}</span>
            </div>
          ))}
          <button className="perf-see-trainings" onClick={() => navigate("/progress/trainings")}>
            See trainings <CaretRight size={14} weight="bold" />
          </button>
        </div>
      </section>

    </div>
  );
}
