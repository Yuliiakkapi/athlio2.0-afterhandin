import { useRef } from "react";
import "./TextInput.css";

export default function TextInput({ label, value, onChange, name, type = "text", readOnly = false, onClick }) {
  const isFilled = Boolean(value);
  const inputRef = useRef(null);

  function handleClear(e) {
    e.preventDefault();
    onChange?.("");
    inputRef.current?.focus();
  }

  return (
    <label className={`textinput-container ${isFilled ? "filled" : ""}`} onClick={readOnly ? onClick : undefined}>
      <div className="textinput-wrapper">
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
          readOnly={readOnly}
          onClick={readOnly ? onClick : undefined}
          className="textinput-field"
          placeholder=" "
          required
        />
        {readOnly ? (
          <span className="selectinput-chevron" aria-hidden="true" />
        ) : (
          <button
            type="button"
            className="textinput-clear"
            onClick={handleClear}
            aria-label={label ? `Clear ${label}` : "Clear input"}
          >
            ×
          </button>
        )}
        <span className="textinput-outline" />
        {label && (
          <span className="textinput-label">
            {label.replace(/ ?\*$/, "")}
            {label.includes("*") && <span className="ti-required">*</span>}
          </span>
        )}
      </div>
    </label>
  );
}
