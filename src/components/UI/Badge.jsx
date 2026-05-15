import "./Badge.css";

/**
 * Badge — reusable badge component with multiple sizes and colors
 *
 * Props:
 *   text        string   — badge label text (default: "Scout")
 *   color       string   — "light" | "dark" | "success" | "danger" | "warning" | "transparent"
 *   size        string   — "xs" | "s" | "m" (default: "xs")
 *   leftIcon    node?    — React element for left icon
 *   rightIcon   node?    — React element for right icon
 *   className   string?  — additional CSS classes
 */
export default function Badge({
  text = "Scout",
  color = "light",
  size = "xs",
  leftIcon,
  rightIcon,
  className,
}) {
  const badgeClass = `badge badge--${color} badge--${size}`;

  return (
    <div className={className ? `${badgeClass} ${className}` : badgeClass}>
      {leftIcon && <span className="badge-icon badge-icon--left">{leftIcon}</span>}
      <span className="badge-text">{text.toUpperCase()}</span>
      {rightIcon && <span className="badge-icon badge-icon--right">{rightIcon}</span>}
    </div>
  );
}
