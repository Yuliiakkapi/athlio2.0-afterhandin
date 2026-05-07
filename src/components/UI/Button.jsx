import "./Button.css";
//size - medium or small
//type - primary, outline or subtle

export default function Button({
  size = "",
  type = "",
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
