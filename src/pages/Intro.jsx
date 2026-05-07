import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import "./intro.css";
import MainLogoSmall from "../assets/logos/main-logo-small.svg";
import PreboardingHero from "../assets/images/preboarding-hero.jpg";

// ─── Commented out: multi-slide carousel (keep for later use) ──────────────
// import { useEffect, useState } from "react";
// import FootballRun from "../assets/images/footballrun.png";
// import BasketballPlayer from "../assets/images/basketballplayer.png";
// import HockeyTeam from "../assets/images/hockeyteam.jpg";
// import AmericanFootball from "../assets/images/americanfootball.jpg";
//
// const slides = [
//   { image: FootballRun,       headline: ["Expand your", "network"] },
//   { image: BasketballPlayer,  headline: ["Track your", "progress"] },
//   { image: HockeyTeam,        headline: ["Connect with", "clubs"] },
//   { image: AmericanFootball,  headline: ["Grow your", "game"] },
// ];
//
// const TRANSITION_MS = 220;
//
// To restore the carousel:
//   1. Add useState/useEffect imports back
//   2. Use slides array + index/fading state
//   3. Add touch-swipe useEffect (see git history)
//   4. Swap <img> background for .intro-bg-layer divs
// ───────────────────────────────────────────────────────────────────────────

export default function Intro() {
  const navigate = useNavigate();

  function goLogin() {
    localStorage.setItem("introSeen", "true");
    navigate("/auth", { state: { mode: "login" } });
  }

  function goSignup() {
    localStorage.setItem("introSeen", "true");
    navigate("/auth", { state: { mode: "signup" } });
  }

  return (
    <div className="intro-root">
      {/* Background image */}
      <div className="intro-bg">
        <img src={PreboardingHero} alt="" className="intro-bg-img" />
        <div className="intro-overlay" />
      </div>

      {/* Bottom content block */}
      <div className="intro-content">
        {/* Logo icon */}
        <div className="intro-logo" aria-hidden="true">
          <img src={MainLogoSmall} alt="" />
        </div>

        {/* Big condensed headline */}
        <h1 className="intro-headline">
          Expand your<br />network
        </h1>

        {/* CTA buttons */}
        <div className="intro-actions">
          <Button
            size="medium"
            type="secondary"
            label="Log in"
            onClick={goLogin}
          />
          <Button
            size="medium"
            type="primary"
            label="Create account"
            onClick={goSignup}
          />
        </div>
      </div>

      {/* Legal */}
      <p className="intro-legal">
        By continuing, you agree to Athlio's{" "}
        <span>Terms of Use</span>.
      </p>
    </div>
  );
}
