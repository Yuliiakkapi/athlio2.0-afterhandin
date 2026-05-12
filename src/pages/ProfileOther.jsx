import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./profile.css";
import { supabase } from "../lib/supabase";
import ProfileHeader from "../components/domain/Profile/ProfileHeader";
import { isFollowing, follow, unfollow } from "../lib/follows";
import NavigationTabs from "../components/UI/NavTabs";
import PostsTab from "../components/domain/Profile/ProfileTabs/PostsTab";
import InfoTab from "../components/domain/Profile/ProfileTabs/InfoTab";
import MatchesTab from "../components/domain/Profile/ProfileTabs/MatchesTab";

const PROFESSIONAL_ROLES = ["scout", "coach", "manager", "agent", "professional"];

export default function OtherProfile() {
  const { id } = useParams();
  if (!id) return <div className="page">Invalid profile route.</div>;

  const [state, setState] = useState("loading");
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [meId, setMeId] = useState(null);
  const [isFollowingState, setIsFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setState("loading");
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user ?? null;
      if (user && !ignore) setMeId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("[OtherProfile] profile fetch error:", error);
        setState("error");
        return;
      }

      if (!data) {
        setState("notfound");
        return;
      }

      setProfile(data);

      if (user) {
        try {
          const following = await isFollowing(data.id);
          if (!ignore) setIsFollowing(following);
        } catch (err) {
          console.error("isFollowing check failed:", err);
        }
      }

      setState("ready");
    })();

    return () => {
      ignore = true;
    };
  }, [id]);

  async function toggleFollow() {
    if (!meId || !profile || busy) return;
    setBusy(true);

    const next = !isFollowingState;
    setIsFollowing(next);

    try {
      if (next) {
        await follow(profile.id);
      } else {
        await unfollow(profile.id);
      }

      await new Promise((r) => setTimeout(r, 300));

      const { data: updatedProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.id)
        .single();

      if (error) {
        console.error("Error fetching updated profile:", error);
      } else {
        setProfile(updatedProfile);
      }
    } catch (err) {
      setIsFollowing(!next);
      console.error("Toggle follow failed:", err);
    } finally {
      setBusy(false);
    }
  }

  if (state === "loading") return <div className="page profile-loading">Loading…</div>;
  if (state === "notfound") return <div className="page profile-loading">Profile not found.</div>;
  if (state === "error") return <div className="page profile-loading">Couldn't load profile.</div>;
  if (!profile) return null;

  // Determine if profile belongs to a professional
  const isProfessional = PROFESSIONAL_ROLES.includes(profile.role);

  // Generate tabs based on role
  const tabs = isProfessional
    ? [
        { id: "posts", label: "Posts" },
        { id: "info", label: "Info" },
      ]
    : [
        { id: "posts", label: "Posts" },
        { id: "info", label: "Info" },
        { id: "matches", label: "Matches" },
      ];

  // Reset activeTab if it's not available for this role
  const availableTabIds = tabs.map((t) => t.id);
  const currentTab = availableTabIds.includes(activeTab) ? activeTab : "posts";

  return (
    <div className="page profile other">
      <ProfileHeader
        profile={profile}
        isMe={false}
        isFollowing={isFollowingState}
        toggleFollow={toggleFollow}
        busy={busy}
      />
      <NavigationTabs
        variant="pill"
        tabs={tabs}
        activeTab={currentTab}
        onTabChange={setActiveTab}
      />
      <div className="profile-tab-content">
        {currentTab === "posts" && <PostsTab profile={profile} isMe={false} />}
        {currentTab === "info" && <InfoTab profile={profile} isMe={false} />}
        {currentTab === "matches" && <MatchesTab profile={profile} isMe={false} />}
      </div>
    </div>
  );
}
