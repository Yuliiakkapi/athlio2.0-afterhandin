import { useState } from "react";
import { Info } from "@phosphor-icons/react";
import "./PlayerProfile.css";

const SKILLS = [
  { key: "dribbling",    label: "Dribbling"    },
  { key: "passing",      label: "Passing"      },
  { key: "shot_power",   label: "Shot Power"   },
  { key: "ball_control", label: "Ball Control" },
  { key: "tackling",     label: "Tackling"     },
  { key: "anticipation", label: "Anticipation" },
];

function SkillCard({ label, value, onChange }) {
  return (
    <div className="pp-skill-card">
      <button className="pp-skill-help" aria-label={`What is ${label}?`}>?</button>
      <span className="pp-skill-name">{label}</span>
      <div className="pp-stepper">
        <button
          className="pp-stepper-btn"
          onClick={() => onChange(Math.max(1, value - 1))}
          type="button"
          aria-label="Decrease"
        >
          −
        </button>
        <span className="pp-stepper-value">{value}</span>
        <button
          className="pp-stepper-btn"
          onClick={() => onChange(Math.min(10, value + 1))}
          type="button"
          aria-label="Increase"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function PlayerProfile() {
  const [skills, setSkills] = useState(
    Object.fromEntries(SKILLS.map((s) => [s.key, 5]))
  );

  function update(key, val) {
    setSkills((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <div className="pp-content">
      <h1 className="pp-title">Profile of Player</h1>
      <p className="pp-subtitle">Rate your football abilities honestly</p>

      <div className="pp-info-row">
        <Info size={16} color="var(--primary-default, #4051fd)" weight="fill" />
        <span className="pp-info-text">This helps personalize your training suggestions</span>
      </div>

      <div className="pp-grid">
        {SKILLS.map((s) => (
          <SkillCard
            key={s.key}
            label={s.label}
            value={skills[s.key]}
            onChange={(v) => update(s.key, v)}
          />
        ))}
      </div>
    </div>
  );
}
