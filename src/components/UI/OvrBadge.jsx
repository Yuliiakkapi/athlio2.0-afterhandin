import { Lock } from "@phosphor-icons/react";
import "./OvrBadge.css";

const LOCK_SIZES = { xs: 6, sm: 9, md: 11, lg: 16 };

export default function OvrBadge({
  value,
  locked = false,
  variant = "default",
  size = "sm",
}) {
  return (
    <div
      className={[
        "ovr-badge",
        `ovr-badge--${size}`,
        `ovr-badge--${variant}`,
        locked ? "ovr-badge--locked" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {locked ? (
        <>
          <Lock
            className="ovr-badge__lock"
            size={LOCK_SIZES[size]}
            weight="fill"
          />
          <span className="ovr-badge__premium">PREMIUM</span>
        </>
      ) : (
        <>
          <span className="ovr-badge__number">{value}</span>
          {variant === "default" && (
            <span className="ovr-badge__label">OVR</span>
          )}
        </>
      )}
    </div>
  );
}
