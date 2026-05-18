import { useNavigate } from "react-router-dom";
import Badge from "../../UI/Badge";
import Button from "../../UI/Button";
import darkblueStripes from "../../../assets/images/darkblue-stripes.png";
import "./ProUpgradeCard.css";

export default function ProUpgradeCard() {
  const navigate = useNavigate();
  return (
    <div
      className="pro-upgrade-card"
      style={{ backgroundImage: `url(${darkblueStripes})` }}
    >
      <Badge text="PRO" color="pro-athlete" size="md" />
      <div className="pro-upgrade-text">
        <h2 className="pro-upgrade-title">Unlock Pro Features</h2>
        <p className="pro-upgrade-desc">
          Get AI insights, advanced analytics, and full scout visibility. Take
          your career to the next level.
        </p>
      </div>

      <Button
        type="secondary"
        size="medium"
        fullWidth
        label="Unlock Premium"
        onClick={() => navigate("/upgrade-pro")}
      />
    </div>
  );
}
