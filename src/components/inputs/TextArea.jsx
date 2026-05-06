import "./TextArea.css";

export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}) {
  return (
    <div className="ta-wrapper">
      {label ? <div className="ta-label">{label}</div> : null}
      <div className="ta-input">
        <textarea
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
