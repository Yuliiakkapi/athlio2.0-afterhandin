import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../components/UI/Button";
import "./intro.css";
import MainLogoSmall from "../assets/logos/main-logo-small.svg";
import FootballRun from "../assets/images/footballrun.png";
import BasketballPlayer from "../assets/images/basketballplayer.png";
import HockeyTeam from "../assets/images/hockeyteam.jpg";
import AmericanFootball from "../assets/images/americanfootball.jpg";

const slides = [
  { image: FootballRun,       headline: ["Expand your", "network"] },
  { image: BasketballPlayer,  headline: ["Track your", "progress"] },
  { image: HockeyTeam,        headline: ["Connect with", "clubs"] },
  { image: AmericanFootball,  headline: ["Grow your", "game"] },
];

const TRANSITION_MS = 220;

export default function Intro() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [fading, setFading] = useState(false);

  // Touch-swipe between slides
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    function onTouchStart(e) {
      if (!e.touches?.length) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
    function onTouchMove(e) {
      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);
      if (dx > 16 && dy < 24) e.preventDefault();
    }
    function onTouchEnd(e) {
      const dx = (e.changedTouches?.[0]?.clientX ?? startX) - startX;
      if (Math.abs(dx) < 40) return;
      changeSlide(dx > 0 ? -1 : 1);
    }

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [index]);

  function changeSlide(dir) {
    setFading(true);
    setPrevIndex(index);
    setIndex((i) => (i + dir + slides.length) % slides.length);
    setTimeout(() => setFading(false), TRANSITION_MS);
  }

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
      {/* Background image layers */}
      <div className="intro-bg">
        <div
          className={`intro-bg-layer${fading ? " fade-out" : " visible"}`}
          style={{ backgroundImage: `url(${slides[prevIndex].image})` }}
        />
        <div
          className={`intro-bg-layer${fading ? " visible" : " visible"}`}
          style={{ backgroundImage: `url(${slides[index].image})` }}
        />
        {/* Gradient overlay — dark at bottom, transparent at top */}
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
          {slides[index].headline.join(" ")}
        </h1>

        {/* CTA buttons */}
        <div className="intro-actions">
          <Button
            size="medium"
            type="outline"
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
