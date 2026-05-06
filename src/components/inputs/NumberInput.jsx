export default function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  name,
}) {
  return (
    <label>
      {label ? <span>{label}</span> : null}
      <input
        type="number"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
