import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { follow, unfollow, isFollowing } from "../../../lib/follows";
import SearchBar from "../../UI/SearchBar";
import PlayerCard from "../../UI/PlayerCard";
import "./FindPeople.css";

export default function FindPeople({ sport, position, playingStyle }) {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [followingMap, setFollowingMap] = useState({});
  const searchTimer = useRef(null);

  // Resolve current user once
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data?.user?.id ?? null);
    });
  }, []);

  // Fetch suggested players (position-matched, style-matched, or same sport fallback)
  useEffect(() => {
    if (currentUserId === null) return;
    let mounted = true;

    (async () => {
      setSuggestionsLoading(true);
      try {
        const posArr = Array.isArray(position) ? position : position ? [position] : [];
        let data = [];

        // 1. Position overlap + same sport
        if (posArr.length > 0 && sport) {
          const { data: posMatches } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url, primary_sport, club_id, country, position, role")
            .neq("id", currentUserId)
            .eq("primary_sport", sport)
            .overlaps("position", posArr)
            .limit(5);
          if (posMatches) data = posMatches;
        }

        // 2. Supplement: same sport, not already included
        if (data.length < 5 && sport) {
          const excludeIds = new Set([currentUserId, ...data.map((p) => p.id)]);
          const { data: all } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url, primary_sport, club_id, country, position, role")
            .eq("primary_sport", sport)
            .limit(20);
          const extra = (all || []).filter((p) => !excludeIds.has(p.id)).slice(0, 5 - data.length);
          if (extra) data = [...data, ...extra];
        }

        // 3. Final fallback: any profiles
        if (data.length === 0) {
          const { data: any } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url, primary_sport, club_id, country, position, role")
            .neq("id", currentUserId)
            .limit(5);
          data = any || [];
        }

        if (!mounted) return;
        setSuggestions(data.slice(0, 5));
        await loadFollowStatus(data);
      } finally {
        if (mounted) setSuggestionsLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [currentUserId, sport, position]);

  // Debounced server-side search across ALL profiles
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    if (!currentUserId) {
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, primary_sport, club_id, country, position, role")
          .neq("id", currentUserId)
          .ilike("full_name", `%${searchQuery.trim()}%`)
          .limit(20);

        setSearchResults(data || []);
        await loadFollowStatus(data || []);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer.current);
  }, [searchQuery, currentUserId]);

  async function loadFollowStatus(profiles) {
    const newIds = profiles.map((p) => p.id).filter((id) => !(id in followingMap));
    if (newIds.length === 0) return;
    const map = {};
    await Promise.all(
      newIds.map(async (id) => {
        try { map[id] = await isFollowing(id); } catch { map[id] = false; }
      }),
    );
    setFollowingMap((prev) => ({ ...prev, ...map }));
  }

  async function handleFollowToggle(id) {
    const currently = !!followingMap[id];
    setFollowingMap((m) => ({ ...m, [id]: !currently }));
    try {
      if (currently) await unfollow(id);
      else await follow(id);
    } catch {
      setFollowingMap((m) => ({ ...m, [id]: currently }));
    }
  }

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="find-people-root">
      <div className="role-header">
        <h1 className="role-header-title">Find people</h1>
        <p className="role-header-subtitle">Connect with players, coaches and scouts you might know</p>
      </div>

      <SearchBar
        label="Search by name..."
        placeholder="Search by name..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {isSearching ? (
        <div>
          {searchLoading ? (
            <p className="find-people-status">Searching...</p>
          ) : searchResults.length === 0 ? (
            <p className="find-people-status">No results found.</p>
          ) : (
            <div className="find-people-list">
              {searchResults.map((p) => (
                <PlayerCardItem
                  key={p.id}
                  profile={p}
                  isFollowing={!!followingMap[p.id]}
                  onToggleFollow={() => handleFollowToggle(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="find-people-section-label">Suggested for you</p>
          {suggestionsLoading ? (
            <p className="find-people-status">Loading...</p>
          ) : suggestions.length === 0 ? (
            <p className="find-people-status">No suggestions yet.</p>
          ) : (
            <div className="find-people-list">
              {suggestions.map((p) => (
                <PlayerCardItem
                  key={p.id}
                  profile={p}
                  isFollowing={!!followingMap[p.id]}
                  onToggleFollow={() => handleFollowToggle(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PlayerCardItem({ profile, isFollowing, onToggleFollow }) {
  const [clubName, setClubName] = useState("");

  useEffect(() => {
    let mounted = true;
    if (!profile.club_id) return;

    supabase
      .from("clubs")
      .select("name")
      .eq("id", profile.club_id)
      .maybeSingle()
      .then(({ data }) => {
        if (mounted && data) setClubName(data.name);
      });

    return () => { mounted = false; };
  }, [profile.club_id]);

  const isAthlete = !profile.role || profile.role === "athlete" || profile.role === "player";
  const shaped = {
    ...profile,
    clubs: clubName ? { name: clubName } : null,
    nationality: profile.country,
  };

  return (
    <PlayerCard
      profile={shaped}
      infoType={isAthlete ? "club" : "professional"}
      isFollowing={isFollowing}
      onFollow={onToggleFollow}
    />
  );
}
