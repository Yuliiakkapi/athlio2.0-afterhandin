import "./DateInput.css";

export default function DateInput({ value, onChange }) {
  return (
    <div className="date-input">
      <input
        id="date_of_game"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Date of game"
        required
      />
    </div>
  );
}
