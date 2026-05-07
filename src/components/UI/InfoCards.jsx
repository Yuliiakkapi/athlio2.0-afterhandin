import "./InfoCards.css";

export default function CardInfoSingle({ profile = {} }) {
  const position = Array.isArray(profile.position)
    ? profile.position.join(", ")
    : profile.position || "—";

  const birthDate = profile.age
    ? `${profile.age} yrs`
    : "—";

  return (
    <div className="card-info-single">
      <div className="card-info-content">
        <div className="info-row">
          <div className="info-field">
            <div className="info-label">Nationality</div>
            <div className="info-value">{profile.country || "—"}</div>
          </div>
          <div className="info-field">
            <div className="info-label">Age</div>
            <div className="info-value">{birthDate}</div>
          </div>
          <div className="info-field">
            <div className="info-label">Gender</div>
            <div className="info-value">{profile.gender || "—"}</div>
          </div>
        </div>
        <div className="info-row">
          <div className="info-field">
            <div className="info-label">Weight (kg)</div>
            <div className="info-value">{profile.weight_kg ?? "—"}</div>
          </div>
          <div className="info-field">
            <div className="info-label">Height (cm)</div>
            <div className="info-value">{profile.height_cm ?? "—"}</div>
          </div>
          <div className="info-field">
            <div className="info-label">Position</div>
            <div className="info-value">{position}</div>
          </div>
        </div>
        <div className="info-row">
          <div className="info-field">
            <div className="info-label">Sport</div>
            <div className="info-value">{profile.primary_sport || "—"}</div>
          </div>
          <div className="info-field">
            <div className="info-label">Location</div>
            <div className="info-value">
              {profile.city && profile.country
                ? `${profile.city}, ${profile.country}`
                : profile.city || profile.country || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
