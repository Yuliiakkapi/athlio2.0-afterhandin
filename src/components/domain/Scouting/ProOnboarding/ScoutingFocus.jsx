import { useState } from "react";
import "./ScoutingFocus.css";

const POSITIONS = [
  { key: "gk",  label: "GK"  },
  { key: "cb",  label: "CB"  },
  { key: "lb",  label: "LB"  },
  { key: "rb",  label: "RB"  },
  { key: "cdm", label: "CDM" },
  { key: "cm",  label: "CM"  },
  { key: "cam", label: "CAM" },
  { key: "lw",  label: "LW"  },
  { key: "rw",  label: "RW"  },
  { key: "st",  label: "ST"  },
];

export default function ScoutingFocus({ onSelectionChange }) {
  const [selected, setSelected] = useState([]);

  function toggle(key) {
    const next = selected.includes(key)
      ? selected.filter((k) => k !== key)
      : [...selected, key];
    setSelected(next);
    onSelectionChange?.(next.length > 0);
  }

  return (
    <div className="sf-content">
      <div className="sf-header">
        <h1 className="sf-title">Scouting Focus</h1>
        <p className="sf-subtitle">Pick the positions you scout for</p>
      </div>

      <div className="sf-grid">
        {POSITIONS.map((pos) => (
          <button
            key={pos.key}
            type="button"
            className={`sf-pos-card${selected.includes(pos.key) ? " sf-pos-card--active" : ""}`}
            onClick={() => toggle(pos.key)}
          >
            {pos.label}
          </button>
        ))}
      </div>
    </div>
  );
}
