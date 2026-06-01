import { useEffect, useState } from "react";
import ProfilePicture from "../../UI/ProfilePicture";
import Avatar from "../../../assets/images/avatar.webp";
import { Plus } from "@phosphor-icons/react";
import Button from "../../UI/Button";
import "./PostHeader.css";
import {
  isFollowing as fetchIsFollowing,
  follow,
  unfollow,
} from "../../../lib/follows";
import { supabase } from "../../../lib/supabase";
import { Link } from "react-router";
import { toPositionAbbr } from "../../../utils/positions";

export default function PostHeader({
  name,
  position,
  club,
  date,
  authorId,
  hideFollow = false,
}) {
  const [isFollowing, setIsFollowing] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

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

    (async () => {
      try {
        if (next) await follow(authorId);
        else await unfollow(authorId);
      } catch (e) {
        console.error(e);
        setIsFollowing(!next);
      }
    })();
  }

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
              {(() => {
                const abbr = position
                  ? String(position)
                      .replace(/[[\]"]/g, "")
                      .split(",")
                      .map((p) => toPositionAbbr(p.trim()))
                      .filter(Boolean)
                      .join(" · ")
                  : null;
                if (abbr && club) return `${abbr} at @${club}`;
                return abbr || club || "";
              })()}
            </p>
            <span className="subheader-dot" aria-hidden="true" />
            <p className="date">{date}</p>
          </div>
        </div>
      </div>

      {!hideFollow && isFollowing === false && (
        <Button
          size="small"
          type="primary"
          label="Follow"
          leadingIcon={Plus}
          onClick={onToggle}
        />
      )}
    </div>
  );
}
