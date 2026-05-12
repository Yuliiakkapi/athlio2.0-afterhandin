import { useState } from "react";
import { CaretDown, CaretRight, Star } from "@phosphor-icons/react";
import { useUser } from "../context/UserContext";
import OvrBadge from "../components/ui/OvrBadge";
import "./Progress.css";

/* ── Mock data ─────────────────────────────────────────────────── */

const PERF_STATS = [
  { label: "Matches", value: 17, trend: "down", text: "2 less",  color: "#ff3d52" },
  { label: "Goals",   value: 12, trend: "up",   text: "3 more",  color: "#09de54" },
  { label: "Assists", value: 18, trend: "same", text: "same",    color: "#fe7611" },
];

const WEEK_DAYS = [
  { key: "m",  label: "M",  icon: "individual" },
  { key: "t",  label: "T",  icon: "team" },
  { key: "w",  label: "W",  icon: null },
  { key: "th", label: "TH", icon: null },
  { key: "f",  label: "F",  icon: "team" },
  { key: "sa", label: "SA", icon: "football" },
  { key: "s",  label: "S",  icon: "recovery" },
];

const VISITORS = [
  { id: 1, role: "Scout",  initials: "JK" },
  { id: 2, role: "Scout",  initials: "MS" },
  { id: 3, role: "Coach",  initials: "AR" },
  { id: 4, role: "Club",   initials: "FC" },
];

const TARGETS = [
  { id: 1, label: "20 goals this season",   value: 14, max: 20,  pct: 70, color: "#ff983d" },
  { id: 2, label: "100 Minutes of playing", value: 65, max: 100, pct: 65, color: "#6f92ff" },
];

const CHALLENGES = [
  { id: 1, title: "The Haaland Hunt", goal: "10 goals in a season",     difficulty: "HARD",   diffColor: "#ff3d52", tags: ["STRIKER"] },
  { id: 2, title: "The VVD Wall",     goal: "8 matches with zero goals", difficulty: "MEDIUM", diffColor: "#ff983d", tags: ["Defenders", "GK"] },
];

const LEADERBOARD = [
  { id: 1, name: "Kylian Mbappe",     club: "Real Madrid FC", a: 15, g: 18, ovr: 52 },
  { id: 2, name: "Samuel Soares",     club: "FC Benfica",      a: 15, g: 17, ovr: 53 },
  { id: 3, name: "Emil Jensen Bryld", club: "Hobro IK",        a: 18, g: 12, ovr: 55, isMe: true },
  { id: 4, name: "Kylian Mbappe",     club: "Real Madrid FC",  a: 17, g: 10, ovr: 55 },
  { id: 5, name: "Kylian Mbappe",     club: "Real Madrid FC",  a: 17, g: 9,  ovr: 56 },
];

const COMPARE_STATS = [
  { label: "GOALS",   mine: 14, theirs: 26 },
  { label: "ASSISTS", mine: 10, theirs: 14 },
  { label: "MATCHES", mine: 22, theirs: 42 },
];

const TARGET_TABS = ["Season", "Month", "Week"];

/* ── Small helpers ─────────────────────────────────────────────── */

