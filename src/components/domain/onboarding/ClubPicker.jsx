import { useMemo, useRef, useState } from "react";
import { CaretDown, MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import CLUBS, { FEATURED_IDS } from "../../../data/clubs.js";
import "./ClubPicker.css";

const FEATURED = FEATURED_IDS.map(id => CLUBS.find(c => c.id === id)).filter(Boolean);

const TEAM_TYPES = ["Main Team", "Reserve", "U-23", "U-21", "U-19", "Academy", "Youth"];

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

function AddTeamSheet({ onClose, onSubmit }) {
  const [clubName, setClubName] = useState("");
  const [city, setCity]         = useState("");
  const [league, setLeague]     = useState("");
  const [teamType, setTeamType] = useState("Main Team");

  function handleSubmit() {
    const clean = clubName.trim();
    if (!clean) return;
    onSubmit({ clubName: clean, city: city.trim(), league: league.trim(), teamType });
  }

  return (
    <div className="add-team-backdrop" onClick={onClose}>
      <div className="add-team-sheet" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="add-team-header">
          <span className="add-team-title">Add your team</span>
          <button className="add-team-close" onClick={onClose} aria-label="Close">
            <X size={24} weight="regular" />
          </button>
        </div>

        {/* Body */}
        <div className="add-team-body">
          <input
            className="add-team-input"
            placeholder="Club name *"
            value={clubName}
            onChange={e => setClubName(e.target.value)}
            autoFocus
          />
          <input
            className="add-team-input"
            placeholder="City *"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <input
            className="add-team-input"
            placeholder="League or division *"
            value={league}
            onChange={e => setLeague(e.target.value)}
          />
          <div className="add-team-select-wrap">
            <select
              className="add-team-select"
              value={teamType}
              onChange={e => setTeamType(e.target.value)}
            >
              {TEAM_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <CaretDown size={18} className="add-team-select-icon" aria-hidden="true" />
          </div>
        </div>

        {/* Footer */}
        <div className="add-team-footer">
          <button
            className="add-team-submit"
            onClick={handleSubmit}
            disabled={!clubName.trim()}
          >
            Add club
          </button>
        </div>

      </div>
    </div>
  );
}

export default function ClubPicker({ value, onChange }) {
  const [query, setQuery]             = useState("");
  const [showAddSheet, setShowAddSheet] = useState(false);
  const inputRef = useRef(null);

  const results  = useMemo(() => searchClubs(query), [query]);
  const showList = query.trim().length >= 2 ? results : FEATURED;
  const listLabel = query.trim().length >= 2 ? "Search results" : "Featured clubs";

  function pickClub(club) {
    onChange({ club_id: null, club_other_name: club.name });
  }

  function handleAddTeam({ clubName, city, league, teamType }) {
    onChange({
      club_id: null,
      club_other_name: clubName,
      club_city: city || undefined,
      club_league: league || undefined,
      club_team_type: teamType,
    });
    setShowAddSheet(false);
  }

  return (
    <div className="team-step">
      {/* Header */}
      <div className="team-header">
        <h1 className="team-title">Your Team</h1>
        <p className="team-subtitle">Which team are you currently playing for?</p>
      </div>

      {/* Search bar */}
      <div className="team-search-wrap">
        <MagnifyingGlass size={18} weight="regular" className="team-search-icon" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          className="team-search-input"
          placeholder="Search for your club..."
          value={query}
          onChange={e => setQuery(e.target.value)}
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

      {/* Club list */}
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
            onClick={() => setShowAddSheet(true)}
          >
            <div className="team-add-icon" aria-hidden="true">
              <Plus size={20} weight="regular" />
            </div>
            <span className="team-add-label">Add your team manually</span>
          </button>
        </div>
      </div>

      {/* Bottom sheet popover */}
      {showAddSheet && (
        <AddTeamSheet
          onClose={() => setShowAddSheet(false)}
          onSubmit={handleAddTeam}
        />
      )}
    </div>
  );
}
