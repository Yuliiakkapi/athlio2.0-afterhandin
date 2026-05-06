import { useEffect, useRef, useState } from "react";
import "./AddPostModal.css";

export default function Modal({
  open,
  onClose,
  children,
  labelledBy = "modal-title",
}) {
  const ref = useRef(null);
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const timeout = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, 300); // Adjust this timeout to match the animation duration
      return () => clearTimeout(timeout);
    }
  }, [open, visible]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    //focus for accessibility
    const t = setTimeout(() => ref.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="addmodal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onClick={onClose}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className={`addmodal-sheet ${closing ? "closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
