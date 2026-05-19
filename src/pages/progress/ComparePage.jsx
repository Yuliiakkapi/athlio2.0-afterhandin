import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import AISuggestion from "../../components/domain/Progress-athletes/AISuggestion";
import Badge from "../../components/UI/Badge";
import dembeleImg    from "../../assets/images/dembele-comparison.png";
import pedriImg      from "../../assets/images/pedricompare.png";
import bellinghamImg from "../../assets/images/bellinghamcompare.png";
import haalandImg    from "../../assets/images/haalandcompare.png";
import playerImg     from "../../assets/images/player.jpg";
import "./ComparePage.css";

const MY = {
  name: "Emil Jensen Bryld",
  flag: "🇩🇰",
  positions: ["ST", "CAM"],
  club: "Hobro IK",
  stats: { goals: 14, assists: 10, matches: 22, minutes: 1320 },
};

const PLAYERS = [
  {
    id: "dembele",
    name: "Ousmane Dembélé", shortName: "DEMBÉLÉ",
    circleColor: "#1B2E7A",
    img: dembeleImg, age: 21, flag: "🇫🇷",
    positions: ["CAM", "ST"], club: "PSG", pct: 65,
    stats: { goals: 26, assists: 14, matches: 42, minutes: 1260 },
  },
  {
    id: "pedri",
    name: "Pedri", shortName: "PEDRI",
    circleColor: "#A50044",
    img: pedriImg, age: 18, flag: "🇪🇸",
    positions: ["CAM", "CM"], club: "FC Barcelona", pct: 58,
    stats: { goals: 8, assists: 12, matches: 38, minutes: 2890 },
  },
  {
    id: "bellingham",
    name: "Jude Bellingham", shortName: "BELLINGHAM",
    circleColor: "#D4D4D4",
    img: bellinghamImg, age: 20, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    positions: ["CM", "CAM"], club: "Real Madrid", pct: 71,
    stats: { goals: 19, assists: 11, matches: 35, minutes: 2940 },
  },
  {
    id: "haaland",
    name: "Erling Haaland", shortName: "HAALAND",
    circleColor: "#97C1E7",
    img: haalandImg, age: 21, flag: "🇳🇴",
    positions: ["ST"], club: "Man City", pct: 48,
    stats: { goals: 30, assists: 6, matches: 40, minutes: 2980 },
  },
];

const STAT_KEYS = [
  { key: "goals",   label: "GOALS"   },
  { key: "assists", label: "ASSISTS" },
  { key: "matches", label: "MATCHES" },
  { key: "minutes", label: "MINUTES" },
];

const fmt = (n) => n >= 1000 ? n.toLocaleString("de-DE") : String(n);

export default function ComparePage() {
  const { profile } = useUser();
  const [activeId, setActiveId] = useState("dembele");
  const player = PLAYERS.find((p) => p.id === activeId);

  const projected = Math.round(MY.stats.goals * player.stats.matches / MY.stats.matches);

  return (
    <div className="cp-page">

      {/* ── Player selector ───────────────────────────────────── */}
      <div className="cp-selector">
        {PLAYERS.map((p) => (
          <button key={p.id} className={`cp-sel-item${p.id === activeId ? " cp-sel-item--active" : ""}`}
            onClick={() => setActiveId(p.id)}>
            <div className="cp-sel-circle" style={{ background: p.circleColor }}>
              <img src={p.img} alt={p.shortName} className="cp-sel-img" />
            </div>
            <span className={`cp-sel-name${p.id === activeId ? " cp-sel-name--active" : ""}`}>
              {p.shortName}
            </span>
          </button>
        ))}
      </div>

      {/* ── Match area ────────────────────────────────────────── */}
      <div className="cp-match-wrap">
        {/* Photos float above the card */}
        <div className="cp-photos">
          <div className="cp-photo cp-photo--user">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="You" className="cp-photo__img" />
              : <img src={playerImg} alt="You" className="cp-photo__img" />
            }
          </div>

          <div className="cp-badge">
            <span className="cp-badge__label">CAREER MATCH AT<br />THE AGE {player.age}</span>
            <span className="cp-badge__pct">{player.pct}%</span>
          </div>

          <div className="cp-photo cp-photo--pro">
            <img src={player.img} alt={player.name} className="cp-photo__img" />
          </div>
        </div>

        {/* Player info card */}
        <div className="cp-match-card">
          <div className="cp-match-players">
            <div className="cp-match-player">
              <div className="cp-match-name-row">
                <span className="cp-match-flag">{MY.flag}</span>
                <span className="cp-match-name">{MY.name}</span>
              </div>
              <div className="cp-match-positions">
                {MY.positions.map((pos) => <Badge key={pos} text={pos} color="light" size="xs" />)}
              </div>
              <span className="cp-match-club">{MY.club}</span>
            </div>

            <div className="cp-match-player cp-match-player--right">
              <div className="cp-match-name-row cp-match-name-row--right">
                <span className="cp-match-name">{player.name}</span>
                <span className="cp-match-flag">{player.flag}</span>
              </div>
              <div className="cp-match-positions cp-match-positions--right">
                {player.positions.map((pos) => <Badge key={pos} text={pos} color="light" size="xs" />)}
              </div>
              <span className="cp-match-club cp-match-club--right">{player.club}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats card ────────────────────────────────────────── */}
      <div className="cmp-card">
        <div className="cmp-stats">
          <div className="cmp-stats__header">
            <span className="cmp-stats__col-label">You</span>
            <span className="cmp-stats__col-label">{player.shortName} at {player.age}</span>
          </div>

          {STAT_KEYS.map(({ key, label }) => {
            const mine = MY.stats[key];
            const theirs = player.stats[key];
            const total = mine + theirs;
            const minePct = Math.round((mine / total) * 100);
            const theirPct = 100 - minePct;
            return (
              <div key={key} className="cmp-row cp-row">
                <div className="cp-row-top">
                  <span className="cmp-row__num cmp-row__num--mine">{fmt(mine)}</span>
                  <span className="cmp-row__label">{label}</span>
                  <span className="cmp-row__num cmp-row__num--theirs">{fmt(theirs)}</span>
                </div>
                <div className="cmp-bars">
                  <div className="cmp-bar cmp-bar--mine"   style={{ width: `${minePct}%` }} />
                  <div className="cmp-bar cmp-bar--theirs" style={{ width: `${theirPct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AI suggestion ─────────────────────────────────────── */}
      <AISuggestion
        title={`At your current pace extrapolated over ${player.stats.matches} matches, you'd reach ${projected} goals — keep your current form going.`}
        desc=""
      />

    </div>
  );
}
