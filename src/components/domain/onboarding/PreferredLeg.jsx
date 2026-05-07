import "./PreferredLeg.css";
import legLeftIcon  from "../../../assets/images/leg-left.png";
import legRightIcon from "../../../assets/images/leg-right.png";
import legBothIcon  from "../../../assets/images/leg-both.png";
import ballImg      from "../../../assets/images/football-ball.png";

const OPTIONS = [
  { id: "left",  label: "Left",  icon: legLeftIcon,  pos: "left"  },
  { id: "right", label: "Right", icon: legRightIcon, pos: "right" },
  { id: "both",  label: "Both",  icon: legBothIcon,  pos: "both"  },
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
          <img src={ballImg} alt="" className="leg-ball-img" />
        </div>

        {/* Left / Right / Both buttons */}
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`leg-btn leg-btn--${opt.pos}${value === opt.id ? " leg-btn--selected" : ""}`}
            onClick={() => onChange(opt.id)}
            aria-pressed={value === opt.id}
          >
            <img src={opt.icon} alt="" className="leg-btn-icon" />
            <span className="leg-btn-label">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
