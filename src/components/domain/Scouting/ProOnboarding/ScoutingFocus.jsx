import { useState } from "react";
import { Sparkle, CaretDown } from "@phosphor-icons/react";
import "./ScoutingFocus.css";

const LEAGUES = [
  "All Leagues",
  "Premier League",
  "La Liga",
  "Bundesliga",
  "Serie A",
  "Ligue 1",
  "Eredivisie",
  "Liga NOS",
  "MLS",
];

export default function ScoutingFocus({ onSelectionChange }) {
  const [league, setLeague] = useState("");
  const [open, setOpen] = useState(false);

  function select(l) {
    setLeague(l);
    setOpen(false);
    onSelectionChange?.(true);
  }

  return (
    <div className="sf-content">
      <div className="sf-header">
        <h1 className="sf-title">Your scouting area</h1>
        <p className="sf-subtitle">Tell us what kind of players you want to scout</p>
      </div>

      <div className="sf-league-wrap">
        <button
          type="button"
          className="sf-league-btn"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={league ? "sf-league-value" : "sf-league-placeholder"}>
            {league || "All Leagues"}
          </span>
          <span className="sf-league-required">*</span>
          <CaretDown size={16} className="sf-league-caret" />
        </button>

        {open && (
          <div className="sf-league-dropdown">
            {LEAGUES.map((l) => (
              <button
                key={l}
                type="button"
                className={`sf-league-option${league === l ? " sf-league-option--active" : ""}`}
                onClick={() => select(l)}
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="sf-circle-wrap">
        <div className="sf-circle">
          <span className="sf-circle-number">9000+</span>
          <span className="sf-circle-label">Talents</span>
        </div>
      </div>

      <div className="sf-hint-card">
        <div className="sf-hint-icon">
          <Sparkle size={28} weight="fill" color="white" />
        </div>
        <div className="sf-hint-text">
          <span className="sf-hint-title">The smaller area the better</span>
          <span className="sf-hint-desc">Narrow your focus to become a specialist scout</span>
        </div>
      </div>
    </div>
  );
}
