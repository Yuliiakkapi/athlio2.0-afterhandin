import { useEffect, useMemo, useRef, useState } from "react";
import { CaretDown, MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import { supabase } from "../../../lib/supabase.js";
import "./ClubPicker.css";

const TEAM_TYPES = ["Main Team", "Reserve", "U-23", "U-21", "U-19", "Academy", "Youth"];

function searchClubs(clubs, query) {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  return clubs.filter(c =>
    c.name.toLowerCase().includes(term) ||
    (c.league && c.league.toLowerCase().includes(term)) ||
    (c.country && c.country.toLowerCase().includes(term))
  ).slice(0, 20);
}

function ClubLogo({ club }) {
  const logoSrc = club.logo_url || club.logo;
  if (logoSrc) {
    return <img src={logoSrc} alt={`${club.name} logo`} className="team-club-logo" />;
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

function pickFeatured(clubs, userCity, userCountry) {
  const city    = (userCity    || "").toLowerCase().trim();
  const country = (userCountry || "").toLowerCase().trim();

  if (!city && !country) return clubs.slice(0, 4);

  const scored = clubs.map(c => {
    let score = 0;
    if (city    && c.city    && c.city.toLowerCase().includes(city))       score += 2;
    if (country && c.country && c.country.toLowerCase().includes(country)) score += 1;
    return { ...c, _score: score };
  });

  const nearby = scored.filter(c => c._score > 0).sort((a, b) => b._score - a._score);
  if (nearby.length >= 4) return nearby.slice(0, 4);

  const rest = scored.filter(c => c._score === 0).slice(0, 4 - nearby.length);
  return [...nearby, ...rest];
}

export default function ClubPicker({ value, onChange, onNext, userCity, userCountry }) {
  const [query, setQuery]               = useState("");
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [clubs, setClubs]               = useState([]);
  const [featured, setFeatured]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    async function fetchClubs() {
      let city    = userCity    || "";
      let country = userCountry || "";

      // Fall back to browser geolocation if no location from the form
      if (!city && !country && navigator.geolocation) {
        try {
          const pos = await new Promise((res, rej) =>
            navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
          );
          const geo = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          ).then(r => r.json());
          city    = geo.address?.city || geo.address?.town || geo.address?.village || "";
          country = geo.address?.country || "";
        } catch {
          // geolocation unavailable or denied — proceed without
        }
      }

      const { data, error } = await supabase
        .from("clubs")
        .select("id, name, league, country, city, logo_url")
        .order("name", { ascending: true });

      if (error) {
        console.error("clubs fetch error:", error);
      } else if (data) {
        setClubs(data);
        setFeatured(pickFeatured(data, city, country));
      }
      setLoading(false);
    }
    fetchClubs();
  }, [userCity, userCountry]);

  const results  = useMemo(() => searchClubs(clubs, query), [clubs, query]);
  const showList = query.trim().length >= 2 ? results : featured;
  const hasLocation = !!(userCity || userCountry);
  const listLabel = query.trim().length >= 2 ? "Search results" : hasLocation ? "Nearby clubs" : "Featured clubs";

  function pickClub(club) {
    onChange({ club_id: club.id, club_other_name: club.name, logo_url: club.logo_url || null });
  }

  async function handleAddTeam({ clubName, city, league, teamType }) {
    const { data, error } = await supabase
      .from("clubs")
      .insert({ name: clubName, city: city || null, league: league || null, country: userCountry || null, sport: "football" })
      .select("id")
      .single();

    const clubId = (!error && data) ? data.id : null;

    onChange({
      club_id: clubId,
      club_other_name: clubName,
      club_city: city || undefined,
      club_league: league || undefined,
      club_team_type: teamType,
    });
    setShowAddSheet(false);
    onNext?.();
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
          {loading && <p className="team-empty">Loading clubs…</p>}
          {!loading && showList.map(club => {
            const selected = value?.club_id === club.id || value?.club_other_name === club.name;
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

          {!loading && query.trim().length >= 2 && results.length === 0 && (
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
