import "./Tag.css";

//used for role and position

export default function Tag({ label }) {
  const formattedLabel =
    label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  return (
    <div className="tag">
      <p>{formattedLabel}</p>
    </div>
  );
}
