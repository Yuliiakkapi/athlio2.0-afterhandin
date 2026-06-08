import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import BasicPost from "../../Post/BasicPost";
import MatchPost from "../../Post/MatchPost";
import { formatMatchDate } from "../../../../lib/format";
import "./PostsTab.css";
import IconButton from "../../../UI/IconButton";
import { Plus } from "@phosphor-icons/react";
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
    const m = post.match || {};
    return (
      <MatchPost
        {...common}
        content={post.content ?? ""}
        imageUrl={post.media || ""}
        mediaUrls={post.media_urls?.length ? post.media_urls : undefined}
        yourTeam={m.your_team || club.name}
        yourTeamLogoUrl={club.logo_url}
        yourScore={Number(m.your_score) || 0}
        opponent={m.opponent ?? ""}
        opponentLogoUrl={m.opponent_club?.logo_url}
        opponentScore={Number(m.opponent_score) || 0}
        league={m.league ?? ""}
        date={formatMatchDate(m.date_of_game)}
        goalsCount={Number(m.goals) || 0}
        assistsCount={Number(m.assists) || 0}
        minCount={Number(m.minutes_played) || 0}
        yellowCards={m.yellow_cards ?? 0}
        redCards={m.red_cards ?? 0}
        hideFollow={true}
      />
    );
  }

  return (
    <BasicPost
      {...common}
      content={post.content ?? ""}
      imageUrl={post.media || undefined}
      mediaUrls={post.media_urls?.length ? post.media_urls : undefined}
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
          media_urls,
          created_at,
          author_id,
          match:match_id (
            id, your_team, opponent, your_score, opponent_score,
            league, date_of_game, goals, assists, minutes_played,
            yellow_cards, red_cards,
            opponent_club:opponent_club_id ( logo_url )
          ),
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
        <div className="profile-posts-tab">
          <div className="posts-empty-state">
            <p className="posts-empty-title">Your feed is empty.</p>
            <p className="posts-empty-subtitle">Add your first post.</p>
            <IconButton
              size="medium"
              type="primary"
              icon={Plus}
              onClick={() => navigate("/add-post")}
            />
          </div>
        </div>
      </main>
    );
  }

  // 🧩 Empty state for others
  if (!posts.length)
    return (
      <main>
        <div className="profile-posts-tab">
          <div className="posts-empty-state">
            <p className="posts-empty-title">No posts yet.</p>
          </div>
        </div>
      </main>
    );

  return (
    <main>
      <div className="profile-posts-tab">
        {posts.map((post) => (
          <PostSwitcher key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
