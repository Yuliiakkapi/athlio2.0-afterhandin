import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "./profile.css";
import { supabase } from "../lib/supabase";
import ProfileHeader from "../components/domain/Profile/ProfileHeader";
import NavigationTabs from "../components/UI/NavTabs";
import PostsTab from "../components/domain/Profile/ProfileTabs/PostsTab";
import StatsTab from "../components/domain/Profile/ProfileTabs/StatsTab";
import InfoTab from "../components/domain/Profile/ProfileTabs/InfoTab";
import MatchesTab from "../components/domain/Profile/ProfileTabs/MatchesTab";

export default function MyProfile() {
  const [state, setState] = useState("loading");
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");

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

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
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

  if (state === "unauth") return <Navigate to="/auth" replace />;
  if (state === "loading") return <div className="page">Loading…</div>;
  if (state === "notfound")
    return <div className="page">Your profile isn't set up yet.</div>;
  if (state === "error")
    return <div className="page">Couldn't load your profile.</div>;
  if (!profile) return null;

  return (
    <div className="page profile self">
      <ProfileHeader profile={profile} isMe={true} />
      <NavigationTabs
        tabs={[
          { id: "posts", label: "Posts" },
          { id: "info", label: "Info" },
          { id: "stats", label: "Stats" },
          { id: "matches", label: "Matches" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="profile-tab-content">
        {activeTab === "posts" && <PostsTab profile={profile} isMe={true} />}
        {activeTab === "stats" && <StatsTab profile={profile} isMe={true} />}
        {activeTab === "info" && <InfoTab profile={profile} isMe={true} />}
        {activeTab === "matches" && (
          <MatchesTab profile={profile} isMe={true} />
        )}
      </div>
    </div>
  );
}
