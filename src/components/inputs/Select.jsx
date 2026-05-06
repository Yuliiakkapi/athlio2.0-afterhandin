import { useState, useEffect } from "react";
import "./Select.css";

export default function Select({ label, value, onChange, options }) {
  const [isFocused, setIsFocused] = useState(false);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    setFilled(value !== "" && value !== null && value !== undefined);
  }, [value]);

  return (
    <div
      className={`select-container ${filled ? "filled" : ""} ${
        isFocused ? "focused" : ""
      }`}
    >
      <div className="select-wrapper">
        <select
          className="select-field"
          value={value || ""}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => onChange(e.target.value)}
        >
          {/* Hidden placeholder option */}
          <option value="" disabled hidden></option>
          {options.map((opt) => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label ?? opt.value}
            </option>
          ))}
        </select>

        <span className="select-outline" />
        {label && <label className="select-label">{label}</label>}
      </div>
    </div>
  );
}
