import { useNavigate } from "react-router-dom";
import { CalendarStar } from "@phosphor-icons/react";
import PerformanceChart from "./premium/PerformanceChart";
import Button from "../../UI/Button";
import "./Premium.css";
import "../../../pages/progress/VisibilityPage.css";

const DONUT_SEGMENTS = [
  { pct: 0.50, color: "var(--primary-default)", label: "Scouts",  value: "50%" },
  { pct: 0.23, color: "var(--negative-default)", label: "Coaches", value: "23%" },
  { pct: 0.17, color: "var(--warning-default)",  label: "Clubs",   value: "17%" },
  { pct: 0.10, color: "var(--success-default)",  label: "Agents",  value: "10%" },
];

function DonutChart() {
  const cx = 55, cy = 55, r = 40, sw = 12;
  const C = 2 * Math.PI * r;
  let acc = 0;

  return (
    <svg viewBox="0 0 110 110" style={{ width: 110, height: 110, flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--neutral-100)" strokeWidth={sw} />
      {DONUT_SEGMENTS.map((seg, i) => {
        const len = seg.pct * C;
        const offset = -(acc * C);
        acc += seg.pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={sw}
            strokeDasharray={`${len} ${C - len}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="7.5" fill="var(--muted)"
        fontFamily="Barlow, sans-serif" fontWeight="600" letterSpacing="0.04em">VISITORS</text>
      <text x={cx} y={cy + 13} textAnchor="middle" fontSize="22" fill="var(--black)"
        fontFamily="Barlow Condensed, sans-serif" fontWeight="700" fontStyle="italic">43</text>
    </svg>
  );
}

export default function PremiumProfessional({ onFinish }) {
  const navigate = useNavigate();

  async function goToScouting() {
    await onFinish?.();
    navigate("/scouting");
  }

  return (
    <div className="premium-root">
      <div className="premium-container">
        {/* Header */}
        <div className="premium-header">
          <h1 className="premium-main-title">Scouting</h1>
        </div>

        {/* Main content */}
        <div className="premium-content">
          <PerformanceChart />

          <div className="vis-analytics">
            <div className="vis-donut-card">
              <DonutChart />
              <div className="vis-donut-legend">
                {DONUT_SEGMENTS.map((seg) => (
                  <div key={seg.label} className="vis-legend-row">
                    <div className="vis-legend-dot" style={{ background: seg.color }} />
                    <span className="vis-legend-label">{seg.label}</span>
                    <span className="vis-legend-pct">{seg.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="vis-active-day-card">
              <p className="vis-active-day-title">Most active day</p>
              <div className="vis-active-day-icon">
                <CalendarStar size={32} weight="regular" color="var(--primary-default)" />
              </div>
              <p className="vis-active-day-name">FRIDAY</p>
              <p className="vis-active-day-visits">85 visits last month</p>
              <p className="vis-active-day-desc">You get the most visits on this day.</p>
            </div>
          </div>
        </div>

        {/* CTA card */}
        <div className="premium-paywall">
          <div className="premium-paywall-badge">PRO</div>
          <h2 className="premium-paywall-title">Explore scouting features</h2>
          <p className="premium-paywall-subtitle">
            Search players, build your watchlist, and discover talent with advanced scouting tools.
          </p>
          <Button
            size="medium"
            type="primary"
            label="Go to scouting"
            fullWidth
            onClick={goToScouting}
          />
        </div>
      </div>
    </div>
  );
}
