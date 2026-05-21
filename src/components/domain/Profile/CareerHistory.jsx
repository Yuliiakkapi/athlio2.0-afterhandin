import { CourtBasketball, SoccerBall } from "@phosphor-icons/react";
import "./CareerHistory.css";

function formatDateRange(exp) {
  const opts = { month: "short", year: "numeric" };
  const start = exp.start_date
    ? new Date(exp.start_date).toLocaleDateString("en-GB", opts)
    : null;
  if (exp.is_current) return start ? `From ${start} to Present` : "Present";
  const end = exp.end_date
    ? new Date(exp.end_date).toLocaleDateString("en-GB", opts)
    : null;
  if (start && end) return `From ${start} to ${end}`;
  if (start) return `From ${start}`;
  return "—";
}

function ClubLogo({ url, name }) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="career-logo"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <div className="career-logo career-logo-fallback">
      {name?.charAt(0) || "?"}
    </div>
  );
}

function CareerRow({ logo, name, league, dateLabel, matches, goals, isLast }) {
  return (
    <div className={`career-row${isLast ? " career-row--last" : ""}`}>
      <ClubLogo url={logo} name={name} />
      <div className="career-info">
        <span className="career-name">
          {name}
          {league && (
            <>
              <span className="career-dot" />
              {league}
            </>
          )}
        </span>
        <span className="career-date">{dateLabel}</span>
      </div>
      <div className="career-stats">
        <span>{matches ?? "–"}</span>
        <span>{goals ?? "–"}</span>
      </div>
    </div>
  );
}

export default function CareerHistory({ profile, experiences = [] }) {
  const currentClubName = profile?.clubs?.name || profile?.club_other_name;
  const currentClubLogo = profile?.clubs?.logo_url || null;

  const hasCurrentInExperiences = experiences.some(
    (e) => e.is_current && e.club?.name === currentClubName
  );

  const rows = [];

  if (currentClubName && !hasCurrentInExperiences) {
    rows.push({
      id: "profile-current",
      logo: currentClubLogo,
      name: currentClubName,
      league: null,
      dateLabel: "Present",
    });
  }

  experiences.forEach((exp) => {
    rows.push({
      id: `${exp.club?.name || "exp"}-${exp.start_date}`,
      logo: exp.club?.logo_url || null,
      name: exp.club?.name || "—",
      league: exp.club?.league || null,
      matches: exp.matches_played ?? null,
      goals: exp.goals_scored ?? null,
      dateLabel: formatDateRange(exp),
    });
  });

  return (
    <section className="career-section">
      <div className="career-header">
        <h3 className="career-title">Career history</h3>
        <div className="career-header-icons">
          <CourtBasketball size={22} weight="light" color="var(--neutral-500)" />
          <SoccerBall size={22} weight="light" color="var(--neutral-500)" />
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="career-empty">No career history yet.</p>
      ) : (
        <div className="career-list">
          {rows.map((row, i) => (
            <CareerRow
              key={row.id}
              {...row}
              isLast={i === rows.length - 1}
            />
          ))}
        </div>
      )}
    </section>
  );
}
