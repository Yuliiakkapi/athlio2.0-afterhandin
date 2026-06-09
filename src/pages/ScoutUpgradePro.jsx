import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, MagnifyingGlass, Target, SoccerBall, Sparkle, Check } from "@phosphor-icons/react";
import Badge from "../components/UI/Badge";
import Button from "../components/UI/Button";
import user1 from "../assets/images/user1.jpg";
import user2 from "../assets/images/user2.jpg";
import user3 from "../assets/images/user 3.jpg";
import user4 from "../assets/images/user4.jpeg";
import "./ScoutUpgradePro.css";
import "./UpgradePro.css";

const FEATURES = [
  {
    key: "search",
    icon: MagnifyingGlass,
    title: "Advanced searching",
    desc: "Unlock advanced search with filters.",
  },
  {
    key: "ovr",
    icon: Target,
    title: "Predictive OVR",
    desc: "For faster scouting",
  },
  {
    key: "stats",
    icon: SoccerBall,
    title: "Advanced statistics",
    desc: "See and explore better statistics",
  },
  {
    key: "ai",
    icon: Sparkle,
    title: "AI summaries and reports",
    desc: "AI will help you fasten your processes",
  },
];

const AVATARS = [user1, user2, user3, user4];

export default function ScoutUpgradePro() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [plan, setPlan] = useState("annual");
  const [billing, setBilling] = useState("club");
  const [confirming, setConfirming] = useState(false);

  function handleStart() {
    if (confirming) return;
    setConfirming(true);
    setTimeout(() => navigate("/scout-pro-onboarding"), 2100);
  }

  return (
    <div className="scout-upgrade-page">
      <div className="scout-upgrade-scroll">

        {/* Close */}
        <div className="scout-upgrade-topbar">
          <button
            className="scout-upgrade-close"
            onClick={() => state?.fromOnboarding ? navigate("/home") : navigate(-1)}
            aria-label="Close"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Hero */}
        <div className="scout-upgrade-hero">
          <h1 className="scout-upgrade-title">
            GO <Badge text="PRO" color="pro-scout" size="md" /> .
            <br />
            SCOUT SMARTER.
          </h1>
          <p className="scout-upgrade-subtitle">
            Access all the tools you need to discover top talent and advance your scouting career.
          </p>
        </div>

        {/* Club / Individual toggle */}
        <div className="scout-billing-toggle">
          <button
            className={`scout-billing-option${billing === "club" ? " scout-billing-option--active" : ""}`}
            onClick={() => setBilling("club")}
            type="button"
          >
            <span className="scout-billing-label">CLUB</span>
            {billing === "club" && (
              <span className="scout-billing-badge">MAX. 7 ACCOUNTS</span>
            )}
          </button>
          <button
            className={`scout-billing-option${billing === "individual" ? " scout-billing-option--active" : ""}`}
            onClick={() => setBilling("individual")}
            type="button"
          >
            <span className="scout-billing-label">INDIVIDUAL</span>
          </button>
        </div>

        {/* Pricing cards */}
        <div className="scout-upgrade-plans">
          <button
            className={`scout-plan-card${plan === "monthly" ? " scout-plan-card--active" : ""}`}
            onClick={() => setPlan("monthly")}
            type="button"
          >
            <div className="scout-plan-annual-header">
              <span className="scout-plan-period">MONTHLY</span>
              {plan === "monthly" && (
                <div className="scout-plan-check" aria-hidden="true">
                  <Check size={14} weight="bold" />
                </div>
              )}
            </div>
            <div className="scout-plan-price-row">
              <span className="scout-plan-price">{billing === "individual" ? "€29.99" : "€79.99"}</span>
              <span className="scout-plan-unit">per month</span>
            </div>
          </button>

          <button
            className={`scout-plan-card${plan === "annual" ? " scout-plan-card--active" : ""}`}
            onClick={() => setPlan("annual")}
            type="button"
          >
            <div className="scout-plan-save-badge">{billing === "individual" ? "SAVE 17%" : "SAVE 33%"}</div>
            <div className="scout-plan-annual-header">
              <span className="scout-plan-period">ANNUAL</span>
              {plan === "annual" && (
                <div className="scout-plan-check" aria-hidden="true">
                  <Check size={14} weight="bold" />
                </div>
              )}
            </div>
            <div className="scout-plan-price-row">
              <span className="scout-plan-price">{billing === "individual" ? "€25.00" : "€69.99"}</span>
              <span className="scout-plan-unit">per month</span>
            </div>
            <span className="scout-plan-billed">{billing === "individual" ? "Billed €300.00 per year" : "Billed €839.88 per year"}</span>
          </button>
        </div>

        {/* Features */}
        <div className="scout-features-card">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.key}
                className={`scout-feature-row${i < FEATURES.length - 1 ? " scout-feature-row--border" : ""}`}
              >
                <div className="scout-feature-icon">
                  <Icon size={20} weight="duotone" />
                </div>
                <div className="scout-feature-text">
                  <span className="scout-feature-title">{f.title}</span>
                  <span className="scout-feature-desc">{f.desc}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social proof */}
        <div className="scout-upgrade-social">
          <div className="scout-upgrade-avatars">
            {AVATARS.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="scout-upgrade-avatar"
                style={{ zIndex: AVATARS.length - i }}
              />
            ))}
          </div>
          <span className="scout-upgrade-social-text">12,400 + professionals</span>
        </div>

      </div>

      {/* Sticky CTA */}
      <div className="scout-upgrade-cta-bar">
        <Button
          type="primary"
          size="medium"
          fullWidth
          label="Start 7-day trial"
          onClick={handleStart}
        />
        <p className="scout-upgrade-footnote">
          Cancel anytime &nbsp;•&nbsp; No charge during trial
        </p>
      </div>

      {/* Pro transition overlay */}
      {confirming && (
        <div className="upgrade-pro-overlay">
          <span className="upgrade-pro-overlay-text">PRO</span>
        </div>
      )}
    </div>
  );
}
