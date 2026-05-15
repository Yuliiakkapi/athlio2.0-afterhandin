import "./ProfessionalRole.css";
import CoachImg   from "../../../assets/images/prof-coach.png";
import ScoutImg   from "../../../assets/images/prof-scout.png";
import ManagerImg from "../../../assets/images/prof-manager.png";
import AgentImg   from "../../../assets/images/prof-agent.png";

const PROFESSIONS = [
  {
    id: "coach",
    label: "Coach",
    image: CoachImg,
    description: "Lead athletes and shape winning teams.",
  },
  {
    id: "scout",
    label: "Scout",
    image: ScoutImg,
    description: "Discover emerging talent around the world.",
  },
  {
    id: "manager",
    label: "Manager",
    image: ManagerImg,
    description: "Oversee club operations and player development.",
  },
  {
    id: "agent",
    label: "Agent",
    image: AgentImg,
    description: "Represent athletes and negotiate their careers.",
  },
];

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfCard({ prof, selected, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={`prof-card${selected ? " prof-card--selected" : ""}`}
      onClick={() => onSelect(prof.id)}
    >
      <img src={prof.image} alt="" className="prof-card-img" />
      <div className="prof-card-overlay" />

      <div className="prof-card-label-wrap" aria-hidden="true">
        <span className="prof-card-label">{prof.label}</span>
      </div>

      <div className="prof-card-desc" aria-hidden={!selected}>
        <p>{prof.description}</p>
      </div>

      <div
        className={`prof-card-chevron${selected ? " prof-card-chevron--active" : ""}`}
        aria-hidden="true"
      >
        <ChevronRight />
      </div>
    </button>
  );
}

export default function ProfessionalRole({ value, onChange }) {
  const top    = PROFESSIONS.slice(0, 2);
  const bottom = PROFESSIONS.slice(2, 4);

  return (
    <div className="prof-select">
      <div className="prof-select-header">
        <h1 className="prof-header-title">Who are you?</h1>
        <p className="prof-header-subtitle">Select your role in the football world</p>
      </div>

      <div className="prof-grid" role="radiogroup" aria-label="Select your profession">
        <div className="prof-row">
          {top.map((p) => (
            <ProfCard
              key={p.id}
              prof={p}
              selected={value === p.id}
              onSelect={onChange}
            />
          ))}
        </div>
        <div className="prof-row">
          {bottom.map((p) => (
            <ProfCard
              key={p.id}
              prof={p}
              selected={value === p.id}
              onSelect={onChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
