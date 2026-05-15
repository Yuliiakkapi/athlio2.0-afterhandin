import { useEffect, useState } from "react";
import "./GoalsField.css";

const ATHLETE_GOALS = [
  "Get discovered by scouts and clubs",
  "Find a new club or trial opportunity",
  "Move to a higher level of football",
  "Track my progress",
  "Build my football profile",
  "Showcase my highlights",
];

export default function GoalsField({ value, onChange, items, title, subtitle }) {
  // value may be a comma-separated string (old behavior) or an array
  const parseValue = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
    return [];
  };

  const [selected, setSelected] = useState(parseValue(value));

  useEffect(() => {
    setSelected(parseValue(value));
  }, [value]);

  const toggle = (goal) => {
    const exists = selected.includes(goal);
    const next = exists ? selected.filter((g) => g !== goal) : [...selected, goal];
    setSelected(next);
    if (typeof onChange === "function") onChange(next.join(","));
  };

  const goals = Array.isArray(items) && items.length > 0 ? items : ATHLETE_GOALS;

  return (
    <div className="goals-field-root">
      <div
        className="role-header"
        style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}
      >
        <h1 className="role-header-title">{title || "Your Goals"}</h1>
        <p className="role-header-subtitle">
          {subtitle || "What are you looking to achieve? This will help personalized your experience."}
        </p>
      </div>

      <div className="goals-grid">
        {goals.map((g) => {
          const active = selected.includes(g);
          return (
            <button
              key={g}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(g)}
              className={`goal-card ${active ? "active" : ""}`}
            >
              <span className="goal-checkbox" aria-hidden="true" />
              <span className="goal-label list-item">{g}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
