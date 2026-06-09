import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CaretLeft, SlidersHorizontal, ArrowsLeftRight } from "@phosphor-icons/react";
import OvrBadge from "../components/UI/OvrBadge";
import NavigationTabs from "../components/UI/NavTabs";
import { fetchPlayerSuggestions } from "../lib/profiles";
import { toPositionAbbr } from "../utils/positions";
import "./Watchlist.css";

/* ─── Seed-based fake stats (same approach as Scouting.jsx) ──────── */

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}
function fakeStatVal(idStr, base, range) {
  const n = idStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return +(seededRand(n * 7919)() * range + base).toFixed(1);
}
function fakeTrend(idStr, salt) {
  const n = (idStr + salt).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const v = Math.round(seededRand(n)() * 60 - 20);
  return v;
}
function fakeOvr(idStr) {
  const n = idStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.round(seededRand(n * 3571)() * 40 + 50);
}
function fakeWinPct(idStr) {
  const n = idStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.round(seededRand(n * 1234)() * 60 + 20);
}

function normalizeForWatchlist(p) {
  const positions = Array.isArray(p.position) ? p.position : p.position ? [p.position] : [];
  const parts = (p.full_name || "Unknown").trim().split(" ");
  const initials = parts.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return {
    id: p.id,
    name: p.full_name || "Unknown",
    initials,
    avatarUrl: p.avatar_url || null,
    club: null,
    age: null,
    position: positions.length > 0 ? toPositionAbbr(positions[0]) : "—",
    ovr: fakeOvr(p.id),
    stats: [
      { label: "GPM",  value: String(fakeStatVal(p.id, 0.2, 1.8)),      trend: fakeTrend(p.id, "g") },
      { label: "APM",  value: String(fakeStatVal(p.id + "a", 0.3, 2.0)), trend: fakeTrend(p.id, "a") },
      { label: "%WIN", value: fakeWinPct(p.id) + "%",                    trend: fakeTrend(p.id, "w") },
    ],
  };
}

const TABS = [
  { id: "all",   label: "All" },
  { id: "list1", label: "Watchlist 1" },
];

/* ─── Trend chip ─────────────────────────────────────────────────── */

function TrendChip({ value }) {
  const up = value >= 0;
  return (
    <div className={`wl-trend text-2xs-medium${up ? " wl-trend--up" : " wl-trend--down"}`}>
      <span className="wl-trend-arrow" aria-hidden="true" />
      <span>{Math.abs(value)}% this week</span>
    </div>
  );
}

/* ─── Stat box ───────────────────────────────────────────────────── */

function StatBox({ label, value, trend }) {
  return (
    <div className="wl-stat-box">
      <span className="wl-stat-label text-2xs-medium">{label}</span>
      <span className="wl-stat-value">{value}</span>
      <TrendChip value={trend} />
    </div>
  );
}

/* ─── Swipeable player card ──────────────────────────────────────── */

const SNAP_THRESHOLD = 50;
const OPEN_OFFSET    = 80;

function PlayerCard({ player, onDelete, onCompare, onOpen }) {
  const [offsetX,  setOffsetX]  = useState(0);
  const [isOpen,   setIsOpen]   = useState(false);
  const [dragging, setDragging] = useState(false);
  const didDrag     = useRef(false);
  const startX      = useRef(0);
  const startOffset = useRef(0);

  function onPointerDown(e) {
    if (e.button !== 0) return;
    startX.current      = e.clientX;
    startOffset.current = isOpen ? -OPEN_OFFSET : 0;
    didDrag.current     = false;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const delta = e.clientX - startX.current;
    if (Math.abs(delta) > 4) didDrag.current = true;
    const raw = startOffset.current + delta;
    setOffsetX(Math.max(-OPEN_OFFSET, Math.min(0, raw)));
  }

  function onPointerUp() {
    if (!dragging) return;
    setDragging(false);
    if (offsetX < -SNAP_THRESHOLD) {
      setOffsetX(-OPEN_OFFSET);
      setIsOpen(true);
    } else {
      setOffsetX(0);
      setIsOpen(false);
    }
  }

  function handleCardClick() {
    if (didDrag.current) return;
    if (isOpen) { setOffsetX(0); setIsOpen(false); return; }
    onOpen(player.id);
  }

  return (
    <div className="wl-card-wrap">
      {/* Red delete zone */}
      <div className="wl-delete-zone">
        <button
          className="wl-delete-btn"
          onClick={() => onDelete(player.id)}
          aria-label={`Delete ${player.name}`}
        >
          <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/>
          </svg>
        </button>
      </div>

      {/* Swipeable card surface */}
      <div
        className={`wl-card${dragging ? "" : " wl-card--snap"}`}
        style={{ transform: `translateX(${offsetX}px)`, cursor: "pointer" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={handleCardClick}
      >
        {/* OVR badge — absolute over avatar */}
        <div className="wl-card-ovr">
          <OvrBadge value={player.ovr} size="md" />
        </div>

        {/* Top row: avatar + info + compare btn */}
        <div className="wl-card-top">
          <div className="wl-card-avatar">
            {player.avatarUrl
              ? <img src={player.avatarUrl} alt="" />
              : <span>{player.initials}</span>
            }
          </div>

          <div className="wl-card-info">
            <span className="wl-card-name">{player.name}</span>
            <div className="wl-card-meta text-sm-medium">
              {player.club && <><span>{player.club}</span><span className="wl-meta-dot" aria-hidden="true" /></>}
              {player.age  && <><span>{player.age}y.o.</span><span className="wl-meta-dot" aria-hidden="true" /></>}
              <span>{player.position}</span>
            </div>
          </div>

          <button
            className="wl-compare-card-btn"
            aria-label={`Compare ${player.name}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onCompare(player); }}
          >
            <ArrowsLeftRight size={18} weight="bold" />
          </button>
        </div>

        {/* Stats row */}
        <div className="wl-card-stats">
          {player.stats.map((s) => (
            <StatBox key={s.label} label={s.label} value={s.value} trend={s.trend} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */

export default function Watchlist() {
  const navigate    = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [players,   setPlayers]   = useState([]);

  useEffect(() => {
    fetchPlayerSuggestions(10)
      .then((raw) => setPlayers(raw.map(normalizeForWatchlist)))
      .catch(console.error);
  }, []);

  function handleDelete(id) {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }

  function handleCompare(player) {
    navigate("/progress/compare", { state: { player } });
  }

  function handleOpen(id) {
    navigate(`/profile/${id}`);
  }

  return (
    <div className="watchlist-page">
      {/* Header */}
      <div className="wl-topbar">
        <button className="wl-icon-btn" onClick={() => navigate(-1)} aria-label="Back">
          <CaretLeft size={24} weight="bold" />
        </button>
        <h1 className="wl-title heading-3xl-italic">Watchlist</h1>
        <button className="wl-icon-btn" aria-label="Filter">
          <SlidersHorizontal size={24} />
        </button>
      </div>

      {/* Segment tabs */}
      <div className="wl-tabs-wrap">
        <NavigationTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="pill"
        />
      </div>

      {/* Player list */}
      <div className="wl-list">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} onDelete={handleDelete} onCompare={handleCompare} onOpen={handleOpen} />
        ))}
      </div>

      {/* Compare FAB — navigates to the select-player page */}
      <div className="wl-compare-wrap">
        <span className="wl-compare-label text-sm-semibold">Compare</span>
        <button
          className="wl-compare-btn"
          aria-label="Compare players"
          onClick={() => navigate("/progress/compare/select")}
        >
          <ArrowsLeftRight size={24} weight="bold" />
        </button>
      </div>
    </div>
  );
}
