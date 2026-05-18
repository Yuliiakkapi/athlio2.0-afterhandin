import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import OnboardingTopbar from "../components/domain/onboarding/UI/OnboardingTopbar";
import OnboardingNavbar from "../components/domain/onboarding/UI/OnboardingNavbar";
import ProSplash from "../components/domain/Progress-athletes/ProOnboarding/ProSplash";
import TrainingSchedule from "../components/domain/Progress-athletes/ProOnboarding/TrainingSchedule";
import PlayerProfile from "../components/domain/Progress-athletes/ProOnboarding/PlayerProfile";
import ConnectApps from "../components/domain/Progress-athletes/ProOnboarding/ConnectApps";
import ReadyScreen from "../components/domain/Progress-athletes/ProOnboarding/ReadyScreen";
import "./ProOnboarding.css";

const FORM_STEPS = 3; // steps 1-3 show progress bar

export default function ProOnboarding() {
  const navigate = useNavigate();
  const { setProfile } = useUser();
  const [step, setStep] = useState(0);

  function next() { setStep((s) => s + 1); }
  function back() {
    if (step === 1) navigate(-1);
    else setStep((s) => s - 1);
  }
  function finish() {
    setProfile((prev) => ({ ...prev, is_pro: true }));
    navigate("/progress");
  }

  return (
    <div className="pro-onboarding-page">
      {step === 0 && <ProSplash onDone={next} />}

      {step >= 1 && step <= FORM_STEPS && (
        <>
          <OnboardingTopbar
            currentStep={step}
            totalSteps={FORM_STEPS}
            onBack={back}
            showBack
          />
          {step === 1 && <TrainingSchedule />}
          {step === 2 && <PlayerProfile />}
          {step === 3 && (
            <ConnectApps />
          )}
          <OnboardingNavbar
            onNext={step < FORM_STEPS ? next : next}
            secondaryLabel={step === FORM_STEPS ? "Skip" : null}
            onSecondary={step === FORM_STEPS ? next : null}
            primaryLabel={step === FORM_STEPS ? "Connect" : "Continue"}
          />
        </>
      )}

      {step === 4 && <ReadyScreen onClose={finish} />}
    </div>
  );
}
