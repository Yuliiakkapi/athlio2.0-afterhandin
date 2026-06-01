import { useNavigate } from "react-router-dom";
import premiumBg from "../../../assets/images/premium-screen-bg.png";
import Button from "../../UI/Button";
import "./Premium.css";

export default function Premium({ onFinish }) {
  const navigate = useNavigate();

  async function goToUpgrade() {
    await onFinish?.();
    navigate("/upgrade-pro", { state: { fromOnboarding: true } });
  }

  return (
    <div className="premium-root">
      {/* Background screenshot */}
      <div className="premium-bg" style={{ backgroundImage: `url(${premiumBg})` }} />
      {/* Fade the image out towards the bottom */}
      <div className="premium-fade" />

      {/* Heading — top, same position as other onboarding steps */}
      <h1 className="premium-main-title">Level up your game</h1>

      {/* Paywall card — pinned to bottom */}
      <div className="premium-paywall">
        <div className="premium-paywall-badge">PRO</div>
        <h2 className="premium-paywall-title">Unlock your features</h2>
        <p className="premium-paywall-subtitle">
          Get AI insights, advanced analytics, and full scout visibility. Take your career to the next level.
        </p>
        <Button
          size="medium"
          type="primary"
          label="Get Premium features"
          fullWidth
          onClick={goToUpgrade}
        />
      </div>
    </div>
  );
}