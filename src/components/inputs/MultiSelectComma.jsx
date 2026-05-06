export default function MultiSelectComma({
  label,
  value,
  onChange,
  placeholder,
}) {
  const str = Array.isArray(value) ? value.join(",") : "";
  return (
    <label>
      {label ? <span>{label}</span> : null}
      <input
        placeholder={placeholder}
        value={str}
        onChange={(e) => {
          const arr = e.target.value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          onChange(arr);
        }}
      />
    </label>
  );
}
