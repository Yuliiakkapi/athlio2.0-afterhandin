import { useRef, useState, useEffect, useCallback } from "react";
import "./PlayingStyle.css";
import courtoisImg from "../../../assets/images/playing-styles/player-courtois.jpg";
import neuerImg from "../../../assets/images/playing-styles/player-neuer.jpg";
import ibrahimovicImg from "../../../assets/images/playing-styles/ibrahimovic.png";
import firminoImg from "../../../assets/images/playing-styles/Firmino.png";
import silvaImg from "../../../assets/images/playing-styles/Silva.png";
import salahImg from "../../../assets/images/playing-styles/Salah.png";
import rashfordImg from "../../../assets/images/playing-styles/rashford.webp";
import debruyneImg from "../../../assets/images/playing-styles/debruyne.webp";
import dybalzImg from "../../../assets/images/playing-styles/dybala.png";
import kimmichImg from "../../../assets/images/playing-styles/joshua_kimmich.avif";
import xaviImg from "../../../assets/images/playing-styles/xavi.jpg";
import kanteImg from "../../../assets/images/playing-styles/kante.webp";
import mataImg from "../../../assets/images/playing-styles/Juan Mata.webp";
import zahaImg from "../../../assets/images/playing-styles/Zaha.png";
import robertsonImg from "../../../assets/images/playing-styles/Robertson.webp";
import trentImg from "../../../assets/images/playing-styles/Trent.png";
import gustoImg from "../../../assets/images/playing-styles/Gusto.webp";
import diasImg from "../../../assets/images/playing-styles/Dias.webp";
import dijkImg from "../../../assets/images/playing-styles/Dijk.webp";
import hummelsImg from "../../../assets/images/playing-styles/hummels.webp";

const CARD_W = 290;
const CARD_GAP = 16;

/* ──────────────────────────────────────────────────────────────────
   Playing styles data — position-specific where images exist,
   generic fallbacks for other positions.
────────────────────────────────────────────────────────────────── */
const ALL_STYLES = [
  // ── Goalkeeper ──────────────────────────────────────────────────
  {
    id: "shot-stopper",
    label: "Shot-stopper",
    positions: ["gk"],
    playerName: "Thibaut Courtois",
    image: courtoisImg,
    bg: null,
    description:
      "You play on the line and build your game around reflexes, positioning, and keeping the ball out above everything else.",
  },
  {
    id: "sweeper-keeper",
    label: "Sweeper-keeper",
    positions: ["gk"],
    playerName: "Manuel Neuer",
    image: neuerImg,
    bg: null,
    description:
      "You rush off the line early, are comfortable with the ball at your feet, and act as an extra outfield player behind the defence.",
  },
  // ── Strikers ────────────────────────────────────────────────────
  {
    id: "target-man",
    label: "Target man",
    positions: ["st"],
    playerName: "Zlatan Ibrahimović",
    image: ibrahimovicImg,
    bg: null,
    description:
      "You hold the ball up, win aerial duels, and bring teammates into play. Physical presence is your most dangerous weapon.",
  },
  {
    id: "false-nine",
    label: "False 9",
    positions: ["st"],
    playerName: "Roberto Firmino",
    image: firminoImg,
    bg: null,
    description:
      "You drop deep to receive, link play between midfield and attack, and create space for others to run into.",
  },
  // ── Wingers (L/RW) ──────────────────────────────────────────────
  {
    id: "creative-wide-player",
    label: "Creative wide player",
    positions: ["lw", "rw"],
    playerName: "Bernardo Silva",
    image: silvaImg,
    bg: null,
    description:
      "You drop deeper to receive, combine quickly, and unlock defences with passing rather than direct running.",
  },
  {
    id: "inverted-winger",
    label: "Inverted winger",
    positions: ["lw", "rw"],
    playerName: "Mohamed Salah",
    image: salahImg,
    bg: null,
    description:
      "You start wide and cut inside onto your stronger foot, always looking to shoot or play through balls centrally.",
  },
  {
    id: "traditional-winger",
    label: "Traditional winger",
    positions: ["lw", "rw"],
    playerName: "Marcus Rashford",
    image: rashfordImg,
    bg: null,
    description:
      "You hug the line and deliver pinpoint crosses from the byline. Pure wingers with pace and the ability to beat defenders one-on-one.",
  },
  // ── CAM ──────────────────────────────────────────────────────────
  {
    id: "playmaker",
    label: "Playmaker",
    positions: ["cam"],
    playerName: "Kevin De Bruyne",
    image: debruyneImg,
    bg: null,
    description:
      "Key passes, through balls, and assists are your currency. You unlock defences with vision others simply don't possess.",
  },
  {
    id: "shadow-striker",
    label: "Shadow striker",
    positions: ["cam"],
    playerName: "Paulo Dybala",
    image: dybalzImg,
    bg: null,
    description:
      "You drift between the lines, making late runs into the box and finishing chances. Creativity meets goal-scoring threat.",
  },
  // ── CDM ──────────────────────────────────────────────────────────
  {
    id: "box-to-box",
    label: "Box to box",
    positions: ["cdm"],
    playerName: "Joshua Kimmich",
    image: kimmichImg,
    bg: null,
    description:
      "You cover every blade of grass. Defensively solid and dangerous going forward — you're everywhere on the pitch.",
  },
  {
    id: "progressive-passer",
    label: "Progressive passer",
    positions: ["cdm"],
    playerName: "Xavi Hernández",
    image: xaviImg,
    bg: null,
    description:
      "You advance play from deep with accurate, incisive passing. Building attacks from the back is your primary role.",
  },
  {
    id: "ball-winner-cdm",
    label: "Ball winner",
    positions: ["cdm"],
    playerName: "N'Golo Kanté",
    image: kanteImg,
    bg: null,
    description:
      "Tackles, interceptions, and tireless pressing define you. You suffocate opponents and win the ball back repeatedly.",
  },
  // ── Wide Midfielders (L/RM) ──────────────────────────────────────
  {
    id: "creative-wide-midfielder",
    label: "Creative wide midfielder",
    positions: ["lm", "rm"],
    playerName: "Juan Mata",
    image: mataImg,
    bg: null,
    description:
      "You operate from the wing with creativity and technical prowess, creating chances and controlling the rhythm of play.",
  },
  {
    id: "direct-wide-player",
    label: "Direct wide player",
    positions: ["lm", "rm"],
    playerName: "Wilfried Zaha",
    image: zahaImg,
    bg: null,
    description:
      "Pace and directness are your calling cards. You take on defenders and create chaos in the opposition penalty box.",
  },
  // ── Fullbacks (L/RB) ─────────────────────────────────────────────
  {
    id: "attacking-fullback",
    label: "Attacking fullback",
    positions: ["lb", "rb"],
    playerName: "Andrew Robertson",
    image: robertsonImg,
    bg: null,
    description:
      "You bomb forward to support attacks and deliver crosses. Offensive contribution is as important as defensive solidity.",
  },
  {
    id: "inverted-fullback",
    label: "Inverted fullback",
    positions: ["lb", "rb"],
    playerName: "Trent Alexander-Arnold",
    image: trentImg,
    bg: null,
    description:
      "You cut inside onto your strong foot to create from deep positions. You're as comfortable playing in midfield as in defence.",
  },
  {
    id: "defensive-fullback",
    label: "Defensive fullback",
    positions: ["lb", "rb"],
    playerName: "Malo Gusto",
    image: gustoImg,
    bg: null,
    description:
      "You focus on defensive discipline and one-on-one battles. Responsibility and solidity define your defensive approach.",
  },
  // ── Centre-backs (CB) ────────────────────────────────────────────
  {
    id: "ball-playing-defender",
    label: "Ball-playing defender",
    positions: ["cb"],
    playerName: "Rüben Dias",
    image: diasImg,
    bg: null,
    description:
      "You're comfortable with the ball at your feet. You start attacks from the back with composure and confident distribution.",
  },
  {
    id: "aggressive-defender",
    label: "Aggressive defender",
    positions: ["cb"],
    playerName: "Virgil van Dijk",
    image: dijkImg,
    bg: null,
    description:
      "Tackles, interceptions, and physicality define you. You win duels and put opponents under constant pressure throughout the game.",
  },
  {
    id: "defensive-organiser",
    label: "Defensive organiser",
    positions: ["cb"],
    playerName: "Mats Hummels",
    image: hummelsImg,
    bg: null,
    description:
      "Your leadership and positioning are unmatched. You organize the defence, read the game, and make crucial interceptions.",
  },
];

