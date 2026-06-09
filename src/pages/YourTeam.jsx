import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CaretLeft, X } from "@phosphor-icons/react";
import OvrBadge from "../components/UI/OvrBadge";
import { supabase } from "../lib/supabase";
import PitchBg from "../assets/images/position-bg.png";
import "./YourTeam.css";

// Fixed formation slots — group drives DEF/MID/ATT breakdown
const FORMATION_SLOTS = [
  { pos: "ST",  group: "att", left: 50.0, top: 28.0 },
  { pos: "LW",  group: "att", left: 17.0, top: 35.0 },
  { pos: "RW",  group: "att", left: 83.0, top: 35.0 },
  { pos: "CAM", group: "mid", left: 50.0, top: 38.5 },
  { pos: "CM",  group: "mid", left: 24.0, top: 50.5 },
  { pos: "CM",  group: "mid", left: 50.0, top: 52.5 },
  { pos: "CM",  group: "mid", left: 76.0, top: 50.5 },
  { pos: "CB",  group: "def", left: 25.0, top: 66.0 },
  { pos: "CB",  group: "def", left: 50.0, top: 69.0 },
  { pos: "CB",  group: "def", left: 75.0, top: 66.0 },
  { pos: "GK",  group: "def", left: 50.0, top: 82.0 },
];

function avg(nums) {
  return nums.length === 0 ? 0 : Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function computeTeamStats(players) {
  const ovrs = FORMATION_SLOTS.map((_, i) => players[i] ? fakeOvr(players[i].id) : null);
  const byGroup = (g) => ovrs.filter((v, i) => v !== null && FORMATION_SLOTS[i].group === g);
  return {
    ovr: avg(ovrs.filter(Boolean)),
    att: avg(byGroup("att")),
    mid: avg(byGroup("mid")),
    def: avg(byGroup("def")),
  };
}

// Deterministic fake OVR from profile id
function fakeOvr(id) {
  const n = parseInt((id ?? "0").replace(/-/g, "").slice(0, 8), 16);
  return 60 + (n % 31);
}

function shortName(fullName) {
  if (!fullName) return "Player";
  const parts = fullName.trim().split(" ");
  return parts[parts.length - 1].toUpperCase();
}

function PlayerMarker({ slot, player, onClick }) {
  const isEmpty = !player;
  const ovr = player ? fakeOvr(player.id) : null;
  const avatarUrl = player?.avatar_url ?? null;

  return (
    <div
      className={`yt-player${isEmpty ? " yt-player--empty" : ""}`}
      style={{ left: `${slot.left}%`, top: `${slot.top}%` }}
      onClick={() => onClick(slot, player)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(slot, player)}
      aria-label={player ? player.full_name : `Empty ${slot.pos} slot`}
    >
      <div className="yt-player-inner">
        <div className="yt-player-circle">
          {isEmpty ? (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="yt-player-jersey">
              <path d="M17 2.5H11L8 6.5H5L3 9L5 12.5H6.5V23.5H21.5V12.5H23L25 9L23 6.5H20L17 2.5Z" fill="white" fillOpacity="0.5" />
            </svg>
          ) : avatarUrl ? (
            <img src={avatarUrl} alt="" className="yt-player-img" />
          ) : (
            <div className="yt-player-initials">
              {(player.full_name ?? "?").split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
          )}
        </div>
        {!isEmpty && (
          <div className="yt-player-badge">
            <OvrBadge value={ovr} size="sm" variant="gold" />
          </div>
        )}
      </div>
      {!isEmpty && (
        <span className="yt-player-name">{shortName(player.full_name)}</span>
      )}
      {isEmpty && (
        <span className="yt-player-pos">{slot.pos}</span>
      )}
    </div>
  );
}

export default function YourTeam() {
  const navigate = useNavigate();
  const { state: navState } = useLocation();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const stats = computeTeamStats(players);

  useEffect(() => {
    async function fetchAthletes() {
      const { data } = await supabase
        .from("profiles")
        .select("*, clubs(name, logo_url, country)")
        .eq("role", "athlete")
        .order("created_at", { ascending: false })
        .limit(11);
      let fetched = data ?? [];
      if (navState?.slotIndex != null && navState?.inPlayer) {
        fetched = fetched.map((p, i) =>
          i === navState.slotIndex ? navState.inPlayer : p
        );
      }
      setPlayers(fetched);
      setLoading(false);
    }
    fetchAthletes();
  }, []);

  function handlePlayerClick(slot, player, slotIndex) {
    navigate("/scouting/substitution", { state: { slot, slotIndex, player } });
  }

  return (
    <div className="your-team-page">
      <div className="yt-bg" aria-hidden="true">
        <img src={PitchBg} alt="" className="yt-bg-img" />
        <div className="yt-gradient" />
      </div>

      <div className="yt-topbar">
        <button className="yt-back-btn" onClick={() => navigate("/scouting")} aria-label="Back">
          <CaretLeft size={20} weight="bold" />
        </button>
        <h1 className="yt-title">YOUR TEAM</h1>
        <button className="yt-close-btn" onClick={() => navigate("/scouting")} aria-label="Close">
          <X size={20} weight="bold" />
        </button>
      </div>

      <div className="yt-ovr-card">
        <div className="yt-ovr-left">
          <span className="yt-ovr-rotated-label">team ovr</span>
          <OvrBadge value={stats.ovr} size="lg" variant="gold" />
        </div>
        <div className="yt-ovr-divider" />
        <div className="yt-ovr-stats">
          <div className="yt-ovr-stat">
            <span className="yt-ovr-stat-label">DEF</span>
            <span className="yt-ovr-stat-value">{stats.def}</span>
          </div>
          <div className="yt-ovr-stat">
            <span className="yt-ovr-stat-label">ATT</span>
            <span className="yt-ovr-stat-value">{stats.att}</span>
          </div>
          <div className="yt-ovr-stat">
            <span className="yt-ovr-stat-label">MID</span>
            <span className="yt-ovr-stat-value">{stats.mid}</span>
          </div>
        </div>
      </div>

      {!loading && (
        <div className="yt-players" aria-label="Team formation" role="group">
          {FORMATION_SLOTS.map((slot, i) => (
            <PlayerMarker
              key={i}
              slot={slot}
              player={players[i] ?? null}
              onClick={(s, p) => handlePlayerClick(s, p, i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
