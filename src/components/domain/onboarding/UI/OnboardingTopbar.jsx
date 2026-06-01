import { ArrowLeft, X } from "@phosphor-icons/react";
import IconButton from "../../../../components/UI/IconButton";
import "./OnboardingTopbar.css";

export default function OnboardingTopbar({
  onBack,
  onClose,
  currentStep = 1,
  totalSteps = 1,
  showBack = true,
  dark = false,
}) {
  const total = Math.max(1, totalSteps);
  const step = Math.min(Math.max(currentStep, 0), total);
  const percent = Math.round((step / total) * 100);

  return (
    <div className={`ob-topbar${dark ? " ob-topbar--dark" : ""}`}>
      <div style={{ visibility: showBack ? "visible" : "hidden" }}>
        <IconButton
          size="small"
          type="subtle"
          icon={ArrowLeft}
          onClick={onBack}
        />
      </div>

      <div
        className="ob-topbar-progress"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Step ${step} of ${total}`}
      >
        <div className="ob-topbar-track">
          <div className="ob-topbar-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {onClose && (
        <IconButton
          size="small"
          type="subtle"
          icon={X}
          onClick={onClose}
        />
      )}
    </div>
  );
}
