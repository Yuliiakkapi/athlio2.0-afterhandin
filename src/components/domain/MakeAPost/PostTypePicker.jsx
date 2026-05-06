import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import "./PostTypePicer.css";
import PostTypeButton from "../../UI/PostTypeButton";
import PostIcon from "../../../assets/icons/post.svg?react";
import StatsIcon from "../../../assets/icons/stats.svg?react";
import ActivityIcon from "../../../assets/icons/activity.svg?react";
import EventIcon from "../../../assets/icons/event.svg?react";

export default function PostTypePicker({ onChoose }) {
  const navigate = useNavigate();
  const { isScout, canPost } = useUser();

  const types = [
    { key: "post", title: "Post", icon: PostIcon },
    {
      key: "match",
      title: "Manual Match",
      icon: StatsIcon,
    },
    {
      key: "activity",
      title: "Activity",
      icon: ActivityIcon,
    },
    {
      key: "event",
      title: "Event",
      icon: EventIcon,
    },
  ];

  const visibleTypes = isScout
    ? types.filter((t) => !["match", "activity"].includes(t.key))
    : types;

  return (
    <div className="post-type-picker">
      {visibleTypes.map((t) => (
        <PostTypeButton
          key={t.key}
          title={t.title}
          icon={t.icon}
          onClick={() => {
            if (!canPost(t.key)) return;
            if (t.key === "match") navigate("/add-post/match");
            else onChoose?.(t.key);
          }}
        />
      ))}
    </div>
  );
}
