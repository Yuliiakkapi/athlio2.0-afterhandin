import { useEffect } from "react";
import { X } from "@phosphor-icons/react";
import Badge from "../../../../components/UI/Badge";
import whiteStripes from "../../../../assets/images/background-whitestrpes.png";
import whiteStripesScouts from "../../../../assets/images/background-whitestripes-scouts.png";
import "./ReadyScreen.css";

export default function ReadyScreen({
  onClose,
  badgeColor = "pro-athlete",
  subtitle = "Your personalized system ready based on your schedule, skills and connected apps",
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="ready-screen" style={{ backgroundImage: `url(${badgeColor === "pro-scout" ? whiteStripesScouts : whiteStripes})` }}>

      <button className="ready-close" onClick={onClose} aria-label="Close">
        <X size={20} weight="bold" />
      </button>

      <div className="ready-content">
        <h1 className="ready-title">
          You're ready to
          <br />
          Go <Badge text="PRO" color={badgeColor} size="md" />
        </h1>
      </div>

      <p className="ready-sub">{subtitle}</p>
    </div>
  );
}
