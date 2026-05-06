import "./ProfilePicture.css";
import VerifiedBadge from "./VerifiedBadge";

export default function ProfilePicture({
  imgUrl = "",
  size = "",
  verified = false,
}) {
  return (
    <div className="profile-picture-container">
      {imgUrl ? (
        <img
          src={imgUrl}
          alt="Profile Picture"
          className={`profile-picture profile-picture--${size}`}
        />
      ) : (
        // render a placeholder element instead of an <img> with empty src
        <div
          className={`profile-picture profile-picture--${size} profile-picture--placeholder`}
          aria-hidden="true"
        />
      )}
      <div className="verification-badge-profile">
        {verified && (
          <VerifiedBadge
            containerSize={`container-${size}`}
            iconSize={`icon-${size}`}
          />
        )}
      </div>
    </div>
  );
}
