import { useNavigate } from "react-router-dom";
import "./ProfileHeader.css";

const DECO_1 = "https://www.figma.com/api/mcp/asset/52ded45f-c755-40dc-9c51-9ee493f1728d";
const DECO_2 = "https://www.figma.com/api/mcp/asset/12ed800c-7121-4de6-914e-0fac6f2ccb2a";
const DECO_3 = "https://www.figma.com/api/mcp/asset/502d28dc-b1c8-4892-acd5-2d324bbebfd0";

export default function ProfileHeader({
  profile,
  isMe = false,
  isFollowing,
  toggleFollow,
  busy,
}) {
  const navigate = useNavigate();

  if (!profile) return null;

  const positions = Array.isArray(profile.position)
    ? profile.position
    : profile.position
    ? [profile.position]
    : [];

  const clubName = profile.club_other_name || null;

  return (
    <section className="ph-root">
      {/* Decorative background shapes from Figma */}
      <img className="ph-deco ph-deco-1" src={DECO_1} alt="" aria-hidden="true" />
      <img className="ph-deco ph-deco-2" src={DECO_2} alt="" aria-hidden="true" />
      <img className="ph-deco ph-deco-3" src={DECO_3} alt="" aria-hidden="true" />

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
        <div className="ph-avatar-wrap">
          {profile.avatar_url ? (
            <img className="ph-avatar" src={profile.avatar_url} alt={profile.full_name || "Avatar"} />
          ) : (
            <div className="ph-avatar ph-avatar--placeholder" />
          )}
        </div>

        <div className="ph-info">
          <h1 className="ph-name">{profile.full_name || profile.username || "Athlete"}</h1>
          <p className="ph-followers">
            {(profile.follower_count ?? 0).toLocaleString()} followers
          </p>
          <div className="ph-meta-row">
            {positions.slice(0, 3).map((pos) => (
              <span key={pos} className="ph-badge">{pos}</span>
            ))}
            {(positions.length > 0 || true) && clubName && (
              <span className="ph-dot" aria-hidden="true" />
            )}
            {clubName && <span className="ph-club">{clubName}</span>}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="ph-actions">
        {isMe ? (
          <button className="ph-btn ph-btn--secondary" onClick={() => navigate("/profile/me/edit")}>
            Edit Profile
          </button>
        ) : (
          <>
            <button
              className="ph-btn ph-btn--secondary"
              onClick={toggleFollow}
              disabled={busy}
            >
              {isFollowing ? "Following" : "+ Follow"}
            </button>
            <button className="ph-btn ph-btn--ghost">Message</button>
          </>
        )}
      </div>
    </section>
  );
}
