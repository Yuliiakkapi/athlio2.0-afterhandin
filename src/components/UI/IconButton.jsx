import "./IconButton.css";
//size - medium or small
//type - primary, neutral or subtle

export default function IconButton({
  size = "",
  type = "",
  icon,
  onClick,
}) {
  const isUrl = typeof icon === "string";
  const IconComp = isUrl ? null : icon;

  return (
    <button className={`icon-button ${size} ${type}`} onClick={onClick}>
      {isUrl && icon ? (
        <img src={icon} alt="" aria-hidden="true" />
      ) : IconComp ? (
        <IconComp aria-hidden="true" />
      ) : null}
    </button>
  );
}
