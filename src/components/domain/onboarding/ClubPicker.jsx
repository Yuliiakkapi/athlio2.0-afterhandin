import { useMemo, useRef, useState } from "react";
import { MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import CLUBS, { FEATURED_IDS } from "../../../data/clubs.js";
import "./ClubPicker.css";

const FEATURED = FEATURED_IDS.map(id => CLUBS.find(c => c.id === id)).filter(Boolean);

function searchClubs(query) {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  return CLUBS.filter(c =>
    c.name.toLowerCase().includes(term) ||
    c.league.toLowerCase().includes(term) ||
    c.country.toLowerCase().includes(term)
  ).slice(0, 20);
}

function ClubLogo({ club }) {
  if (club.logo) {
    return <img src={club.logo} alt={`${club.name} logo`} className="team-club-logo" />;
  }
  // Coloured initials placeholder
  const initials = club.name
    .split(/\s+/)
    .filter(w => /^[A-Z]/u.test(w))
    .slice(0, 2)
    .map(w => w[0])
    .join("") || club.name[0];
  return (
    <div className="team-club-logo-placeholder team-club-logo-initials" aria-hidden="true">
      {initials}
    </div>
  );
}

export default function ClubPicker({ value, onChange }) {
  const [query, setQuery]           = useState("");
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState(value?.club_other_name || "");
  const inputRef = useRef(null);

  const results  = useMemo(() => searchClubs(query), [query]);
  const showList = query.trim().length >= 2 ? results : FEATURED;
  const listLabel = query.trim().length >= 2 ? "Search results" : "Featured clubs";

  function pickClub(club) {
    setShowManual(false);
    onChange({ club_id: null, club_other_name: club.name });
  }

  function commitManual() {
    const clean = manualName.trim();
    if (!clean) return;
    onChange({ club_id: null, club_other_name: clean });
    setShowManual(false);
  }

  return (
    <div className="team-step">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="team-header">
        <h1 className="team-title">Your Team</h1>
        <p className="team-subtitle">Which team are you currently playing for?</p>
      </div>

      {/* ── Search bar ─────────────────────────────────────────── */}
      <div className="team-search-wrap">
        <MagnifyingGlass size={18} weight="regular" className="team-search-icon" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          className="team-search-input"
          placeholder="Search for your club..."
          value={query}
          onChange={e => { setQuery(e.target.value); setShowManual(false); }}
          autoComplete="off"
        />
        {query.length > 0 && (
          <button
            type="button"
            className="team-search-clear"
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            aria-label="Clear search"
          >
            <X size={16} weight="bold" />
          </button>
        )}
      </div>

      {/* ── Manual entry form ──────────────────────────────────── */}
      {showManual && (
        <div className="team-manual-wrap">
          <input
            type="text"
            className="team-manual-input"
            placeholder="Enter your team name"
            value={manualName}
            onChange={e => {
              setManualName(e.target.value);
              onChange({ club_id: null, club_other_name: e.target.value });
            }}
            onKeyDown={e => e.key === "Enter" && commitManual()}
            autoFocus
          />
        </div>
      )}

      {/* ── Club list ──────────────────────────────────────────── */}
      <div className="team-list-wrap">
        <p className="team-list-label">{listLabel}</p>

        <div className="team-list">
          {showList.map(club => {
            const selected = value?.club_other_name === club.name;
            return (
              <button
                key={club.id}
                type="button"
                className={`team-club-btn${selected ? " team-club-btn--selected" : ""}`}
                onClick={() => pickClub(club)}
              >
                <ClubLogo club={club} />
                <div className="team-club-meta">
                  <span className="team-club-name">{club.name}</span>
                  <span className="team-club-sub">{club.league} · {club.country}</span>
                </div>
              </button>
            );
          })}

          {query.trim().length >= 2 && results.length === 0 && (
            <p className="team-empty">No clubs found for "{query}"</p>
          )}

          {/* Add manually */}
          <button
            type="button"
            className="team-add-btn"
            onClick={() => { setShowManual(true); setQuery(""); }}
          >
            <div className="team-add-icon" aria-hidden="true">
              <Plus size={20} weight="regular" />
            </div>
            <span className="team-add-label">Add your team manually</span>
          </button>
        </div>
      </div>
    </div>
  );
}
