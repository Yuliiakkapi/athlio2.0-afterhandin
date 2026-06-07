import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FootballPitch from "../assets/graphics/football_pitch.svg";
import { useUser } from "../context/UserContext";
import ProUpgradeCard from "../components/domain/Progress-athletes/ProUpgradeCard";
import "./scout-tools.css";

const WATCHLIST_PLAYERS = [
  { id: 1, name: "J. Santos", position: "FW", a: 3, g: 8, rating: "7.4", ovr: 68 },
  { id: 2, name: "M. Rodriguez", position: "CM", a: 5, g: 2, rating: "6.9", ovr: 62 },
];

const SUGGESTED_PLAYERS = [
  {
    id: 1,
    name: "Emil Jonansen Bryld",
    positions: ["ST", "LW"],
    club: "AC Milan U21",
    age: 20,
    stats: [{ value: "1.2", label: "GPM" }, { value: "0.8", label: "APM" }, { value: "4.3", label: "SHT" }],
    ovr: 72,
  },
  {
    id: 2,
    name: "Omar Diallo",
    positions: ["CAM"],
    club: "Stade Rennais",
    age: 21,
    stats: [{ value: "0.7", label: "GPM" }, { value: "1.1", label: "APM" }, { value: "3.1", label: "SHT" }],
    ovr: 69,
  },
  {
    id: 3,
    name: "Tomáš Dvořák",
    positions: ["CM"],
    club: "Sparta Prague",
    age: 22,
    stats: [{ value: "0.4", label: "GPM" }, { value: "0.9", label: "APM" }, { value: "2.2", label: "SHT" }],
    ovr: 71,
  },
  {
    id: 4,
    name: "Pierre Nkumu",
    positions: ["CB"],
    club: "RB Leipzig",
    age: 19,
    stats: [{ value: "0.1", label: "GPM" }, { value: "0.2", label: "APM" }, { value: "1.0", label: "SHT" }],
    ovr: 67,
  },
];

const LEADERBOARD_ROWS = [
  { rank: 1, name: "Carlos Vega", position: "ST", club: "Valencia CF", ovr: 56 },
  { rank: 2, name: "Yusuf Adeyemi", position: "CM", club: "Ferencváros", ovr: 55 },
  { rank: 3, name: "Niklas Braun", position: "CB", club: "VfB Stuttgart", ovr: 54 },
  { rank: 4, name: "André Ferreira", position: "GK", club: "Sporting CP", ovr: 52 },
];

const AI_CHIPS = [
  "Find me a CAM under 23",
  "Best strikers in Liga 1",
  "Left-footed CB, tall",
  "Fast wingers, top dribbles",
  "Midfielders with high pass%",
];

const POSITIONS_ON_PITCH = [
  { id: "gk", label: "GK", top: "82%", left: "50%" },
  { id: "lb", label: "LB", top: "64%", left: "20%" },
  { id: "cb1", label: "CB", top: "64%", left: "39%" },
  { id: "cb2", label: "CB", top: "64%", left: "61%" },
  { id: "rb", label: "RB", top: "64%", left: "80%" },
  { id: "cm1", label: "CM", top: "44%", left: "30%" },
  { id: "cm2", label: "CM", top: "44%", left: "50%" },
  { id: "cm3", label: "CM", top: "44%", left: "70%" },
  { id: "lw", label: "LW", top: "24%", left: "20%" },
  { id: "st", label: "ST", top: "20%", left: "50%" },
  { id: "rw", label: "RW", top: "24%", left: "80%" },
];

