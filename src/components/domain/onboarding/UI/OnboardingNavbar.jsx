import React from "react";
import Button from "../../../UI/Button";
import IconButton from "../../../UI/IconButton";
import "./OnboardingNavbar.css";

function ArrowLeft(props) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OnboardingNavbar({
  onBack,
  onNext,
  onFinish,
  showBack = true,
  showNext = true,
  showFinish = false,
  canContinue = true,
  secondaryLabel = null,
  onSecondary = null,
  primaryLabel = "Continue",
}) {
  const hasSplit = Boolean(secondaryLabel && onSecondary);

  const handleContinue = () => {
    if (showNext && typeof onNext === "function") return onNext();
    if (showFinish && typeof onFinish === "function") return onFinish();
  };

  return (
    <div className="onboarding-navbar">
      <div className="onboarding-left">
        {showBack ? (
          <IconButton size="medium" type="subtle" icon={ArrowLeft} onClick={onBack} />
        ) : (
          <div style={{ width: 40 }} />
        )}
      </div>

      {hasSplit ? (
        <div className="onboarding-split">
          <button type="button" className="onboarding-secondary-btn" onClick={onSecondary}>
            {secondaryLabel}
          </button>
          <div className={`onboarding-split-primary${!canContinue ? " continue-disabled" : ""}`}>
            <Button size="medium" type="primary" label={primaryLabel} onClick={canContinue ? handleContinue : undefined} />
          </div>
        </div>
      ) : (
        <div className={`onboarding-right${!canContinue ? " continue-disabled" : ""}`}>
          <Button size="medium" type="primary" label={primaryLabel} onClick={canContinue ? handleContinue : undefined} />
        </div>
      )}
    </div>
  );
}
