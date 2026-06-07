import { useState } from "react";
import OvrBadge from "../../components/UI/OvrBadge";
import { useUser } from "../../context/UserContext";
import "./LeaderboardPage.css";

const FILTERS = ["Watchlist", "All", "La Liga 1 U19"];

const PLAYERS = [
  { id: 1, name: "Kylian Mbappe", club: "Real Madrid FC", g: 15, a: 18, ovr: 52 },
  { id: 2, name: "Samuel Soares", club: "FC Benfica", g: 15, a: 17, ovr: 53 },
  { id: 3, name: "Kylian Mbappe", club: "Real Madrid FC", g: 17, a: 10, ovr: 55, isMe: true },
  { id: 4, name: "Lionel Messi", club: "Inter Miami CF", g: 15, a: 12, ovr: 40 },
  { id: 5, name: "Cristiano Ronaldo", club: "Al Nassr", g: 20, a: 9, ovr: 60 },
  { id: 6, name: "Erling Haaland", club: "Manchester City", g: 22, a: 8, ovr: 48 },
  { id: 7, name: "Neymar Jr.", club: "Al Hilal", g: 10, a: 11, ovr: 30 },
  { id: 8, name: "Mohamed Salah", club: "Liverpool FC", g: 18, a: 13, ovr: 45 },
  { id: 9, name: "Alex Morgan", club: "Orlando Pride", g: 18, a: 13, ovr: 45 },
  { id: 10, name: "Alex Morgan", club: "Orlando Pride", g: 18, a: 13, ovr: 45 },
];

export default function LeaderboardPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { profile } = useUser();

  const rows = PLAYERS.map((p) =>
    p.isMe
      ? { ...p, name: profile?.full_name || profile?.username || p.name, club: profile?.club_other_name || p.club, avatar: profile?.avatar_url }
      : p
  );

  return (
    <div className="lb-page">
      <div className="lb-filters-wrap">
        <div className="lb-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`lb-filter-tab${activeFilter === f ? " lb-filter-tab--active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="lb-table">
        <div className="lb-thead">
          <div className="lb-thead-left">
            <span className="lb-thead-player">Player</span>
          </div>
          <div className="lb-thead-right">
            <span className="lb-thead-stat">G</span>
            <span className="lb-thead-stat">A</span>
            <span className="lb-thead-rating">Rating</span>
          </div>
        </div>

        {rows.map((player, i) => (
          <div
            key={player.id}
            className={[
              "lb-row",
              player.isMe && "lb-row--me",
              i === rows.length - 1 && "lb-row--last",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="lb-row-left">
              <span className="lb-rank">{i + 1}.</span>
              <div className={`lb-avatar${player.isMe ? " lb-avatar--me" : ""}`}>
                {player.avatar
                  ? <img src={player.avatar} alt="" className="lb-avatar-img" />
                  : player.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
              </div>
              <div className="lb-player-info">
                <span className="lb-player-name text-sm-semibold">{player.name}</span>
                <span className="lb-player-club text-xs-medium">{player.club}</span>
              </div>
            </div>

            <div className="lb-row-right">
              <span className={`lb-stat${player.isMe ? " lb-stat--me" : ""}`}>{player.g}</span>
              <span className={`lb-stat${player.isMe ? " lb-stat--me" : ""}`}>{player.a}</span>
              <div className="lb-rating">
                <OvrBadge value={player.ovr} size={player.isMe ? "md" : "sm"} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
