import { useRef, useState, useEffect, useCallback } from "react";
import "./PlayingStyle.css";
import courtoisImg from "../../../assets/images/player-courtois.jpg";
import neuerImg from "../../../assets/images/player-neuer.jpg";

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
      "You're not afraid to leave your area. You read the game early, sweep up loose balls, and act as an extra outfield player.",
  },
  // ── Defenders ───────────────────────────────────────────────────
  {
    id: "ball-playing-defender",
    label: "Ball-playing defender",
    positions: ["cb", "lb", "rb"],
    playerName: "Virgil van Dijk",
    image: null,
    bg: "linear-gradient(180deg, #0a2a4a 0%, #1a5080 70%)",
    description:
      "You're comfortable with the ball at your feet. You start attacks from the back with composure and confident distribution.",
  },
  {
    id: "aggressive-defender",
    label: "Aggressive defender",
    positions: ["cb", "lb", "rb", "cdm"],
    playerName: "Marquinhos",
    image: null,
    bg: "linear-gradient(180deg, #2a0a0a 0%, #6a1a1a 70%)",
    description:
      "Tackles, interceptions, and physicality define you. You win duels and put opponents under constant pressure throughout the game.",
  },
  // ── Midfielders ─────────────────────────────────────────────────
  {
    id: "box-to-box",
    label: "Box-to-box",
    positions: ["cm", "lm", "rm", "cdm"],
    playerName: "N'Golo Kanté",
    image: null,
    bg: "linear-gradient(180deg, #0a2a1a 0%, #1a6a3a 70%)",
    description:
      "You cover every blade of grass. Defensively solid and dangerous going forward — you're everywhere on the pitch.",
  },
  {
    id: "deep-lying-playmaker",
    label: "Deep-lying playmaker",
    positions: ["cdm", "cm"],
    playerName: "Luka Modrić",
    image: null,
    bg: "linear-gradient(180deg, #1a0a2a 0%, #4a1a7a 70%)",
    description:
      "The game flows through you. You dictate the tempo, recycle possession, and always find the right pass under pressure.",
  },
  {
    id: "creative-playmaker",
    label: "Creative playmaker",
    positions: ["cam", "cm", "lm", "rm"],
    playerName: "Kevin De Bruyne",
    image: null,
    bg: "linear-gradient(180deg, #0a1a3a 0%, #1a3a8a 70%)",
    description:
      "Key passes, through balls, and assists are your currency. You unlock defences with vision others simply don't possess.",
  },
  // ── Attackers ───────────────────────────────────────────────────
  {
    id: "dribbler",
    label: "Dribbler",
    positions: ["lw", "rw", "cam", "lm", "rm"],
    playerName: "Kylian Mbappé",
    image: null,
    bg: "linear-gradient(180deg, #1a1a0a 0%, #5a5a1a 70%)",
    description:
      "Pace, quick feet, and taking on defenders one-on-one. You turn individual brilliance into match-winning moments.",
  },
  {
    id: "target-man",
    label: "Target man",
    positions: ["st", "lw", "rw"],
    playerName: "Olivier Giroud",
    image: null,
    bg: "linear-gradient(180deg, #2a1a0a 0%, #7a4a1a 70%)",
    description:
      "You hold the ball up, win aerial duels, and bring teammates into play. Physical presence is your most dangerous weapon.",
  },
  {
    id: "poacher",
    label: "Poacher",
    positions: ["st", "cam"],
    playerName: "Erling Haaland",
    image: null,
    bg: "linear-gradient(180deg, #0a2a2a 0%, #1a6a6a 70%)",
    description:
      "You live in the box. Clinical, sharp, and always in the right place at the right time to put the ball in the net.",
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
          <p>{active.description}</p>
        </div>
      )}
    </div>
  );
}
