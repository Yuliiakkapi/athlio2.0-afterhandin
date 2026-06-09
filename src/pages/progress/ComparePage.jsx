import { useState } from "react";
import { X, Sparkle, CaretDown, Plus } from "@phosphor-icons/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import OvrBadge from "../../components/UI/OvrBadge";
import Badge from "../../components/UI/Badge";
import playerImg from "../../assets/images/player.jpg";
import haalandImg from "../../assets/images/haalandcompare.png";
import "./ComparePage.css";

const ME = {
  name: "Emil Jensen Bryld",
  flag: "🇩🇰",
  positions: ["ST", "CAM"],
  club: "Real Madrid",
  age: 18,
  foot: "Right foot",
  ovr: 72,
  stats: {
    matches: 22, minutes: 1320, winPct: 65, matchesStarted: 18,
    goals: 14, gpm: 1.2, goalsPerMin: 1.2,
    assists: 14, assistsPerMatch: 1.2, assistsPerMin: 1.2,
  },
};

const OPPONENT = {
  name: "Ahmed Hataili",
  flag: "🇩🇰",
  positions: ["ST", "CAM"],
  club: "Real Madrid",
  age: 18,
  foot: "Right foot",
  ovr: 65,
  img: haalandImg,
  stats: {
    matches: 42, minutes: 1260, winPct: 54, matchesStarted: 14,
    goals: 14, gpm: 1.2, goalsPerMin: 1.2,
    assists: 26, assistsPerMatch: 1.2, assistsPerMin: 1.2,
  },
};

const SEASON_STATS = [
  { key: "matches", label: "matches" },
  { key: "minutes", label: "minutes" },
  { key: "winPct", label: "%WIN", fmt: (v) => `${v}%` },
  { key: "matchesStarted", label: "matches started" },
];

const GOALS_STATS = [
  { key: "goals", label: "goals" },
  { key: "gpm", label: "GPM" },
  { key: "goalsPerMin", label: "Goals per minute" },
];

const ASSISTS_STATS = [
  { key: "assists", label: "Assists" },
  { key: "assistsPerMatch", label: "assists Per Match" },
  { key: "assistsPerMin", label: "Assists per minute" },
];

