import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  PencilSimple,
  ShareNetwork,
  Plus,
  ChatCircle,
} from "@phosphor-icons/react";
import "./ProfileHeader.css";
import Button from "../../UI/Button";
import Badge from "../../UI/Badge";
import ProfilePicture from "../../UI/ProfilePicture";

import darkblueStripes from "../../../assets/images/darkblue-stripes.png";
import { toPositionAbbr } from "../../../utils/positions";

export default function ProfileHeader({
  profile,
  isMe = false,
  isFollowing,
  toggleFollow,
  busy,
  onAvatarChange,
}) {
  const navigate = useNavigate();
  const fileRef = useRef();

  if (!profile) return null;

  const positions = Array.isArray(profile.position)
    ? profile.position
    : profile.position
      ? [profile.position]
      : [];

  const clubName = profile.clubs?.name || profile.club_other_name || null;
  const clubLogo = profile.clubs?.logo_url || null;

  function handleAvatarFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof onAvatarChange === "function") {
        onAvatarChange(dataUrl);
      }
    };
    reader.readAsDataURL(f);
  }

  function handleAvatarClick() {
    if (isMe && !profile.avatar_url) {
      // If blank picture, open gallery
      fileRef.current?.click();
    } else if (isMe && profile.avatar_url) {
      // If has picture, go to edit to change it
      navigate("/profile/me/edit");
    }
  }

  return (
    <section className="ph-root">
      <img
        className="ph-deco"
        src={darkblueStripes}
        alt=""
        aria-hidden="true"
      />

      <div className="ph-box">
        {/* Main content: avatar LEFT + info RIGHT */}
        <div className="ph-content">
          <div
            className="ph-avatar-wrap"
            onClick={handleAvatarClick}
            role={isMe ? "button" : undefined}
            tabIndex={isMe ? 0 : undefined}
            title={
              isMe && !profile.avatar_url
                ? "Click to add picture"
                : isMe
                  ? "Click to change picture"
                  : ""
            }
          >
            <ProfilePicture
              imgUrl={profile.avatar_url}
              size="xlarge"
              verified={profile.is_verified}
            />
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarFileChange}
          />

          <div className="ph-info">
            <h1 className="ph-name heading-4xl-italic">
              {profile.full_name || profile.username || "Athlete"}
            </h1>
            <p className="ph-followers text-sm-medium">
              {(profile.follower_count ?? 0).toLocaleString()} followers
              {isMe && (
                <>
                  {" · "}
                  <span
                    onClick={() => navigate("/profile/me/following")}
                    style={{ cursor: "pointer" }}
                  >
                    {(profile.following_count ?? 0).toLocaleString()} following
                  </span>
                </>
              )}
            </p>
            <div className="ph-meta-row">
              {positions.slice(0, 3).map((pos) => (
                <Badge
                  key={pos}
                  text={toPositionAbbr(pos)}
                  color="light"
                  size="s"
                />
              ))}
              {(positions.length > 0 || true) && clubName && (
                <span className="ph-dot" aria-hidden="true" />
              )}
              {clubName && (
                <span className="ph-club text-sm-medium">
                  {clubLogo && (
                    <img
                      src={clubLogo}
                      alt={clubName}
                      className="ph-club-logo"
                    />
                  )}
                  {clubName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="ph-actions">
          {isMe ? (
            <>
              <Button
                size="small"
                type="secondary"
                label="Edit Profile"
                leadingIcon={PencilSimple}
                fullWidth
                onClick={() => navigate("/profile/me/edit")}
              />
              <Button
                size="small"
                type="white"
                label="Share"
                leadingIcon={ShareNetwork}
                fullWidth
                onClick={() => console.log("Share clicked")}
              />
            </>
          ) : (
            <>
              <Button
                size="small"
                type={isFollowing ? "following" : "primary"}
                label={isFollowing ? "Following" : "Follow"}
                leadingIcon={isFollowing ? undefined : Plus}
                fullWidth
                disabled={busy}
                onClick={toggleFollow}
              />
              <Button size="small" type="white" label="Message" fullWidth />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
