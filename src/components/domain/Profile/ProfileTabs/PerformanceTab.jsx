import { useState } from "react";
import { CaretDown, ArrowRight, Info } from "@phosphor-icons/react";
import OvrBadge from "../../../UI/OvrBadge";
import PROFEATURES_BG from "../../../../assets/images/Profeatures.png";
import "./PerformanceTab.css";

/* ─── Mock data ─────────────────────────────────────────────────── */

const CHART_DATA = {
  goals: [
    { season: "2023/24", value: 6,  predicted: false },
    { season: "2024/25", value: 4,  predicted: false },
    { season: "2025/26", value: 12, predicted: true  },
    { season: "2026/27", value: 17, predicted: true  },
  ],
  assists: [
    { season: "2023/24", value: 3,  predicted: false },
    { season: "2024/25", value: 5,  predicted: false },
    { season: "2025/26", value: 9,  predicted: true  },
    { season: "2026/27", value: 13, predicted: true  },
  ],
  matches: [
    { season: "2023/24", value: 18, predicted: false },
    { season: "2024/25", value: 14, predicted: false },
    { season: "2025/26", value: 24, predicted: true  },
    { season: "2026/27", value: 30, predicted: true  },
  ],
};

const RADAR_STATS = [
  { label: "Anticipation", value: 72,  lastValue: 70,  trend: "+1%",  up: true,  angle: -90,  anchor: "middle" },
  { label: "Shot Power",   value: 68,  lastValue: 72,  trend: "-2%",  up: false, angle: -30,  anchor: "start"  },
  { label: "Tackling",     value: 35,  lastValue: 33,  trend: "+5%",  up: true,  angle:  30,  anchor: "start"  },
  { label: "Ball Control", value: 78,  lastValue: 73,  trend: "+6%",  up: true,  angle:  90,  anchor: "middle" },
  { label: "Dribbling",    value: 82,  lastValue: 67,  trend: "+22%", up: true,  angle: 150,  anchor: "end"    },
  { label: "Passing",      value: 75,  lastValue: 57,  trend: "+30%", up: true,  angle: 210,  anchor: "end"    },
];

const PREDICTIONS = [
  { label: "Goals",   value: 15, sub: "this season",    trend: "+67% vs last season",  up: true  },
  { label: "Assist",  value: 15, sub: "this season",    trend: "+50% vs last season",  up: true  },
  { label: "Minutes", value: 890, sub: "avg season",    trend: "+6% vs last season",   up: true  },
];

const TRAINING_ROWS = [
  { icon: "⚡", label: "Weeks with 4+ trainings", sub: "more goal contribution",    pct: "+35%", up: true  },
  { icon: "↩",  label: "Recovery days",           sub: "better average match rating", pct: "+12%", up: true  },
  { icon: "💪", label: "Gym sessions",            sub: "better top-game performance", pct: "+18%", up: true  },
];

const LEADERBOARD = [
  { id: 1, name: "Kylan Mbappe",     club: "Real Madrid FC", age: 16, goals: 18, ovr: 52 },
  { id: 2, name: "Samuel Soares",    club: "FC Benfica",      age: 17, goals: 15, ovr: 53 },
  { id: 3, name: "Emil Jensen Bryld",club: "Hobro IK",        age: 18, goals: 12, ovr: 53 },
  { id: 4, name: "Kylan Mbappe",     club: "Real Madrid FC",  age: 17, goals: 10, ovr: 55 },
  { id: 5, name: "Kylan Mbappe",     club: "Real Madrid FC",  age: 17, goals:  9, ovr: 56 },
];

/* ─── Line chart ────────────────────────────────────────────────── */