function StatRow({ label, left, right, fmt }) {
  const format = fmt || String;
  const leftWins = left > right;
  const rightWins = right > left;
  const maxVal = Math.max(left, right) || 1;
  const leftPct = Math.round((left / maxVal) * 100);
  const rightPct = Math.round((right / maxVal) * 100);

  return (
    <div className="cpv2-stat-row">
      <div className="cpv2-stat-values">
        <span className={`cpv2-stat-num${leftWins ? " cpv2-num--win" : " cpv2-num--lose"}`}>
          {format(left)}
        </span>
        <span className="cpv2-stat-label">{label}</span>
        <span className={`cpv2-stat-num cpv2-stat-num--right${rightWins ? " cpv2-num--win" : " cpv2-num--lose"}`}>
          {format(right)}
        </span>
      </div>
      <div className="cpv2-bars">
        <div className="cpv2-bar-half cpv2-bar-half--left">
          <div
            className={`cpv2-bar-fill${leftWins ? " cpv2-bar--win" : " cpv2-bar--lose"}`}
            style={{ width: `${leftPct}%` }}
          />
        </div>
        <div className="cpv2-bar-half cpv2-bar-half--right">
          <div
            className={`cpv2-bar-fill${rightWins ? " cpv2-bar--win" : " cpv2-bar--lose"}`}
            style={{ width: `${rightPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

const EMPTY_PLAYER = {
  name: "—",
  flag: "",
  positions: [],
  club: "",
  age: null,
  foot: "—",
  ovr: 0,
  img: null,
  initials: "?",
  stats: {
    matches: 0, minutes: 0, winPct: 0, matchesStarted: 0,
    goals: 0, gpm: 0, goalsPerMin: 0,
    assists: 0, assistsPerMatch: 0, assistsPerMin: 0,
  },
};

function seedNum(idStr, salt, min, max) {
  let s = (idStr + salt).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  s = (s * 1664525 + 1013904223) & 0xffffffff;
  return Math.round(min + ((s >>> 0) / 0xffffffff) * (max - min));
}

function fromWatchlistPlayer(p) {
  const id = p.id ?? p.name ?? "x";
  const matches         = seedNum(id, "m",  18, 38);
  const matchesStarted  = seedNum(id, "ms", Math.round(matches * 0.5), matches);
  const minutes         = matchesStarted * seedNum(id, "min", 70, 90);
  const goals           = seedNum(id, "g",  4, 22);
  const assists         = seedNum(id, "a",  3, 18);
  const winPct          = seedNum(id, "w",  30, 72);
  const gpm             = parseFloat((goals / matches).toFixed(2));
  const goalsPerMin     = parseFloat((goals / (minutes || 1)).toFixed(3));
  const assistsPerMatch = parseFloat((assists / matches).toFixed(2));
  const assistsPerMin   = parseFloat((assists / (minutes || 1)).toFixed(3));

  return {
    name: p.name,
    flag: "🏴",
    positions: (p.positions ?? [p.position].filter(Boolean)),
    club: p.club || "",
    age: p.age || null,
    foot: seedNum(id, "foot", 0, 1) ? "Right foot" : "Left foot",
    ovr: p.ovr || 0,
    img: p.avatarUrl || null,
    initials: p.initials || p.name?.[0] || "?",
    stats: {
      matches, minutes, winPct, matchesStarted,
      goals, gpm, goalsPerMin,
      assists, assistsPerMatch, assistsPerMin,
    },
  };
}

export default function ComparePage() {
  const { profile } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const meImg = profile?.avatar_url || playerImg;

  const { player, playerA: initA, playerB: initB } = location.state || {};
  const isWatchlistCompare = !!(initA || initB);

  const [rawLeft,  setRawLeft]  = useState(initA ?? null);
  const [rawRight, setRawRight] = useState(initB ?? player ?? null);

  const leftPlayer = rawLeft ? fromWatchlistPlayer(rawLeft) : (isWatchlistCompare ? EMPTY_PLAYER : ME);
  const leftImg    = isWatchlistCompare ? (leftPlayer.img || null) : meImg;

  const opponent   = rawRight ? fromWatchlistPlayer(rawRight) : (isWatchlistCompare ? EMPTY_PLAYER : OPPONENT);

  const leftEmpty  = isWatchlistCompare && !rawLeft;
  const rightEmpty = opponent.name === "—";

  function handleFillSlot(slot) {
    navigate("/scouting/watchlist", {
      state: {
        compareMode: true,
        slot,
        fixedPlayer: slot === "right" ? rawLeft : rawRight,
      },
    });
  }

  return (
    <div className="cpv2-page">

      {/* ── Player Photos ─────────────────────────────────────────── */}
      <div className="cpv2-photos-row">
        <div className="cpv2-photo-slot cpv2-photo-slot--left">
          <div
            className={`cpv2-photo-circle cpv2-photo-circle--shadow${leftEmpty ? " cpv2-photo-circle--empty" : ""}`}
            onClick={leftEmpty ? () => handleFillSlot("left") : undefined}
            role={leftEmpty ? "button" : undefined}
            tabIndex={leftEmpty ? 0 : undefined}
          >
            {leftEmpty
              ? <Plus size={36} weight="bold" className="cpv2-plus-icon" />
              : leftImg
              ? <img src={leftImg} alt={leftPlayer.name} className="cpv2-photo-img" />
              : <span className="cpv2-photo-initials">{leftPlayer.initials}</span>
            }
          </div>
          {!leftEmpty && (
            <div className="cpv2-ovr-wrap cpv2-ovr-wrap--right">
              <OvrBadge value={leftPlayer.ovr} variant="gold" size="md" />
            </div>
          )}
          {!leftEmpty && isWatchlistCompare && (
            <button className="cpv2-remove-btn cpv2-remove-btn--left" onClick={() => setRawLeft(null)}>
              <X size={12} weight="bold" />
            </button>
          )}
        </div>

        <div className="cpv2-photo-slot cpv2-photo-slot--right">
          <div
            className={`cpv2-photo-circle${rightEmpty ? " cpv2-photo-circle--empty" : ""}`}
            onClick={rightEmpty ? () => handleFillSlot("right") : undefined}
            role={rightEmpty ? "button" : undefined}
            tabIndex={rightEmpty ? 0 : undefined}
          >
            {rightEmpty
              ? <Plus size={36} weight="bold" className="cpv2-plus-icon" />
              : opponent.img
              ? <img src={opponent.img} alt={opponent.name} className="cpv2-photo-img" />
              : <span className="cpv2-photo-initials">{opponent.initials}</span>
            }
          </div>
          {!rightEmpty && (
            <div className="cpv2-ovr-wrap cpv2-ovr-wrap--left">
              <OvrBadge value={opponent.ovr} variant="default" size="md" />
            </div>
          )}
          {!rightEmpty && (
            <button className="cpv2-remove-btn cpv2-remove-btn--right" onClick={() => setRawRight(null)}>
              <X size={12} weight="bold" />
            </button>
          )}
        </div>
      </div>

      {/* ── Player Info Card ──────────────────────────────────────── */}
      <div className="cpv2-info-card">
        <div className="cpv2-info-player">
          <div className="cpv2-name-row">
            <span className="cpv2-flag">{leftPlayer.flag}</span>
            <span className="cpv2-player-name">{leftPlayer.name}</span>
          </div>
          <div className="cpv2-badges-row">
            {leftPlayer.positions.map((p) => <Badge key={p} text={p} color="light" size="xs" />)}
          </div>
          <div className="cpv2-meta-row">
            {leftPlayer.club && <span className="cpv2-meta-text">{leftPlayer.club}</span>}
            {leftPlayer.club && leftPlayer.age && <span className="cpv2-dot" />}
            {leftPlayer.age && <span className="cpv2-meta-text">{leftPlayer.age}y.o.</span>}
          </div>
          <div className="cpv2-meta-row">
            <span className="cpv2-meta-text">{leftPlayer.foot}</span>
          </div>
        </div>

        <div className="cpv2-info-player cpv2-info-player--right">
          <div className="cpv2-name-row cpv2-name-row--right">
            <span className="cpv2-flag">{opponent.flag}</span>
            <span className="cpv2-player-name">{opponent.name}</span>
          </div>
          <div className="cpv2-badges-row cpv2-badges-row--right">
            {opponent.positions.map((p) => <Badge key={p} text={p} color="light" size="xs" />)}
          </div>
          <div className="cpv2-meta-row cpv2-meta-row--right">
            {opponent.club && <span className="cpv2-meta-text">{opponent.club}</span>}
            {opponent.club && opponent.age && <span className="cpv2-dot" />}
            {opponent.age && <span className="cpv2-meta-text">{opponent.age}y.o.</span>}
          </div>
          <div className="cpv2-meta-row cpv2-meta-row--right">
            <span className="cpv2-meta-text">{opponent.foot}</span>
          </div>
        </div>
      </div>

      {/* ── Stats Card ────────────────────────────────────────────── */}
      <div className="cpv2-stats-card">
        <div className="cpv2-season-hdr">
          <span className="cpv2-season-hdr-text">Season 2025/26</span>
          <CaretDown size={16} />
        </div>

        <div className="cpv2-section-body">
          {SEASON_STATS.map(({ key, label, fmt }) => (
            <StatRow key={key} label={label} left={leftPlayer.stats[key]} right={opponent.stats[key]} fmt={fmt} />
          ))}
        </div>

        <div className="cpv2-section-divider">
          <span className="cpv2-section-label">Goals</span>
        </div>
        <div className="cpv2-section-body">
          {GOALS_STATS.map(({ key, label, fmt }) => (
            <StatRow key={key} label={label} left={leftPlayer.stats[key]} right={opponent.stats[key]} fmt={fmt} />
          ))}
        </div>

        <div className="cpv2-section-divider">
          <span className="cpv2-section-label">Assists</span>
        </div>
        <div className="cpv2-section-body">
          {ASSISTS_STATS.map(({ key, label, fmt }) => (
            <StatRow key={key} label={label} left={leftPlayer.stats[key]} right={opponent.stats[key]} fmt={fmt} />
          ))}
        </div>
      </div>

      {/* ── AI Suggestion ─────────────────────────────────────────── */}
      <div className="cpv2-ai-card">
        <div className="cpv2-ai-icon">
          <Sparkle size={24} color="white" weight="fill" />
        </div>
        <p className="cpv2-ai-text">
          Emil Bryld overall is showing bigger potential this season compared to {opponent.name}. However he has also less matches played and that means less experience.
        </p>
      </div>

      {/* ── Export Button ─────────────────────────────────────────── */}
      <button className="cpv2-export-btn">
        Export a Scouting Report
      </button>

    </div>
  );
}
