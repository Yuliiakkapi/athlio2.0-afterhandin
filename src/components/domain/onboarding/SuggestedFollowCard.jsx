import { Link } from "react-router-dom";
import ProfilePicture from "../../UI/ProfilePicture";
import Badge from "../../UI/Badge";
import { toPositionAbbr } from "../../../utils/positions";
import "./SuggestedFollowCard.css";

export default function SuggestedFollowCard({
  id,
  name,
  avatarUrl,
  verified = false,
  positions = [],
  clubName = null,
}) {
  const parts = (name || "").trim().split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ");

  return (
    <Link to={`/profile/${id}`} className="suggest-follow-card">
      <div className="suggest-card-photo-wrap">
        <ProfilePicture imgUrl={avatarUrl} size="large" verified={verified} />
        {positions.length > 0 && (
          <div className="suggest-card-badges">
            {positions.slice(0, 2).map((pos) => (
              <Badge key={pos} text={toPositionAbbr(pos)} color="light" size="xs" />
            ))}
          </div>
        )}
      </div>

      <div className="suggest-card-info">
        <p className="suggest-card-firstname">{firstName}</p>
        {lastName && <p className="suggest-card-lastname">{lastName}</p>}
        {clubName && <p className="suggest-card-club">{clubName}</p>}
      </div>
    </Link>
  );
}
