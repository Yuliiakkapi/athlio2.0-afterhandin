import "./PostTypeButton.css";

export default function PostTypeButton({ title, icon: Icon, onClick, disabled = false }) {
  return (
    <button
      className={`post-type-btn${disabled ? " post-type-btn--disabled" : ""}`}
      onClick={disabled ? undefined : onClick}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      <span className="post-type-btn-icon">
        <Icon size={28} weight="light" />
      </span>
      <span className="post-type-btn-label">{title}</span>
    </button>
  );
}
