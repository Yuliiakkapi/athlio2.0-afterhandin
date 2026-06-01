import "./Feed.css";
import { useEffect, useState } from "react";
import BasicPost from "../domain/Post/BasicPost";
import MatchPost from "../domain/Post/MatchPost";
import { supabase } from "../../lib/supabase";
// adjust this path if your context sits elsewhere
import { useUser } from "../../context/UserContext";
import SuggestedAccounts from "../domain/Suggested/SuggestedAccounts";

export function PostSwitcher({ post, likedPostIds = new Set() }) {
  // prefer joined profile data if present
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
        likesCount={Number(post.likes_count) || 0}
        commentsCount={Number(post.comments_count) || 0}
        initialLiked={likedPostIds.has(post.id) ? true : null}
      />
    );
  }

  // default basic post
  return (
    <BasicPost
      {...common}
      content={post.content ?? ""}
      imageUrl={post.media || undefined}
      yourTeam={club.name}
      likesCount={Number(post.likes_count) || 0}
      commentsCount={Number(post.comments_count) || 0}
    />
  );
}

export default function Feed() {
  const { user, loading: userLoading } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [likedPostIds, setLikedPostIds] = useState(new Set());

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const onPosted = () => setRefreshKey((k) => k + 1);
    document.addEventListener("composer:posted", onPosted);
    return () => document.removeEventListener("composer:posted", onPosted);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // wait for context to resolve
      if (userLoading) return;

      // no user = empty feed
      if (!user) {
        if (!cancelled) {
          setPosts([]);
          setLoading(false);
        }
        return;
      }

      // 1) who do I follow
      const { data: followRows, error: followErr } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);

      if (cancelled) return;

      if (followErr) {
        setError(followErr.message);
        setLoading(false);
        return;
      }

      const followingIds = (followRows || []).map((r) => r.following_id);

      // Always include my own user id so I see my posts
      const authorIds = Array.from(new Set([user.id, ...followingIds]));

      const { data: postRows, error: postsErr } = await supabase
        .from("posts")
        .select(
          `
      id,
      type,
      content,
      media,
      created_at,
      likes_count,
      comments_count,
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
        .in("author_id", authorIds)
        .order("created_at", { ascending: false })
        .limit(50);

      if (cancelled) return;

      if (postsErr) {
        setError(postsErr.message);
      } else {
        const rows = Array.isArray(postRows) ? postRows : [];
        setPosts(rows);

        // Batch-fetch all liked post IDs in one query
        if (rows.length > 0) {
          const postIds = rows.map((p) => p.id);
          const { data: { session } } = await supabase.auth.getSession();
          const me = session?.user?.id;
          if (me) {
            const { data: likedRows } = await supabase
              .from("post_likes")
              .select("post_id")
              .in("post_id", postIds)
              .eq("user_id", me);
            setLikedPostIds(new Set((likedRows || []).map((r) => r.post_id)));
          }
        }
      }
      //suggested accounts
      const excludeIds = authorIds; // me + people I follow

      const { data: suggestedProfiles, error: suggErr } = await supabase
        .from("profiles")
        .select(
          `
    id,
    full_name,
    username,
    position,
    avatar_url,
    club:club_id (name, logo_url)
  `,
        )
        .not("id", "in", `(${excludeIds.join(",")})`)
        .not("username", "is", null)
        .limit(10);

      if (!suggErr && !cancelled) {
        setSuggested(Array.isArray(suggestedProfiles) ? suggestedProfiles : []);
      }

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user, userLoading, refreshKey]);

  if (userLoading || loading) return <p>Loading feed…</p>;
  if (error) return <p className="error">{error}</p>;

  if (!user) {
    return (
      <div className="feed-empty">
        <p>Sign in to see posts from athletes you follow.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="posts-feed">
        <div className="feed-empty">
          <p>No posts yet. Follow athletes to see their activity here.</p>
        </div>
        {suggested.length > 0 && <SuggestedAccounts profiles={suggested} />}
      </div>
    );
  }

  return (
    <div className="posts-feed">
      {posts.map((p, index) => {
        const showSuggestions =
          suggested.length > 0 && index > 0 && index % 2 === 0;

        return (
          <div key={p.id} className="feed-item">
            <PostSwitcher post={p} likedPostIds={likedPostIds} />
            {showSuggestions && <SuggestedAccounts profiles={suggested} />}
          </div>
        );
      })}
    </div>
  );
}
