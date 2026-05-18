import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  MagnifyingGlass,
  Target,
  SoccerBall,
  Sparkle,
  Check,
} from "@phosphor-icons/react";
import Badge from "../components/UI/Badge";
import Button from "../components/UI/Button";
import IconButton from "../components/UI/IconButton";
import darkblueGradient from "../assets/images/darkblue-gradient.png";
import user1 from "../assets/images/user1.jpg";
import user2 from "../assets/images/user2.jpg";
import user3 from "../assets/images/user 3.jpg";
import user4 from "../assets/images/user4.jpeg";
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
    icon: Target,
    title: "Predictive OVR",
    desc: "AI career trajectory forecast",
  },
  {
    key: "training",
    icon: SoccerBall,
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

const AVATARS = [user1, user2, user3, user4];

export default function UpgradePro() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState("annual");
  const [confirming, setConfirming] = useState(false);

  function handleStart() {
    if (confirming) return;
    setConfirming(true);
    setTimeout(() => navigate("/pro-onboarding"), 2100);
  }

  return (
    <div
      className="upgrade-page"
      style={{ backgroundImage: `url(${darkblueGradient})` }}
    >
      <div className="upgrade-scroll">
        {/* Close */}
        <div className="upgrade-topbar">
          <IconButton
            size="medium"
            type="subtle"
            icon={X}
            onClick={() => navigate(-1)}
          />
        </div>

        {/* Hero */}
        <div className="upgrade-hero">
          <h1 className="upgrade-title">
            GO <Badge text="PRO" color="pro-athlete" size="md" />
            <br />
            PLAY BIGGER.
          </h1>
          <p className="upgrade-subtitle">
            Unlock every tool to accelerate your career and get noticed by
            scouts.
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
            {plan === "monthly" && (
              <div className="upgrade-plan-check" aria-hidden="true">
                <Check size={14} weight="bold" />
              </div>
            )}
          </button>

          <button
            className={`upgrade-plan-card${plan === "annual" ? " upgrade-plan-card--active" : ""}`}
            onClick={() => setPlan("annual")}
          >
            <div className="upgrade-plan-save">
              <Badge text="SAVE 33%" color="warning" size="xs" />
            </div>
            <span className="upgrade-plan-period">ANNUAL</span>
            <div className="upgrade-plan-price-row">
              <span className="upgrade-plan-price">€4.99</span>
              <span className="upgrade-plan-unit">per month</span>
            </div>
            <span className="upgrade-plan-billed">Billed €39.99/year</span>
            {plan === "annual" && (
              <div className="upgrade-plan-check" aria-hidden="true">
                <Check size={14} weight="bold" />
              </div>
            )}
          </button>
        </div>

        {/* Features */}
        <div className="upgrade-features-card">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.key}
                className={`upgrade-feature-row${i < FEATURES.length - 1 ? " upgrade-feature-row--border" : ""}`}
              >
                <div className="upgrade-feature-icon">
                  <Icon
                    size={20}
                    weight="duotone"
                    className="upgrade-feature-icon-svg"
                  />
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
            {AVATARS.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="upgrade-avatar"
                style={{ zIndex: AVATARS.length - i }}
              />
            ))}
          </div>
          <span className="upgrade-social-text">12,400 + pro players</span>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="upgrade-cta-bar">
        <Button
          type="primary"
          size="medium"
          fullWidth
          label="Start 7-day trial"
          onClick={handleStart}
        />
        <p className="upgrade-cta-footnote">
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
