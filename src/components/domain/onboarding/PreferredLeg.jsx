import { ArrowLeft, ArrowRight, ArrowsLeftRight } from "@phosphor-icons/react";
import footballSvg from "../../../assets/icons/football.svg";
import "./PreferredLeg.css";

const OPTIONS = [
  { id: "left",  label: "Left",  icon: ArrowLeft,       pos: "left"  },
  { id: "right", label: "Right", icon: ArrowRight,      pos: "right" },
  { id: "both",  label: "Both",  icon: ArrowsLeftRight, pos: "both"  },
];

export default function PreferredLeg({ value, onChange }) {
  return (
    <div className="leg-step">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="leg-header">
        <h1 className="leg-title">Which is your stronger foot?</h1>
        <p className="leg-subtitle">
          This helps scouts understand your technical profile.
        </p>
      </div>

      {/* ── Visual: football + option buttons ─────────────────────── */}
      <div className="leg-visual">
        {/* Football circle */}
        <div className="leg-ball" aria-hidden="true">
          <img src={footballSvg} alt="" className="leg-ball-img" />
        </div>

        {/* Left / Right / Both buttons */}
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              type="button"
              className={`leg-btn leg-btn--${opt.pos}${value === opt.id ? " leg-btn--selected" : ""}`}
              onClick={() => onChange(opt.id)}
              aria-pressed={value === opt.id}
            >
              <Icon
                size={28}
                weight="bold"
                className="leg-btn-icon-ph"
                aria-hidden="true"
              />
              <span className="leg-btn-label">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
