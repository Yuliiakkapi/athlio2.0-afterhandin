import { useNavigate } from "react-router-dom";
import Badge from "../../UI/Badge";
import Button from "../../UI/Button";
import darkblueStripes from "../../../assets/images/darkblue-stripes.png";
import "./ProUpgradeCard.css";

export default function ProUpgradeCard({
  title = "Unlock Pro Features",
  description = "Get AI insights, advanced analytics, and full scout visibility. Take your career to the next level.",
  buttonLabel = "Unlock Premium",
  onButtonClick,
  badgeColor = "pro-athlete",
  badgeClassName,
}) {
  const navigate = useNavigate();
  return (
    <div
      className="pro-upgrade-card"
      style={{ backgroundImage: `url(${darkblueStripes})` }}
    >
      <Badge text="PRO" color={badgeColor} size="md" className={badgeClassName} />
      <div className="pro-upgrade-text">
        <h2 className="pro-upgrade-title">{title}</h2>
        <p className="pro-upgrade-desc">{description}</p>
      </div>

      <Button
        type="secondary"
        size="medium"
        fullWidth
        label={buttonLabel}
        onClick={onButtonClick ?? (() => navigate("/upgrade-pro"))}
      />
    </div>
  );
}
