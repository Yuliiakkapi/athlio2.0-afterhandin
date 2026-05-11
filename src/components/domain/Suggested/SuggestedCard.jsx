import { useEffect, useState, useTransition } from "react";
import { Link } from "react-router";
import { Plus, Check } from "@phosphor-icons/react";
import IconButton from "../../UI/IconButton";
import {
  isFollowing as fetchIsFollowing,
  follow,
  unfollow,
} from "../../../lib/follows";
import "./SuggestedCard.css";

export default function SuggestedCard({ profile }) {
  if (!profile) return null;

  const [isFollowing, setIsFollowing] = useState(null); // null = loading
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const v = await fetchIsFollowing(profile.id);
        if (alive) setIsFollowing(v);
      } catch {
        if (alive) setIsFollowing(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [profile?.id]);

  function onToggle() {
    if (!profile?.id || isFollowing === null) return;
    const next = !isFollowing;
    setIsFollowing(next); // optimistic

    startTransition(async () => {
      try {
        if (next) await follow(profile.id);
        else await unfollow(profile.id);
      } catch (e) {
        console.error(e);
        setIsFollowing(!next); // revert on fail
      }
    });
  }

  const loading = isFollowing === null || isPending;
  const profileHref = `/profile/${profile.id}`;
  const position = profile.position?.[0];
  const [firstName, lastName] = (profile.full_name || profile.username || "").split(" ");

  return (
    <Link to={profileHref} className="suggested-card">
      {/* Background image with overlay */}
      <div className="suggested-card-bg" style={{ backgroundImage: `url(${profile.avatar_url})` }} />
      <div className="suggested-card-overlay" />

      {/* Top-right button */}
      <div className="suggested-card-btn-wrap">
        <button
          type="button"
          className="suggested-card-add-btn"
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
          disabled={loading}
          title={isFollowing ? "Following" : "Follow"}
        >
          <Plus size={18} weight="bold" />
        </button>
      </div>

      {/* Bottom content: name and position */}
      <div className="suggested-card-content">
        <div className="suggested-card-name-wrap">
          <p className="suggested-card-name">
            {firstName && <span className="suggested-card-first-name">{firstName}</span>}
            {lastName && <span className="suggested-card-last-name">{lastName}</span>}
          </p>
        </div>
        {position && (
          <div className="suggested-card-position-badge">
            {position.toUpperCase()}
          </div>
        )}
      </div>
    </Link>
  );
}
