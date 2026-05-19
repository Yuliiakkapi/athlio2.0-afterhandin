import "./TrainingDayCard.css";

export default function TrainingDayCard({ day, date, active, onClick, icon: Icon, status, variant }) {
  const classes = [
    "tdc",
    variant ? `tdc--${variant}` : "",
    active ? "tdc--active" : "",
    status ? `tdc--${status}` : "",
  ].filter(Boolean).join(" ");

  if (variant === "date") {
    return (
      <button type="button" className={classes} onClick={onClick}>
        <span className="tdc__day-name">{day}</span>
        <span className="tdc__date-num">{date}</span>
        <div className="tdc__dot" />
      </button>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      <div className="tdc__icon">
        {Icon && (variant === "week" || active) && <Icon size={22} weight="regular" />}
      </div>
      <span className="tdc__label">{day}</span>
      <div className="tdc__dot" />
    </button>
  );
}
