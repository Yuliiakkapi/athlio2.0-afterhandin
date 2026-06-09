import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "@phosphor-icons/react";
import "./ProfessionalInfoTab.css";

const ABOUT_MAX_CHARS = 140;

function sanitizeLogo(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return null;
    if (u.hostname.includes("edgeone.app")) return null;
    return url;
  } catch {
    return null;
  }
}

function formatDateLine(exp) {
  const opts = { month: "short", year: "numeric" };
  const start = exp.start_date
    ? new Date(exp.start_date).toLocaleDateString("en-GB", opts)
    : null;
  if (exp.is_current) return [start ? `From ${start}` : "", "to Present"];
  const end = exp.end_date
    ? new Date(exp.end_date).toLocaleDateString("en-GB", opts)
    : null;
  if (start && end) return [`From ${start}`, `to ${end}`];
  if (start) return [`From ${start}`, ""];
  return ["—", ""];
}

function ExperienceCard({ exp }) {
  const [line1, line2] = formatDateLine(exp);
  const logo = sanitizeLogo(exp.logo_url);

  return (
    <div className="pro-exp-card">
      <div className="pro-exp-left">
        {logo ? (
          <img
            src={logo}
            alt={exp.org_name}
            className="pro-exp-logo"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="pro-exp-logo pro-exp-logo-fallback">
            {exp.org_name?.charAt(0) || "?"}
          </div>
        )}
        <div className="pro-exp-info">
          <span className="pro-exp-title">{exp.team_name || "—"}</span>
          <span className="pro-exp-org">{exp.org_name || "—"}</span>
        </div>
      </div>
      {(line1 || line2) && (
        <div className="pro-exp-date">
          {line1 && <span>{line1}</span>}
          {line2 && <span>{line2}</span>}
        </div>
      )}
    </div>
  );
}

export default function ProfessionalInfoTab({ profile, experiences = [], isMe = false }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const bio = profile?.bio || "";
  const needsTruncation = bio.length > ABOUT_MAX_CHARS;
  const displayBio = needsTruncation && !expanded ? bio.slice(0, ABOUT_MAX_CHARS) + "…" : bio;

  // Prepend current club as synthetic experience if not already in the list
  const currentClubName = profile?.clubs?.name || profile?.club_other_name || null;
  const currentClubLogo = profile?.clubs?.logo_url || null;
  const roleLabel = profile?.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : null;

  const hasCurrentInList = experiences.some(
    (e) => e.is_current && e.org_name === currentClubName
  );

  const allExperiences = [
    ...(currentClubName && !hasCurrentInList
      ? [{ org_name: currentClubName, team_name: roleLabel, logo_url: currentClubLogo, is_current: true, start_date: null }]
      : []),
    ...experiences,
  ];

  return (
    <div className="pro-info-tab">
      {/* About section */}
      <div className="pro-section">
        <h3 className="pro-section-title">About</h3>
        {bio ? (
          <div className="pro-about-card">
            <p className="pro-bio-text">{displayBio}</p>
            {needsTruncation && (
              <button className="pro-see-more" onClick={() => setExpanded((v) => !v)}>
                {expanded ? "See less" : "See more"}
              </button>
            )}
          </div>
        ) : isMe ? (
          <div className="pro-about-card pro-about-empty">
            <button className="pro-add-about-btn" onClick={() => navigate("/profile/me/edit")}>
              <Plus size={16} weight="bold" />
              Add about
            </button>
          </div>
        ) : null}
      </div>

      {/* Experiences section */}
      <div className="pro-section">
        <h3 className="pro-section-title">Experiences</h3>
        <div className="pro-experiences">
          {allExperiences.length > 0 && (
            <div className="pro-exp-list">
              {allExperiences.map((exp, i) => (
                <ExperienceCard key={`${exp.org_name}-${exp.start_date}-${i}`} exp={exp} />
              ))}
            </div>
          )}
          {isMe && (
            <button className="pro-edit-btn">
              <Plus size={16} weight="bold" />
              Edit experiences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