function TrendArrow({ trend, text, color }) {
  return (
    <div className="prog-trend">
      {trend === "up" && (
        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" aria-hidden="true">
          <path d="M1 9.5L6 2.5L11 9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {trend === "down" && (
        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" aria-hidden="true">
          <path d="M1 2.5L6 9.5L11 2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {trend === "same" && (
        <svg width="11" height="2" viewBox="0 0 11 2" fill="none" aria-hidden="true">
          <line x1="0" y1="1" x2="11" y2="1" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      <span style={{ color }}>{text}</span>
    </div>
  );
}

function ProgressRing({ value, max, color }) {
  const r = 37;
  const circum = 2 * Math.PI * r;
  const filled = (value / max) * circum;
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" className="prog-ring-svg" aria-hidden="true">
      <circle cx="45" cy="45" r={r} fill="none" stroke="#e1e1e4" strokeWidth="5.5" />
      <circle
        cx="45" cy="45" r={r} fill="none"
        stroke={color} strokeWidth="5.5"
        strokeDasharray={`${filled} ${circum - filled}`}
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
      />
    </svg>
  );
}

/* ── Day icons ──────────────────────────────────────────────────── */

function IndividualIcon({ color = "#91909b" }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="8.5" r="4" stroke={color} strokeWidth="1.5" />
      <path d="M6 24c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TeamIcon({ color = "#91909b" }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="10" cy="8" r="3" stroke={color} strokeWidth="1.5" />
      <path d="M4 22c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="19" cy="8" r="3" stroke={color} strokeWidth="1.5" />
      <path d="M13 22c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FootballIconSvg({ color = "#91909b" }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="11" stroke={color} strokeWidth="1.5" />
      <path d="M14 7.5l2.5 3.5-2.5 3-2.5-3 2.5-3.5z" stroke={color} strokeWidth="1" />
      <path d="M7 14l2.5-3 3 2.5-2.5 3L7 14z" stroke={color} strokeWidth="1" />
      <path d="M21 14l-2.5-3-3 2.5 2.5 3L21 14z" stroke={color} strokeWidth="1" />
      <path d="M14 15.5l2.5 3-2.5 2.5-2.5-2.5 2.5-3z" stroke={color} strokeWidth="1" />
    </svg>
  );
}

function RecoveryIcon({ color = "#91909b" }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="3" y="13" width="22" height="3" rx="1.5" stroke={color} strokeWidth="1.5" />
      <path d="M7 13V10M21 13V10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 10h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DayIcon({ icon, active }) {
  const color = active ? "#4051fd" : "#91909b";
  if (icon === "individual") return <IndividualIcon color={color} />;
  if (icon === "team")       return <TeamIcon color={color} />;
  if (icon === "football")   return <FootballIconSvg color={color} />;
  if (icon === "recovery")   return <RecoveryIcon color={color} />;
  return null;
}

/* ── Section: Performance card ─────────────────────────────────── */

function PerformanceCard() {
  return (
    <div className="prog-perf-card">
      <div className="prog-perf-blob prog-perf-blob-1" aria-hidden="true" />
      <div className="prog-perf-blob prog-perf-blob-2" aria-hidden="true" />
      <div className="prog-perf-blob prog-perf-blob-3" aria-hidden="true" />

      <div className="prog-perf-inner">
        <div className="prog-perf-header">
          <div>
            <div className="prog-perf-season-row">
              <span className="prog-perf-season">Season 2025/26</span>
              <CaretDown size={20} color="white" />
            </div>
            <p className="prog-perf-subtitle">Your performance</p>
          </div>
          <div className="prog-pro-badge">PRO</div>
        </div>

        <div className="prog-stats-row">
          {PERF_STATS.map((s) => (
            <div key={s.label} className="prog-stat-box">
              <span className="prog-stat-label">{s.label}</span>
              <span className="prog-stat-value">{s.value}</span>
              <TrendArrow trend={s.trend} text={s.text} color={s.color} />
            </div>
          ))}
        </div>

        <button className="prog-analysis-btn">
          See performance analysis
          <CaretRight size={20} />
        </button>
      </div>
    </div>
  );
}

/* ── Section: Profile visibility ───────────────────────────────── */

function ProfileVisibilitySection() {
  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Profile visibility</h2>
          <p className="prog-section-subtitle">See who checked your profile this week</p>
        </div>
      </div>

      <div className="prog-visits-row">
        <div className="prog-visit-card">
          <span className="prog-visit-label">Profile visits</span>
          <span className="prog-visit-number">128</span>
          <div className="prog-visit-change">
            <svg width="12" height="12" viewBox="0 0 13 12" fill="none" aria-hidden="true">
              <path d="M1.5 9.5L6.5 3.5L11.5 9.5" stroke="#00ab3d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>24% this week</span>
          </div>
        </div>
        <div className="prog-visit-card">
          <span className="prog-visit-label">Unique visits</span>
          <span className="prog-visit-number">43</span>
          <span className="prog-visit-week">this week</span>
        </div>
      </div>

      <div className="prog-visitors-card">
        <p className="prog-visitors-title">Recent visitors</p>
        <div className="prog-visitors-row">
          {VISITORS.map((v) => (
            <div key={v.id} className="prog-visitor-item">
              <div className="prog-visitor-avatar">{v.initials}</div>
              <span className="prog-visitor-badge">{v.role}</span>
            </div>
          ))}
          <div className="prog-visitor-item">
            <div className="prog-visitor-more">+2</div>
            <span className="prog-visitor-badge prog-visitor-badge--spacer" aria-hidden="true">·</span>
          </div>
        </div>
        <button className="prog-analytics-btn">
          View full analytics
          <CaretRight size={20} />
        </button>
      </div>
    </section>
  );
}

