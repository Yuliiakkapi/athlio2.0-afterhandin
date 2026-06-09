import "../../../pages/progress/TrainingsPage.css";

const STATS = [
  { label: "SESSIONS", value: "6", trend: "24% this week" },
  { label: "DURATION", value: "4h 20m", trend: "5% this week", smallValue: true },
  { label: "AVR. RATING", value: "6.9", down: true, downTrend: "10% vs last" },
];

const BREAKDOWN = [
  { label: "Team training", pct: 70 },
  { label: "Gym", pct: 20 },
  { label: "Football training", pct: 5 },
  { label: "Run", pct: 5 },
  { label: "Recovery", pct: 0 },
];

export default function YourProgressSection() {
  return (
    <section className="tp-section">
      <h2 className="tp-section-title">Your progress</h2>

      <div className="tp-stats">
        {STATS.map((s) => (
          <div key={s.label} className="tp-stat-card">
            <span className="tp-stat-label">{s.label}</span>
            <span className={`tp-stat-value${s.smallValue ? " tp-stat-value--sm" : ""}`}>
              {s.value}
            </span>
            {s.trend && (
              <div className="tp-stat-trend">
                <div className="tp-stat-arrow" aria-hidden="true" />
                <span>{s.trend}</span>
              </div>
            )}
            {s.down && (
              <div className="tp-stat-trend tp-stat-trend--down">
                <div className="tp-stat-arrow-down" aria-hidden="true" />
                <span>{s.downTrend}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="tp-breakdown-card">
        {BREAKDOWN.map((b) => (
          <div key={b.label} className="tp-breakdown-row">
            <div className="tp-breakdown-top">
              <span className="tp-breakdown-label">{b.label}</span>
              <span className="tp-breakdown-pct">{b.pct}%</span>
            </div>
            <div className="tp-breakdown-bar-bg">
              <div className="tp-breakdown-bar-fill" style={{ width: `${b.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
