import { useState } from "react";
import { ChevronDown, ChevronRight, Sparkle, Lock } from "@phosphor-icons/react";
import "./Scouting.css";

/* ─── Mock data ─────────────────────────────────────────────────── */

const MOCK_WATCHLIST = [
  { id: 1, name: "Kylian Mbappe",     club: "Real Madrid FC", assists: 15, goals: 18, ovr: 52, initials: "KM" },
  { id: 2, name: "Samuel Soares",     club: "FC Benfica",      assists: 15, goals: 17, ovr: 53, initials: "SS" },
  { id: 3, name: "Emil Jensen Bryld", club: "Hobro IK",        assists: 18, goals: 12, ovr: 53, initials: "EJ", isMe: true },
  { id: 4, name: "Kylian Mbappe",     club: "Real Madrid FC",  assists: 17, goals: 10, ovr: 55, initials: "KM" },
];

const MOCK_LEADERBOARD = [
  { id: 1, name: "Kylian Mbappe",  club: "Real Madrid FC", assists: 15, goals: 18, ovr: 52, initials: "KM" },
  { id: 2, name: "Samuel Soares",  club: "FC Benfica",      assists: 15, goals: 17, ovr: 53, initials: "SS" },
  { id: 3, name: "Kylian Mbappe",  club: "Real Madrid FC",  assists: 17, goals: 10, ovr: 55, initials: "KM" },
  { id: 4, name: "Kylian Mbappe",  club: "Real Madrid FC",  assists: 17, goals: 9,  ovr: 56, initials: "KM" },
];

const MOCK_SUGGESTED = [
  { id: 1, nameLine1: "Emil Jonansen", nameLine2: "Bryld", club: "Real Madrid", age: "18y.o.", positions: ["ST", "LW"], gpm: "1.2", avgMin: "12", apm: "2", ovr: 72 },
  { id: 2, nameLine1: "Emil Jonansen", nameLine2: "Bryld", club: "Real Madrid", age: "18y.o.", positions: ["ST", "LW"], gpm: "1.2", avgMin: "12", apm: "2", ovr: 72 },
  { id: 3, nameLine1: "Emil Jonansen", nameLine2: "Bryld", club: "Real Madrid", age: "18y.o.", positions: ["ST", "LW"], gpm: "1.2", avgMin: "12", apm: "2", ovr: 72 },
];

const AI_PROMPTS = [
  "Who compares to young Modric at 17?",
  "Who compares to young Modric at 17?",
];

const PITCH_POSITIONS = [
  { key: "cdm", label: "CDM", cx: "50%", cy: "21%", hasPlayer: false },
  { key: "cb",  label: "CB",  cx: "50%", cy: "42%", hasPlayer: true  },
  { key: "lb",  label: "LB",  cx: "29%", cy: "35%", hasPlayer: false },
  { key: "rb",  label: "RB",  cx: "70%", cy: "35%", hasPlayer: false },
  { key: "gk",  label: "GK",  cx: "50%", cy: "62%", hasPlayer: false },
];

/* ─── Utility components ─────────────────────────────────────────── */

