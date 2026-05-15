import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaretDown, CaretRight, Star, Sparkle as SparkleIcon } from "@phosphor-icons/react";
import { useUser } from "../context/UserContext";
import OvrBadge from "../components/ui/OvrBadge";
// Use user-provided PNG background if present
import WATCHLIST_BG from "../assets/images/watchlist-bg.png";
// Upsell background provided by user
import PROFEATURES_BG from "../assets/images/Profeatures.png";
import "./Scouting.css";

// Decorative Figma vectors removed — using user's image as background instead

// Figma placeholder assets — replace with permanent CDN assets (expire in 7 days)
const PLACEHOLDER_AVATAR   = "https://www.figma.com/api/mcp/asset/10a27e2c-0a1a-4a66-b8ba-67c014ea8c9f";
const PLACEHOLDER_CLUB_LOGO = "https://www.figma.com/api/mcp/asset/071f4d1e-d339-4179-84f5-6f1dc145661c";



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
  { id: 1, nameLine1: "Emil Jonansen", nameLine2: "Bryld",   positions: ["ST", "LW"], gpm: 1.2,  avgMin: 72, apm: 0.82, initials: "EB", club: "Real Madrid",   clubLogo: PLACEHOLDER_CLUB_LOGO, age: 18, ovr: 72, avatarUrl: PLACEHOLDER_AVATAR },
  { id: 2, nameLine1: "Omar",          nameLine2: "Diallo",  positions: ["CAM"],      gpm: 0.9,  avgMin: 68, apm: 0.71, initials: "OD", club: "FC Benfica",    clubLogo: null,                  age: 21, ovr: 68, avatarUrl: null },
  { id: 3, nameLine1: "Tomáš",         nameLine2: "Dvořák",  positions: ["CM"],       gpm: 0.5,  avgMin: 81, apm: 0.56, initials: "TD", club: "Sparta Prague", clubLogo: null,                  age: 24, ovr: 65, avatarUrl: null },
  { id: 4, nameLine1: "Pierre",        nameLine2: "Nkumu",   positions: ["CB"],       gpm: 0.2,  avgMin: 77, apm: 0.21, initials: "PN", club: "LOSC Lille",    clubLogo: null,                  age: 19, ovr: 61, avatarUrl: null },
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

function PositionTag({ text }) {
  return <span className="scout-position-tag text-2xs-semibold">{text}</span>;
}

function FilterButton({ label }) {
  return (
    <button className="scout-filter-btn text-sm-semibold">
      {label}
      <CaretDown size={18} />
    </button>
  );
}

/* ─── Watchlist card ─────────────────────────────────────────────── */

function WatchlistSection() {
  const { profile } = useUser();
  const navigate = useNavigate();

  // Prefer the local watchlist background SVG, then user avatar, then placeholder
  const bgUrl = WATCHLIST_BG || profile?.avatar_url || PLACEHOLDER_AVATAR;

  return (
    <div className="watchlist-card">
      {/* Background image (user avatar or placeholder) */}
      <div className="watchlist-bg" style={{ backgroundImage: `url(${bgUrl})` }} aria-hidden="true" />

     

      <div className="watchlist-inner">
        <div className="watchlist-header-row">
          <span className="watchlist-title">Your watchlist</span>
          <button className="watchlist-find-btn">Find more players</button>
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
                  <OvrBadge value={player.ovr} locked={false} />
                </span>
              </div>
            </div>
          ))}
        </div>

        <button className="watchlist-cta" onClick={() => navigate("/scouting/watchlist")}>
          <span>See your whole watchlist</span>
          <CaretRight size={20} />
        </button>
      </div>
    </div>
  );
}

/* ─── Suggested players ──────────────────────────────────────────── */

