import { CaretDown } from "@phosphor-icons/react";
import "./SeasonOverviewCard.css";

const DEFAULT_STATS = [
  {
    label: "Min. Per Game",
    value: "60.5",
    trend: { pct: "6%" },
    details: [
      { label: "Total matches", value: "70" },
      { label: "Started matches", value: "67" },
      { label: "Minutes total", value: "1,098" },
    ],
    cards: { red: 2, yellow: 3 },
  },
  {
    label: "Goals Per Game",
    value: "0.5",
    trend: { pct: "6%" },
    details: [
      { label: "Goals total", value: "70" },
      { label: "Goals per minute", value: "0.067" },
    ],
  },
  {
    label: "Assist Per Game",
    value: "1.5",
    trend: { pct: "6%" },
    details: [
      { label: "Assist totals", value: "70" },
      { label: "Assists per minute", value: "0.07" },
    ],
  },
];

export default function SeasonOverviewCard({ season = "2025/26", stats = DEFAULT_STATS }) {
  return (
    <div className="season-overview-card">
      <div className="season-header">
        <div className="season-title-row">
          <h2 className="season-title">Season {season}</h2>
          <CaretDown size={20} weight="bold" className="season-title-chevron" />
        </div>
        <div className="season-trend-badge">
          <span className="season-trend-arrow" aria-hidden="true" />
          <span className="season-trend-label">vs. last season</span>
        </div>
      </div>

      <div className="season-stats">
        {stats.map((stat) => (
          <div key={stat.label} className="season-stat-row">
            <div className="season-stat-left">
              <p className="season-stat-label">{stat.label}</p>
              <div className="season-stat-value-row">
                <span className="season-stat-value">{stat.value}</span>
                {stat.trend && (
                  <div className="season-stat-pct-badge">
                    <span className="season-stat-arrow" aria-hidden="true" />
                    <span className="season-stat-pct">{stat.trend.pct}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="season-stat-right">
              {stat.details.map((d) => (
                <div key={d.label} className="season-stat-detail">
                  <span className="season-stat-detail-label">{d.label}</span>
                  <span className="season-stat-detail-value">{d.value}</span>
                </div>
              ))}
              {stat.cards && (
                <div className="season-stat-detail">
                  <span className="season-stat-detail-label">Cards</span>
                  <div className="season-cards-row">
                    <div className="season-card-badge season-card-badge--red">
                      <span className="season-card-num">{stat.cards.red}</span>
                    </div>
                    <div className="season-card-badge season-card-badge--yellow">
                      <span className="season-card-num">{stat.cards.yellow}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
