import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import BasicPost from "../../Post/BasicPost";
import MatchPost from "../../Post/MatchPost";
import "./PostsTab.css";
import IconButton from "../../../UI/IconButton";
import PlusIcon from "../../../../assets/icons/plus.svg?react";
import { useNavigate } from "react-router-dom";

function PostSwitcher({ post }) {
  const prof = post.profiles || {};
  const club = prof.club || {};

  const rawDate = post.created_at || post.createdAt || "";
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })
    : "";

  const common = {
    id: post.id,
    author: prof.full_name || prof.username || post.author || "",
    authorId: prof.id || post.author_id || "",
    position: prof.position || "",
    createdAt: formattedDate,
    club: club,
  };

  if (post.type === "match") {
    return (
      <MatchPost
        {...common}
        content={post.content ?? ""}
        imageUrl={post.media || ""}
        goalsCount={Number(post.goals) || 0}
        assistsCount={Number(post.assists) || 0}
        minCount={Number(post.minutes_played) || 0}
        date={post.date_of_game ?? ""}
        league={post.league ?? ""}
        opponent={post.opponent ?? ""}
        yourScore={Number(post.your_score) || 0}
        opponentScore={Number(post.opponent_score) || 0}
        yourTeam={club.name}
        hideFollow={true}
      />
    );
  }

  return (
    <BasicPost
      {...common}
      content={post.content ?? ""}
      imageUrl={post.media || undefined}
      yourTeam={club.name}
      hideFollow={true}
    />
  );
}

export default function PostsTab({ profile, isMe = false }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!profile?.id) return;

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          type,
          content,
          media,
          created_at,
          goals,
          assists,
          minutes_played,
          date_of_game,
          league,
          your_team,
          opponent,
          your_score,
          opponent_score,
          author_id,
          profiles:author_id (
            id,
            full_name,
            username,
            role,
            position,
            avatar_url,
            club_id,
            club:club_id (id, name, logo_url)
          )
        `,
        )
        .eq("author_id", profile.id)
        .order("created_at", { ascending: false });

      if (ignore) return;

      if (error) {
        console.error("Error loading user posts:", error);
        setError(error.message);
      } else {
        setPosts(data || []);
      }

      setLoading(false);
    }

    load();
    return () => {
      ignore = true;
    };
  }, [profile?.id]);

  if (loading) return <p>Loading posts…</p>;
  if (error) return <p className="error">Failed to load posts: {error}</p>;

  // 🧩 Empty state for your own profile
  if (!posts.length && isMe) {
    return (
      <main>
        <div className="profile-stats-tab">
          <div className="empty-state-box">
            <p className="empty-title">You don’t have available posts yet.</p>
            <p className="empty-subtitle">Add your post manually.</p>
          </div>
          <div className="empty-icon-container">
            <IconButton
              size="medium"
              type="primary"
              icon={PlusIcon}
              onClick={() => navigate("/add-post")}
            />
            <p className="empty-subtitle">Add a post.</p>
          </div>
        </div>
      </main>
    );
  }

  // 🧩 Empty state for others
  if (!posts.length)
    return (
      <main>
        <div className="profile-stats-tab">
          <p className="empty-subtitle">No posts yet.</p>
        </div>
      </main>
    );

  return (
    <main>
      <div className="profile-stats-tab">
        {posts.map((post) => (
          <PostSwitcher key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
