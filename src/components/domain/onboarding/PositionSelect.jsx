import { SPORT_POSITIONS } from "../../../utils/positions";
export default function PositionSelect({ sport, value, onChange }) {
  const options = sport ? SPORT_POSITIONS[sport] || [] : [];
  return (
    <div>
      <div
        className="role-header"
        style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}
      >
        <h1 className="role-header-title">Choose your position</h1>
        <p className="role-header-subtitle">You can select multiple</p>
      </div>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select position</option>
        {options.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
}
