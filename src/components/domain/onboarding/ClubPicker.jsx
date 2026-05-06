import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabase.js";
import TextInput from "../../inputs/TextInput";
import "./ClubPicker.css";
import FootballIcon from "../../../assets/icons/football.svg?react";
import BasketballIcon from "../../../assets/icons/basketball.svg?react";
import SearchBar from "../../UI/SearchBar";

export default function ClubPicker({ sport, value, onChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [useOther, setUseOther] = useState(Boolean(value?.club_other_name));
  const deb = useRef();

  useEffect(() => {
    if (deb.current) clearTimeout(deb.current);

    deb.current = setTimeout(async () => {
      // If the user hasn't typed much yet, surface a few suggested teams
      // for the current sport to help them pick faster.
      if (!query || query.length < 2) {
        const { data, error } = await supabase
          .from("clubs")
          .select("id, name, city, country_code, logo_url")
          .eq("sport", sport)
          .order("name", { ascending: true })
          .limit(6);
        if (!error) setResults(data || []);
        return;
      }

      const { data, error } = await supabase
        .from("clubs")
        .select("id, name, city, country_code, logo_url")
        .eq("sport", sport)
        .ilike("name", `%${query}%`)
        .limit(15);

      if (!error) setResults(data || []);
    }, 250);
  }, [query, sport]);

  function pickClub(id) {
    setUseOther(false);
    onChange({ club_id: id, club_other_name: null });
  }

  function chooseOther() {
    setUseOther(true);
    onChange({ club_id: null, club_other_name: "" });
  }

  async function addNewClub(name) {
    const clean = (name || "").trim();
    if (!clean) return;

    const { data, error } = await supabase
      .from("clubs")
      .insert([{ name: clean, sport }])
      .select("id")
      .single();

    if (!error && data) {
      onChange({ club_id: data.id, club_other_name: null });
      setUseOther(false);
    }
  }

  // --- Render ---
  return (
    <div>
      <div
        className="role-header"
        style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}
      >
        <h1 className="role-header-title">Add the team you play for</h1>
        <p className="role-header-subtitle">
          This will help you post match results and stats
        </p>
      </div>

      {/* Use the visual SearchBar; when clicked show a real input for typing */}
      <div style={{ maxWidth: 520 }}>
        <SearchBar
          value={query}
          onChange={(v) => {
            setUseOther(false);
            setQuery(v);
          }}
          placeholder="Search club"
          onClear={() => setQuery("")}
        />

        <ul className="club-list" style={{ marginTop: 8 }}>
          {query && query.trim().length > 0 && (
            <li key="use-typed">
              <button
                type="button"
                className="club-item-btn club-item-use"
                onClick={() => addNewClub(query)}
                aria-label={`Use ${query} instead`}
              >
                {/* sport-specific icon inside placeholder area */}
                {sport === "football" ? (
                  <FootballIcon className="club-logo-svg" aria-hidden />
                ) : sport === "basketball" ? (
                  <BasketballIcon className="club-logo-svg" aria-hidden />
                ) : (
                  <div className="club-logo-placeholder" aria-hidden />
                )}
                <div className="club-meta">
                  <div className="club-name">Use "{query}" instead</div>
                </div>
              </button>
            </li>
          )}

          {results.map((c) => {
            const selected = value?.club_id === c.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  className={`club-item-btn${selected ? " selected" : ""}`}
                  onClick={() => pickClub(c.id)}
                >
                  {c.logo_url ? (
                    <img
                      src={c.logo_url}
                      alt={`${c.name} logo`}
                      className="club-logo"
                    />
                  ) : (
                    <FootballIcon className="club-logo-svg" aria-hidden />
                  )}

                  <div className="club-meta">
                    <div className="club-name">{c.name}</div>
                    {c.city ? <div className="club-city">{c.city}</div> : null}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {useOther && (
          <div>
            <TextInput
              placeholder="Enter club name"
              value={value?.club_other_name || ""}
              onChange={(v) => onChange({ club_id: null, club_other_name: v })}
            />
            <button
              type="button"
              onClick={() => addNewClub(value?.club_other_name)}
            >
              Add new club
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
