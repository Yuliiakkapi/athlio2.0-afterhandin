import { useNavigate } from "react-router-dom";
import PerformanceCard from "../Progress-athletes/PerformanceCard";
import Button from "../../UI/Button";
import "./Premium.css";

export default function Premium() {
  const navigate = useNavigate();

  function goToUpgrade() {
    navigate("/upgrade-pro", { state: { fromOnboarding: true } });
  }

  return (
    <div className="premium-root">
      <div className="premium-container">
        {/* Header */}
        <div className="premium-header">
          <h1 className="premium-main-title">Level up your game</h1>
        </div>

        {/* Main content */}
        <div className="premium-content">
          <PerformanceCard />
        </div>

        {/* Paywall card */}
        <div className="premium-paywall">
          <div className="premium-paywall-badge">PRO</div>
          <h2 className="premium-paywall-title">Unlock pro features</h2>
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
    </div>
  );
}
