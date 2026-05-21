import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "./profile.css";
import { supabase } from "../lib/supabase";
import ProfileHeader from "../components/domain/Profile/ProfileHeader";
import NavigationTabs from "../components/UI/NavTabs";
import PostsTab from "../components/domain/Profile/ProfileTabs/PostsTab";
import InfoTab from "../components/domain/Profile/ProfileTabs/InfoTab";
import MatchesTab from "../components/domain/Profile/ProfileTabs/MatchesTab";

const PROFESSIONAL_ROLES = ["scout", "coach", "manager", "agent", "professional"];

export default function MyProfile() {
  const [state, setState] = useState("loading");
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [userId, setUserId] = useState(null);

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

      const { data, error } = await supabase
        .from("profiles")
        .select("*, clubs(name, logo_url, country)")
        .eq("id", user.id)
        .single();

      if (ignore) return;
      if (error) {
        setState(error.code === "PGRST116" ? "notfound" : "error");
        return;
      }
      setProfile(data);
      setState("ready");
    })();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleAvatarChange(dataUrl) {
    if (!userId || !profile) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: dataUrl })
        .eq("id", userId);

      if (!error) {
        setProfile({ ...profile, avatar_url: dataUrl });
      } else {
        console.error("Failed to update avatar:", error);
      }
    } catch (err) {
      console.error("Error updating avatar:", err);
    }
  }

  if (state === "unauth") return <Navigate to="/auth" replace />;
  if (state === "loading") return <div className="page profile-loading">Loading…</div>;
  if (state === "notfound") return <div className="page profile-loading">Your profile isn't set up yet.</div>;
  if (state === "error") return <div className="page profile-loading">Couldn't load your profile.</div>;
  if (!profile) return null;

  // Determine if user is professional
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
    <div className="page profile self">
      <ProfileHeader profile={profile} isMe={true} onAvatarChange={handleAvatarChange} />
      <NavigationTabs
        variant="pill"
        tabs={tabs}
        activeTab={currentTab}
        onTabChange={setActiveTab}
      />
      <div className="profile-tab-content">
        {currentTab === "posts" && <PostsTab profile={profile} isMe={true} />}
        {currentTab === "info" && <InfoTab profile={profile} isMe={true} />}
        {currentTab === "matches" && <MatchesTab profile={profile} isMe={true} />}
      </div>
    </div>
  );
}
