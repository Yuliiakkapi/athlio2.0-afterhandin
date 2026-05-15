import ProfilePicture from "../../UI/ProfilePicture";
import Button from "../../UI/Button";
import { Plus } from "@phosphor-icons/react";
import "./SuggestedFollowCard.css";

// Contract
// props: { id, name, avatarUrl, verified, isFollowing, onToggle }
export default function SuggestedFollowCard({
  id,
  name,
  avatarUrl,
  verified = false,
  isFollowing = false,
  onToggle,
}) {
  return (
    <div className="suggest-follow-card" data-node-id="2207:21535">
      <ProfilePicture imgUrl={avatarUrl || ""} size="large" verified={verified} />
      <div className="suggest-follow-card-name" title={name}>
        {name}
      </div>
      <Button
        size="small"
        type={isFollowing ? "subtle" : "outline"}
        label={isFollowing ? "Following" : "Follow"}
        Icon={!isFollowing ? Plus : undefined}
        onClick={() => onToggle && onToggle(id)}
      />
    </div>
  );
}
