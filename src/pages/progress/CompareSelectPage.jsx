import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MagnifyingGlass, SlidersHorizontal } from "@phosphor-icons/react";
import OvrBadge from "../../components/UI/OvrBadge";
import { fetchPlayerSuggestions } from "../../lib/profiles";
import { toPositionAbbr } from "../../utils/positions";
import "./CompareSelectPage.css";

function seededRand(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function fakeStats(id) {
  const r = seededRand(id * 7919);
  const gpm  = (r() * 1.8 + 0.2).toFixed(1);
  const apm  = (r() * 2.0 + 0.3).toFixed(1);
  const win  = Math.round(r() * 55 + 20);
  const tGpm = Math.round(r() * 40 - 10);
  const tApm = Math.round(r() * 40 - 10);
  const tWin = Math.round(r() * 30 - 5);
  return [
    { label: "GPM",  value: gpm,       trend: tGpm },
    { label: "APM",  value: apm,       trend: tApm },
    { label: "%WIN", value: `${win}%`, trend: tWin },
  ];
}

function fakeOvr(id) {
  const r = seededRand(id * 3571);
  return Math.round(r() * 40 + 50);
}

function toInitials(name) {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function normalizePlayer(p) {
  const idNum = p.id
    ? p.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    : 1;
  const positions = Array.isArray(p.position)
    ? p.position
    : p.position
    ? [p.position]
    : [];
  const posAbbr = positions.length ? toPositionAbbr(positions[0]) : null;
  const clubName = p.club || null;
  return {
    id: p.id,
    name: p.full_name || "Unknown",
    club: clubName,
    age: p.age ?? null,
    position: posAbbr,
    ovr: fakeOvr(idNum),
    initials: toInitials(p.full_name),
    avatarUrl: p.avatar_url || null,
    stats: fakeStats(idNum),
  };
}

function TrendChip({ value }) {
  const up = value >= 0;
  return (
    <div className={`csp-trend${up ? " csp-trend--up" : " csp-trend--down"}`}>
      <span className="csp-trend-arrow" aria-hidden="true" />
      <span>{Math.abs(value)}% this week</span>
    </div>
  );
}

function StatBox({ label, value, trend }) {
  return (
    <div className="csp-stat-box">
      <span className="csp-stat-label">{label}</span>
      <span className="csp-stat-value">{value}</span>
      <TrendChip value={trend} />
    </div>
  );
}

function PlayerSelectCard({ player, selected, onSelect }) {
  return (
    <button
      className={`csp-card${selected ? " csp-card--selected" : ""}`}
      onClick={() => onSelect(player.id)}
    >
      <div className="csp-card-top">
        <div className="csp-avatar-wrap">
          <div className="csp-avatar">
            {player.avatarUrl
              ? <img src={player.avatarUrl} alt={player.name} className="csp-avatar-img" />
              : <span className="csp-avatar-initials">{player.initials}</span>
            }
          </div>
          <div className="csp-ovr">
            <OvrBadge value={player.ovr} size="md" />
          </div>
        </div>

        <div className="csp-card-info">
          <span className="csp-player-name">{player.name}</span>
          <div className="csp-player-meta">
            {player.club && <span className="csp-meta-text">{player.club}</span>}
            {player.club && player.age && <span className="csp-dot" />}
            {player.age && <span className="csp-meta-text">{player.age}y.o.</span>}
            {(player.club || player.age) && player.position && <span className="csp-dot" />}
            {player.position && <span className="csp-meta-text">{player.position}</span>}
          </div>
        </div>
      </div>

      <div className="csp-card-stats">
        {player.stats.map((s) => (
          <StatBox key={s.label} label={s.label} value={s.value} trend={s.trend} />
        ))}
      </div>
    </button>
  );
}

export default function CompareSelectPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(
    location.state?.preSelectedId ?? null
  );

  useEffect(() => {
    fetchPlayerSuggestions(30)
      .then((raw) => setPlayers(raw.map(normalizePlayer)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = players.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.club && p.club.toLowerCase().includes(q)) ||
      (p.position && p.position.toLowerCase().includes(q))
    );
  });

  function handleContinue() {
    const player = players.find((p) => p.id === selectedId);
    navigate("/progress/compare", { state: { player } });
  }

  return (
    <div className="csp-page">
      {/* Search bar */}
      <div className="csp-search-bar-wrap">
        <div className="csp-search-bar">
          <MagnifyingGlass size={18} className="csp-search-icon" weight="regular" />
          <input
            className="csp-search-input"
            type="text"
            placeholder="Search athletes, scouts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="csp-filter-btn" aria-label="Filters">
          <SlidersHorizontal size={22} />
        </button>
      </div>

      {/* Player list */}
      <div className="csp-list">
        <span className="csp-section-label">Suggested players</span>

        {loading && <p className="csp-empty">Loading…</p>}

        {!loading && filtered.map((player) => (
          <PlayerSelectCard
            key={player.id}
            player={player}
            selected={selectedId === player.id}
            onSelect={setSelectedId}
          />
        ))}

        {!loading && filtered.length === 0 && (
          <p className="csp-empty">No players match your search.</p>
        )}
      </div>

      {/* Continue button — sticky at bottom */}
      <div className="csp-footer">
        <button
          className="csp-continue-btn"
          disabled={selectedId === null}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