function LineChart({ data }) {
  const W = 311, H = 205;
  const L = 30, R = 8, T = 22, B = 56;
  const PW = W - L - R;
  const PH = H - T - B;
  const BL = T + PH; // baseline y

  const maxVal = Math.max(...data.map(d => d.value));
  const yMax = Math.ceil(maxVal / 5) * 5;
  const yStep = yMax <= 20 ? 5 : 10;
  const yLabels = Array.from({ length: Math.round(yMax / yStep) + 1 }, (_, i) => i * yStep);

  const toX = (i) => L + (i / (data.length - 1)) * PW;
  const toY = (v) => T + PH - (v / yMax) * PH;

  const splitIdx = data.findIndex(d => d.predicted);

  // Solid historical line (indices 0..splitIdx-1)
  const histPoints = data
    .slice(0, splitIdx)
    .map((d, i) => `${toX(i)},${toY(d.value)}`)
    .join(" ");

  // Dashed predicted line (starts from last historical point)
  const predPoints = data
    .slice(splitIdx - 1)
    .map((d, i) => `${toX(splitIdx - 1 + i)},${toY(d.value)}`)
    .join(" ");

  // Filled area under predicted line
  const areaPoints = [
    `${toX(splitIdx - 1)},${toY(data[splitIdx - 1].value)}`,
    ...data.slice(splitIdx).map((d, i) => `${toX(splitIdx + i)},${toY(d.value)}`),
    `${toX(data.length - 1)},${BL}`,
    `${toX(splitIdx - 1)},${BL}`,
  ].join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      {/* Grid lines */}
      {yLabels.map(v => (
        <line key={v} x1={L} y1={toY(v)} x2={L + PW} y2={toY(v)}
          stroke="#e9e9ec" strokeWidth="1" />
      ))}

      {/* Y-axis labels */}
      {yLabels.map(v => (
        <text key={v} x={L - 4} y={toY(v) + 4} textAnchor="end"
          fontSize="11" fill="#91909b" fontFamily="Barlow,sans-serif" fontWeight="600">
          {v}
        </text>
      ))}

      {/* Predicted fill */}
      <polygon points={areaPoints} fill="rgba(64,81,253,0.08)" />

      {/* Historical line (solid) */}
      <polyline points={histPoints} fill="none" stroke="#4051fd" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* Predicted line (dashed) */}
      <polyline points={predPoints} fill="none" stroke="#4051fd" strokeWidth="2"
        strokeDasharray="5,4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {data.map((d, i) => (
        <circle key={i} cx={toX(i)} cy={toY(d.value)} r={4.5}
          fill={d.predicted ? "#f0f4ff" : "#4051fd"}
          stroke="#4051fd" strokeWidth="2" />
      ))}

      {/* Value labels above dots */}
      {data.map((d, i) => (
        <text key={i} x={toX(i)} y={toY(d.value) - 8} textAnchor="middle"
          fontSize="12" fill="#4051fd" fontFamily="Barlow,sans-serif" fontWeight="600">
          {d.value}
        </text>
      ))}

      {/* X-axis season labels */}
      {data.map((d, i) => (
        <text key={i} x={toX(i)} y={BL + 14} textAnchor="middle"
          fontSize="11" fill="#91909b" fontFamily="Barlow,sans-serif" fontWeight="600">
          {d.season}
        </text>
      ))}

      {/* PREDICTED badges for predicted seasons */}
      {data.map((d, i) =>
        d.predicted ? (
          <g key={i} transform={`translate(${toX(i)}, ${BL + 36})`}>
            <rect x="-27" y="-8" width="54" height="14" rx="7" fill="#dbe9ff" />
            <text textAnchor="middle" y="4" fontSize="8.5" fill="#1f2cb4"
              fontFamily="Barlow,sans-serif" fontWeight="700" fontStyle="italic">
              PREDICTED
            </text>
          </g>
        ) : null
      )}
    </svg>
  );
}

/* ─── Skill radar ───────────────────────────────────────────────── */

