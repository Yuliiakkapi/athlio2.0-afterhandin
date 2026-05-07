import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import SearchBarCard from "../components/domain/Scouting/SearchBarCard";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "@phosphor-icons/react";
import "./search.css";

const RECENTS_KEY = "recentProfileSearches";

function loadRecents() {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    const arr = JSON.parse(raw || "[]");
    if (Array.isArray(arr)) return arr.filter(Boolean);
  } catch {}
  return [];
}

function saveRecent(id) {
  try {
    const current = loadRecents();
    const next = [id, ...current.filter((x) => x !== id)].slice(0, 10);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {}
}

export default function ScoutingSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recents, setRecents] = useState(() => loadRecents());
  const [suggested, setSuggested] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false;
    async function run() {
      const term = q.trim();
      if (term.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .ilike("full_name", `%${term}%`)
        .limit(20);
      if (cancel) return;
      if (error) {
        console.error("search profiles", error);
        setResults([]);
      } else {
        setResults(data || []);
      }
      setLoading(false);
    }
    run();
    return () => {
      cancel = true;
    };
  }, [q]);

  useEffect(() => {
    let cancel = false;
    async function loadSuggested() {
      if (q.trim() !== "" || recents.length > 0) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .order("created_at", { ascending: false })
        .limit(10);
      if (cancel) return;
      if (error) {
        console.error("load suggested profiles", error);
        setSuggested([]);
      } else {
        setSuggested(data || []);
      }
    }
    loadSuggested();
    return () => {
      cancel = true;
    };
  }, [q, recents.length]);

  function pick(id) {
    saveRecent(id);
    setRecents(loadRecents());
    navigate(`/scouting?add=${encodeURIComponent(id)}`);
  }

  const displayList =
    q.trim().length >= 2 ? results : recents.length > 0 ? recents : suggested;
  const showRecentHeader = q.trim().length < 2;

  return (
    <main className="search-page">
      <div className="search-header">
        <div className="search-input-wrapper">
          <MagnifyingGlass size={24} className="search-input-icon" aria-hidden="true" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for a new player"
            className="search-input-field"
          />
        </div>

        {showRecentHeader && (
          <h2 className="recently-saved-title">Recently Saved</h2>
        )}
      </div>

      <div className="search-results">
        {loading && <p className="search-loading">Searching…</p>}

        {!loading && q.trim().length >= 2 && results.length === 0 && (
          <p className="no-results">
            No players found. Try a different search.
          </p>
        )}

        {!loading && displayList.length > 0 && (
          <div className="player-cards-list">
            {displayList.map((item) => {
              const id = typeof item === "string" ? item : item.id;
              return <SearchBarCard key={id} profileId={id} onSelect={pick} />;
            })}
          </div>
        )}

        {!loading &&
          !q.trim() &&
          recents.length === 0 &&
          suggested.length === 0 && (
            <p className="no-results">No players yet. Start searching above.</p>
          )}
      </div>
    </main>
  );
}
