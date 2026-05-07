import "./OnboardingNavbar.css";

export default function OnboardingNavbar({
  onNext,
  onFinish,
  showNext = true,
  showFinish = false,
  canContinue = true,
  dark = false,
  // Optional secondary (ghost) button — e.g. "I'm not in a club"
  secondaryLabel = null,
  onSecondary = null,
  // legacy props (ignored — back is now in OnboardingTopbar)
  onBack: _onBack,
  showBack: _showBack,
}) {
  function handleContinue() {
    if (!canContinue) return;
    if (showFinish && typeof onFinish === "function") return onFinish();
    if (typeof onNext === "function") return onNext();
  }

  const hasSplit = Boolean(secondaryLabel && onSecondary);

  return (
    <div className={[
      "onboarding-navbar",
      dark      ? "onboarding-navbar--dark"  : "",
      hasSplit  ? "onboarding-navbar--split" : "",
    ].filter(Boolean).join(" ")}>

      {hasSplit && (
        <button
          type="button"
          className="onboarding-secondary-btn"
          onClick={onSecondary}
        >
          {secondaryLabel}
        </button>
      )}

      <button
        type="button"
        className={[
          "onboarding-continue-btn",
          !canContinue ? "onboarding-continue-btn--disabled" : "",
          hasSplit     ? "onboarding-continue-btn--half"     : "",
        ].filter(Boolean).join(" ")}
        onClick={handleContinue}
        disabled={!canContinue}
        aria-disabled={!canContinue}
      >
        {showFinish ? "Finish" : "Continue"}
      </button>
    </div>
  );
}
