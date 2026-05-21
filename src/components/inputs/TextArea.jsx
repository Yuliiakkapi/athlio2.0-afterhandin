import "./TextArea.css";

export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}) {
  const isFilled = Boolean(value);

  return (
    <div className={`ta-wrapper ${isFilled ? "ta-filled" : ""}`}>
      <div className="ta-container">
        <div className="ta-input">
          <textarea
            rows={rows}
            placeholder=" "
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="ta-field"
          />
        </div>
        {label && <label className="ta-floating-label">{label}</label>}
      </div>
    </div>
  );
}