function getStylesForPositions(positions) {
  if (!Array.isArray(positions) || positions.length === 0) return ALL_STYLES;
  const filtered = ALL_STYLES.filter((s) =>
    s.positions.some((p) => positions.includes(p))
  );
  return filtered.length > 0 ? filtered : ALL_STYLES;
}

export default function PlayingStyle({ value, onChange, positions }) {
  const scrollRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const styles = getStylesForPositions(positions);

  // Initialise with the first style on mount / when styles change
  useEffect(() => {
    if (styles.length > 0) {
      const initIdx = Math.max(
        0,
        styles.findIndex((s) => s.id === value)
      );
      setActiveIdx(initIdx);
      onChange(styles[initIdx].id);

      // Scroll to the initial card without animation
      const el = scrollRef.current;
      if (el && initIdx > 0) {
        el.scrollLeft = initIdx * (CARD_W + CARD_GAP);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styles.length]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const raw = el.scrollLeft / (CARD_W + CARD_GAP);
    const idx = Math.max(0, Math.min(Math.round(raw), styles.length - 1));
    if (idx !== activeIdx) {
      setActiveIdx(idx);
      onChange(styles[idx].id);
    }
  }, [activeIdx, styles, onChange]);

  const active = styles[activeIdx] || styles[0];

  return (
    <div className="style-step">
      {/* Header */}
      <div className="style-header">
        <h1 className="style-title">Your playing style</h1>
        <p className="style-subtitle">
          Choose the one that best describes your game.
        </p>
      </div>

      {/* Active style badge */}
      <div className="style-badge-wrap">
        <span className="style-badge">{active?.label}</span>
      </div>

      {/* Horizontal carousel */}
      <div
        className="style-carousel"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {styles.map((s, i) => (
          <div
            key={s.id}
            className={`style-card${i === activeIdx ? " style-card--active" : ""}`}
            onClick={() => {
              const el = scrollRef.current;
              if (el) el.scrollTo({ left: i * (CARD_W + CARD_GAP), behavior: "smooth" });
            }}
          >
            {/* Image or gradient placeholder */}
            {s.image ? (
              <img
                src={s.image}
                alt={s.playerName}
                className="style-card-img"
              />
            ) : (
              <div
                className="style-card-placeholder"
                style={{ background: s.bg || "linear-gradient(180deg, #1a2a4a 0%, #2a4a8a 70%)" }}
              />
            )}

            {/* Bottom fade overlay */}
            <div className="style-card-fade" />

            {/* Player name */}
            <p className="style-card-name">{s.playerName}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      {active && (
        <div className="style-desc">
          <p className="text-base-regular">{active.description}</p>
        </div>
      )}
    </div>
  );
}
