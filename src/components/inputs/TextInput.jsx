import { useRef } from "react";
import "./TextInput.css";

export default function TextInput({ label, value, onChange, name, type = "text" }) {
  const isFilled = Boolean(value);
  const inputRef = useRef(null);

  function handleClear(e) {
    e.preventDefault();
    onChange("");
    // focus the input after clearing
    inputRef.current?.focus();
  }

  return (
    <label className={`textinput-container ${isFilled ? "filled" : ""}`}>
      <div className="textinput-wrapper">
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="textinput-field"
          placeholder=" " /* note the space placeholder trick */
          required
        />
        <button
          type="button"
          className="textinput-clear"
          onClick={handleClear}
          aria-label={label ? `Clear ${label}` : "Clear input"}
        >
          ×
        </button>
        <span className="textinput-outline" />
        {label && <span className="textinput-label">{label}</span>}
      </div>
    </label>
  );
}
