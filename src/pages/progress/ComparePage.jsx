import { X, Sparkle, CaretDown } from "@phosphor-icons/react";
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

export default function ComparePage() {
  const { profile } = useUser();
  const meImg = profile?.avatar_url || playerImg;

  return (
    <div className="cpv2-page">

      {/* ── Player Photos ─────────────────────────────────────────── */}
      <div className="cpv2-photos-row">
        <div className="cpv2-photo-slot cpv2-photo-slot--left">
          <div className="cpv2-photo-circle cpv2-photo-circle--shadow">
            <img src={meImg} alt="You" className="cpv2-photo-img" />
          </div>
          <div className="cpv2-ovr-wrap cpv2-ovr-wrap--right">
            <OvrBadge value={ME.ovr} variant="gold" size="md" />
          </div>
          <button className="cpv2-remove-btn cpv2-remove-btn--left">
            <X size={12} weight="bold" />
          </button>
        </div>

        <div className="cpv2-photo-slot cpv2-photo-slot--right">
          <div className="cpv2-photo-circle">
            <img src={OPPONENT.img} alt={OPPONENT.name} className="cpv2-photo-img" />
          </div>
          <div className="cpv2-ovr-wrap cpv2-ovr-wrap--left">
            <OvrBadge value={OPPONENT.ovr} variant="default" size="md" />
          </div>
          <button className="cpv2-remove-btn cpv2-remove-btn--right">
            <X size={12} weight="bold" />
          </button>
        </div>
      </div>

      {/* ── Player Info Card ──────────────────────────────────────── */}
      <div className="cpv2-info-card">
        <div className="cpv2-info-player">
          <div className="cpv2-name-row">
            <span className="cpv2-flag">{ME.flag}</span>
            <span className="cpv2-player-name">{ME.name}</span>
          </div>
          <div className="cpv2-badges-row">
            {ME.positions.map((p) => <Badge key={p} text={p} color="light" size="xs" />)}
          </div>
          <div className="cpv2-meta-row">
            <span className="cpv2-meta-text">{ME.club}</span>
            <span className="cpv2-dot" />
            <span className="cpv2-meta-text">{ME.age}y.o.</span>
          </div>
          <div className="cpv2-meta-row">
            <span className="cpv2-meta-text">{ME.foot}</span>
          </div>
        </div>

        <div className="cpv2-info-player cpv2-info-player--right">
          <div className="cpv2-name-row cpv2-name-row--right">
            <span className="cpv2-flag">{OPPONENT.flag}</span>
            <span className="cpv2-player-name">{OPPONENT.name}</span>
          </div>
          <div className="cpv2-badges-row cpv2-badges-row--right">
            {OPPONENT.positions.map((p) => <Badge key={p} text={p} color="light" size="xs" />)}
          </div>
          <div className="cpv2-meta-row cpv2-meta-row--right">
            <span className="cpv2-meta-text">{OPPONENT.club}</span>
            <span className="cpv2-dot" />
            <span className="cpv2-meta-text">{OPPONENT.age}y.o.</span>
          </div>
          <div className="cpv2-meta-row cpv2-meta-row--right">
            <span className="cpv2-meta-text">{OPPONENT.foot}</span>
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
            <StatRow key={key} label={label} left={ME.stats[key]} right={OPPONENT.stats[key]} fmt={fmt} />
          ))}
        </div>

        <div className="cpv2-section-divider">
          <span className="cpv2-section-label">Goals</span>
        </div>
        <div className="cpv2-section-body">
          {GOALS_STATS.map(({ key, label, fmt }) => (
            <StatRow key={key} label={label} left={ME.stats[key]} right={OPPONENT.stats[key]} fmt={fmt} />
          ))}
        </div>

        <div className="cpv2-section-divider">
          <span className="cpv2-section-label">Assists</span>
        </div>
        <div className="cpv2-section-body">
          {ASSISTS_STATS.map(({ key, label, fmt }) => (
            <StatRow key={key} label={label} left={ME.stats[key]} right={OPPONENT.stats[key]} fmt={fmt} />
          ))}
        </div>
      </div>

      {/* ── AI Suggestion ─────────────────────────────────────────── */}
      <div className="cpv2-ai-card">
        <div className="cpv2-ai-icon">
          <Sparkle size={24} color="white" weight="fill" />
        </div>
        <p className="cpv2-ai-text">
          Emil Bryld overall is showing bigger potential this season. However he has also less matches played and that means less experience.
        </p>
      </div>

      {/* ── Export Button ─────────────────────────────────────────── */}
      <button className="cpv2-export-btn">
        Export a Scouting Report
      </button>

    </div>
  );
}
