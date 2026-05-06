import "./DateInput.css";

export default function DateInput({ value, onChange }) {
  return (
    <div className="date-input">
      <input
        id="date_of_game"
        type="date"
        value={value}
        onChange={onChange}
        placeholder="Date of game"
        required
      />
    </div>
  );
}
