import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { unfollow } from "../lib/follows";
import SearchBar from "../components/UI/SearchBar";
import PlayerCard from "../components/UI/PlayerCard";
import "./ProfileFollowing.css";

export default function ProfileFollowing() {
  const [state, setState] = useState("loading");
  const [userId, setUserId] = useState(null);
  const [following, setFollowing] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let ignore = false;

    (async () => {
      setState("loading");
      const { data: auth, error: authErr } = await supabase.auth.getUser();
      const user = auth?.user ?? null;
      if (authErr || !user) {
        if (!ignore) setState("unauth");
        return;
      }

      setUserId(user.id);

      const { data: followRows, error: followErr } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);

      if (ignore) return;
      if (followErr) { setState("error"); return; }

      const ids = followRows.map((r) => r.following_id);

      if (ids.length === 0) {
        setFollowing([]);
        setState("ready");
        return;
      }

      const { data: profiles, error: profilesErr } = await supabase
        .from("profiles")
        .select("*, clubs(name, logo_url)")
        .in("id", ids);

      if (ignore) return;
      if (profilesErr) { setState("error"); return; }

      setFollowing(profiles);
      setState("ready");
    })();

    return () => { ignore = true; };
  }, []);

  async function handleUnfollow(profileId) {
    setFollowing((prev) => prev.filter((p) => p.id !== profileId));
    await unfollow(profileId);
  }

  if (state === "unauth") return <Navigate to="/auth" replace />;
  if (state === "loading") return <div className="page following-loading">Loading…</div>;
  if (state === "error") return <div className="page following-loading">Couldn't load following.</div>;

  const filtered = query.trim()
    ? following.filter((p) =>
        (p.full_name || p.username || "")
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : following;

  return (
    <div className="page following-page">
      <div className="following-search">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search following…"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="following-empty text-sm-regular">
          {query ? "No results." : "You're not following anyone yet."}
        </p>
      ) : (
        <div className="following-list">
          {filtered.map((profile) => (
            <PlayerCard
              key={profile.id}
              profile={profile}
              infoType="club"
              isFollowing={true}
              onFollow={() => handleUnfollow(profile.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
