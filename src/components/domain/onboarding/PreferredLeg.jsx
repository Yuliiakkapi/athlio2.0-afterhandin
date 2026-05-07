import { ArrowCircleUpLeft, ArrowCircleUpRight, Infinity as InfinityIcon } from "@phosphor-icons/react";
import footballBall from "../../../assets/images/football-ball.png";
import "./PreferredLeg.css";

const OPTIONS = [
  { id: "left",  label: "Left",  icon: ArrowCircleUpLeft,  pos: "left"  },
  { id: "right", label: "Right", icon: ArrowCircleUpRight, pos: "right" },
  { id: "both",  label: "Both",  icon: InfinityIcon,       pos: "both"  },
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
        <div className="leg-group">
          {/* Football circle */}
          <div className="leg-ball" aria-hidden="true">
            <img src={footballBall} alt="" className="leg-ball-img" />
          </div>

          {/* Left / Right / Both buttons */}
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const selected = value === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                className={`leg-btn leg-btn--${opt.pos}${selected ? " leg-btn--selected" : ""}`}
                onClick={() => onChange(opt.id)}
                aria-pressed={selected}
              >
                <Icon
                  size={32}
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
    </div>
  );
}
