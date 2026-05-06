import TextInput from "../../inputs/TextInput";

export default function LocationFields({ country, city, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        className="role-header"
        style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}
      >
        <h1 className="role-header-title">Where are you based</h1>
        <p className="role-header-subtitle">
          Help us personalize content, events and recommendations relevant to
          where you live and train.
        </p>
      </div>
      <TextInput
        label="Nationality"
        value={country}
        onChange={(v) => onChange({ country: v })}
      />
      <TextInput
        label="Location of your base"
        value={city}
        onChange={(v) => onChange({ city: v })}
      />
    </div>
  );
}
