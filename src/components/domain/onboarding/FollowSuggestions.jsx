import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { follow, unfollow, isFollowing } from "../../../lib/follows";
import "./FollowSuggestions.css";
import SuggestedFollowCard from "./SuggestedFollowCard";

export default function FollowSuggestions({ role, sport, position, clubId, country, goals }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      // Build OR filters based on goals (prefer), then sport/club/country
      const conditions = [];

      if (goals) {
        // goals stored as CSV string; match any phrase loosely
        const parts = goals.split(",").map((s) => s.trim()).filter(Boolean);
        for (const p of parts.slice(0, 3)) {
          // limit to first 3 goal phrases
          // use ilike for case-insensitive substring matching
          const esc = p.replace(/[,()]/g, "");
          conditions.push(`goals.ilike.%${esc}%`);
        }
      }

      if (sport) conditions.push(`primary_sport.eq.${sport}`);
      if (clubId) conditions.push(`club_id.eq.${clubId}`);
      if (country) conditions.push(`country.eq.${country}`);

      try {
        // get current user id to exclude
        const { data: userData } = await supabase.auth.getUser();
        const uid = userData?.user?.id || null;

        let data = null;

        if (conditions.length > 0) {
          const orStr = conditions.join(",");
          const { data: qdata, error } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url, primary_sport, club_id, country, goals")
            .neq("id", uid)
            .or(orStr)
            .limit(12);
          if (!error && qdata && qdata.length > 0) data = qdata;
        }

        // If we have no conditions or the query returned nothing, fetch a larger
        // set of profiles and pick a random sample client-side so the UI shows
        // varied suggestions even without inputs.
        if (!data) {
          const { data: all, error: ae } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url, primary_sport, club_id, country, goals")
            .neq("id", uid)
            .limit(200);
          if (!ae && all && all.length > 0) {
            // shuffle and take up to 12
            const shuffled = all.sort(() => Math.random() - 0.5);
            data = shuffled.slice(0, 12);
          } else {
            data = [];
          }
        }

        if (mounted) {
          setSuggestions(data || []);

          // check following state for each suggestion
          const map = {};
          await Promise.all(
            (data || []).map(async (p) => {
              try {
                const f = await isFollowing(p.id);
                map[p.id] = f;
              } catch (e) {
                map[p.id] = false;
              }
            }),
          );
          if (mounted) setFollowingMap(map);
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [sport, position, clubId, country, goals]);

  async function handleFollowToggle(id) {
    const currently = !!followingMap[id];
    // optimistic update
    setFollowingMap((m) => ({ ...m, [id]: !currently }));
    try {
      if (currently) await unfollow(id);
      else await follow(id);
    } catch (e) {
      // rollback on error
      setFollowingMap((m) => ({ ...m, [id]: currently }));
    }
  }

  return (
    <div className="follow-suggestions-root">
      <div className="role-header" style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}>
        <h1 className="role-header-title">{role === "scout" ? "Follow these suggested profiles" : "Follow people who share your goals and journey"}</h1>
        <p className="role-header-subtitle">Discover people we think are relevant to your goals — follow a few to personalize your feed.</p>
      </div>
      <div style={{ marginTop: 12 }}>
        {loading ? (
          <div>Loading...</div>
        ) : suggestions.length === 0 ? (
          <div>No suggestions right now. Try coming back later.</div>
        ) : (
          <div className="suggest-follow-grid">
            {suggestions.map((p) => (
              <SuggestedFollowCard
                key={p.id}
                id={p.id}
                name={p.full_name || "Unnamed"}
                avatarUrl={p.avatar_url}
                verified={false /* placeholder, add verification logic if available */}
                isFollowing={!!followingMap[p.id]}
                onToggle={handleFollowToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
