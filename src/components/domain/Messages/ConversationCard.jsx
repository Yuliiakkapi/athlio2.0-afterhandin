import ProfilePicture from "../../UI/ProfilePicture";
import RoleBadge from "../../UI/RoleBadge";
import "./ConversationCard.css";

/**
 * ConversationCard — a single row in the messages list.
 *
 * Props:
 *   name       string   — sender's display name
 *   role       string   — "Player" | "Scout" | "Coach" | …
 *   avatarUrl  string?  — profile image URL (null → placeholder)
 *   preview    string   — last message snippet
 *   time       string   — human-readable timestamp ("2h ago")
 *   unread     boolean  — show the blue unread dot
 *   verified   boolean  — show verified badge on avatar
 *   onClick    fn?      — tap/click handler
 */
export default function ConversationCard({
  name,
  role,
  avatarUrl,
  preview,
  time,
  unread = false,
  verified = false,
  onClick,
}) {
  return (
    <button
      type="button"
      className="conv-card"
      onClick={onClick}
    >
      <div className={`conv-card-left${unread ? "" : " conv-card-left--read"}`}>
        {unread && <span className="conv-unread-dot" aria-hidden="true" />}
        <ProfilePicture imgUrl={avatarUrl} size="medium" verified={verified} />
        <div className="conv-meta">
          <div className="conv-name-row">
            <span className="conv-name text-sm-semibold">{name}</span>
            <RoleBadge role={role} />
          </div>
          <p className={`conv-preview text-sm-medium${unread ? " conv-preview--unread" : ""}`}>
            {preview}
          </p>
        </div>
      </div>
      <span className="conv-time text-2xs-medium">{time}</span>
    </button>
  );
}
