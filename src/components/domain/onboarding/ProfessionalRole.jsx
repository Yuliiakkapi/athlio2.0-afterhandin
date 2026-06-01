import "./ProfessionalRole.css";
import CoachBw      from "../../../assets/images/coach-bw.png";
import CoachColor   from "../../../assets/images/coach-color.png";
import ScoutBw      from "../../../assets/images/scout.png";
import ScoutColor   from "../../../assets/images/scout-color.png";
import ManagerBw    from "../../../assets/images/manager-bw.png";
import ManagerColor from "../../../assets/images/manager-color.png";
import AgentBw      from "../../../assets/images/Agent-bw.png";
import AgentColor   from "../../../assets/images/Agent-color.png";

const PROFESSIONS = [
  {
    id: "coach",
    label: "Coach",
    imageBw: CoachBw,
    imageColor: CoachColor,
    description: "Lead athletes and shape winning teams.",
  },
  {
    id: "scout",
    label: "Scout",
    imageBw: ScoutBw,
    imageColor: ScoutColor,
    description: "Discover emerging talent around the world.",
  },
  {
    id: "manager",
    label: "Manager",
    imageBw: ManagerBw,
    imageColor: ManagerColor,
    description: "Oversee club operations and player development.",
  },
  {
    id: "agent",
    label: "Agent",
    imageBw: AgentBw,
    imageColor: AgentColor,
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
      <img src={prof.imageBw}    alt="" className="prof-card-img prof-card-img--bw" />
      <img src={prof.imageColor} alt="" className="prof-card-img prof-card-img--color" />
      <div className="prof-card-overlay" />

      <div className="prof-card-label-wrap" aria-hidden="true">
        <span className="prof-card-label">{prof.label}</span>
      </div>

      <div className="prof-card-desc" aria-hidden={!selected}>
        <p className="text-base-medium">{prof.description}</p>
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