import { useEffect, useRef } from "react";
import "./GrowingTextArea.css";

export default function GrowingTextArea({
  value,
  onChange,
  placeholder,
  className = "",
  minRows = 1,
  autoFocus = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    const scrollH = el.scrollHeight;
    el.style.height = scrollH + "px";
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={minRows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={`auto-textarea ${className}`}
    />
  );
}
