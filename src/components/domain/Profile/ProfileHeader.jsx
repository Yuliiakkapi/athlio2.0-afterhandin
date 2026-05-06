import { useNavigate } from "react-router-dom"; // 👈 import this
import Button from "../../UI/Button";
import ProfilePicture from "../../UI/ProfilePicture";
import Tag from "../../UI/Tag";
import VerifiedBadge from "../../UI/VerifiedBadge";
import Player from "../../../assets/images/player.jpg";
import PlusIcon from "../../../assets/icons/plus.svg?react";
import CheckIcon from "../../../assets/icons/check.svg?react";
import LocationIcon from "../../../assets/icons/location.svg?react";
import EditIcon from "../../../assets/icons/edit.svg?react";
import VerifyIcon from "../../../assets/icons/verify.svg?react";
import ShareIcon from "../../../assets/icons/share.svg?react";

import "./ProfileHeader.css";

export default function ProfileHeader({
  profile,
  isMe = false,
  isFollowing,
  toggleFollow,
  busy,
}) {
  const navigate = useNavigate(); // ✅ create the navigate hook

  if (!profile) return null;

  const hasTags = profile.role || profile.position;
  const locationText =
    profile.city && profile.country
      ? `${profile.city}, ${profile.country}`
      : profile.city || profile.country || null;

  return (
    <section className="profile-header">
      {/* === Top row: avatar, name, and tags === */}
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

      {/* === Middle section: bio and stats === */}
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
              <LocationIcon />
              <span>{locationText}</span>
            </div>
          )}
        </div>
      </div>

      {/* === Bottom section: buttons === */}
      <div className="profile-header-row profile-buttons">
        {isMe ? (
          <>
            <Button
              size="medium"
              type="outline"
              label="Edit Profile"
              Icon={EditIcon}
              onClick={() => navigate("/profile/me/edit")} // ✅ navigate to edit page
            />
            <Button
              size="medium"
              type="outline"
              label="Verify"
              Icon={VerifyIcon}
            />
            <Button size="medium" type="outline" Icon={ShareIcon} />
          </>
        ) : (
          <>
            <Button
              size="medium"
              type={isFollowing ? "outline" : "primary"}
              label={isFollowing ? "Following" : "Follow"}
              onClick={toggleFollow}
              disabled={busy}
              Icon={isFollowing ? CheckIcon : PlusIcon}
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
