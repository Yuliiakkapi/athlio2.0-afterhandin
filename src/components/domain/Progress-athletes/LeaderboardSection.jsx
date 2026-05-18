import { CaretDown } from "@phosphor-icons/react";
import OvrBadge from "../../UI/OvrBadge";
import "./LeaderboardSection.css";

const LEADERBOARD = [
  { id: 1, name: "Kylian Mbappe",     club: "Real Madrid FC", a: 15, g: 18, ovr: 52 },
  { id: 2, name: "Samuel Soares",     club: "FC Benfica",      a: 15, g: 17, ovr: 53 },
  { id: 3, name: "Emil Jensen Bryld", club: "Hobro IK",        a: 18, g: 12, ovr: 55, isMe: true },
  { id: 4, name: "Kylian Mbappe",     club: "Real Madrid FC",  a: 17, g: 10, ovr: 55 },
  { id: 5, name: "Kylian Mbappe",     club: "Real Madrid FC",  a: 17, g: 9,  ovr: 56 },
];

export default function LeaderboardSection() {
  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Leaderboard</h2>
          <p className="prog-section-subtitle">Ranking your position and age</p>
        </div>
        <button className="prog-filter-btn">
          All world
          <CaretDown size={16} />
        </button>
      </div>
      <div className="prog-lb-card">
        <div className="prog-lb-thead">
          <span className="prog-lb-col-player">player</span>
          <div className="prog-lb-col-stats">
            <span>A</span>
            <span>G</span>
            <span className="prog-lb-col-rating">rating</span>
          </div>
        </div>
        {LEADERBOARD.map((row, i) => (
          <div
            key={row.id}
            className={[
              "prog-lb-row",
              row.isMe && "prog-lb-row--me",
              i === LEADERBOARD.length - 1 && "prog-lb-row--last",
            ].filter(Boolean).join(" ")}
          >
            <div className="prog-lb-player">
              <div className={`prog-lb-avatar${row.isMe ? " prog-lb-avatar--me" : ""}`}>
                {row.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
              </div>
              <div>
                <p className="prog-lb-name">{row.name}</p>
                <p className="prog-lb-club">{row.club}</p>
              </div>
            </div>
            <div className="prog-lb-stats">
              <span className={`prog-lb-stat${row.isMe ? " prog-lb-stat--me" : ""}`}>{row.a}</span>
              <span className={`prog-lb-stat${row.isMe ? " prog-lb-stat--me" : ""}`}>{row.g}</span>
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
