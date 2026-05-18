import "./Badge.css";

/**
 * Badge
 *
 * size   "xs" | "s" | "m"  — 3 standard sizes (sm/md reserved for pro badges)
 * color  "light" | "dark" | "success" | "danger" | "warning" | "transparent"
 *        | "pro-athlete" | "pro-scout"
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
