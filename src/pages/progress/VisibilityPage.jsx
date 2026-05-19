import { useNavigate } from "react-router-dom";
import { CaretRight, IdentificationCard, VideoCamera, CheckCircle, CalendarStar } from "@phosphor-icons/react";
import Badge from "../../components/UI/Badge";
import Button from "../../components/UI/Button";
import scout1   from "../../assets/images/scout1.jpg";
import scout2   from "../../assets/images/scout2.png";
import coach1   from "../../assets/images/coach1.png";
import club1    from "../../assets/images/club1.png";
import profScout from "../../assets/images/prof-scout.png";
import profCoach from "../../assets/images/prof-coach.png";
import "./VisibilityPage.css";

const STATS = [
  { label: "PROFILE VISITS",  value: 128, trend: "24% this week" },
  { label: "UNIQUE VISITS",   value: 43,  trend: null,           sub: "this week" },
  { label: "NEW FOLLOWERS",   value: 12,  trend: "20% vs last week" },
];

const VISITORS = [
  { id: 1, name: "Martin Larsen",  role: "Scout", org: "AAB",          time: "2h ago",  image: scout1   },
  { id: 2, name: "Jakob Ahlmann",  role: "Scout", org: "FC København",  time: "1d ago",  image: scout2   },
  { id: 3, name: "José Mourinho",  role: "Coach", org: "Benfica",       time: "3d ago",  image: coach1   },
  { id: 4, name: "Midtjylland",    role: "Club",  org: null,            time: "3d ago",  image: club1    },
  { id: 5, name: "Jakob Poulsen",  role: "Coach", org: "AGF",           time: "7d ago",  image: profCoach },
  { id: 6, name: "VRI",            role: "Club",  org: null,            time: "5d ago",  image: profScout },
];

const DONUT_SEGMENTS = [
  { pct: 0.50, color: "var(--primary-default)", label: "Scouts",  value: "50%" },
  { pct: 0.23, color: "var(--negative-default)", label: "Coaches", value: "23%" },
  { pct: 0.17, color: "var(--warning-default)",  label: "Clubs",   value: "17%" },
  { pct: 0.10, color: "var(--success-default)",  label: "Agents",  value: "10%" },
];

const SUGGESTIONS = [
  { Icon: IdentificationCard, label: "Verify your profile",   sub: "Verified players get up to 50% more views" },
  { Icon: VideoCamera,        label: "Add match videos",      sub: "Profiles with videos get 3x more views"    },
  { Icon: CheckCircle,        label: "Complete your profile", sub: "100% completed profiles get more attention" },
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

export default function VisibilityPage() {
  const navigate = useNavigate();

  return (
    <div className="vis-page">

      {/* Verify banner */}
      <div className="vis-verify-banner">
        <div className="vis-verify-text">
          <p className="vis-verify-title">Verify your identity with ID</p>
          <p className="vis-verify-sub">
            Verified players get up to{" "}
            <span className="vis-verify-highlight">50% more</span> profile views
          </p>
        </div>
        <Button type="primary" size="small" label="Verify" />
      </div>

      {/* 3 stat cards */}
      <div className="vis-stats">
        {STATS.map((s) => (
          <div key={s.label} className="vis-stat-card">
            <span className="vis-stat-label">{s.label}</span>
            <span className="vis-stat-value">{s.value}</span>
            {s.sub && <span className="vis-stat-sub">{s.sub}</span>}
            {s.trend && (
              <div className="vis-stat-trend">
                <div className="vis-stat-arrow" aria-hidden="true" />
                <span>{s.trend}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent visitors */}
      <section className="vis-section">
        <h2 className="vis-section-title">Recent visitors</h2>
        <div className="vis-visitors-card">
          {VISITORS.map((v, idx) => (
            <div key={v.id} className={`vis-visitor-row${idx < VISITORS.length - 1 ? " vis-visitor-row--border" : ""}`}>
              <img src={v.image} alt={v.name} className="vis-visitor-avatar" />
              <div className="vis-visitor-info">
                <div className="vis-visitor-name-row">
                  <span className="vis-visitor-name">{v.name}</span>
                  <Badge text={v.role} color="light" size="xs" />
                </div>
                {v.org && <span className="vis-visitor-org">{v.org}</span>}
              </div>
              <span className="vis-visitor-time">{v.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics */}
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

      {/* Suggestions */}
      <section className="vis-section">
        <h2 className="vis-section-title">Suggestions</h2>
        <div className="vis-suggestions-card">
          {SUGGESTIONS.map(({ Icon, label, sub }, idx) => (
            <button key={label} className={`vis-suggestion-row${idx < SUGGESTIONS.length - 1 ? " vis-suggestion-row--border" : ""}`}>
              <div className="vis-suggestion-icon">
                <Icon size={20} weight="regular" color="var(--primary-default)" />
              </div>
              <div className="vis-suggestion-info">
                <p className="vis-suggestion-label">{label}</p>
                <p className="vis-suggestion-sub">{sub}</p>
              </div>
              <CaretRight size={18} color="var(--muted)" />
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
