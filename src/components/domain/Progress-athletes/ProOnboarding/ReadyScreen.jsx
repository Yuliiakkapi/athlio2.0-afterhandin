import { X } from "@phosphor-icons/react";
import "./ReadyScreen.css";

export default function ReadyScreen({ onClose }) {
  return (
    <div className="ready-screen">
      {/* Diagonal stripe decorations */}
      <div className="ready-stripe ready-stripe-1" aria-hidden="true" />
      <div className="ready-stripe ready-stripe-2" aria-hidden="true" />

      <button className="ready-close" onClick={onClose} aria-label="Close">
        <X size={20} weight="bold" />
      </button>

      <div className="ready-content">
        <h1 className="ready-title">
          You're ready to
          <br />
          Go <span className="ready-pro-badge">PRO</span>
        </h1>
      </div>

      <p className="ready-sub">
        Your personalized system ready based on your{" "}
        schedule, skills and connected apps
      </p>
    </div>
  );
}
