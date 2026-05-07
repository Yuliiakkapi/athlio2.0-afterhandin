import "./OnboardingNavbar.css";

export default function OnboardingNavbar({
  onNext,
  onFinish,
  showNext = true,
  showFinish = false,
  canContinue = true,
  dark = false,
  // legacy props (ignored — back is now in OnboardingTopbar)
  onBack: _onBack,
  showBack: _showBack,
}) {
  function handleContinue() {
    if (!canContinue) return;
    if (showFinish && typeof onFinish === "function") return onFinish();
    if (typeof onNext === "function") return onNext();
  }

  return (
    <div className={`onboarding-navbar${dark ? " onboarding-navbar--dark" : ""}`}>
      <button
        type="button"
        className={`onboarding-continue-btn${canContinue ? "" : " onboarding-continue-btn--disabled"}`}
        onClick={handleContinue}
        disabled={!canContinue}
        aria-disabled={!canContinue}
      >
        {showFinish ? "Finish" : "Continue"}
      </button>
    </div>
  );
}
