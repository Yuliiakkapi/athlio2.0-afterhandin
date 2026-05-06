import "./PostIcon.css";

export default function PostIcon({ Icon, count = 0, onClick, className = "" }) {
  return (
    <div
      className={`postIcon ${className}`.trim()}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="icon-container">
        <Icon className="icon" />
      </div>
      {count !== undefined && <p>{count}</p>}
    </div>
  );
}
