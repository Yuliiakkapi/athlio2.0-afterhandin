import { useState, useRef } from "react";
import { ArrowsLeftRight } from "@phosphor-icons/react";
import OvrBadge from "../../UI/OvrBadge";
import "./PlayerStatCard.css";

const SNAP_THRESHOLD = 50;
const OPEN_OFFSET = 80;

function TrendChip({ value }) {
  const up = typeof value === "number" ? value >= 0 : true;
  const label = typeof value === "number" ? `${Math.abs(value)}% this week` : value;
  return (
    <div className={`psc-trend text-2xs-medium${up ? " psc-trend--up" : " psc-trend--down"}`}>
      <span className="psc-trend-arrow" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function StatBox({ label, value, trend }) {
  return (
    <div className="psc-stat-box">
      <span className="psc-stat-label text-2xs-medium">{label}</span>
      <span className="psc-stat-value">{value}</span>
      <TrendChip value={trend} />
    </div>
  );
}

/**
 * Shared player stat card used in Watchlist, SelectPlayers, and SearchPlayers.
 *
 * player shape:
 *   { id, name, club, age, position, ovr, avatarUrl, initials,
 *     stats: [{ label, value, trend }] }
 *   trend: signed number (+ up, – down) or display string (treated as up)
 *
 * Behaviour driven by optional callbacks:
 *   onDelete  → swipe-to-delete enabled
 *   onCompare → compare button shown
 *   onSelect  → card is clickable
 */
export default function PlayerStatCard({ player, onDelete, onCompare, onSelect }) {
  const [offsetX, setOffsetX] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const swipeable = !!onDelete;

  function onPointerDown(e) {
    if (!swipeable || e.button !== 0) return;
    startX.current = e.clientX;
    startOffset.current = isOpen ? -OPEN_OFFSET : 0;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!swipeable || !dragging) return;
    const raw = startOffset.current + (e.clientX - startX.current);
    setOffsetX(Math.max(-OPEN_OFFSET, Math.min(0, raw)));
  }

  function onPointerUp() {
    if (!swipeable || !dragging) return;
    setDragging(false);
    if (offsetX < -SNAP_THRESHOLD) {
      setOffsetX(-OPEN_OFFSET);
      setIsOpen(true);
    } else {
      setOffsetX(0);
      setIsOpen(false);
    }
  }

  const card = (
    <div
      className={`psc-card${dragging ? "" : " psc-card--snap"}${onSelect ? " psc-card--selectable" : ""}`}
      style={swipeable ? { transform: `translateX(${offsetX}px)` } : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onSelect ? () => onSelect(player) : undefined}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? (e) => e.key === "Enter" && onSelect(player) : undefined}
    >
      <div className="psc-card-ovr">
        <OvrBadge value={player.ovr} size="md" />
      </div>

      <div className="psc-card-top">
        <div className="psc-card-avatar">
          {player.avatarUrl ? (
            <img src={player.avatarUrl} alt="" />
          ) : (
            <span>{player.initials}</span>
          )}
        </div>

        <div className="psc-card-info">
          <span className="psc-card-name">{player.name}</span>
          <div className="psc-card-meta text-sm-medium">
            {player.club && <span>{player.club}</span>}
            {player.club && (player.age || player.position) && (
              <span className="psc-meta-dot" aria-hidden="true" />
            )}
            {player.age && <span>{player.age}y.o.</span>}
            {player.age && player.position && (
              <span className="psc-meta-dot" aria-hidden="true" />
            )}
            {player.position && <span>{player.position}</span>}
          </div>
        </div>

        {onCompare && (
          <button
            className="psc-compare-btn"
            aria-label={`Compare ${player.name}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onCompare(player); }}
          >
            <ArrowsLeftRight size={18} weight="bold" />
          </button>
        )}
      </div>

      <div className="psc-card-stats">
        {player.stats.map((s) => (
          <StatBox key={s.label} label={s.label} value={s.value} trend={s.trend} />
        ))}
      </div>
    </div>
  );

  if (!swipeable) {
    return <div className="psc-card-wrap">{card}</div>;
  }

  return (
    <div className="psc-card-wrap">
      <div className="psc-delete-zone">
        <button
          className="psc-delete-btn"
          onClick={() => onDelete(player.id)}
          aria-label={`Delete ${player.name}`}
        >
          <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
          </svg>
        </button>
      </div>
      {card}
    </div>
  );
}
