import IconButton from "./IconButton";
import "./PostTypeButton.css";

export default function PostTypeButton({ title, icon: Icon, onClick }) {
  return (
    <div
      className="post-type-button"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
    >
      <span className="post-type-button" onClick={onClick}>
        <IconButton size="small" type="subtle" icon={Icon} />
        <p>{title}</p>
      </span>
    </div>
  );
}
