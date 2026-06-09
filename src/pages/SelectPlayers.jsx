import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CaretLeft, Funnel, MagnifyingGlass } from "@phosphor-icons/react";
import OvrBadge from "../components/UI/OvrBadge";
import { supabase } from "../lib/supabase";
import "./SelectPlayers.css";

const TABS = ["ALL", "Watchlist 1"];

// Deterministic fake stats seeded from player UUID
function hashNum(id, offset, min, max) {
  const n = parseInt((id ?? "0").replace(/-/g, "").slice(offset, offset + 8), 16);
  return min + (n % (max - min + 1));
}

function fakeOvr(id) { return hashNum(id, 0, 60, 90); }

function fakeStats(id) {
  return {
    gpm: {
      value: (hashNum(id, 2, 50, 200) / 100).toFixed(1),
      trend: `${hashNum(id, 4, 10, 40)}% this week`,
    },
    apm: {
      value: (hashNum(id, 6, 30, 200) / 100).toFixed(1),
      trend: `${hashNum(id, 8, 10, 45)}% this week`,
    },
    win: {
      value: `${hashNum(id, 10, 28, 72)}%`,
      trend: `${hashNum(id, 12, 8, 35)}% this week`,
    },
  };
}

function StatBox({ label, value, trend }) {
  return (
    <div className="sp-stat-box">
      <span className="sp-stat-label">{label}</span>
      <span className="sp-stat-value">{value}</span>
      <div className="sp-stat-trend">
        <svg width="12" height="12" viewBox="0 0 12 12" className="sp-trend-icon">
          <polygon points="6,1.5 11,10.5 1,10.5" fill="var(--success-default,#00ab3d)" />
        </svg>
        <span className="sp-trend-text">{trend}</span>
      </div>
    </div>
  );
}

function PlayerCard({ player, onSelect }) {
  const ovr = fakeOvr(player.id);
  const stats = fakeStats(player.id);
  const clubName = player.clubs?.name ?? player.club_other_name ?? null;
  const age = player.age ?? null;
  const avatarUrl = player.avatar_url;
  const positions = player.position ?? [];

  const initials = (player.full_name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      className="sp-player-card"
      onClick={() => onSelect(player)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(player)}
    >
      <div className="sp-player-top">
        <div className="sp-player-photo-wrap">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="sp-player-photo" />
          ) : (
            <div className="sp-player-initials">{initials}</div>
          )}
          <div className="sp-ovr-badge">
            <OvrBadge value={ovr} size="sm" variant="gold" />
          </div>
        </div>
        <div className="sp-player-details">
          <p className="sp-player-name">{player.full_name ?? "Unknown"}</p>
          <div className="sp-player-meta">
            {positions.slice(0, 2).map((pos) => (
              <span key={pos} className="sp-pos-badge">{pos.toUpperCase()}</span>
            ))}
            {clubName && <span className="sp-player-club">{clubName}</span>}
            {clubName && age && <span className="sp-dot" />}
            {age && <span className="sp-player-info">{age}y.o.</span>}
          </div>
        </div>
      </div>
      <div className="sp-player-stats">
        <StatBox label="GPM" value={stats.gpm.value} trend={stats.gpm.trend} />
        <StatBox label="APM" value={stats.apm.value} trend={stats.apm.trend} />
        <StatBox label="%WIN" value={stats.win.value} trend={stats.win.trend} />
      </div>
    </div>
  );
}

export default function SelectPlayers() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAthletes() {
      const { data } = await supabase
        .from("profiles")
        .select("*, clubs(name, logo_url, country)")
        .eq("role", "athlete")
        .order("created_at", { ascending: false })
        .limit(30);
      setPlayers(data ?? []);
      setLoading(false);
    }
    fetchAthletes();
  }, []);

  function handleSelect(selectedPlayer) {
    navigate("/scouting/substitution", {
      state: {
        player: state?.outPlayer,
        slot: state?.slot,
        slotIndex: state?.slotIndex,
        inPlayer: selectedPlayer,
      },
    });
  }

  const displayed = activeTab === 0 ? players : players.slice(0, 3);

  return (
    <div className="sp-page">
      <div className="sp-topbar">
        <button className="sp-back-btn" onClick={() => navigate(-1)} aria-label="Back">
          <CaretLeft size={24} weight="bold" />
        </button>
        <h1 className="sp-title">Select players</h1>
        <button className="sp-filter-btn" aria-label="Filter">
          <Funnel size={24} />
        </button>
      </div>

      <div className="sp-tabs">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`sp-tab${activeTab === i ? " sp-tab--active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="sp-list">
        {loading && (
          <p className="sp-loading">Loading players…</p>
        )}
        {!loading && displayed.length === 0 && (
          <p className="sp-empty">No players found.</p>
        )}
        {!loading && displayed.map((player) => (
          <PlayerCard key={player.id} player={player} onSelect={handleSelect} />
        ))}
      </div>

      <div className="sp-fab-wrap">
        <span className="sp-fab-label">Search more</span>
        <button
          className="sp-fab"
          aria-label="Search"
          onClick={() => navigate("/scouting/search")}
        >
          <MagnifyingGlass size={28} weight="bold" color="white" />
        </button>
      </div>
    </div>
  );
}
