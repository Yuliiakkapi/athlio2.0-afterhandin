import VerificationIcon from "../../assets/icons/verification.svg?react";
import "./VerifiedBadge.css";

export default function VerifiedBadge({ containerSize = "", iconSize = "" }) {
  return (
    <div className={`verified-badge-container ${containerSize}`}>
      <VerificationIcon className={`verified-badge ${iconSize}`} />
    </div>
  );
}
