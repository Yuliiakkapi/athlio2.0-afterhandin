import { useEffect } from "react";
import { X } from "@phosphor-icons/react";
import IconButton from "./IconButton";
import "./SuccessPopover.css";

// circle draw (1.4s) + check draw (0.5s) + pause (0.8s)
const AUTO_CLOSE_MS = 2700;

export default function SuccessPopover({ title, subtitle, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, AUTO_CLOSE_MS);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="success-popover-overlay">
      <div className="success-popover">
        <div className="success-popover-header">
          <IconButton icon={X} type="subtle" size="large" onClick={onClose} />
        </div>

        <div className="success-popover-content">
          <svg
            className="success-svg"
            width="90" height="90"
            viewBox="0 0 90 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="success-circle"
              d="M45 1.57895C50.7021 1.57895 56.3484 2.70207 61.6165 4.88418C66.8846 7.06629 71.6713 10.2647 75.7033 14.2967C79.7353 18.3287 82.9337 23.1154 85.1158 28.3835C87.2979 33.6516 88.4211 39.2979 88.4211 45C88.4211 50.7021 87.2979 56.3484 85.1158 61.6165C82.9337 66.8846 79.7353 71.6713 75.7033 75.7033C71.6713 79.7353 66.8846 82.9337 61.6165 85.1158C56.3484 87.2979 50.7021 88.4211 45 88.4211C39.2979 88.4211 33.6516 87.2979 28.3835 85.1158C23.1154 82.9337 18.3287 79.7353 14.2967 75.7033C10.2647 71.6713 7.06628 66.8846 4.88417 61.6165C2.70206 56.3484 1.57894 50.7021 1.57895 45C1.57895 39.2978 2.70207 33.6515 4.88419 28.3835C7.0663 23.1154 10.2647 18.3287 14.2967 14.2967C18.3287 10.2646 23.1154 7.06628 28.3835 4.88417C33.6516 2.70206 39.2979 1.57894 45 1.57895L45 1.57895Z"
              stroke="var(--primary-500)"
              strokeWidth="3.15789"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="success-check"
              d="M26.0526 44.3684L39.3701 57.6316L64.7368 32.3684"
              stroke="var(--primary-500)"
              strokeWidth="3.15789"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="success-popover-text">
            <p className="heading-4xl-italic success-popover-title">{title}</p>
            {subtitle && (
              <p className="text-sm-medium success-popover-subtitle">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
