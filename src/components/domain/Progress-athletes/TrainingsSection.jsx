import { useState } from "react";
import "./TrainingsSection.css";

const WEEK_DAYS = [
  { key: "m",  label: "M",  icon: "individual" },
  { key: "t",  label: "T",  icon: "team" },
  { key: "w",  label: "W",  icon: null },
  { key: "th", label: "TH", icon: null },
  { key: "f",  label: "F",  icon: "team" },
  { key: "sa", label: "SA", icon: "football" },
  { key: "s",  label: "S",  icon: "recovery" },
];

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

export default function TrainingsSection() {
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
