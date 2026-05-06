import { useEffect, useState, useTransition } from "react";
import { Link } from "react-router";
import ProfilePicture from "../../UI/ProfilePicture";
import Button from "../../UI/Button";
import PlusIcon from "../../../assets/icons/plus.svg?react";
import CheckIcon from "../../../assets/icons/check.svg?react";
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

  return (
    <div className="suggested-card">
      <Link to={profileHref} className="suggested-card-top">
        <ProfilePicture size="large" imgUrl={profile.avatar_url} />
        <p className="suggested-card-name">
          {profile.full_name || profile.username}
        </p>
      </Link>

      <Button
        size="small"
        type={isFollowing ? "following" : "primary"}
        label={loading ? "..." : isFollowing ? "" : "Follow"}
        Icon={loading ? undefined : isFollowing ? CheckIcon : PlusIcon}
        onClick={onToggle}
        disabled={loading}
      />
    </div>
  );
}
