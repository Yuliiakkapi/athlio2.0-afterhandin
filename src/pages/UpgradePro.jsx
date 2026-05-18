import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, MagnifyingGlass, ChartLineUp, Football, Sparkle, Check } from "@phosphor-icons/react";
import "./UpgradePro.css";

const FEATURES = [
  {
    key: "scout",
    icon: MagnifyingGlass,
    title: "Scout Visibility",
    desc: "Get premium badge and see who viewed you",
  },
  {
    key: "ovr",
    icon: ChartLineUp,
    title: "Predictive OVR",
    desc: "AI career trajectory forecast",
  },
  {
    key: "training",
    icon: Football,
    title: "Training support",
    desc: "Plan and track your trainings, get suggestions",
  },
  {
    key: "challenges",
    icon: Sparkle,
    title: "Exclusive Challenges",
    desc: "Pro-only challenges & rewards",
  },
];

const AVATAR_COLORS = ["#e8a838", "#3a8f3a", "#7b52c4", "#d44040", "#2a6db5"];

export default function UpgradePro() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState("annual");

  return (
    <div className="upgrade-page">
      {/* Background blobs */}
      <div className="upgrade-blob upgrade-blob-1" aria-hidden="true" />
      <div className="upgrade-blob upgrade-blob-2" aria-hidden="true" />

      <div className="upgrade-scroll">
        {/* Close */}
        <div className="upgrade-topbar">
          <button className="upgrade-close-btn" onClick={() => navigate(-1)} aria-label="Close">
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Hero */}
        <div className="upgrade-hero">
          <h1 className="upgrade-title">
            GO <span className="upgrade-pro-badge">PRO</span>.
            <br />
            PLAY BIGGER.
          </h1>
          <p className="upgrade-subtitle">
            Unlock every tool to accelerate your career
            and get noticed by scouts.
          </p>
        </div>

        {/* Pricing */}
        <div className="upgrade-plans">
          <button
            className={`upgrade-plan-card${plan === "monthly" ? " upgrade-plan-card--active" : ""}`}
            onClick={() => setPlan("monthly")}
          >
            <span className="upgrade-plan-period">MONTHLY</span>
            <div className="upgrade-plan-price-row">
              <span className="upgrade-plan-price">€6.99</span>
              <span className="upgrade-plan-unit">per month</span>
            </div>
          </button>

          <button
            className={`upgrade-plan-card${plan === "annual" ? " upgrade-plan-card--active" : ""}`}
            onClick={() => setPlan("annual")}
          >
            <div className="upgrade-plan-save">SAVE 33%</div>
            <span className="upgrade-plan-period">ANNUAL</span>
            <div className="upgrade-plan-price-row">
              <span className="upgrade-plan-price">€4.99</span>
              <span className="upgrade-plan-unit">per month</span>
            </div>
            <span className="upgrade-plan-billed">Billed €39.99/year</span>
            {plan === "annual" && (
              <div className="upgrade-plan-check" aria-hidden="true">
                <Check size={14} weight="bold" color="white" />
              </div>
            )}
          </button>
        </div>

        {/* Features */}
        <div className="upgrade-features-card">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.key} className={`upgrade-feature-row${i < FEATURES.length - 1 ? " upgrade-feature-row--border" : ""}`}>
                <div className="upgrade-feature-icon">
                  <Icon size={20} color="#4ff777" weight="duotone" />
                </div>
                <div className="upgrade-feature-text">
                  <span className="upgrade-feature-title">{f.title}</span>
                  <span className="upgrade-feature-desc">{f.desc}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social proof */}
        <div className="upgrade-social">
          <div className="upgrade-avatars">
            {AVATAR_COLORS.map((color, i) => (
              <div
                key={i}
                className="upgrade-avatar"
                style={{ background: color, zIndex: AVATAR_COLORS.length - i }}
              />
            ))}
          </div>
          <span className="upgrade-social-text">12,400 + pro players</span>
        </div>

        {/* Spacer so content clears sticky footer */}
        <div className="upgrade-footer-spacer" />
      </div>

      {/* Sticky CTA */}
      <div className="upgrade-cta-bar">
        <button className="upgrade-cta-btn" onClick={() => navigate("/pro-onboarding")}>Start 7-day trial</button>
        <p className="upgrade-cta-footnote">Cancel anytime &nbsp;•&nbsp; No charge during trial</p>
      </div>
    </div>
  );
}
