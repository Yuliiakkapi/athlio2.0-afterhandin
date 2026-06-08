import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import "./PostTypePicer.css";
import PostTypeButton from "../../UI/PostTypeButton";
import { PlusCircle, SoccerBall, Sneaker } from "@phosphor-icons/react";

const TYPES = [
  { key: "post",     title: "Post",     icon: PlusCircle, disabled: false },
  { key: "match",    title: "Match",    icon: SoccerBall, disabled: false },
  { key: "training", title: "Training", icon: Sneaker,    disabled: true  },
];

export default function PostTypePicker({ onChoose }) {
  const navigate = useNavigate();
  const { isScout, canPost } = useUser();

  const visibleTypes = isScout
    ? TYPES.filter((t) => t.key !== "match")
    : TYPES;

  return (
    <div className="post-type-picker">
      {visibleTypes.map((t) => (
        <PostTypeButton
          key={t.key}
          title={t.title}
          icon={t.icon}
          disabled={t.disabled || !canPost(t.key)}
          onClick={() => {
            if (t.key === "match") navigate("/post-match-select");
            else onChoose?.(t.key);
          }}
        />
      ))}
    </div>
  );
}
