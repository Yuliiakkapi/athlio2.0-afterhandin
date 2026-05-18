import { useNavigate } from "react-router-dom";
import "./ProUpgradeCard.css";

export default function ProUpgradeCard() {
  const navigate = useNavigate();
  return (
    <div className="pro-upgrade-card">
      <div className="pro-upgrade-blob pro-upgrade-blob-1" aria-hidden="true" />
      <div className="pro-upgrade-blob pro-upgrade-blob-2" aria-hidden="true" />

      <div className="pro-upgrade-inner">
        <div className="pro-upgrade-badge">PRO</div>
        <h2 className="pro-upgrade-title">Unlock Pro Features</h2>
        <p className="pro-upgrade-desc">
          Get AI insights, advanced analytics, and full scout
          visibility. Take your career to the next level.
        </p>
        <button className="pro-upgrade-btn" onClick={() => navigate("/upgrade-pro")}>Unlock Premium</button>
      </div>
    </div>
  );
}
