import { CaretDown } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import OvrBadge from "../../UI/OvrBadge";
import Button from "../../UI/Button";
import { useUser } from "../../../context/UserContext";
import "./LeaderboardSection.css";

const LEADERBOARD = [
  {
    id: 1,
    name: "Kylian Mbappe",
    club: "Real Madrid FC",
    a: 15,
    g: 18,
    ovr: 52,
  },
  { id: 2, name: "Samuel Soares", club: "FC Benfica", a: 15, g: 17, ovr: 53 },
  {
    id: 3,
    name: "Emil Jensen Bryld",
    club: "Hobro IK",
    a: 18,
    g: 12,
    ovr: 55,
    isMe: true,
  },
  { id: 4, name: "Mikkel Pedersen", club: "Hobro IK", a: 17, g: 10, ovr: 55 },
  { id: 5, name: "Søren Jørgensen", club: "VRI", a: 17, g: 9, ovr: 56 },
];

export default function LeaderboardSection() {
  const { profile } = useUser();
  const navigate = useNavigate();
  const myAvatar = profile?.avatar_url;
  const myName  = profile?.full_name || profile?.username || "You";
  const myClub  = profile?.club_other_name || "";

  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Leaderboard</h2>
          <p className="prog-section-subtitle">Ranking your position and age</p>
        </div>
        <Button
          type="secondary"
          size="xsmall"
          label="All world"
          trailingIcon={CaretDown}
        />
      </div>

      <div className="prog-lb-card" onClick={() => navigate("/progress/leaderboard")}>
        <div className="prog-lb-thead">
          <span className="prog-lb-col-player">Player</span>
          <div className="prog-lb-col-stats">
            <span>G</span>
            <span>A</span>
            <span className="prog-lb-col-rating">Rating</span>
          </div>
        </div>

        {LEADERBOARD.map((row, i) => (
          <div
            key={row.id}
            className={[
              "prog-lb-row",
              row.isMe && "prog-lb-row--me",
              i === LEADERBOARD.length - 1 && "prog-lb-row--last",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="prog-lb-player">
              <div
                className={`prog-lb-avatar${row.isMe ? " prog-lb-avatar--me" : ""}`}
              >
                {row.isMe && myAvatar
                  ? <img src={myAvatar} alt="" className="prog-lb-avatar-img" />
                  : row.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
              </div>
              <div>
                <p className="prog-lb-name">{row.isMe ? myName : row.name}</p>
                <p className="prog-lb-club">{row.isMe ? myClub : row.club}</p>
              </div>
            </div>

            <div className="prog-lb-stats">
              <span
                className={`prog-lb-stat${row.isMe ? " prog-lb-stat--me" : ""}`}
              >
                {row.a}
              </span>
              <span
                className={`prog-lb-stat${row.isMe ? " prog-lb-stat--me" : ""}`}
              >
                {row.g}
              </span>
              <div className="prog-lb-rating">
                <OvrBadge value={row.ovr} size={row.isMe ? "md" : "sm"} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
