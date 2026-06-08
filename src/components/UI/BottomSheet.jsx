import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import IconButton from "./IconButton";
import "./BottomSheet.css";

export default function BottomSheet({ title, open, onClose, children, footer }) {
  const [visible, setVisible] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const t = setTimeout(() => { setVisible(false); setClosing(false); }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div className="bs-overlay" onClick={onClose}>
      <div
        className={`bs-sheet${closing ? " bs-sheet--closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bs-handle" />
        <div className="bs-header">
          <h2 className="bs-title text-lg-semibold">{title}</h2>
          <IconButton icon={X} type="subtle" size="small" onClick={onClose} />
        </div>
        <div className="bs-body">{children}</div>
        {footer && <div className="bs-footer">{footer}</div>}
      </div>
    </div>
  );
}
