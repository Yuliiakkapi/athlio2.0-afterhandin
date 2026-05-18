import "./TrainingDayCard.css";

export default function TrainingDayCard({ day, active, onClick, icon: Icon }) {
  return (
    <button
      type="button"
      className={`tdc${active ? " tdc--active" : ""}`}
      onClick={onClick}
    >
      <div className="tdc__icon">
        {active && Icon && <Icon size={22} weight="regular" />}
      </div>
      <span className="tdc__label">{day}</span>
      <div className="tdc__dot" />
    </button>
  );
}
