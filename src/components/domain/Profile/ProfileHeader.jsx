import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileHeader.css";

import darkblueStripes from "../../../assets/images/darkblue-stripes.png";

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

  const clubName = profile.club_other_name || null;

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
      <img className="ph-deco" src={darkblueStripes} alt="" aria-hidden="true" />

      {/* Top bar: back arrow + share */}
      <div className="ph-topbar">
        <button className="ph-icon-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="ph-icon-btn" aria-label="Share profile">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.75" />
            <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.75" />
            <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.75" />
            <path d="M8.3 10.7l7.4-4.4M8.3 13.3l7.4 4.4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Main content: avatar LEFT + info RIGHT */}
      <div className="ph-content">
        <div 
          className="ph-avatar-wrap"
          onClick={handleAvatarClick}
          style={isMe ? { cursor: "pointer", opacity: 0.9, transition: "opacity 0.2s" } : {}}
          onMouseEnter={(e) => isMe && (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => isMe && (e.currentTarget.style.opacity = "0.9")}
          title={isMe && !profile.avatar_url ? "Click to add picture" : isMe ? "Click to change picture" : ""}
          role={isMe ? "button" : undefined}
          tabIndex={isMe ? 0 : undefined}
        >
          {profile.avatar_url ? (
            <img className="ph-avatar" src={profile.avatar_url} alt={profile.full_name || "Avatar"} />
          ) : (
            <div className="ph-avatar ph-avatar--placeholder" />
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarFileChange}
        />

        <div className="ph-info">
          <h1 className="ph-name heading-4xl-italic">{profile.full_name || profile.username || "Athlete"}</h1>
          <p className="ph-followers text-sm-medium">
            {(profile.follower_count ?? 0).toLocaleString()} followers
          </p>
          <div className="ph-meta-row">
            {positions.slice(0, 3).map((pos) => (
              <span key={pos} className="ph-badge">{pos}</span>
            ))}
            {(positions.length > 0 || true) && clubName && (
              <span className="ph-dot" aria-hidden="true" />
            )}
            {clubName && <span className="ph-club text-sm-medium">{clubName}</span>}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="ph-actions">
        {isMe ? (
          <button className="ph-btn ph-btn--secondary text-base-semibold" onClick={() => navigate("/profile/me/edit")}>
            Edit Profile
          </button>
        ) : (
          <>
            <button
              className="ph-btn ph-btn--secondary text-base-semibold"
              onClick={toggleFollow}
              disabled={busy}
            >
              {isFollowing ? "Following" : "+ Follow"}
            </button>
            <button className="ph-btn ph-btn--ghost text-base-semibold">Message</button>
          </>
        )}
      </div>
    </section>
  );
}
