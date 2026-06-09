import { useRef, useState } from "react";
import OvrBadge from "../../components/UI/OvrBadge";
import { useUser } from "../../context/UserContext";
import "./LeaderboardPage.css";

const ALL_WORLD = [
  { id: 1,  name: "Kylian Mbappe",     club: "Real Madrid FC",  g: 15, a: 18, ovr: 52 },
  { id: 2,  name: "Samuel Soares",     club: "FC Benfica",       g: 15, a: 17, ovr: 53 },
  { id: 3,  name: "Kylian Mbappe",     club: "Real Madrid FC",  g: 17, a: 10, ovr: 55, isMe: true },
  { id: 4,  name: "Lionel Messi",      club: "Inter Miami CF",   g: 15, a: 12, ovr: 40 },
  { id: 5,  name: "Cristiano Ronaldo", club: "Al Nassr",         g: 20, a: 9,  ovr: 60 },
  { id: 6,  name: "Erling Haaland",    club: "Manchester City",  g: 22, a: 8,  ovr: 48 },
  { id: 7,  name: "Neymar Jr.",        club: "Al Hilal",         g: 10, a: 11, ovr: 30 },
  { id: 8,  name: "Mohamed Salah",     club: "Liverpool FC",     g: 18, a: 13, ovr: 45 },
  { id: 9,  name: "Alex Morgan",       club: "Orlando Pride",    g: 18, a: 13, ovr: 45 },
  { id: 10, name: "Alex Morgan",       club: "Orlando Pride",    g: 18, a: 13, ovr: 45 },
];

const DIVISION_3 = [
  { id: 1,  name: "Emil Jensen Bryld", club: "Hobro IK",         g: 18, a: 12, ovr: 55 },
  { id: 2,  name: "Mikkel Pedersen",   club: "Hobro IK",         g: 17, a: 10, ovr: 55 },
  { id: 3,  name: "Søren Jørgensen",   club: "VRI",              g: 17, a: 9,  ovr: 56 },
  { id: 4,  name: "Lars Nielsen",      club: "FC Fredericia",    g: 14, a: 8,  ovr: 50 },
  { id: 5,  name: "Jonas Madsen",      club: "Silkeborg IF",     g: 13, a: 11, ovr: 49 },
  { id: 6,  name: "Rasmus Berg",       club: "AGF Aarhus",       g: 12, a: 7,  ovr: 48 },
  { id: 7,  name: "Tobias Lund",       club: "OB Odense",        g: 11, a: 9,  ovr: 47 },
  { id: 8,  name: "Anders Holm",       club: "Randers FC",       g: 10, a: 6,  ovr: 46 },
  { id: 9,  name: "Christian Dahl",    club: "FC Midtjylland",   g: 9,  a: 8,  ovr: 44 },
  { id: 10, name: "Frederik Koch",     club: "Esbjerg fB",       g: 8,  a: 5,  ovr: 43 },
];

const LA_LIGA_U19 = [
  { id: 1,  name: "Lamine Yamal",      club: "FC Barcelona",     g: 20, a: 15, ovr: 68 },
  { id: 2,  name: "Pau Cubarsí",       club: "FC Barcelona",     g: 3,  a: 7,  ovr: 65 },
  { id: 3,  name: "Marc Guiu",         club: "Chelsea FC",       g: 14, a: 6,  ovr: 62 },
  { id: 4,  name: "Gavi",              club: "FC Barcelona",     g: 8,  a: 12, ovr: 70 },
  { id: 5,  name: "Pedri",             club: "FC Barcelona",     g: 10, a: 14, ovr: 72 },
  { id: 6,  name: "Nico Williams",     club: "Athletic Bilbao",  g: 16, a: 9,  ovr: 67 },
  { id: 7,  name: "Alejandro Iturbe",  club: "Real Sociedad",    g: 11, a: 8,  ovr: 60 },
  { id: 8,  name: "Carlos Romero",     club: "Sevilla FC",       g: 9,  a: 5,  ovr: 58 },
  { id: 9,  name: "Hugo Duro",         club: "Valencia CF",      g: 12, a: 4,  ovr: 57 },
  { id: 10, name: "Sergio Camello",    club: "Atletico Madrid",  g: 7,  a: 6,  ovr: 55 },
];

const TABS = [
  { label: "Watchlist",     players: ALL_WORLD },
  { label: "All",           players: ALL_WORLD },
  { label: "La Liga 1 U19", players: LA_LIGA_U19 },
];

function LeaderboardCard({ players, profile }) {
  const rows = players.map((p) =>
    p.isMe
      ? { ...p, name: profile?.full_name || profile?.username || p.name, club: profile?.club_other_name || p.club, avatar: profile?.avatar_url }
      : p
  );

  return (
    <div className="lbp-card">
      <div className="lbp-thead">
        <span className="lbp-thead-player">Player</span>
        <div className="lbp-thead-right">
          <span className="lbp-thead-stat">G</span>
          <span className="lbp-thead-stat">A</span>
          <span className="lbp-thead-rating">Rating</span>
        </div>
      </div>

      {rows.map((player, i) => (
        <div
          key={player.id}
          className={[
            "lbp-row",
            player.isMe && "lbp-row--me",
            i === rows.length - 1 && "lbp-row--last",
          ].filter(Boolean).join(" ")}
        >
          <div className="lbp-row-left">
            <span className="lbp-rank">{i + 1}.</span>
            <div className={`lbp-avatar${player.isMe ? " lbp-avatar--me" : ""}`}>
              {player.avatar
                ? <img src={player.avatar} alt="" className="lbp-avatar-img" />
                : player.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
            </div>
            <div className="lbp-player-info">
              <span className="lbp-player-name text-sm-semibold">{player.name}</span>
              <span className="lbp-player-club text-xs-medium">{player.club}</span>
            </div>
          </div>

          <div className="lbp-row-right">
            <span className={`lbp-stat${player.isMe ? " lbp-stat--me" : ""}`}>{player.g}</span>
            <span className={`lbp-stat${player.isMe ? " lbp-stat--me" : ""}`}>{player.a}</span>
            <div className="lbp-rating">
              <OvrBadge value={player.ovr} size={player.isMe ? "md" : "sm"} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LeaderboardPage() {
  const { profile } = useUser();
  const [activeTab, setActiveTab] = useState(1);
  const carouselRef = useRef(null);

  function handleTabClick(index) {
    setActiveTab(index);
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.children[index];
    if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  return (
    <div className="lbp-page">
      <div className="lbp-tabs">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            className={`lbp-tab${activeTab === i ? " lbp-tab--active" : ""}`}
            onClick={() => handleTabClick(i)}
          >
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="lbp-carousel" ref={carouselRef}>
        {TABS.map((tab) => (
          <LeaderboardCard key={tab.label} players={tab.players} profile={profile} />
        ))}
      </div>
    </div>
  );
}
