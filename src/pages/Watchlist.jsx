import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CaretLeft, SlidersHorizontal, ArrowsLeftRight } from "@phosphor-icons/react";
import OvrBadge from "../components/UI/OvrBadge";
import NavigationTabs from "../components/UI/NavTabs";
import "./Watchlist.css";

/* ─── Mock data ─────────────────────────────────────────────────── */

const MOCK_PLAYERS = [
  {
    id: 1, name: "Emil Jonansen Bryld", club: "Real Madrid", age: 18, position: "ST",
    ovr: 72, initials: "EB", avatarUrl: null,
    stats: [
      { label: "GPM",  value: "1.2", trend: +24 },
      { label: "APM",  value: "1.5", trend: +30 },
      { label: "%WIN", value: "39%", trend: +22 },
    ],
  },
  {
    id: 2, name: "Jakub Malenovský", club: "Real Madrid", age: 18, position: "CAM",
    ovr: 65, initials: "JM", avatarUrl: null,
    stats: [
      { label: "GPM",  value: "1.2", trend: +24 },
      { label: "APM",  value: "1.5", trend: -30 },
      { label: "%WIN", value: "22%", trend: +22 },
    ],
  },
  {
    id: 3, name: "Emil Jonansen Bryld", club: "Real Madrid", age: 18, position: "LW",
    ovr: 55, initials: "EB", avatarUrl: null,
    stats: [
      { label: "GPM",  value: "1.2", trend: +24 },
      { label: "APM",  value: "1.5", trend: +30 },
      { label: "%WIN", value: "22%", trend: +22 },
    ],
  },
];

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

function PlayerCard({ player, onDelete }) {
  const [offsetX,  setOffsetX]  = useState(0);
  const [isOpen,   setIsOpen]   = useState(false);
  const [dragging, setDragging] = useState(false);
  const startX      = useRef(0);
  const startOffset = useRef(0);

  function onPointerDown(e) {
    if (e.button !== 0) return;
    startX.current      = e.clientX;
    startOffset.current = isOpen ? -OPEN_OFFSET : 0;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const raw = startOffset.current + (e.clientX - startX.current);
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

  return (
    <div className="wl-card-wrap">
      {/* Red delete zone */}
      <div className="wl-delete-zone">
        <button
          className="wl-delete-btn"
          onClick={() => onDelete(player.id)}
          aria-label={`Delete ${player.name}`}
        >
          {/* Trash icon via SVG to avoid additional import */}
          <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/>
          </svg>
        </button>
      </div>

      {/* Swipeable card surface */}
      <div
        className={`wl-card${dragging ? "" : " wl-card--snap"}`}
        style={{ transform: `translateX(${offsetX}px)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* OVR badge — absolute over avatar */}
        <div className="wl-card-ovr">
          <OvrBadge value={player.ovr} size="md" />
        </div>

        {/* Top row: avatar + info */}
        <div className="wl-card-top">
          <div className="wl-card-avatar">
            {player.avatarUrl ? (
              <img src={player.avatarUrl} alt="" />
            ) : (
              <span>{player.initials}</span>
            )}
          </div>

          <div className="wl-card-info">
            <span className="wl-card-name">{player.name}</span>
            <div className="wl-card-meta text-sm-medium">
              <span>{player.club}</span>
              <span className="wl-meta-dot" aria-hidden="true" />
              <span>{player.age}y.o.</span>
              <span className="wl-meta-dot" aria-hidden="true" />
              <span>{player.position}</span>
            </div>
          </div>
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
  const [players,   setPlayers]   = useState(MOCK_PLAYERS);

  function handleDelete(id) {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
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

      {/* Segment tabs — same component as Profile */}
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
          <PlayerCard key={player.id} player={player} onDelete={handleDelete} />
        ))}
      </div>

      {/* Compare FAB */}
      <div className="wl-compare-wrap">
        <span className="wl-compare-label text-sm-semibold">Compare</span>
        <button className="wl-compare-btn" aria-label="Compare players">
          <ArrowsLeftRight size={24} weight="bold" />
        </button>
      </div>
    </div>
  );
}
