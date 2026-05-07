import "./RoleSelect.css";
import AthleteImage from "../../../assets/images/role-athlete.jpg";
import ProfessionalImage from "../../../assets/images/role-professional.jpg";

const ROLES = [
  { id: "athlete",      label: "Player",       image: AthleteImage },
  { id: "professional", label: "Professional", image: ProfessionalImage },
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

export default function RoleSelect({ role, onChange, onNext }) {
  function select(id) {
    onChange(id);
    // auto-advance after a short delay so the selection highlight is visible
    if (onNext) setTimeout(onNext, 220);
  }

  return (
    <div className="role-select">
      {/* Heading */}
      <div className="role-select-header">
        <h1 className="role-header-title">Choose your role</h1>
        <p className="role-header-subtitle">Select how you want to use this app</p>
      </div>

      {/* Two portrait cards */}
      <div className="role-cards" role="radiogroup" aria-label="Choose your role">
        {ROLES.map((r) => {
          const selected = role === r.id;
          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`role-card${selected ? " role-card--selected" : ""}`}
              onClick={() => select(r.id)}
            >
              {/* Photo background */}
              <img src={r.image} alt="" className="role-card-img" />

              {/* Dark overlay */}
              <div className="role-card-overlay" />

              {/* Vertical label — reads bottom-to-top */}
              <div className="role-card-label-wrap" aria-hidden="true">
                <span className="role-card-label">{r.label}</span>
              </div>

              {/* Chevron circle in bottom-right */}
              <div className={`role-card-chevron${selected ? " role-card-chevron--active" : ""}`} aria-hidden="true">
                <ChevronRight />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
