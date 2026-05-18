import { useState } from "react";
import { UsersThree, SneakerMove } from "@phosphor-icons/react";
import TrainingDayCard from "../../../../components/UI/TrainingDayCard";
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

function DayPicker({ selected, onChange, icon }) {
  function toggle(key) {
    onChange(
      selected.includes(key)
        ? selected.filter((k) => k !== key)
        : [...selected, key]
    );
  }
  return (
    <div className="ts-day-row">
      {DAYS.map((d) => (
        <TrainingDayCard
          key={d.key}
          day={d.label}
          active={selected.includes(d.key)}
          onClick={() => toggle(d.key)}
          icon={icon}
        />
      ))}
    </div>
  );
}

export default function TrainingSchedule({ onSelectionChange }) {
  const [team, setTeam] = useState([]);
  const [individual, setIndividual] = useState([]);

  function handleTeam(days) {
    setTeam(days);
    onSelectionChange?.(days.length > 0 || individual.length > 0);
  }

  function handleIndividual(days) {
    setIndividual(days);
    onSelectionChange?.(team.length > 0 || days.length > 0);
  }

  return (
    <div className="ts-content">
      <div className="ts-header">
        <h1 className="ts-title">Training Schedule</h1>
        <p className="ts-subtitle">Pick the days you have trainings</p>
      </div>

      <div className="ts-section">
        <p className="ts-section-label">Team trainings</p>
        <DayPicker selected={team} onChange={handleTeam} icon={UsersThree} />
      </div>

      <div className="ts-section">
        <p className="ts-section-label">Individual trainings</p>
        <DayPicker selected={individual} onChange={handleIndividual} icon={SneakerMove} />
      </div>
    </div>
  );
}
