import { useEffect, useState, useTransition } from "react";
import ProfilePicture from "../../UI/ProfilePicture";
import Avatar from "../../../assets/images/avatar.webp";
import { Check, Plus } from "@phosphor-icons/react";
import Button from "../../UI/Button";
import "./PostHeader.css";
import {
  isFollowing as fetchIsFollowing,
  follow,
  unfollow,
} from "../../../lib/follows";
import { supabase } from "../../../lib/supabase";
import { Link } from "react-router";

export default function PostHeader({
  name,
  position,
  club,
  date,
  authorId,
  hideFollow = false,
}) {
  const [isFollowing, setIsFollowing] = useState(null); // null = loading
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!authorId) return;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", authorId)
          .single();

        if (error) throw error;

        let url = data?.avatar_url || null;

        // If only a storage path exists, try to build a public URL from the 'avatars' bucket
        if (!url && data?.avatar_path) {
          try {
            const { data: pub } = supabase.storage
              .from("avatars")
              .getPublicUrl(data.avatar_path);
            url = pub?.publicUrl || null;
          } catch {
            // ignore storage URL failures; we'll fall back to placeholder
          }
        }

        if (alive) setAvatarUrl(url || null);
      } catch {
        if (alive) setAvatarUrl(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [authorId]);

  useEffect(() => {
    if (hideFollow) return;
    let alive = true;
    (async () => {
      try {
        const v = await fetchIsFollowing(authorId);
        if (alive) setIsFollowing(v);
      } catch {
        if (alive) setIsFollowing(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [authorId, hideFollow]);

  function onToggle() {
    if (isFollowing === null) return;
    const next = !isFollowing;
    setIsFollowing(next); // optimistic

    startTransition(async () => {
      try {
        if (next) await follow(authorId);
        else await unfollow(authorId);
      } catch (e) {
        console.error(e);
        setIsFollowing(!next); // revert on fail
      }
    });
  }

  const loading = isFollowing === null || isPending;
  const profileHref = `/profile/${authorId}`;

  return (
    <div className="post-header">
      <div className="header-left">
        <Link to={profileHref} className="author-link">
          <ProfilePicture
            size="medium"
            verified={true}
            imgUrl={avatarUrl || Avatar}
          />
        </Link>
        <div className="header-text">
          <Link to={profileHref} className="author-link">
            <p className="name">{name}</p>
          </Link>
          <div className="subheader-text">
            <p className="role">
              {position && club
                ? `${String(position).replace(/[[\]"]/g, "")} at @${club}`
                : String(position)?.replace(/[[\]"]/g, "") || club || ""}
            </p>
            <span className="subheader-dot" aria-hidden="true" />
            <p className="date">{date}</p>
          </div>
        </div>
      </div>

      {!hideFollow && (
        <Button
          size="small"
          type={isFollowing ? "following" : "primary"}
          label={loading ? "..." : isFollowing ? "" : "Follow"}
          aria-label={isFollowing ? "Unfollow user" : "Follow user"}
          leadingIcon={loading ? undefined : isFollowing ? Check : Plus}
          onClick={onToggle}
          disabled={loading}
        />
      )}
    </div>
  );
}
