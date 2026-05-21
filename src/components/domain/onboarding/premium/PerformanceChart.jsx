import { useState } from "react";
import "./PerformanceChart.css";

const CHART_DATA = {
  goals: [6, 4, 12, 15, 17],
  assists: [3, 5, 8, 10, 14],
  matches: [10, 12, 15, 18, 20],
};

const YEARS = ["2023/24", "2024/25", "2025/26", "2026/27"];
const YEARS_WITH_PREDICTION = [...YEARS, "2027/28"];

export default function PerformanceChart() {
  const [activeTab, setActiveTab] = useState("goals");

  const data = CHART_DATA[activeTab];
  const maxValue = 20;
  const chartHeight = 150;

  const points = data.map((value, idx) => {
    const x = (idx / (data.length - 1)) * 310;
    const y = chartHeight - (value / maxValue) * chartHeight;
    return { x, y, value };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <div className="perf-chart-card">
      <div className="perf-chart-header">
        <button
          className={`perf-chart-tab ${activeTab === "goals" ? "active" : ""}`}
          onClick={() => setActiveTab("goals")}
        >
          ⚽ Goals
        </button>
        <button
          className={`perf-chart-tab ${activeTab === "assists" ? "active" : ""}`}
          onClick={() => setActiveTab("assists")}
        >
          🎯 Assists
        </button>
        <button
          className={`perf-chart-tab ${activeTab === "matches" ? "active" : ""}`}
          onClick={() => setActiveTab("matches")}
        >
          📊 Matches
        </button>
      </div>

      <div className="perf-chart-container">
        <div className="perf-y-axis">
          <div className="perf-y-label">20</div>
          <div className="perf-y-label">15</div>
          <div className="perf-y-label">10</div>
          <div className="perf-y-label">5</div>
          <div className="perf-y-label">0</div>
        </div>

        <div className="perf-chart-plot">
          <svg width="320" height={chartHeight} className="perf-chart-svg">
            <path d={pathD} className="perf-chart-line" />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="4" className="perf-data-point" />
            ))}
          </svg>
          <div className="perf-values">
            {data.map((v, i) => (
              <span key={i} className="perf-value-label">
                {v}
              </span>
            ))}
          </div>
        </div>

        <div className="perf-x-axis">
          {YEARS_WITH_PREDICTION.map((year, i) => (
            <div key={year} className="perf-x-label">
              {year}
              {i >= data.length && <span className="perf-predicted">predicted</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
