import { useNavigate } from "react-router-dom";
import { CaretDown, CaretRight, LockOpen } from "@phosphor-icons/react";
import Button from "../../UI/Button";
import Badge from "../../UI/Badge";
import lightblueStripes from "../../../assets/images/lightblue-stripes.png";
import polygonUp from "../../../assets/icons/polygon-up.svg";
import polygonDown from "../../../assets/icons/polygon-down.svg";
import "./PerformanceCard.css";

const PERF_STATS = [
  {
    label: "Matches",
    value: 17,
    trend: "down",
    text: "2 less",
    color: "#ff3d52",
  },
  { label: "Goals", value: 12, trend: "up", text: "3 more", color: "#09de54" },
  {
    label: "Assists",
    value: 18,
    trend: "same",
    text: "same",
    color: "#fe7611",
  },
];

function TrendArrow({ trend, text, color }) {
  return (
    <div className="prog-trend">
      {trend === "up" && (
        <img src={polygonUp} width="12" height="11" alt="" aria-hidden="true" />
      )}
      {trend === "down" && (
        <img
          src={polygonDown}
          width="12"
          height="11"
          alt=""
          aria-hidden="true"
        />
      )}
      {trend === "same" && (
        <svg
          width="11"
          height="2"
          viewBox="0 0 11 2"
          fill="none"
          aria-hidden="true"
        >
          <line
            x1="0"
            y1="1"
            x2="11"
            y2="1"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
      <span style={{ color }}>{text}</span>
    </div>
  );
}

export default function PerformanceCard({ isPro = false }) {
  const navigate = useNavigate();

  return (
    <div
      className="prog-perf-card"
      style={{ backgroundImage: `url(${lightblueStripes})` }}
    >
      {isPro && (
        <div className="prog-perf-badge-slot">
          <Badge text="PRO" color="pro-athlete" size="sm" />
        </div>
      )}
      <div className="prog-perf-inner">
        <div className="prog-perf-header">
          <div className="prog-perf-season-row">
            <span className="prog-perf-season">Season 2025/26</span>
            <CaretDown size={20} color="white" />
          </div>
          <p className="prog-perf-subtitle">Your performance</p>
        </div>

        <div className="prog-stats-row">
          {PERF_STATS.map((s) => (
            <div key={s.label} className="prog-stat-box">
              <span className="prog-stat-label">{s.label}</span>
              <span className="prog-stat-value">{s.value}</span>
              {isPro && (
                <TrendArrow trend={s.trend} text={s.text} color={s.color} />
              )}
            </div>
          ))}
        </div>

        {isPro ? (
          <Button
            size="small"
            type="white"
            fullWidth
            label="See performance analysis"
            trailingIcon={CaretRight}
            onClick={() => navigate("/progress/performance")}
          />
        ) : (
          <Button
            size="small"
            type="white"
            fullWidth
            label="Unlock performance analysis"
            leadingIcon={LockOpen}
            onClick={() => navigate("/upgrade-pro")}
          />
        )}
      </div>
    </div>
  );
}
