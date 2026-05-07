import "./PositionSelect.css";
import PitchBg from "../../../assets/images/position-bg.png";

/* ──────────────────────────────────────────────────────────────────
   Jersey icon — inline SVG, `color` prop controls fill via
   `fill="currentColor"` so CSS can tint selected vs unselected
────────────────────────────────────────────────────────────────── */
function JerseyIcon() {
  return (
    <svg
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pos-btn-jersey"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.21 2.739 18.358.094A.75.75 0 0 0 17.999 0h-3a.75.75 0 0 0-.75.75c0 .597-.237 1.169-.659 1.591A2.25 2.25 0 0 1 12 3a2.25 2.25 0 0 1-2.25-2.25.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.361.094L.787 2.739a1.5 1.5 0 0 0-.617 2.003l1.806 3.451A1.5 1.5 0 0 0 3.343 9H5.25v7.5A1.5 1.5 0 0 0 6.75 18h10.5a1.5 1.5 0 0 0 1.5-1.5V9h1.906a1.5 1.5 0 0 0 1.367-.807l1.806-3.451a1.5 1.5 0 0 0-.617-2.003Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Football positions: left = horizontal centre %, top = % of
   viewport height. Derived from Figma node 7242:45691 (393×852).
────────────────────────────────────────────────────────────────── */
const FOOTBALL_POSITIONS = [
  { id: "st",  label: "ST",  left: 50.0, top: 25.7 },
  { id: "lw",  label: "LW",  left: 29.5, top: 31.3 },
  { id: "rw",  label: "RW",  left: 70.2, top: 31.3 },
  { id: "cam", label: "CAM", left: 49.6, top: 37.0 },
  { id: "lm",  label: "LM",  left: 23.4, top: 47.1 },
  { id: "cm",  label: "CM",  left: 50.0, top: 46.7 },
  { id: "rm",  label: "RM",  left: 76.3, top: 46.7 },
  { id: "cdm", label: "CDM", left: 50.0, top: 57.4 },
  { id: "lb",  label: "LB",  left: 26.5, top: 64.8 },
  { id: "cb",  label: "CB",  left: 50.0, top: 68.2 },
  { id: "rb",  label: "RB",  left: 73.3, top: 64.8 },
  { id: "gk",  label: "GK",  left: 50.0, top: 78.4 },
];

export default function PositionSelect({ value = [], onChange }) {
  function toggle(id) {
    const current = Array.isArray(value) ? value.slice() : [];
    const idx = current.indexOf(id);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(id);
    onChange(current);
  }

  return (
    <div className="pos-step">
      {/* ── Fixed full-viewport background (no layout impact) ───── */}
      <div className="pos-bg" aria-hidden="true">
        <img src={PitchBg} alt="" className="pos-bg-img" />
        <div className="pos-gradient" />
      </div>

      {/* ── Header — same flow & position as every other step ────── */}
      <div className="pos-header">
        <h1 className="pos-title">Select your position</h1>
        <p className="pos-subtitle">You can choose multiple</p>
      </div>

      {/* ── Position buttons — fixed overlay, viewport coordinates ─ */}
      <div className="pos-buttons" aria-label="Football positions" role="group">
        {FOOTBALL_POSITIONS.map((p) => {
          const selected = Array.isArray(value) && value.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              className={`pos-btn${selected ? " pos-btn--selected" : ""}`}
              style={{ left: `${p.left}%`, top: `${p.top}%` }}
              onClick={() => toggle(p.id)}
              aria-pressed={selected}
              aria-label={p.label}
            >
              <span className="pos-btn-label">{p.label}</span>
              <div className="pos-btn-circle">
                <JerseyIcon />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
