import { useState, Children, isValidElement, cloneElement } from "react";
import "./Accordion.css";
import DownIcon from "../../assets/icons/down.svg?react"; // ✅ using your down.svg icon

export default function Accordion({
  title,
  children,
  defaultOpen = false,
  closeOnSelect = true,
}) {
  const [open, setOpen] = useState(defaultOpen);

  // ✅ Handle child click + auto close
  const handleChildClick = (child, e) => {
    child.props?.onClick?.(e);
    if (closeOnSelect) setOpen(false);
  };

  // ✅ Safely clone only valid elements (like <Button />)
  const wrappedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    return cloneElement(child, {
      onClick: (e) => handleChildClick(child, e),
    });
  });

  return (
    <div className={`accordion ${open ? "open" : ""}`}>
      {/* === Header (Clickable Chip) === */}
      <button
        className="accordion-header"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="accordion-title">{title}</span>
        <DownIcon className={`accordion-icon ${open ? "rotated" : ""}`} />
      </button>

      {/* === Dropdown Content === */}
      <div className={`accordion-content ${open ? "show" : ""}`}>
        {wrappedChildren}
      </div>
    </div>
  );
}
