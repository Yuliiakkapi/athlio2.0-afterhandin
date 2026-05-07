import "./RoleSelect.css";
import AthleteImage from "../../../assets/images/role-athlete.jpg";
import ProfessionalImage from "../../../assets/images/role-professional.jpg";

const ROLES = [
  { id: "athlete", label: "Athlete", image: AthleteImage },
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
    if (onNext) {
      // brief delay so the selection highlight is visible before advancing
      setTimeout(onNext, 200);
    }
  }

  return (
    <div className="role-select">
      <div className="role-header">
        <h1 className="role-header-title">Choose your role</h1>
        <p className="role-header-subtitle">Select how you want to use athlio</p>
      </div>

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
              {/* Background photo */}
              <img src={r.image} alt="" className="role-card-img" />

              {/* Dark overlay */}
              <div className="role-card-overlay" />

              {/* Vertical label */}
              <div className="role-card-label-wrap" aria-hidden="true">
                <span className="role-card-label">{r.label}</span>
              </div>

              {/* Chevron button in the bottom-right */}
              <div className="role-card-chevron" aria-hidden="true">
                <ChevronRight />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
