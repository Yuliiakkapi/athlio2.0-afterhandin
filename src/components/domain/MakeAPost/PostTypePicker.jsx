import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import "./PostTypePicer.css";
import PostTypeButton from "../../UI/PostTypeButton";
import {
  Article,
  CalendarBlank,
  ChartBar,
  Sparkle,
} from "@phosphor-icons/react";

export default function PostTypePicker({ onChoose }) {
  const navigate = useNavigate();
  const { isScout, canPost } = useUser();

  const types = [
    { key: "post", title: "Post", icon: Article },
    {
      key: "match",
      title: "Manual Match",
      icon: ChartBar,
    },
    {
      key: "activity",
      title: "Activity",
      icon: Sparkle,
    },
    {
      key: "event",
      title: "Event",
      icon: CalendarBlank,
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
