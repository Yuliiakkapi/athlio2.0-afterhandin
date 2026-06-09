import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal, ArrowsLeftRight, MagnifyingGlass, Check } from "@phosphor-icons/react";
import OvrBadge from "../components/UI/OvrBadge";
import NavigationTabs from "../components/UI/NavTabs";
import IconButton from "../components/UI/IconButton";
import { fetchWatchlist, removeFromWatchlist } from "../lib/watchlist";
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
    club: p.club || null,
    age: p.age || null,
    positions: positions.slice(0, 2).map(toPositionAbbr),
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

function PlayerCard({ player, onDelete, onOpen, comparing, selected, onSelectPlayer }) {
  const [offsetX,  setOffsetX]  = useState(0);
  const [isOpen,   setIsOpen]   = useState(false);
  const [dragging, setDragging] = useState(false);
  const didDrag     = useRef(false);
  const startX      = useRef(0);
  const startOffset = useRef(0);

  function onPointerDown(e) {
    if (e.button !== 0) return;
    if (comparing) return;
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
    if (comparing) { onSelectPlayer(player.id); return; }
    if (didDrag.current) return;
    if (isOpen) { setOffsetX(0); setIsOpen(false); return; }
    onOpen(player.id);
  }

  return (
    <div className="wl-card-wrap">
      {/* Red delete zone — hidden in comparing mode */}
      {!comparing && (
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
      )}

      {/* Card surface */}
      <div
        className={`wl-card${dragging ? "" : " wl-card--snap"}${selected ? " wl-card--selected" : ""}`}
        style={{ transform: comparing ? "none" : `translateX(${offsetX}px)`, cursor: "pointer" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={handleCardClick}
      >
        {/* Top row: avatar + info */}
        <div className="wl-card-top">
          <div className="wl-card-photo-wrap">
            {player.avatarUrl
              ? <img src={player.avatarUrl} alt="" className="wl-card-photo" />
              : <div className="wl-card-initials">{player.initials}</div>
            }
            <div className="wl-card-ovr">
              <OvrBadge value={player.ovr} size="sm" variant="gold" />
            </div>
          </div>

          <div className="wl-card-info">
            <span className="wl-card-name">{player.name}</span>
            <div className="wl-card-meta">
              {player.positions.map((pos) => (
                <span key={pos} className="wl-pos-badge">{pos}</span>
              ))}
              {player.club && <span className="wl-card-club">{player.club}</span>}
              {player.club && player.age && <span className="wl-meta-dot" aria-hidden="true" />}
              {player.age && <span className="wl-card-age">{player.age}y.o.</span>}
            </div>
          </div>

          {selected && (
            <div className="wl-card-check" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="var(--primary-default,#4051fd)" />
                <polyline points="5,10 8.5,13.5 15,7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
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
  const navigate      = useNavigate();
  const { state: locationState } = useLocation();
  const fillSlotMode  = locationState?.compareMode === true;
  const fillSlot      = locationState?.slot || null;        // "left" | "right"
  const fixedPlayer   = locationState?.fixedPlayer || null; // the already-chosen player

  const [activeTab,   setActiveTab]   = useState("all");
  const [players,     setPlayers]     = useState([]);
  const [comparing,   setComparing]   = useState(fillSlotMode);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchWatchlist()
      .then((raw) => setPlayers(raw.map(normalizeForWatchlist)))
      .catch(console.error);
  }, []);

  function handleDelete(id) {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    removeFromWatchlist(id).catch(console.error);
  }

  function handleOpen(id) {
    navigate(`/profile/${id}`);
  }

  function handleEnterCompare() {
    setComparing(true);
    setSelectedIds([]);
  }

  function handleCancelCompare() {
    if (fillSlotMode) {
      // Return to ComparePage keeping the player that's still there
      const playerA = fillSlot === "right" ? fixedPlayer : null;
      const playerB = fillSlot === "right" ? null        : fixedPlayer;
      navigate("/progress/compare", { state: { playerA, playerB } });
      return;
    }
    setComparing(false);
    setSelectedIds([]);
  }

  function handleSelectForCompare(id) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (fillSlotMode) return [id]; // only one pick when filling a slot
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  }

  function handleGoCompare() {
    const [idA, idB] = selectedIds;
    const pickedA = players.find((p) => p.id === idA) || null;
    const pickedB = players.find((p) => p.id === idB) || null;

    if (fillSlotMode && fixedPlayer) {
      const playerA = fillSlot === "right" ? fixedPlayer : pickedA;
      const playerB = fillSlot === "right" ? pickedA     : fixedPlayer;
      navigate("/progress/compare", { state: { playerA, playerB } });
      return;
    }

    navigate("/progress/compare", { state: { playerA: pickedA, playerB: pickedB } });
  }

  return (
    <div className="watchlist-page">
      {/* Header */}
      <div className="wl-topbar">
        <IconButton
          size="small"
          type="subtle"
          icon={ArrowLeft}
          onClick={comparing ? handleCancelCompare : () => navigate("/scouting")}
        />
        <h1 className="wl-title">
          {comparing ? "Select players" : "Watchlist"}
        </h1>
        <IconButton size="small" type="subtle" icon={SlidersHorizontal} />
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
        {players.length === 0 ? (
          <div className="wl-empty">
            <p className="wl-empty-text text-sm-medium">No saved players yet.</p>
            <button
              className="wl-search-btn text-sm-semibold"
              onClick={() => navigate("/scouting/search")}
            >
              <MagnifyingGlass size={18} weight="bold" />
              Search Players
            </button>
          </div>
        ) : (
          players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onDelete={handleDelete}
              onOpen={handleOpen}
              comparing={comparing}
              selected={selectedIds.includes(player.id)}
              onSelectPlayer={handleSelectForCompare}
            />
          ))
        )}
      </div>

      {/* Compare FAB */}
      <div className="wl-compare-wrap">
        <span className="wl-compare-label text-sm-semibold">Compare</span>
        {comparing ? (
          <button
            className="wl-compare-btn wl-compare-btn--confirm"
            aria-label="Confirm compare"
            disabled={selectedIds.length === 0}
            onClick={handleGoCompare}
          >
            <Check size={24} weight="bold" />
          </button>
        ) : (
          <button
            className="wl-compare-btn"
            aria-label="Compare players"
            onClick={handleEnterCompare}
          >
            <ArrowsLeftRight size={24} weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
}
