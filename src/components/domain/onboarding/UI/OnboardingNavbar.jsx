import Button from "../../../../components/UI/Button";
import "./OnboardingNavbar.css";

export default function OnboardingNavbar({
  onNext,
  onFinish,
  showNext = true,
  showFinish = false,
  canContinue = true,
  dark = false,
  primaryLabel = null,
  secondaryLabel = null,
  onSecondary = null,
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
      dark     ? "onboarding-navbar--dark"  : "",
      hasSplit ? "onboarding-navbar--split" : "",
    ].filter(Boolean).join(" ")}>

      {hasSplit && (
        <Button
          type="subtle"
          size="medium"
          label={secondaryLabel}
          onClick={onSecondary}
        />
      )}

      <Button
        type="primary"
        size="medium"
        fullWidth={!hasSplit}
        label={primaryLabel || (showFinish ? "Finish" : "Continue")}
        onClick={handleContinue}
        disabled={!canContinue}
      />
    </div>
  );
}
