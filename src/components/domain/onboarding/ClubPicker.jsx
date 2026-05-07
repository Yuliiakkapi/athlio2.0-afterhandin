import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabase.js";
import { MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import "./ClubPicker.css";

export default function ClubPicker({ sport, value, onChange }) {
  const [query, setQuery]           = useState("");
  const [results, setResults]       = useState([]);
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState(value?.club_other_name || "");
  const inputRef = useRef(null);
  const deb      = useRef(null);

  /* ── Fetch clubs (debounced) ──────────────────────────────────── */
  useEffect(() => {
    if (deb.current) clearTimeout(deb.current);

    deb.current = setTimeout(async () => {
      const term = query.trim();
      const q = supabase
        .from("clubs")
        .select("id, name, city, country, logo_url, league")
        .limit(term.length >= 2 ? 15 : 8)
        .order("name", { ascending: true });

      if (term.length >= 2) q.ilike("name", `%${term}%`);

      const { data, error } = await q;
      if (!error) setResults(data || []);
    }, 250);
  }, [query, sport]);

  /* ── Helpers ──────────────────────────────────────────────────── */
  function pickClub(id) {
    setShowManual(false);
    onChange({ club_id: id, club_other_name: null });
  }

  async function commitManual() {
    const clean = manualName.trim();
    if (!clean) return;

    // Try to insert into clubs table; fall back to club_other_name if it fails
    const { data, error } = await supabase
      .from("clubs")
      .insert([{ name: clean, sport }])
      .select("id")
      .maybeSingle();

    if (!error && data?.id) {
      onChange({ club_id: data.id, club_other_name: null });
    } else {
      onChange({ club_id: null, club_other_name: clean });
    }
    setShowManual(false);
  }

  const isListLabel = query.trim().length >= 2 ? "Search results" : "Recommended clubs";

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
          onChange={(e) => { setQuery(e.target.value); setShowManual(false); }}
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
            onChange={(e) => {
              setManualName(e.target.value);
              onChange({ club_id: null, club_other_name: e.target.value });
            }}
            autoFocus
          />
        </div>
      )}

      {/* ── Club list ──────────────────────────────────────────── */}
      <div className="team-list-wrap">
        <p className="team-list-label">{isListLabel}</p>

        <div className="team-list">
          {results.map((club) => {
            const selected = value?.club_id === club.id;
            const sub = club.league || club.city || club.country || "";
            return (
              <button
                key={club.id}
                type="button"
                className={`team-club-btn${selected ? " team-club-btn--selected" : ""}`}
                onClick={() => pickClub(club.id)}
              >
                {club.logo_url ? (
                  <img
                    src={club.logo_url}
                    alt={`${club.name} logo`}
                    className="team-club-logo"
                  />
                ) : (
                  <div className="team-club-logo-placeholder" aria-hidden="true" />
                )}
                <div className="team-club-meta">
                  <span className="team-club-name">{club.name}</span>
                  {sub ? <span className="team-club-sub">{sub}</span> : null}
                </div>
              </button>
            );
          })}

          {results.length === 0 && query.trim().length >= 2 && (
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