/* ── Section: Trainings ─────────────────────────────────────────── */

function TrainingsSection() {
  const [activeDay, setActiveDay] = useState("sa");
  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Trainings</h2>
          <p className="prog-section-subtitle">Work on your goals and track them</p>
        </div>
        <button className="prog-see-all-btn">See all</button>
      </div>

      <div className="prog-day-picker">
        {WEEK_DAYS.map((d) => {
          const isActive = activeDay === d.key;
          return (
            <button
              key={d.key}
              className={`prog-day-btn${isActive ? " prog-day-btn--active" : ""}`}
              onClick={() => setActiveDay(d.key)}
            >
              {d.icon && <DayIcon icon={d.icon} active={isActive} />}
              <span className={`prog-day-label${isActive ? " prog-day-label--active" : ""}`}>{d.label}</span>
              <div className={`prog-day-dot${isActive ? " prog-day-dot--active" : d.icon ? " prog-day-dot--filled" : ""}`} />
            </button>
          );
        })}
      </div>

      <div className="prog-matchday-card">
        <div className="prog-matchday-overlay" aria-hidden="true" />
        <div className="prog-matchday-top">
          <span className="prog-matchday-badge">match day</span>
        </div>
        <div className="prog-matchday-bottom">
          <p className="prog-matchday-text">
            Give your best.{" "}
            <span className="prog-matchday-gradient">we will track the rest.</span>
          </p>
          <button className="prog-matchday-btn">Log your performance after game</button>
        </div>
      </div>
    </section>
  );
}

/* ── Section: Targets ───────────────────────────────────────────── */

