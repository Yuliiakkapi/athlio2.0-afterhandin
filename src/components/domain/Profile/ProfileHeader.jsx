import { useNavigate } from "react-router-dom";
import Button from "../../UI/Button";
import ProfilePicture from "../../UI/ProfilePicture";
import Tag from "../../UI/Tag";
import VerifiedBadge from "../../UI/VerifiedBadge";
import Player from "../../../assets/images/player.jpg";
import {
  Check,
  MapPin,
  PencilSimpleLine,
  Plus,
  SealCheck,
  ShareNetwork,
} from "@phosphor-icons/react";

import "./ProfileHeader.css";

export default function ProfileHeader({
  profile,
  isMe = false,
  isFollowing,
  toggleFollow,
  busy,
}) {
  const navigate = useNavigate();

  if (!profile) return null;

  const locationText =
    profile.city && profile.country
      ? `${profile.city}, ${profile.country}`
      : profile.city || profile.country || null;

  return (
    <section className="profile-header">
      <div className="profile-header-row profile-header-top">
        <ProfilePicture
          size="large"
          verified={profile.verified}
          imgUrl={profile.avatar_url || Player}
        />

        <div className="profile-top-text">
          <div className="profile-name-row">
            <h2 className="profile-name">{profile.full_name}</h2>
            {profile.verified && (
              <VerifiedBadge
                containerSize="container-small"
                iconSize="icon-small"
              />
            )}
          </div>
          <div className="profile-tags">
            {profile.role && <Tag label={profile.role} />}
            {profile.position && (
              <Tag label={String(profile.position).replace(/[[\]"]/g, "")} />
            )}
          </div>
        </div>
      </div>

      <div className="profile-header-row profile-info">
        {profile.bio && <p className="profile-bio">{profile.bio}</p>}

        <div className="profile-meta">
          <div className="profile-follow-line">
            <span className="profile-followers">
              <strong>{profile.follower_count ?? 0}</strong> followers
            </span>

            {isMe && (
              <span
                className="profile-following"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/profile/me/following")}
              >
                <strong>{profile.following_count ?? 0}</strong> following
              </span>
            )}
          </div>

          {locationText && (
            <div className="profile-location">
              <MapPin />
              <span>{locationText}</span>
            </div>
          )}
        </div>
      </div>

      <div className="profile-header-row profile-buttons">
        {isMe ? (
          <>
            <Button
              size="medium"
              type="outline"
              label="Edit Profile"
              Icon={PencilSimpleLine}
              onClick={() => navigate("/profile/me/edit")}
            />
            <Button size="medium" type="outline" label="Verify" Icon={SealCheck} />
            <Button size="medium" type="outline" Icon={ShareNetwork} />
          </>
        ) : (
          <>
            <Button
              size="medium"
              type={isFollowing ? "outline" : "primary"}
              label={isFollowing ? "Following" : "Follow"}
              onClick={toggleFollow}
              disabled={busy}
              Icon={isFollowing ? Check : Plus}
            />
            <Button
              size="medium"
              type="outline"
              label="Message"
              onClick={() => console.log("Message clicked")}
            />
          </>
        )}
      </div>
    </section>
  );
}
