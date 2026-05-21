import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { follow, unfollow, isFollowing } from "../../../lib/follows";
import SearchBar from "../../UI/SearchBar";
import Button from "../../UI/Button";
import ProfilePicture from "../../UI/ProfilePicture";
import "./FindPeople.css";

export default function FindPeople({ role, sport, position, clubId, country, goals }) {
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const conditions = [];

      if (goals) {
        const parts = goals.split(",").map((s) => s.trim()).filter(Boolean);
        for (const p of parts.slice(0, 3)) {
          const esc = p.replace(/[,()]/g, "");
          conditions.push(`goals.ilike.%${esc}%`);
        }
      }

      if (sport) conditions.push(`primary_sport.eq.${sport}`);
      if (clubId) conditions.push(`club_id.eq.${clubId}`);
      if (country) conditions.push(`country.eq.${country}`);

      try {
        const { data: userData } = await supabase.auth.getUser();
        const uid = userData?.user?.id || null;

        let data = null;

        if (conditions.length > 0) {
          const orStr = conditions.join(",");
          const { data: qdata, error } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url, primary_sport, club_id, country, goals, position, role")
            .neq("id", uid)
            .or(orStr)
            .limit(12);
          if (!error && qdata && qdata.length > 0) data = qdata;
        }

        if (!data) {
          const { data: all, error: ae } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url, primary_sport, club_id, country, goals, position, role")
            .neq("id", uid)
            .limit(200);
          if (!ae && all && all.length > 0) {
            const shuffled = all.sort(() => Math.random() - 0.5);
            data = shuffled.slice(0, 12);
          } else {
            data = [];
          }
        }

        if (mounted) {
          setAllSuggestions(data || []);
          setFilteredSuggestions(data || []);

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

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSuggestions(allSuggestions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allSuggestions.filter((p) => {
      const name = (p.full_name || "").toLowerCase();
      const club = (p.club_name || "").toLowerCase();
      const team = (p.team_name || "").toLowerCase();
      return name.includes(query) || club.includes(query) || team.includes(query);
    });
    setFilteredSuggestions(filtered);
  }, [searchQuery, allSuggestions]);

  async function handleFollowToggle(id) {
    const currently = !!followingMap[id];
    setFollowingMap((m) => ({ ...m, [id]: !currently }));
    try {
      if (currently) await unfollow(id);
      else await follow(id);
    } catch (e) {
      setFollowingMap((m) => ({ ...m, [id]: currently }));
    }
  }

  return (
    <div className="find-people-root">
      <div className="role-header">
        <h1 className="role-header-title">Find people</h1>
        <p className="role-header-subtitle">Connect with other players, coaches and scouts you might know</p>
      </div>

      <SearchBar
        label="Search for name, surname or team..."
        placeholder="Search for name, surname or team..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <div style={{ marginTop: 12 }}>
        {loading ? (
          <div>Loading...</div>
        ) : filteredSuggestions.length === 0 ? (
          <div>No results found.</div>
        ) : (
          <div className="find-people-list">
            {filteredSuggestions.map((p) => (
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
    </div>
  );
}

function PlayerCardItem({ profile, isFollowing, onToggleFollow }) {
  const [clubName, setClubName] = useState("");

  useEffect(() => {
    let mounted = true;
    if (!profile.club_id) return;

    (async () => {
      try {
        const { data, error } = await supabase
          .from("clubs")
          .select("name")
          .eq("id", profile.club_id)
          .maybeSingle();
        if (mounted && !error && data) setClubName(data.name);
      } catch (e) {
        // ignore
      }
    })();

    return () => (mounted = false);
  }, [profile.club_id]);

  const roleText = profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "";
  const positions = Array.isArray(profile.position) ? profile.position : profile.position ? [profile.position] : [];

  return (
    <div className="player-card-item">
      <ProfilePicture imgUrl={profile.avatar_url || ""} size="large" verified={false} />
      <div className="player-card-content">
        <div className="player-card-header">
          <div>
            <h3 className="player-card-name">{profile.full_name || "Unnamed"}</h3>
            <div className="player-card-badges">
              {roleText && <span className="badge">{roleText}</span>}
              {positions.map((pos) => (
                <span key={pos} className="badge">{pos.toUpperCase()}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="player-card-info">
          {clubName && <span className="player-card-club">{clubName}</span>}
          {clubName && profile.country && <span className="player-card-separator">•</span>}
          {profile.country && <span className="player-card-country">{profile.country}</span>}
        </div>
      </div>
      <Button
        size="small"
        type={isFollowing ? "subtle" : "primary"}
        label={isFollowing ? "Following" : "Follow"}
        onClick={onToggleFollow}
      />
    </div>
  );
}
