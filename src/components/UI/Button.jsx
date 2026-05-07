import "./Button.css";

/**
 * Button component
 *
 * size   — "medium" (44px) | "small" (36px) | "xsmall" (32px) | "big" (44px full-width)
 * type   — "primary" | "outline" | "outlined" | "secondary" | "subtle" | "gray" | "following"
 * label  — button text
 * Icon   — React component or image URL for a leading icon
 * disabled, htmlType, onClick — standard
 */
export default function Button({
  size = "medium",
  type = "primary",
  label,
  onClick,
  Icon,
  htmlType = "button",
  disabled = false,
}) {
  const isUrl = typeof Icon === "string";
  const IconComp = isUrl ? null : Icon;

  return (
    <button
      type={htmlType}
      className={`button button--${size} button--${type}`}
      onClick={onClick}
      disabled={disabled}
    >
      {isUrl && Icon ? (
        <img src={Icon} alt="" className="button-icon" aria-hidden="true" />
      ) : IconComp ? (
        <IconComp className="button-icon" />
      ) : null}
      <p>{label}</p>
    </button>
  );
}