export default function ScoutTools() {
  const { profile } = useUser();
  const navigate = useNavigate();
  const [hasPremium, setHasPremium] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [aiInput, setAiInput] = useState("");

  const positions = Array.isArray(profile?.position)
    ? profile.position
    : profile?.position
    ? [profile.position]
    : [];

  return (
    <main className="st-page">
      <div className="st-content">
        {/* ── Watchlist Card ── */}
        <section className="st-watchlist-card">
          <div className="st-watchlist-deco st-watchlist-deco-1" />
          <div className="st-watchlist-deco st-watchlist-deco-2" />

          <div className="st-watchlist-header">
            <span className="st-watchlist-title">Your watchlist</span>
            <button className="st-see-all-btn">See all</button>
          </div>

          <div className="st-watchlist-table">
            <div className="st-watchlist-thead">
              <span className="st-wt-player">Player</span>
              <span className="st-wt-stat">A</span>
              <span className="st-wt-stat">G</span>
              <span className="st-wt-stat">Rating</span>
            </div>
            {WATCHLIST_PLAYERS.map((p) => (
              <div key={p.id} className="st-watchlist-row">
                <div className="st-wt-player-cell">
                  <div className="st-wt-avatar" />
                  <div className="st-wt-player-info">
                    <span className="st-wt-name">{p.name}</span>
                    <span className="st-wt-pos">{p.position}</span>
                  </div>
                  <span className="st-ovr-badge">{p.ovr}</span>
                </div>
                <span className="st-wt-stat-val">{p.a}</span>
                <span className="st-wt-stat-val">{p.g}</span>
                <span className="st-wt-stat-val">{p.rating}</span>
              </div>
            ))}

            {/* Current user row — highlighted */}
            {profile && (
              <div className="st-watchlist-row st-watchlist-row--me">
                <div className="st-wt-player-cell">
                  <div className="st-wt-avatar-wrap--me">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt=""
                        className="st-wt-avatar-img"
                      />
                    ) : (
                      <div className="st-wt-avatar st-wt-avatar--me" />
                    )}
                  </div>
                  <div className="st-wt-player-info">
                    <span className="st-wt-name">
                      {profile.full_name || profile.username || "You"}
                    </span>
                    <span className="st-wt-pos">
                      {positions[0] || profile.club_other_name || "—"}
                    </span>
                  </div>
                  <span className="st-ovr-badge">—</span>
                </div>
                <span className="st-wt-stat-val">—</span>
                <span className="st-wt-stat-val">—</span>
                <span className="st-wt-stat-val">—</span>
              </div>
            )}
          </div>

          <button className="st-watchlist-cta">See your whole watchlist →</button>
        </section>

        {/* ── Suggested Players ── */}
        <section className="st-section">
          <div className="st-section-header">
            <div className="st-section-title-group">
              <h2 className="st-section-title">Suggested players</h2>
              {hasPremium && <span className="st-section-subtitle">Based on your preferences</span>}
            </div>
            <button className="st-see-all-link">Find more players</button>
          </div>
          <div className="st-players-scroll">
            {SUGGESTED_PLAYERS.map((p) => (
              hasPremium ? (
                <div key={p.id} className="st-player-card st-player-card--premium">
                  <div className="st-pc-avatar-corner" />
                  <div className="st-pc-badges-row">
                    {p.positions.map((pos) => (
                      <span key={pos} className="st-pc-pos-badge">{pos}</span>
                    ))}
                  </div>
                  <span className="st-pc-name st-pc-name--premium">{p.name}</span>
                  <div className="st-pc-meta-row">
                    <span className="st-pc-club">{p.club}</span>
                    <span className="st-pc-dot">·</span>
                    <span className="st-pc-age">{p.age} yrs</span>
                  </div>
                  <div className="st-pc-stats-row">
                    {p.stats.map((s) => (
                      <div key={s.label} className="st-pc-stat-box">
                        <span className="st-pc-stat-val">{s.value}</span>
                        <span className="st-pc-stat-lbl">{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="st-pc-ovr-badge">{p.ovr}</div>
                </div>
              ) : (
                <div key={p.id} className="st-player-card">
                  <div className="st-pc-avatar" />
                  <div className="st-pc-info">
                    <span className="st-pc-name">{p.name}</span>
                    <div className="st-pc-badges-row st-pc-badges-row--center">
                      {p.positions.map((pos) => (
                        <span key={pos} className="st-pc-pos-badge">{pos}</span>
                      ))}
                    </div>
                  </div>
                  <div className="st-pc-locked-ovr">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>Premium</span>
                  </div>
                  <span className="st-pc-club-sm">{p.club}</span>
                </div>
              )
            ))}
          </div>
        </section>

        {/* ── AI Scout ── */}
        <section className="st-ai-section">
          <div className="st-ai-header">
            <div className="st-ai-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z" fill="url(#ai-grad)" />
                <defs>
                  <linearGradient id="ai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff983d" />
                    <stop offset="100%" stopColor="#ff3d52" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="st-ai-title-group">
              <h2 className="st-section-title">AI Scout</h2>
              {hasPremium && <span className="st-section-subtitle">Ranking your position and age</span>}
            </div>
          </div>
          <div className="st-ai-input-row">
            <input
              className="st-ai-input"
              placeholder="Ask me anything about players…"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
            />
          </div>
          <div className="st-ai-chips">
            {AI_CHIPS.map((chip) => (
              <button key={chip} className="st-ai-chip" onClick={() => setAiInput(chip)}>
                {chip}
              </button>
            ))}
          </div>
        </section>

        {/* ── Overall Leaderboard ── */}
        <section className="st-leaderboard-card" onClick={() => navigate("/progress/leaderboard")}>
          <div className="st-lb-header">
            <div className="st-section-title-group">
              <h2 className="st-section-title">Overall Leaderboard</h2>
              {hasPremium && <span className="st-section-subtitle">Ranking your position and age</span>}
            </div>
            <button className="st-lb-filter-btn">
              Division 3
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
          <div className="st-lb-table">
            <div className="st-lb-thead">
              <span className="st-lb-rank">#</span>
              <span className="st-lb-player">Player</span>
              <span className="st-lb-ovr">OVR</span>
            </div>
            {LEADERBOARD_ROWS.map((row) => (
              <div key={row.rank} className="st-lb-row">
                <span className="st-lb-rank">{row.rank}</span>
                <div className="st-lb-player-cell">
                  <div className="st-lb-avatar" />
                  <div className="st-lb-player-info">
                    <span className="st-lb-name">{row.name}</span>
                    <span className="st-lb-pos">{row.position} · {row.club}</span>
                  </div>
                </div>
                <span className="st-lb-ovr-val">{row.ovr}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Your Team ── */}
        <section className="st-team-section">
          <div className="st-team-header">
            <div className="st-section-title-group">
              <h2 className="st-section-title">Your Team</h2>
              {hasPremium && <span className="st-section-subtitle">Ranking your position and age</span>}
            </div>
            <button className="st-lb-filter-btn">
              All world
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
          <div className="st-pitch-wrap">
            <img src={FootballPitch} alt="Football pitch" className="st-pitch" />
            {POSITIONS_ON_PITCH.map((pos) => (
              <button
                key={pos.id}
                className={`st-pos-btn ${selectedPosition === pos.id ? "st-pos-btn--active" : ""}`}
                style={{ top: pos.top, left: pos.left }}
                onClick={() => setSelectedPosition(pos.id === selectedPosition ? null : pos.id)}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Unlock Banner (non-premium only) ── */}
        {!hasPremium && (
          <div className="st-unlock-wrap">
            <div className="st-unlock-fade" />
            <div className="st-unlock-banner">
              <ProUpgradeCard badgeColor="pro-scout" buttonLabel="Get Premium features" onButtonClick={() => setHasPremium(true)} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