function PlayerAvatar({ initials, size = 32, highlighted = false, avatarUrl = null }) {
  return (
    <div
      className={`scout-avatar${highlighted ? " scout-avatar--highlighted" : ""}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt="" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

function OvrBadge({ value, locked, large = false }) {
  return (
    <div className={`ovr-badge${large ? " ovr-badge--large" : ""}`}>
      {locked ? (
        <>
          <Lock size={large ? 12 : 9} weight="fill" />
          <span className="ovr-label">PREMIUM</span>
        </>
      ) : (
        <>
          <span className="ovr-number">{value}</span>
          <span className="ovr-label">OVR</span>
        </>
      )}
    </div>
  );
}

function PositionTag({ text }) {
  return <span className="scout-position-tag">{text}</span>;
}

function FilterButton({ label }) {
  return (
    <button className="scout-filter-btn">
      {label}
      <ChevronDown size={18} />
    </button>
  );
}

/* ─── Watchlist card ─────────────────────────────────────────────── */

function WatchlistSection() {
  return (
    <div className="watchlist-card">
      <div className="watchlist-ring watchlist-ring--1" />
      <div className="watchlist-ring watchlist-ring--2" />
      <div className="watchlist-ring watchlist-ring--3" />

      <div className="watchlist-inner">
        <div className="watchlist-header-row">
          <span className="watchlist-title">Your watchlist</span>
        </div>

        <div className="watchlist-table">
          <div className="wt-col-header">
            <span className="wt-col-player">player</span>
            <div className="wt-col-stats">
              <span className="wt-stat-head">A</span>
              <span className="wt-stat-head">G</span>
              <span className="wt-stat-head wt-stat-head--wide">rating</span>
            </div>
          </div>

          {MOCK_WATCHLIST.map((player, i) => (
            <div
              key={player.id}
              className={`wt-row${i === MOCK_WATCHLIST.length - 1 ? " wt-row--last" : ""}`}
            >
              <div className="wt-row-player">
                <PlayerAvatar initials={player.initials} highlighted={player.isMe} />
                <div className="wt-row-names">
                  <span className="wt-player-name">{player.name}</span>
                  <span className="wt-player-club">{player.club}</span>
                </div>
              </div>
              <div className="wt-row-stats">
                <span className="wt-stat-val">{player.assists}</span>
                <span className="wt-stat-val">{player.goals}</span>
                <span className="wt-stat-val wt-stat-val--wide">
                  <OvrBadge value={player.ovr} locked={true} />
                </span>
              </div>
            </div>
          ))}
        </div>

        <button className="watchlist-cta">
          <span>See your whole watchlist</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

/* ─── Suggested players ──────────────────────────────────────────── */

function SuggestedCard({ player, isPremium }) {
  return (
    <div className="suggested-card">
      <div className="suggested-avatar-wrap">
        <PlayerAvatar initials="EB" size={90} />
        <div className="suggested-ovr-pos">
          <OvrBadge value={player.ovr} locked={!isPremium} large />
        </div>
      </div>

      <div className="suggested-positions">
        {player.positions.map((p) => (
          <PositionTag key={p} text={p} />
        ))}
      </div>

      <div className="suggested-name">
        <div>{player.nameLine1}</div>
        <div>{player.nameLine2}</div>
      </div>

      <div className="suggested-meta">
        <span>{player.club}</span>
        <span className="suggested-dot">·</span>
        <span>{player.age}</span>
      </div>

      <div className="suggested-stats-row">
        {[
          { val: player.gpm,    lbl: "GPM"      },
          { val: player.avgMin, lbl: "Avg.min."  },
          { val: player.apm,    lbl: "APM"       },
        ].map((s) => (
          <div key={s.lbl} className="suggested-stat">
            <span className="suggested-stat-val">{s.val}</span>
            <span className="suggested-stat-lbl">{s.lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuggestedSection({ isPremium }) {
  return (
    <section className="scout-section">
      <div className="scout-section-header">
        <div>
          <h2 className="scout-section-title">Suggested players</h2>
          <p className="scout-section-subtitle">
            {isPremium ? "based on your preferences" : "Test yourself with football stars"}
          </p>
        </div>
        <button className="scout-link-btn">Find more players</button>
      </div>
      <div className="suggested-scroll">
        {MOCK_SUGGESTED.map((p) => (
          <SuggestedCard key={p.id} player={p} isPremium={isPremium} />
        ))}
      </div>
    </section>
  );
}

/* ─── AI Scout ───────────────────────────────────────────────────── */

function AiScoutSection() {
  return (
    <section className="scout-section">
      <div className="scout-section-header">
        <div>
          <h2 className="scout-section-title">AI Scout</h2>
          <p className="scout-section-subtitle">Ranking your position and age</p>
        </div>
      </div>
      <div className="ai-scout-card">
        <div className="ai-scout-icon">
          <Sparkle size={32} weight="fill" />
        </div>
        {AI_PROMPTS.map((prompt, i) => (
          <div key={i} className="ai-prompt-chip">
            {prompt}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Overall Leaderboard ────────────────────────────────────────── */

function LeaderboardSection() {
  return (
    <section className="scout-section">
      <div className="scout-section-header">
        <div>
          <h2 className="scout-section-title">Overall Leaderboard</h2>
          <p className="scout-section-subtitle">Ranking your position and age</p>
        </div>
        <FilterButton label="Division 3" />
      </div>

      <div className="lb-card">
        <div className="lb-col-header">
          <span className="lb-col-player">player</span>
          <div className="lb-col-stats">
            <span className="lb-stat-head">A</span>
            <span className="lb-stat-head">G</span>
            <span className="lb-stat-head lb-stat-head--wide">rating</span>
          </div>
        </div>

        {MOCK_LEADERBOARD.map((player, i) => (
          <div
            key={player.id}
            className={`lb-row${i === MOCK_LEADERBOARD.length - 1 ? " lb-row--last" : ""}`}
          >
            <div className="lb-row-player">
              <PlayerAvatar initials={player.initials} />
              <div className="lb-row-names">
                <span className="lb-player-name">{player.name}</span>
                <span className="lb-player-club">{player.club}</span>
              </div>
            </div>
            <div className="lb-row-stats">
              <span className="lb-stat-val">{player.assists}</span>
              <span className="lb-stat-val">{player.goals}</span>
              <span className="lb-stat-val lb-stat-val--wide">
                <OvrBadge value={player.ovr} locked={false} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Your team (football pitch) ─────────────────────────────────── */

function YourTeamSection() {
  return (
    <section className="scout-section">
      <div className="scout-section-header">
        <div>
          <h2 className="scout-section-title">Your team</h2>
          <p className="scout-section-subtitle">Ranking your position and age</p>
        </div>
        <FilterButton label="All world" />
      </div>

      <div className="pitch-card">
        <div className="pitch-overlay" />
        {PITCH_POSITIONS.map((pos) => (
          <button
            key={pos.key}
            className={`pos-btn${pos.hasPlayer ? " pos-btn--has-player" : ""}`}
            style={{ left: pos.cx, top: pos.cy }}
          >
            <span className="pos-label">{pos.label}</span>
            <div className="pos-circle">
              {pos.hasPlayer ? (
                <PlayerAvatar initials="P" size={19} />
              ) : (
                /* Jersey icon */
                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 9l-4-6H6L2 9l3 2v10h14V11l3-2z" opacity=".15" />
                  <path d="M6.2 3h11.6l3.8 5.7-2.4 1.6-.2.1V21H5V10.4l-.2-.1L2.4 8.7 6.2 3zm1.4 1.5L5.1 8.3l1.4.9.5.3V19.5h10V9.5l.5-.3 1.4-.9-2.5-3.8H7.6z" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ─── Premium upsell card ────────────────────────────────────────── */

function PremiumUpsellCard({ onUnlock }) {
  return (
    <div className="premium-upsell-card">
      <div className="premium-upsell-rings">
        <div className="premium-upsell-ring premium-upsell-ring--1" />
        <div className="premium-upsell-ring premium-upsell-ring--2" />
        <div className="premium-upsell-ring premium-upsell-ring--3" />
      </div>

      <div className="premium-pro-badge">PRO</div>

      <div className="premium-upsell-content">
        <h3 className="premium-upsell-title">Unlock pro features</h3>
        <p className="premium-upsell-desc">
          Get AI insights, advanced analytics, and full scout visibility. Take your career to the next level.
        </p>
      </div>

      <button className="premium-upsell-btn" onClick={onUnlock}>
        Unlock Premium
      </button>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */

export default function Scouting() {
  const [isPremium, setIsPremium] = useState(false);

  return (
    <div className="scouting-page">
      <div className="scouting-sections">
        <WatchlistSection />
        <SuggestedSection isPremium={isPremium} />
        <AiScoutSection />

        {isPremium ? (
          <>
            <LeaderboardSection />
            <YourTeamSection />
          </>
        ) : (
          <div className="scouting-premium-spacer" />
        )}
      </div>

      {!isPremium && (
        <div className="scouting-premium-gate">
          <div className="premium-gate-fade" />
          <div className="premium-gate-body">
            <PremiumUpsellCard onUnlock={() => setIsPremium(true)} />
          </div>
        </div>
      )}
    </div>
  );
}
