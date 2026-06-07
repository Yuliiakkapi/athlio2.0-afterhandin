import { useState } from "react";
import NavigationTabs from "../../UI/NavTabs";
import "./Performance.css";

const CHART_TABS = ["Goals", "Assists", "Matches"];

const CHART_DATA = {
  Goals:   { seasons: ["2023/24","2024/25","2025/26","2026/27"], values: [6,4,12,17],  yMax: 20, predicted: 2 },
  Assists: { seasons: ["2023/24","2024/25","2025/26","2026/27"], values: [8,11,15,21], yMax: 25, predicted: 2 },
  Matches: { seasons: ["2023/24","2024/25","2025/26","2026/27"], values: [22,19,24,30], yMax: 35, predicted: 2 },
};

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
  const areaTopPts = values.slice(splitAt - 1).map((v, i) => `${xOf(splitAt - 1 + i)},${yOf(v)}`).join(" ");
  const areaPath = `${xOf(splitAt - 1)},${PAD.top + cH} ${areaTopPts} ${xOf(n - 1)},${PAD.top + cH}`;
  const yTicks = [0, Math.round(yMax / 4), Math.round(yMax / 2), Math.round(3 * yMax / 4), yMax];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", overflow: "visible" }}>
      <polygon points={areaPath} fill="rgba(64,81,253,0.08)" />
      {yTicks.map((v) => (
        <text key={v} x={PAD.left - 4} y={yOf(v) + 3.5} textAnchor="end"
          fontSize="9" fill="var(--muted)" fontFamily="Barlow, sans-serif">{v}</text>
      ))}
      <polyline points={histPts} fill="none" stroke="var(--primary-default)" strokeWidth="2" strokeLinejoin="round" />
      <polyline points={predPts} fill="none" stroke="var(--primary-default)" strokeWidth="2"
        strokeDasharray="5 3" strokeLinejoin="round" />
      {values.map((v, i) => (
        <circle key={i} cx={xOf(i)} cy={yOf(v)} r={4}
          fill={i < splitAt ? "var(--primary-default)" : "var(--neutral-50-bg)"}
          stroke="var(--primary-default)" strokeWidth="2" />
      ))}
      {values.map((v, i) => (
        <text key={i} x={xOf(i)} y={yOf(v) - 8} textAnchor="middle"
          fontSize="10.5" fill="var(--black)" fontWeight="600" fontFamily="Barlow, sans-serif">{v}</text>
      ))}
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

export default function PerformanceChartCard() {
  const [tab, setTab] = useState("Goals");
  return (
    <div className="perf-chart-card">
      <NavigationTabs variant="segment" tabs={CHART_TABS} activeTab={tab} onTabChange={setTab} />
      <div className="perf-chart-wrap">
        <LineChart tab={tab} />
      </div>
    </div>
  );
}
