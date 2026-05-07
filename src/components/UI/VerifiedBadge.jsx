import { SealCheck } from "@phosphor-icons/react";
import "./VerifiedBadge.css";

export default function VerifiedBadge({ containerSize = "", iconSize = "" }) {
  return (
    <div className={`verified-badge-container ${containerSize}`}>
      <SealCheck className={`verified-badge ${iconSize}`} />
    </div>
  );
}
