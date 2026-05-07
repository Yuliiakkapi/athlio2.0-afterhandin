import "./OnboardingTopbar.css";
import { ArrowLeft } from "@phosphor-icons/react";

export default function OnboardingTopbar({
  onBack,
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
      <button
        type="button"
        className="ob-topbar-back-btn"
        onClick={onBack}
        aria-label="Go back"
        style={{ visibility: showBack ? "visible" : "hidden" }}
      >
        <ArrowLeft className="ob-topbar-back-icon" aria-hidden="true" />
      </button>

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
    </div>
  );
}
