import { useState } from "react";
import "./TrainingSchedule.css";

const DAYS = [
  { key: "m",  label: "M"  },
  { key: "t",  label: "T"  },
  { key: "w",  label: "W"  },
  { key: "th", label: "TH" },
  { key: "f",  label: "F"  },
  { key: "sa", label: "SA" },
  { key: "s",  label: "S"  },
];

function DayPicker({ selected, onChange }) {
  function toggle(key) {
    onChange(
      selected.includes(key)
        ? selected.filter((k) => k !== key)
        : [...selected, key]
    );
  }
  return (
    <div className="ts-day-row">
      {DAYS.map((d) => {
        const active = selected.includes(d.key);
        return (
          <button
            key={d.key}
            className={`ts-day-btn${active ? " ts-day-btn--active" : ""}`}
            onClick={() => toggle(d.key)}
            type="button"
          >
            <span className={`ts-day-label${active ? " ts-day-label--active" : ""}`}>{d.label}</span>
            <div className={`ts-day-dot${active ? " ts-day-dot--active" : ""}`} />
          </button>
        );
      })}
    </div>
  );
}

export default function TrainingSchedule() {
  const [team, setTeam] = useState([]);
  const [individual, setIndividual] = useState([]);

  return (
    <div className="ts-content">
      <h1 className="ts-title">Training Schedule</h1>
      <p className="ts-subtitle">Pick the days you have trainings</p>

      <div className="ts-section">
        <p className="ts-section-label">Team trainings</p>
        <DayPicker selected={team} onChange={setTeam} />
      </div>

      <div className="ts-section">
        <p className="ts-section-label">Individual trainings</p>
        <DayPicker selected={individual} onChange={setIndividual} />
      </div>
    </div>
  );
}
