import { useMemo } from "react";
import { CheckSquare, Square } from "@phosphor-icons/react";
import "./GoalsSelect.css";

const GOALS = [
  { id: "discovered",    label: "Get discovered by scouts and clubs" },
  { id: "new-club",      label: "Find a new club or trial opportunity" },
  { id: "higher-level",  label: "Move to a higher level of football" },
  { id: "track",         label: "Track my progress" },
  { id: "build-profile", label: "Build my football profile" },
  { id: "showcase",      label: "Showcase my highlights" },
];

function parseGoals(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value); } catch {}
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

export default function GoalsSelect({ value, onChange }) {
  const selected = useMemo(() => parseGoals(value), [value]);

  function toggle(id) {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    onChange(JSON.stringify(next));
  }

  return (
    <div className="goals-step">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="goals-header">
        <h1 className="goals-title">Your Goals</h1>
        <p className="goals-subtitle">
          What are you looking to achieve? This will help personalise your experience.
        </p>
      </div>

      {/* ── "People in common" badge ───────────────────────────── */}
      <div className="goals-badge-wrap">
        <span className="goals-badge">
          {selected.length} {selected.length === 1 ? "person" : "people"} in common
        </span>
      </div>

      {/* ── Goal list ──────────────────────────────────────────── */}
      <div className="goals-list">
        {GOALS.map((g) => {
          const active = selected.includes(g.id);
          return (
            <button
              key={g.id}
              type="button"
              className={`goals-item${active ? " goals-item--selected" : ""}`}
              onClick={() => toggle(g.id)}
              aria-pressed={active}
            >
              <span className="goals-item-label">{g.label}</span>
              {active ? (
                <CheckSquare
                  size={24}
                  weight="fill"
                  className="goals-item-icon goals-item-icon--checked"
                  aria-hidden="true"
                />
              ) : (
                <Square
                  size={24}
                  weight="regular"
                  className="goals-item-icon"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
