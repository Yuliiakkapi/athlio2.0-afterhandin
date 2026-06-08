import "./TextInput.css";
import "./SelectInput.css";

export default function SelectInput({ label, value, onChange, options }) {
  return (
    <label className="textinput-container filled">
      <div className="textinput-wrapper">
        <select
          className="textinput-field selectinput-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => {
            const val = typeof o === "string" ? o : o.value;
            const lbl = typeof o === "string" ? o : o.label;
            return <option key={val} value={val}>{lbl}</option>;
          })}
        </select>
        <span className="selectinput-chevron" aria-hidden="true" />
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
