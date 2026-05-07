import { useEffect, useRef, useState } from "react";
import { MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import "./ClubPicker.css";

const BASE = "https://www.thesportsdb.com/api/v1/json/3";

// Featured leagues shown when no query is entered
const FEATURED_LEAGUES = [
  "English Premier League",
  "Spanish La Liga",
  "German Bundesliga",
  "Italian Serie A",
  "French Ligue 1",
];

function isSoccer(t) {
  const s = (t.strSport || "").toLowerCase();
  return s === "soccer" || s === "football";
}

async function fetchFeatured() {
  const perLeague = await Promise.all(
    FEATURED_LEAGUES.map(league =>
      fetch(`${BASE}/search_all_teams.php?l=${encodeURIComponent(league)}`)
        .then(r => r.json())
        .then(json => (json.teams || []).filter(isSoccer).slice(0, 4))
        .catch(() => [])
    )
  );
  // Flatten and deduplicate
  const seen = new Set();
  return perLeague.flat().filter(t => {
    if (seen.has(t.idTeam)) return false;
    seen.add(t.idTeam);
    return true;
  });
}

async function searchTeams(query) {
  const res = await fetch(`${BASE}/searchteams.php?t=${encodeURIComponent(query)}`);
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
