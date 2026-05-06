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
}) {
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

      <div className={`onboarding-right ${!canContinue ? "continue-disabled" : ""}`}>
        <Button size="medium" type="primary" label="Continue" onClick={canContinue ? handleContinue : undefined} />
      </div>
    </div>
  );
}
