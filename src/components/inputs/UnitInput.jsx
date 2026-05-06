export default function UnitInput({
  label,
  value,
  onChange,
  unit,
  setUnit,
  unitOptions,
  placeholderCm,
  placeholderAlt,
}) {
  return (
    <div>
      {label ? <span>{label}</span> : null}
      <input
        value={value}
        placeholder={unit === unitOptions[0] ? placeholderCm : placeholderAlt}
        onChange={(e) => onChange(e.target.value)}
      />
      <select value={unit} onChange={(e) => setUnit(e.target.value)}>
        {unitOptions.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
    </div>
  );
}
