import "./Button.css";

/**
 * size         — "medium" (44px) | "small" (36px) | "xsmall" (32px)
 * type         — "primary" | "outline" | "outlined" | "secondary" | "subtle" | "gray" | "white" | "following"
 * label        — button text
 * leadingIcon  — React component or image URL, rendered before the label
 * trailingIcon — React component, rendered after the label
 * fullWidth    — stretch button to 100% width
 * disabled, htmlType, onClick — standard
 */
export default function Button({
  size = "medium",
  type = "primary",
  label,
  onClick,
  leadingIcon,
  trailingIcon: TrailingIcon,
  fullWidth = false,
  htmlType = "button",
  disabled = false,
}) {
  const isUrl = typeof leadingIcon === "string";
  const LeadingIcon = isUrl ? null : leadingIcon;

  const classes = [
    "button",
    `button--${size}`,
    `button--${type}`,
    fullWidth ? "button--full-width" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={htmlType}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {isUrl && leadingIcon ? (
        <img src={leadingIcon} alt="" className="button-icon" aria-hidden="true" />
      ) : LeadingIcon ? (
        <LeadingIcon className="button-icon" />
      ) : null}
      <span>{label}</span>
      {TrailingIcon && <TrailingIcon className="button-icon" />}
    </button>
  );
}
