import { useState } from "react";
import { Info } from "@phosphor-icons/react";
import NumberPicker from "../../../../components/UI/NumberPicker";
import "./ScoutCriteria.css";

const CRITERIA = [
  { key: "technical",  label: "Technical"  },
  { key: "physical",   label: "Physical"   },
  { key: "mental",     label: "Mental"     },
  { key: "tactical",   label: "Tactical"   },
  { key: "potential",  label: "Potential"  },
  { key: "experience", label: "Experience" },
];

const DEFAULT_VALUES = Object.fromEntries(CRITERIA.map((c) => [c.key, 5]));

export default function ScoutCriteria() {
  const [values, setValues] = useState(DEFAULT_VALUES);

  function update(key, val) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <div className="sc-content">
      <div className="sc-header">
        <h1 className="sc-title">Scout Criteria</h1>
        <p className="sc-subtitle">Rate what matters most to you in a player</p>
      </div>

      <div className="sc-info-row">
        <Info size={16} color="var(--primary-default)" weight="fill" />
        <span className="sc-info-text">This helps personalize your player suggestions</span>
      </div>

      <div className="sc-grid">
        {CRITERIA.map((c) => (
          <div key={c.key} className="sc-card">
            <span className="sc-card-name">{c.label}</span>
            <NumberPicker value={values[c.key]} onChange={(v) => update(c.key, v)} min={1} max={10} />
          </div>
        ))}
      </div>
    </div>
  );
}
