import { useNavigate } from "react-router-dom";
import premiumScoutBg from "../../../assets/images/PremiumScreen-scout.png";
import ProUpgradeCard from "../Progress-athletes/ProUpgradeCard";
import "./Premium.css";

export default function PremiumProfessional({ onFinish }) {
  const navigate = useNavigate();

  async function goToScouting() {
    await onFinish?.();
    navigate("/scouting");
  }

  return (
    <div className="premium-root">
      <div className="premium-bg" style={{ backgroundImage: `url(${premiumScoutBg})`, top: -76 }} />
      <div className="premium-fade" />

      <h1 className="premium-main-title">Level up your game</h1>

      <ProUpgradeCard
        title="Unlock pro features"
        description="Search players, build your watchlist, and discover talent with advanced scouting tools."
        buttonLabel="Get Premium features"
        onButtonClick={goToScouting}
        badgeClassName="pro-badge--scout-gradient"
      />
    </div>
  );
}
