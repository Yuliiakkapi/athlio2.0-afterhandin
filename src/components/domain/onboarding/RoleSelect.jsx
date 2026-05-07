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
    if (onNext) setTimeout(onNext, 320); // wait for the expand animation to finish
  }

  return (
    <div className="role-select">
      <div className="role-select-header">
        <h1 className="role-header-title">Choose your role</h1>
        <p className="role-header-subtitle">Select how you want to use this app</p>
      </div>

      {/* Two portrait cards — selected one expands via CSS :has() */}
      <div className="role-photo-cards" role="radiogroup" aria-label="Choose your role">
        {ROLES.map((r) => {
          const selected = role === r.id;
          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`role-photo-card${selected ? " role-photo-card--selected" : ""}`}
              onClick={() => select(r.id)}
            >
              <img src={r.image} alt="" className="role-photo-card-img" />
              <div className="role-photo-card-overlay" />

              {/* Label at bottom-right, reading bottom-to-top */}
              <div className="role-photo-card-label-wrap" aria-hidden="true">
                <span className="role-photo-card-label">{r.label}</span>
              </div>

              {/* Chevron circle */}
              <div
                className={`role-photo-card-chevron${selected ? " role-photo-card-chevron--active" : ""}`}
                aria-hidden="true"
              >
                <ChevronRight />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