function TargetsSection() {
  const [tab, setTab] = useState("Season");
  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Targets</h2>
          <p className="prog-section-subtitle">Work on your goals and track them</p>
        </div>
        <button className="prog-see-all-btn">See all</button>
      </div>

      <div className="prog-tabs">
        {TARGET_TABS.map((t) => (
          <button
            key={t}
            className={`prog-tab${tab === t ? " prog-tab--active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="prog-targets-row">
        {TARGETS.map((target) => (
          <div key={target.id} className="prog-target-card">
            <div className="prog-ring-wrap">
              <ProgressRing value={target.value} max={target.max} color={target.color} />
              <div className="prog-ring-center">
                <span className="prog-ring-value">{target.value}</span>
                <span className="prog-ring-max">/{target.max}</span>
              </div>
            </div>
            <p className="prog-target-label">{target.label}</p>
            <div className="prog-target-progress">
              <div className="prog-target-track">
                <div className="prog-target-fill" style={{ width: `${target.pct}%`, background: target.color }} />
              </div>
              <div className="prog-target-meta">
                <span className="prog-target-status">ongoing</span>
                <span className="prog-target-pct" style={{ color: target.color }}>{target.pct}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="prog-ai-tip">
        <div className="prog-ai-tip-icon">
          <Star size={24} weight="fill" color="#151622" />
        </div>
        <div className="prog-ai-tip-body">
          <p className="prog-ai-tip-title">Log 14 matches this season without gaps</p>
          <p className="prog-ai-tip-desc">
            Players with fully logged seasons get 40% more profile views on average.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Section: Challenges ────────────────────────────────────────── */

function ChallengesSection() {
  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Challenges</h2>
          <p className="prog-section-subtitle">Test yourself with football stars</p>
        </div>
        <button className="prog-see-all-btn">See all</button>
      </div>
      <div className="prog-challenges-scroll">
        {CHALLENGES.map((c) => (
          <div key={c.id} className={`prog-challenge-card prog-challenge-card--${c.id}`}>
            <div className="prog-challenge-overlay" aria-hidden="true" />
            <div className="prog-challenge-top">
              <span className="prog-challenge-diff" style={{ background: c.diffColor }}>{c.difficulty}</span>
              {c.tags.map((tag) => (
                <span key={tag} className="prog-challenge-tag">{tag}</span>
              ))}
            </div>
            <div className="prog-challenge-bottom">
              <div>
                <p className="prog-challenge-title">{c.title}</p>
                <p className="prog-challenge-goal">{c.goal}</p>
              </div>
              <button className="prog-challenge-join">Join</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Section: Leaderboard ───────────────────────────────────────── */

function LeaderboardSection() {
  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Leaderboard</h2>
          <p className="prog-section-subtitle">Ranking your position and age</p>
        </div>
        <button className="prog-filter-btn">
          All world
          <CaretDown size={16} />
        </button>
      </div>
      <div className="prog-lb-card">
        <div className="prog-lb-thead">
          <span className="prog-lb-col-player">player</span>
          <div className="prog-lb-col-stats">
            <span>A</span>
            <span>G</span>
            <span className="prog-lb-col-rating">rating</span>
          </div>
        </div>
        {LEADERBOARD.map((row, i) => (
          <div
            key={row.id}
            className={[
              "prog-lb-row",
              row.isMe && "prog-lb-row--me",
              i === LEADERBOARD.length - 1 && "prog-lb-row--last",
            ].filter(Boolean).join(" ")}
          >
            <div className="prog-lb-player">
              <div className={`prog-lb-avatar${row.isMe ? " prog-lb-avatar--me" : ""}`}>
                {row.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
              </div>
              <div>
                <p className="prog-lb-name">{row.name}</p>
                <p className="prog-lb-club">{row.club}</p>
              </div>
            </div>
            <div className="prog-lb-stats">
              <span className={`prog-lb-stat${row.isMe ? " prog-lb-stat--me" : ""}`}>{row.a}</span>
              <span className={`prog-lb-stat${row.isMe ? " prog-lb-stat--me" : ""}`}>{row.g}</span>
              <div className="prog-lb-rating">
                <OvrBadge value={row.ovr} size={row.isMe ? "md" : "sm"} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Section: Compare ───────────────────────────────────────────── */

function CompareSection() {
  const { profile } = useUser();
  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Compare</h2>
          <p className="prog-section-subtitle">Ranking your position and age</p>
        </div>
      </div>
      <div className="prog-compare-card">
        <div className="prog-compare-players">
          <div className="prog-compare-player">
            <div className="prog-compare-avatar">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="" className="prog-compare-avatar-img" />
                : <span>{(profile?.full_name || profile?.username || "Y").charAt(0).toUpperCase()}</span>
              }
            </div>
            <span className="prog-compare-name">YOU</span>
            <div className="prog-compare-rating-badge">65%</div>
          </div>
          <span className="prog-compare-vs">VS</span>
          <div className="prog-compare-player">
            <div className="prog-compare-avatar prog-compare-avatar--other" />
            <span className="prog-compare-name">DEMBELE</span>
          </div>
        </div>

        <div className="prog-compare-stats">
          {COMPARE_STATS.map((s) => {
            const total = s.mine + s.theirs;
            const minePct = (s.mine / total) * 100;
            return (
              <div key={s.label} className="prog-compare-row">
                <span className="prog-compare-mine">{s.mine}</span>
                <div className="prog-compare-center">
                  <span className="prog-compare-label">{s.label}</span>
                  <div className="prog-compare-bars">
                    <div className="prog-compare-bar-mine"  style={{ width: `${minePct}%` }} />
                    <div className="prog-compare-bar-other" style={{ width: `${100 - minePct}%` }} />
                  </div>
                </div>
                <span className="prog-compare-theirs">{s.theirs}</span>
              </div>
            );
          })}
        </div>

        <button className="prog-compare-cta">
          Compare to other players
          <CaretRight size={20} />
        </button>
      </div>
    </section>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */

export default function Progress() {
  return (
    <div className="progress-page">
      <div className="progress-sections">
        <PerformanceCard />
        <ProfileVisibilitySection />
        <TrainingsSection />
        <TargetsSection />
        <ChallengesSection />
        <LeaderboardSection />
        <CompareSection />
      </div>
    </div>
  );
}
