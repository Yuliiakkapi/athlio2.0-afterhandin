import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import OnboardingTopbar from "../components/domain/onboarding/UI/OnboardingTopbar";
import OnboardingNavbar from "../components/domain/onboarding/UI/OnboardingNavbar";
import ScoutSplash from "../components/domain/Scouting/ProOnboarding/ScoutSplash";
import ScoutingFocus from "../components/domain/Scouting/ProOnboarding/ScoutingFocus";
import ScoutCriteria from "../components/domain/Scouting/ProOnboarding/ScoutCriteria";
import ScoutReadyScreen from "../components/domain/Scouting/ProOnboarding/ScoutReadyScreen";
import "./ScoutProOnboarding.css";

const FORM_STEPS = 2;

export default function ScoutProOnboarding() {
  const navigate = useNavigate();
  const { setProfile } = useUser();
  const [step, setStep] = useState(0);
  const [canContinue, setCanContinue] = useState(false);

  function next() { setCanContinue(false); setStep((s) => s + 1); }
  function back() {
    if (step === 1) navigate(-1);
    else setStep((s) => s - 1);
  }
  function finish() {
    setProfile((prev) => ({ ...prev, is_pro: true }));
    navigate("/scouting");
  }

  return (
    <div className="scout-pro-onboarding-page">
      {step === 0 && <ScoutSplash onDone={next} />}

      {step >= 1 && step <= FORM_STEPS && (
        <>
          <OnboardingTopbar
            currentStep={step}
            totalSteps={FORM_STEPS}
            onBack={back}
            showBack
          />
          {step === 1 && <ScoutingFocus onSelectionChange={setCanContinue} />}
          {step === 2 && <ScoutCriteria />}
          <OnboardingNavbar
            onNext={next}
            secondaryLabel={step === FORM_STEPS ? "Skip" : null}
            onSecondary={step === FORM_STEPS ? next : null}
            primaryLabel={step === FORM_STEPS ? "Activate" : "Continue"}
            canContinue={step === 1 ? canContinue : true}
          />
        </>
      )}

      {step === 3 && (
        <ReadyScreen
          onClose={finish}
          badgeColor="pro-scout"
          subtitle="Your scouting workspace is set up based on your focus and criteria"
        />
      )}
    </div>
  );
}
