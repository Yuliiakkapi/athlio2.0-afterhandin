import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CaretDown, CaretRight, Star, Sparkle as SparkleIcon } from "@phosphor-icons/react";
import { useUser } from "../context/UserContext";
import OvrBadge from "../components/UI/OvrBadge.jsx";
import WATCHLIST_BG from "../assets/images/watchlist-bg.png";
import PitchBg from "../assets/images/position-bg.png";
import ProUpgradeCard from "../components/domain/Progress-athletes/ProUpgradeCard";
import { fetchPlayerSuggestions } from "../lib/profiles";
import { toPositionAbbr } from "../utils/positions";
import { supabase } from "../lib/supabase";
import "./Scouting.css";

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}
function fakeStat(idStr, base, range) {
  const n = idStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return +(seededRand(n * 7919)() * range + base).toFixed(2);
}
function fakeOvr(idStr) {
  const n = idStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.round(seededRand(n * 3571)() * 40 + 50);
}
function normalizeForScouting(p) {
  const positions = Array.isArray(p.position) ? p.position : p.position ? [p.position] : [];
  const parts = (p.full_name || "Unknown").trim().split(" ");
  const nameLine2 = parts.length > 1 ? parts.slice(1).join(" ") : parts[0];
  const nameLine1 = parts.length > 1 ? parts[0] : "";
  const initials = parts.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return {
    id: p.id,
    nameLine1,
    nameLine2,
    initials,
    avatarUrl: p.avatar_url || null,
    positions: positions.slice(0, 2).map(toPositionAbbr),
    club: p.club || null,
    clubLogo: p.club_logo || null,
    age: p.age ?? null,
    gpm: fakeStat(p.id, 0.2, 1.8),
    apm: fakeStat(p.id + "a", 0.3, 2.0),
    avgMin: Math.round(fakeStat(p.id + "m", 45, 50)),
    ovr: fakeOvr(p.id),
  };
}



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


const AI_PROMPTS = [
  "Who compares to young Modric at 17?",
  "Who compares to young Modric at 17?",
];

const PITCH_POSITIONS = [
  { key: "rb-top-l", label: "RB",  cx: "29%", cy: "7%",  hasPlayer: false },
  { key: "rb-top-r", label: "RB",  cx: "71%", cy: "7%",  hasPlayer: false },
  { key: "cdm",      label: "CDM", cx: "50%", cy: "27%", hasPlayer: false },
  { key: "lb",       label: "LB",  cx: "29%", cy: "45%", hasPlayer: false },
  { key: "rb",       label: "RB",  cx: "71%", cy: "41%", hasPlayer: false },
  { key: "cb",       label: "CB",  cx: "50%", cy: "55%", hasPlayer: true  },
  { key: "gk",       label: "GK",  cx: "50%", cy: "80%", hasPlayer: false },
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
    <Link to={`/profile/${player.id}`} className="sug-card">
      {/* Position tags — top left */}
      <div className="sug-card-positions">
        {player.positions.map((pos, i) => (
          <PositionTag key={i} text={pos} />
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
    </Link>
  );
}

function SuggestedSection({ isPremium }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchPlayerSuggestions(8)
      .then((raw) => setPlayers(raw.map(normalizeForScouting)))
      .catch(console.error);
  }, []);

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
        {players.slice(0, isPremium ? 5 : 3).map((p) => (
          <SuggestedCard key={p.id} player={p} />
        ))}
      </div>
    </section>
  );
}

/* ─── AI Scout ───────────────────────────────────────────────────── */

function AiScoutSection() {
  const navigate = useNavigate();
  return (
    <section className="scout-section">
      <div className="scout-section-header">
        <div>
          <h2 className="scout-section-title text-lg-semibold">AI Scout</h2>
          <p className="scout-section-subtitle text-sm-medium">Ranking your position and age</p>
        </div>
      </div>
      <button
        className="ai-scout-card"
        onClick={() => navigate("/scouting/ai-scout")}
        aria-label="Open AI Scout"
      >
        <div className="ai-scout-icon">
          <SparkleIcon size={32} weight="fill" />
        </div>
        {AI_PROMPTS.map((prompt, i) => (
          <div key={i} className="ai-prompt-chip">
            {prompt}
          </div>
        ))}
      </button>
    </section>
  );
}

/* ─── Overall Leaderboard ────────────────────────────────────────── */

function LeaderboardSection() {
  const navigate = useNavigate();
  return (
    <section className="scout-section">
      <div className="scout-section-header">
        <div>
          <h2 className="scout-section-title text-lg-semibold">Overall Leaderboard</h2>
          <p className="scout-section-subtitle text-sm-medium">Ranking your position and age</p>
        </div>
        <FilterButton label="Division 3" />
      </div>

      <div className="lb-card" onClick={() => navigate("/progress/leaderboard")}>
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
  const [pitchPlayers, setPitchPlayers] = useState([]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("role", "athlete")
      .order("created_at", { ascending: false })
      .limit(7)
      .then(({ data }) => setPitchPlayers(data ?? []));
  }, []);

  return (
    <section className="scout-section">
      <div className="scout-section-header">
        <div>
          <h2 className="scout-section-title text-lg-semibold">Your team</h2>
          <p className="scout-section-subtitle text-sm-medium">Ranking your position and age</p>
        </div>
        <OvrBadge value={72} size="lg" variant="gold" />
      </div>

      <button
        className="pitch-card"
        onClick={() => navigate("/scouting/team")}
        aria-label="View your team"
      >
        <img src={PitchBg} alt="" className="pitch-card-bg" />
        <div className="pitch-overlay" />
        {PITCH_POSITIONS.map((pos, i) => {
          const player = pitchPlayers[i] ?? null;
          const hasAvatar = !!player?.avatar_url;
          return (
            <div
              key={pos.key}
              className={`pos-btn${hasAvatar ? " pos-btn--has-player" : ""}`}
              style={{ left: pos.cx, top: pos.cy }}
            >
              <span className="pos-label">{pos.label}</span>
              <div className="pos-circle">
                {hasAvatar ? (
                  <>
                    <img src={player.avatar_url} alt="" className="pos-circle-img" />
                    <div className="pos-circle-overlay" />
                  </>
                ) : (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="var(--primary-default, #4051fd)" aria-hidden="true">
                    <path d="M17 2.5H11L8 6.5H5L3 9L5 12.5H6.5V23.5H21.5V12.5H23L25 9L23 6.5H20L17 2.5Z" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </button>
    </section>
  );
}


/* ─── Page ───────────────────────────────────────────────────────── */

export default function Scouting() {
  const { profile } = useUser();
  const navigate = useNavigate();
  const isPremium = !!profile?.is_pro;

  return (
    <div className="scouting-page">
      <div className="scouting-sections">
        <WatchlistSection />
        <SuggestedSection isPremium={isPremium} />

        {isPremium ? (
          <>
            <AiScoutSection />
            <LeaderboardSection />
            <YourTeamSection />
          </>
        ) : (
          <ProUpgradeCard badgeColor="pro-scout" buttonLabel="Get Premium features" onButtonClick={() => navigate("/scout-upgrade-pro")} />
        )}
      </div>
    </div>
  );
}