function SkillRadar() {
  const CX = 150, CY = 130, MAX_R = 72;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const pt = (r, deg) => [
    CX + r * Math.cos(toRad(deg)),
    CY + r * Math.sin(toRad(deg)),
  ];

  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const hexPts = (r) =>
    RADAR_STATS.map(s => pt(r, s.angle).map(n => n.toFixed(1)).join(",")).join(" ");

  const thisPoly = RADAR_STATS.map(s =>
    pt((s.value / 100) * MAX_R, s.angle).map(n => n.toFixed(1)).join(",")
  ).join(" ");

  const lastPoly = RADAR_STATS.map(s =>
    pt((s.lastValue / 100) * MAX_R, s.angle).map(n => n.toFixed(1)).join(",")
  ).join(" ");

  const LABEL_R = MAX_R + 22;

  return (
    <div className="perf-radar-wrap">
      <svg viewBox="0 0 300 260" width="100%" style={{ display: "block" }}>
        {/* Grid hexagons */}
        {gridLevels.map(level => (
          <polygon key={level} points={hexPts(level * MAX_R)}
            fill="none" stroke="#e1e1e4" strokeWidth="1" />
        ))}

        {/* Axis spokes */}
        {RADAR_STATS.map(s => {
          const [x, y] = pt(MAX_R, s.angle);
          return (
            <line key={s.label} x1={CX} y1={CY} x2={x.toFixed(1)} y2={y.toFixed(1)}
              stroke="#e1e1e4" strokeWidth="1" />
          );
        })}

        {/* Last season polygon */}
        <polygon points={lastPoly}
          fill="none" stroke="#4051fd" strokeWidth="1.5"
          strokeDasharray="4,3" opacity="0.45" />

        {/* This season polygon */}
        <polygon points={thisPoly}
          fill="rgba(64,81,253,0.14)" stroke="#4051fd" strokeWidth="2" />

        {/* Labels and trend chips */}
        {RADAR_STATS.map(s => {
          const [lx, ly] = pt(LABEL_R, s.angle);
          const { anchor } = s;
          const trendColor = s.up ? "#00ab3d" : "#ff3d52";

          return (
            <g key={s.label}>
              <text x={lx.toFixed(1)} y={(ly - 6).toFixed(1)}
                textAnchor={anchor} fontSize="9.5"
                fill="#151622" fontFamily="Barlow,sans-serif" fontWeight="700">
                {s.label.toUpperCase()}
              </text>
              <text x={lx.toFixed(1)} y={(ly + 7).toFixed(1)}
                textAnchor={anchor} fontSize="9"
                fill={trendColor} fontFamily="Barlow,sans-serif" fontWeight="600">
                {s.value} {s.trend}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="perf-radar-legend">
        <div className="perf-radar-legend-item">
          <div className="perf-radar-dot perf-radar-dot--this" />
          <span className="text-2xs-medium">This season</span>
        </div>
        <div className="perf-radar-legend-item">
          <div className="perf-radar-dot perf-radar-dot--last" />
          <span className="text-2xs-medium">Last season</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-sections (Pro only) ───────────────────────────────────── */

function AiInsightCard() {
  return (
    <div className="perf-ai-card">
      <div className="perf-ai-icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.9 8.1H20.4L15.3 11.9L17.2 18L12 14.2L6.8 18L8.7 11.9L3.6 8.1H10.1L12 2Z"
            fill="white" />
        </svg>
      </div>
      <div className="perf-ai-text">
        <p className="perf-ai-title text-sm-semibold">
          Player is getting better every match
        </p>
        <p className="perf-ai-sub text-2xs-medium">
          Top talent trajectory — on track for breakthrough season
        </p>
      </div>
    </div>
  );
}

function PredictionsSection() {
  return (
    <section className="perf-section">
      <h3 className="perf-section-title text-base-semibold">
        Performance predictions
      </h3>
      <div className="perf-pred-grid">
        {PREDICTIONS.map(p => (
          <div key={p.label} className="perf-pred-box">
            <span className="perf-pred-value heading-4xl-italic">{p.value}</span>
            <span className="perf-pred-label text-2xs-medium">{p.label}</span>
            <span className="perf-pred-sub text-2xs-medium">{p.sub}</span>
            <span className={`perf-pred-trend text-2xs-medium${p.up ? " perf-pred-trend--up" : " perf-pred-trend--down"}`}>
              {p.trend}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillTrendsSection() {
  return (
    <section className="perf-section">
      <div className="perf-section-header">
        <h3 className="perf-section-title text-base-semibold">Skill trends</h3>
        <button className="perf-info-btn" aria-label="About skill trends">
          <Info size={16} />
        </button>
      </div>
      <SkillRadar />
    </section>
  );
}

function TrainingImpactSection() {
  return (
    <section className="perf-section">
      <h3 className="perf-section-title text-base-semibold">Training impact</h3>
      <div className="perf-training-rows">
        {TRAINING_ROWS.map(row => (
          <div key={row.label} className="perf-training-row">
            <div className="perf-training-icon" aria-hidden="true">
              {row.icon}
            </div>
            <div className="perf-training-text">
              <span className="perf-training-label text-sm-medium">{row.label}</span>
              <span className="perf-training-sub text-2xs-medium">{row.sub}</span>
            </div>
            <span className={`perf-training-pct text-sm-semibold${row.up ? " perf-training-pct--up" : " perf-training-pct--down"}`}>
              {row.pct}
            </span>
          </div>
        ))}
      </div>
      <button className="perf-trainings-link text-sm-semibold">
        See trainings <ArrowRight size={14} weight="bold" />
      </button>
    </section>
  );
}

function LeaderboardSection() {
  return (
    <section className="perf-section">
      <div className="perf-lb-header">
        <div>
          <h3 className="perf-section-title text-base-semibold">Leaderboard</h3>
          <p className="perf-lb-sub text-2xs-medium">Ranking your position and age</p>
        </div>
        <button className="perf-lb-scope text-sm-medium">
          All world <CaretDown size={14} />
        </button>
      </div>

      <div className="perf-lb-table">
        <div className="perf-lb-col-row text-2xs-medium">
          <span className="perf-lb-col-player">Player</span>
          <span className="perf-lb-col-a">A</span>
          <span className="perf-lb-col-g">G</span>
          <span className="perf-lb-col-rating">Rating</span>
        </div>
        {LEADERBOARD.map(p => (
          <div key={p.id} className="perf-lb-row">
            <div className="perf-lb-player">
              <div className="perf-lb-avatar">
                <span className="text-xs-medium">{p.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</span>
              </div>
              <div className="perf-lb-player-info">
                <span className="perf-lb-name text-sm-semibold">{p.name}</span>
                <span className="perf-lb-club text-2xs-medium">{p.club}</span>
              </div>
            </div>
            <span className="perf-lb-col-a text-sm-medium">{p.age}</span>
            <span className="perf-lb-col-g text-sm-medium">{p.goals}</span>
            <span className="perf-lb-col-rating">
              <OvrBadge value={p.ovr} size="xs" variant="default" />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function UnlockProCard({ onUnlock }) {
  return (
    <div className="perf-unlock-card" style={{ backgroundImage: `url(${PROFEATURES_BG})` }}>
      <div className="perf-unlock-pro-badge">PRO</div>
      <h3 className="perf-unlock-title heading-4xl-italic">Unlock pro features</h3>
      <p className="perf-unlock-desc text-sm-medium">
        Get AI insights, advanced analytics, and full scout visibility.
        Take your career to the next level.
      </p>
      <button className="perf-unlock-btn text-base-semibold" onClick={onUnlock}>
        Unlock Premium
      </button>
    </div>
  );
}

/* ─── Chart tab selector ────────────────────────────────────────── */

const CHART_TABS = [
  { id: "goals",   label: "Goals"   },
  { id: "assists", label: "Assists" },
  { id: "matches", label: "Matches" },
];

function ChartCard({ tab, onTabChange }) {
  return (
    <div className="perf-chart-card">
      <div className="perf-chart-tabs">
        {CHART_TABS.map(t => (
          <button
            key={t.id}
            className={`perf-chart-tab text-sm-semibold${tab === t.id ? " perf-chart-tab--active" : ""}`}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <LineChart data={CHART_DATA[tab]} />
    </div>
  );
}

/* ─── Main export ───────────────────────────────────────────────── */

export default function PerformanceTab({ viewerIsPro: initialIsPro = false }) {
  const [isPro, setIsPro] = useState(Boolean(initialIsPro));
  const [chartTab, setChartTab] = useState("goals");

  return (
    <div className="perf-tab">
      {isPro && <AiInsightCard />}
      <ChartCard tab={chartTab} onTabChange={setChartTab} />
      {isPro ? (
        <>
          <PredictionsSection />
          <SkillTrendsSection />
          <TrainingImpactSection />
          <LeaderboardSection />
        </>
      ) : (
        <UnlockProCard onUnlock={() => setIsPro(true)} />
      )}
    </div>
  );
}
