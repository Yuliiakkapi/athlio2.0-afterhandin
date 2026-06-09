import { CaretDown } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import OvrBadge from "../../UI/OvrBadge";
import "./LeaderboardSection.css";

const LEADERBOARD = [
  { id: 1, name: "Kylian Mbappe",     club: "Real Madrid FC", a: 15, g: 18, ovr: 52 },
  { id: 2, name: "Samuel Soares",     club: "FC Benfica",      a: 15, g: 17, ovr: 53 },
  { id: 3, name: "Emil Jensen Bryld", club: "Hobro IK",        a: 18, g: 12, ovr: 55 },
  { id: 4, name: "Mikkel Pedersen",   club: "Hobro IK",        a: 17, g: 10, ovr: 55 },
  { id: 5, name: "Søren Jørgensen",   club: "VRI",             a: 17, g: 9,  ovr: 56 },
];

export default function LeaderboardSection() {
  const navigate = useNavigate();

  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Leaderboard</h2>
          <p className="prog-section-subtitle">Ranking your position and age</p>
        </div>
        <button className="prog-lb-filter-btn">
          Division 3 <CaretDown size={16} />
        </button>
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
            className={["prog-lb-row", i === LEADERBOARD.length - 1 && "prog-lb-row--last"].filter(Boolean).join(" ")}
          >
            <div className="prog-lb-player">
              <div className="prog-lb-avatar">
                {row.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
              </div>
              <div>
                <p className="prog-lb-name">{row.name}</p>
                <p className="prog-lb-club">{row.club}</p>
              </div>
            </div>

            <div className="prog-lb-stats">
              <span className="prog-lb-stat">{row.a}</span>
              <span className="prog-lb-stat">{row.g}</span>
              <div className="prog-lb-rating">
                <OvrBadge value={row.ovr} size="sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