function SuggestedCard({ player }) {
  return (
    <div className="sug-card">
      {/* Position tags — top left */}
      <div className="sug-card-positions">
        {player.positions.map((pos) => (
          <PositionTag key={pos} text={pos} />
        ))}
      </div>

      {/* Avatar — top right */}
      <div className="sug-card-avatar">
        {player.avatarUrl ? (
          <img src={player.avatarUrl} alt={player.nameLine2} />
        ) : (
          <span>{player.initials}</span>
        )}
      </div>

      {/* OVR badge — overlaid at avatar bottom-right */}
      <div className="sug-card-ovr">
        <OvrBadge value={player.ovr} size="md" variant="gold" />
      </div>

      {/* Player name */}
      <p className="sug-card-name">{player.nameLine1} {player.nameLine2}</p>

      {/* Club + age meta row */}
      <div className="sug-card-meta">
        {player.clubLogo && (
          <div className="sug-meta-club-logo-wrap">
            <img src={player.clubLogo} alt="" className="sug-meta-club-logo" />
          </div>
        )}
        <span className="sug-meta-club">{player.club}</span>
        <span className="sug-meta-dot" aria-hidden="true" />
        <span className="sug-meta-age">{player.age}y.o.</span>
      </div>

      {/* Stats row — three grey boxes */}
      <div className="sug-card-stats">
        <div className="sug-stat-box">
          <span className="sug-stat-value">{player.gpm}</span>
          <span className="sug-stat-label">GPM</span>
        </div>
        <div className="sug-stat-box">
          <span className="sug-stat-value">{player.apm}</span>
          <span className="sug-stat-label">APM</span>
        </div>
        <div className="sug-stat-box">
          <span className="sug-stat-value">{player.avgMin}</span>
          <span className="sug-stat-label">Avg.min</span>
        </div>
      </div>
    </div>
  );
}

function SuggestedSection({ isPremium }) {
  return (
    <section className="scout-section">
      <div className="scout-section-header">
        <div>
          <h2 className="scout-section-title text-lg-semibold">Suggested players</h2>
          <p className="scout-section-subtitle text-sm-medium">
            {isPremium ? "based on your preferences" : "Test yourself with football stars"}
          </p>
        </div>
        <button className="scout-link-btn text-sm-semibold">Find more players</button>
      </div>
      <div className="suggested-scroll">
        {MOCK_SUGGESTED.map((p) => (
          <SuggestedCard key={p.id} player={p} />
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
          <h2 className="scout-section-title text-lg-semibold">AI Scout</h2>
          <p className="scout-section-subtitle text-sm-medium">Ranking your position and age</p>
        </div>
      </div>
      <div className="ai-scout-card">
        <div className="ai-scout-icon">
          <SparkleIcon size={32} weight="fill" />
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
          <h2 className="scout-section-title text-lg-semibold">Overall Leaderboard</h2>
          <p className="scout-section-subtitle text-sm-medium">Ranking your position and age</p>
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
                <span className="lb-player-name text-sm-semibold">{player.name}</span>
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
  const navigate = useNavigate();
  return (
    <section className="scout-section">
      <div className="scout-section-header">
        <div>
          <h2 className="scout-section-title text-lg-semibold">Your team</h2>
          <p className="scout-section-subtitle text-sm-medium">Ranking your position and age</p>
        </div>
        <button className="scout-link-btn text-sm-semibold" onClick={() => navigate("/scouting/team")}>
          View full team
        </button>
      </div>

      <div className="pitch-card">
        <div className="pitch-overlay" />
        {PITCH_POSITIONS.map((pos) => (
          <button
            key={pos.key}
            className={`pos-btn${pos.hasPlayer ? " pos-btn--has-player" : ""}`}
            style={{ left: pos.cx, top: pos.cy }}
          >
            <span className="pos-label text-sm-semibold">{pos.label}</span>
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
    <div className="premium-upsell-card" style={{ backgroundImage: `url(${PROFEATURES_BG})` }}>
      <div className="premium-pro-badge">PRO</div>

      <div className="premium-upsell-content">
        <h3 className="heading-4xl-italic">Unlock pro features</h3>
        <p className="premium-upsell-desc text-sm-medium">
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
