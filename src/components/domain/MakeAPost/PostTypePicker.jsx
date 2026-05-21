import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import "./PostTypePicer.css";
import PostTypeButton from "../../UI/PostTypeButton";
import { Article, ChartBar } from "@phosphor-icons/react";

export default function PostTypePicker({ onChoose }) {
  const navigate = useNavigate();
  const { isScout, canPost } = useUser();

  const types = [
    { key: "post", title: "Post", icon: Article },
    { key: "match", title: "Manual Match", icon: ChartBar },
  ];

  const visibleTypes = isScout
    ? types.filter((t) => t.key !== "match")
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
