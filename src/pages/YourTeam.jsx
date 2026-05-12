import { useNavigate } from "react-router-dom";
import { CaretLeft } from "@phosphor-icons/react";
import OvrBadge from "../components/UI/OvrBadge";
import PitchBg from "../assets/images/position-bg.png";
import "./YourTeam.css";

// Figma asset — replace with permanent CDN asset (expires 7 days after generation)
const PLAYER_IMG = "https://www.figma.com/api/mcp/asset/3f4073c4-96b3-4be5-a16e-3aae27fcfffe";

const TEAM_OVR = 72;
const DEF_OVR  = 72;
const OFF_OVR  = 65;

// Viewport-% coordinates matching position-bg.png pitch layout (same scale as PositionSelect)
const FORMATION = [
  { id: 1,  name: "BRYLD", ovr: 72, pos: "ST",  left: 50.0, top: 28.0 },
  { id: 2,  name: "BRYLD", ovr: 72, pos: "LW",  left: 17.0, top: 35.0 },
  { id: 3,  name: "BRYLD", ovr: 72, pos: "CAM", left: 50.0, top: 38.5 },
  { id: 4,  name: "BRYLD", ovr: 72, pos: "RW",  left: 83.0, top: 35.0 },
  { id: 5,  name: "BRYLD", ovr: 72, pos: "LCM", left: 24.0, top: 50.5 },
  { id: 6,  name: "BRYLD", ovr: 72, pos: "CM",  left: 50.0, top: 52.5 },
  { id: 7,  name: "BRYLD", ovr: 72, pos: "RCM", left: 76.0, top: 50.5 },
  { id: 8,  name: "BRYLD", ovr: 72, pos: "LCB", left: 25.0, top: 66.0 },
  { id: 9,  name: "BRYLD", ovr: 72, pos: "CB",  left: 50.0, top: 69.0 },
  { id: 10, name: "BRYLD", ovr: 72, pos: "RCB", left: 75.0, top: 66.0 },
  { id: 11, name: "BRYLD", ovr: 72, pos: "GK",  left: 50.0, top: 82.0 },
];

function PlayerMarker({ player }) {
  return (
    <div
      className="yt-player"
      style={{ left: `${player.left}%`, top: `${player.top}%` }}
    >
      <span className="yt-player-pos">{player.pos}</span>
      <div className="yt-player-inner">
        <div className="yt-player-circle">
          <img src={PLAYER_IMG} alt="" className="yt-player-img" />
        </div>
        <div className="yt-player-badge">
          <OvrBadge value={player.ovr} size="xs" variant="gold" />
        </div>
      </div>
      <span className="yt-player-name">{player.name}</span>
    </div>
  );
}

export default function YourTeam() {
  const navigate = useNavigate();

  return (
    <div className="your-team-page">
      {/* Full-viewport pitch background */}
      <div className="yt-bg" aria-hidden="true">
        <img src={PitchBg} alt="" className="yt-bg-img" />
        <div className="yt-gradient" />
      </div>

      {/* Fixed top bar: back + title */}
      <div className="yt-topbar">
        <button className="yt-back-btn" onClick={() => navigate(-1)} aria-label="Back">
          <CaretLeft size={20} weight="bold" />
        </button>
        <h1 className="yt-title heading-3xl-italic">YOUR TEAM</h1>
        <div className="yt-topbar-spacer" />
      </div>

      {/* Fixed OVR stats bar */}
      <div className="yt-ovr-bar">
        <OvrBadge value={TEAM_OVR} size="lg" variant="gold" />
        <div className="yt-ovr-divider" aria-hidden="true" />
        <div className="yt-ovr-metrics">
          <div className="yt-ovr-metric">
            <span className="yt-ovr-label text-base-semibold">Def</span>
            <OvrBadge value={DEF_OVR} size="sm" variant="gold" />
          </div>
          <div className="yt-ovr-metric">
            <span className="yt-ovr-label text-base-semibold">Offense</span>
            <OvrBadge value={OFF_OVR} size="sm" variant="gold" />
          </div>
        </div>
      </div>

      {/* Player markers — fixed overlay at viewport coordinates */}
      <div className="yt-players" aria-label="Team formation" role="group">
        {FORMATION.map((player) => (
          <PlayerMarker key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
