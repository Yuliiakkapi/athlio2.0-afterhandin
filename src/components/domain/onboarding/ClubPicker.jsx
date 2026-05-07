import { useEffect, useRef, useState } from "react";
import { MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import "./ClubPicker.css";

const BASE = "https://www.thesportsdb.com/api/v1/json/3";

// 4 seed clubs shown before the user types anything
const FEATURED_SEEDS = ["Real Madrid", "FC Barcelona", "Manchester City", "Bayern Munich"];

function isSoccer(t) {
  const s = (t.strSport || "").toLowerCase();
  // Accept Soccer, Football, or no sport set (some clubs omit it)
  return !s || s === "soccer" || s === "football";
}

async function fetchOneSeed(name) {
  const res  = await fetch(`${BASE}/searchteams.php?t=${encodeURIComponent(name)}`);
  const json = await res.json();
  const teams = (json.teams || []).filter(isSoccer);
  // Prefer an exact name match, fall back to first result
  return (
    teams.find(t => t.strTeam.toLowerCase() === name.toLowerCase()) ||
    teams[0] ||
    null
  );
}

async function fetchFeatured() {
  const results = await Promise.all(FEATURED_SEEDS.map(name =>
    fetchOneSeed(name).catch(() => null)
  ));
  return results.filter(Boolean);
}

async function searchTeams(query) {
  const res  = await fetch(`${BASE}/searchteams.php?t=${encodeURIComponent(query)}`);
  const json = await res.json();
  return (json.teams || []).filter(isSoccer).slice(0, 20);
}

export default function ClubPicker({ value, onChange }) {
  const [query, setQuery]           = useState("");
  const [results, setResults]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState(value?.club_other_name || "");
  const inputRef    = useRef(null);
  const deb         = useRef(null);
  const featuredRef = useRef([]);

  // Load featured clubs on mount
  useEffect(() => {
    fetchFeatured().then(teams => {
      featuredRef.current = teams;
      setResults(teams);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Debounced search — restore featured when query is cleared
  useEffect(() => {
    if (deb.current) clearTimeout(deb.current);

    const term = query.trim();

    if (term.length < 2) {
      setResults(featuredRef.current);
      return;
    }

    setLoading(true);
    deb.current = setTimeout(() => {
      searchTeams(term)
        .then(teams => { setResults(teams); setLoading(false); })
        .catch(() => setLoading(false));
    }, 300);
  }, [query]);

  function pickClub(team) {
    setShowManual(false);
    onChange({ club_id: null, club_other_name: team.strTeam });
  }

  function commitManual() {
    const clean = manualName.trim();
    if (!clean) return;
    onChange({ club_id: null, club_other_name: clean });
    setShowManual(false);
  }

  const isListLabel = query.trim().length >= 2 ? "Search results" : "Featured clubs";

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
        <p className="team-list-label">{isListLabel}</p>

        <div className="team-list">
          {loading && results.length === 0 && (
            <p className="team-empty">Loading clubs…</p>
          )}

          {results.map(club => {
            const selected = value?.club_other_name === club.strTeam;
            const logo     = club.strTeamBadge ? `${club.strTeamBadge}/preview` : null;
            const sub      = club.strLeague || club.strCountry || "";
            return (
              <button
                key={club.idTeam}
                type="button"
                className={`team-club-btn${selected ? " team-club-btn--selected" : ""}`}
                onClick={() => pickClub(club)}
              >
                {logo ? (
                  <img src={logo} alt={`${club.strTeam} logo`} className="team-club-logo" />
                ) : (
                  <div className="team-club-logo-placeholder" aria-hidden="true" />
                )}
                <div className="team-club-meta">
                  <span className="team-club-name">{club.strTeam}</span>
                  {sub ? <span className="team-club-sub">{sub}</span> : null}
                </div>
              </button>
            );
          })}

          {!loading && results.length === 0 && query.trim().length >= 2 && (
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
