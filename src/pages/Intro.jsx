import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../components/UI/Button";
import "./intro.css";
import MainLogoSmall from "../assets/logos/main-logo-small.svg";
import BasketballPlayer from "../assets/images/basketballplayer.png";
import FootballRun from "../assets/images/footballrun.png";
import HockeyTeam from "../assets/images/hockeyteam.jpg";
import AmericanFootball from "../assets/images/americanfootball.jpg";
import { supabase } from "../lib/supabase";
import GoogleIcon from "../assets/icons/google.svg?react";

// Intro (preboarding) page based on Figma node 2396:15993
// Reuses existing Button component and Barlow font tokens.
export default function Intro() {
  const navigate = useNavigate();
  // Second slide now fixed to basketballplayer.png asset (no dynamic override fallback)

  // Slides updated per request: 1=footballrun, 2=basketball player, 3=hockey team, 4=american football
  const slides = [
    {
      image: FootballRun,
      lines: ["Every athlete trains", "with a dream to", "grow"],
      subtitle: "Your journey to sports excellence starts here.",
    },
    {
      image: BasketballPlayer,
      lines: ["Turn effort into", "performance", "insights"],
      subtitle: "Track progress with real-time analytics.",
    },
    {
      image: HockeyTeam,
      lines: ["Connect with", "clubs and", "talent"],
      subtitle: "Build your sports network faster.",
    },
    {
      image: AmericanFootball,
      lines: ["Grow your", "game with", "community"],
      subtitle: "Join athletes pushing boundaries.",
    },
  ];

  const TRANSITION_MS = 200; // crossfade duration (Figma ease-out 200ms)
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isCrossfading, setIsCrossfading] = useState(false);

  // Emphasis word rotation for first slide only
  const emphWords = ["grow", "improve", "excel"]; // you can tweak words here
  const WORD_INTERVAL = 2000; // ms
  const [wordIndex, setWordIndex] = useState(0);
  const [prevWordIndex, setPrevWordIndex] = useState(0);
  const [isWordFading, setIsWordFading] = useState(false);

  // Auto-advance disabled: slides change only via touch swipe or future controls

  // Rotate emphasis word only on first slide
  useEffect(() => {
    if (index !== 0) return; // active on first slide only
    const tick = () => {
      setIsWordFading(true);
      setPrevWordIndex((p) => wordIndex);
      const switchId = setTimeout(() => {
        setWordIndex((w) => (w + 1) % emphWords.length);
      }, 60);
      const endId = setTimeout(
        () => setIsWordFading(false),
        60 + TRANSITION_MS + 20,
      );
      return () => {
        clearTimeout(switchId);
        clearTimeout(endId);
      };
    };
    const intervalId = setInterval(tick, WORD_INTERVAL);
    return () => clearInterval(intervalId);
  }, [index, wordIndex, emphWords.length]);

  // Touch swipe navigation for mobile
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let dragging = false;
    const root = document.querySelector(".intro-hero");
    if (!root) return;

    function onTouchStart(e) {
      if (!e.touches || e.touches.length === 0) return;
      dragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
    function onTouchMove(e) {
      // prevent vertical scroll capture only if horizontal intent is strong
      if (!dragging) return;
      const dx = e.touches[0].clientX - startX;
      const dy = Math.abs(e.touches[0].clientY - startY);
      if (Math.abs(dx) > 16 && dy < 24) {
        e.preventDefault();
      }
    }
    function onTouchEnd(e) {
      if (!dragging) return;
      dragging = false;
      const endX = (e.changedTouches && e.changedTouches[0]?.clientX) || startX;
      const dx = endX - startX;
      const threshold = 40; // px
      if (dx > threshold) {
        // swipe right -> previous
        setIsCrossfading(true);
        setPrevIndex(index);
        setIndex((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsCrossfading(false), TRANSITION_MS);
      } else if (dx < -threshold) {
        // swipe left -> next
        setIsCrossfading(true);
        setPrevIndex(index);
        setIndex((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsCrossfading(false), TRANSITION_MS);
      }
    }

    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    root.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
    };
  }, [index, slides.length, TRANSITION_MS]);

  function goEmail() {
    localStorage.setItem("introSeen", "true");
    navigate("/auth");
  }

  function goGoogle() {
    // Trigger same Google OAuth flow as on the Auth screen
    const OAUTH_REDIRECT = window.location.origin + "/auth/callback";
    localStorage.setItem("introSeen", "true");
    supabase.auth
      .signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: OAUTH_REDIRECT,
          queryParams: { prompt: "select_account" },
        },
      })
      .then(({ error }) => {
        if (error) navigate("/auth");
      });
  }

  return (
    <div className={`intro-root${isCrossfading ? " is-crossfading" : ""}`}>
      <div className="intro-hero">
        <div className="intro-hero-layers">
          <div
            className={`intro-hero-layer intro-hero-layer--prev${isCrossfading ? " fade-out" : ""}`}
            style={{ backgroundImage: `url(${slides[prevIndex].image})` }}
          />
          <div
            className={`intro-hero-layer intro-hero-layer--curr${isCrossfading ? " fade-in" : " visible"}`}
            style={{
              backgroundImage: `url(${slides[index].image})`,
              transitionTimingFunction: "ease-in-out",
            }}
          />
        </div>
        <div className="intro-overlay" />
        {/* Progress bar */}
        <div
          className="intro-progress"
          aria-label={`Slide ${index + 1} of ${slides.length}`}
        >
          {slides.map((_, i) => (
            <div
              key={i}
              className={`intro-progress-item${i === index ? " is-active" : ""}${i < index ? " is-done" : ""}`}
            />
          ))}
        </div>
        {/* Heading */}
        <div className="intro-heading">
          <div className="intro-logo" aria-hidden="true">
            <img src={MainLogoSmall} alt="" />
          </div>
          <h1 className="intro-title">
            {index === 0 ? (
              <>
                <span>Every athlete trains</span>
                <div className="intro-line">
                  <span className="intro-title-break">with a dream to</span>
                  <span
                    className="intro-title-em intro-emph"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <span
                      key={`prev-${prevWordIndex}`}
                      className={`intro-emph-layer intro-emph-layer--prev${isWordFading ? " fade-out" : ""}`}
                    >
                      {emphWords[prevWordIndex]}
                    </span>
                    <span
                      key={`curr-${wordIndex}`}
                      className={`intro-emph-layer intro-emph-layer--curr${isWordFading ? " fade-in" : " visible"}`}
                    >
                      {emphWords[wordIndex]}
                    </span>
                  </span>
                </div>
              </>
            ) : (
              <span className="intro-title-block">
                {slides[index].lines.join(" ")}
              </span>
            )}
          </h1>
          <p className="intro-sub">{slides[index].subtitle}</p>
        </div>
      </div>

      <div className="intro-actions">
        <Button
          size="medium"
          type="primary"
          label="Continue with email"
          onClick={goEmail}
        />
        <Button
          size="medium"
          type="outline"
          label="Google"
          onClick={goGoogle}
          Icon={GoogleIcon}
        />
      </div>
      <p className="intro-legal">
        By continuing, you agree to Athlio’s <span>Terms of Use</span>.
      </p>
    </div>
  );
}
