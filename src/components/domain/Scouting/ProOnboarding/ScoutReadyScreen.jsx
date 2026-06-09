import { useEffect } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import "./ScoutReadyScreen.css";

export default function ScoutReadyScreen({ onClose, subtitle = "Your personalized system ready based on your schedule, skills and connected apps" }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="srs-screen">
      <div className="srs-stripe srs-stripe--1" />
      <div className="srs-stripe srs-stripe--2" />
      <div className="srs-stripe srs-stripe--3" />

      <button className="srs-close" onClick={onClose} aria-label="Close">
        <ArrowLeft size={20} weight="bold" />
      </button>

      <div className="srs-content">
        <h1 className="srs-title">
          You're ready to go
          <br />
          <span className="srs-pro-badge">PRO</span>
        </h1>
      </div>

      <p className="srs-sub">{subtitle}</p>
    </div>
  );
}
