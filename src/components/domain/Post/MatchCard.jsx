import MatchPostCount from "../../UI/MatchPostCount";
import MatchVerdict from "../../UI/MatchVerdict";
import "./MatchCard.css";

/**
 * MatchCard — shows match result with optional background photo.
 *
 * Props:
 *   imageUrl       string?   — match action photo (full-bleed with gradient)
 *   yourTeam       string    — player's team name
 *   yourScore      number    — player's team score
 *   opponent       string    — opposing team name
 *   opponentScore  number    — opposing team score
 *   league         string    — competition name ("La Liga")
 *   date           string    — match date ("23 Mar")
 *   goalsCount     number
 *   assistsCount   number
 *   minCount       number    — minutes played
 *   yellowCards    number?   — yellow cards received (renders card indicator)
 *   redCards       number?   — red cards received (renders card indicator)
 */
export default function MatchCard({
  imageUrl,
  yourTeam,
  yourScore,
  opponent,
  opponentScore,
  league,
  date,
  goalsCount,
  assistsCount,
  minCount,
  yellowCards = 0,
  redCards = 0,
}) {
  const hasImage = !!imageUrl;
  const showCards = yellowCards > 0 || redCards > 0;

  return (
    <div className="match-card">

      {/* ── Top: image background + match info ──────────────────── */}
      <div className={`match-card-top${hasImage ? " match-card-top--image" : ""}`}>
        {hasImage && (
          <div aria-hidden="true" className="match-card-bg">
            <img src={imageUrl} alt="" className="match-card-bg-img" />
            <div className="match-card-gradient" />
          </div>
        )}

        {/* League + date — top right */}
        <div className="match-card-meta">
          <span className="match-card-league">{league}</span>
          <span className="match-card-date">{date}</span>
        </div>

        {/* Teams + scores + verdict — bottom of the card-top */}
        <div className="match-card-teams-row">
          <div className="match-card-teams">
            {/* Your team */}
            <div className="match-card-team match-card-team--yours">
              <span className="match-card-team-name">{yourTeam}</span>
              <span className="match-card-score match-card-score--yours">{yourScore}</span>
            </div>
            {/* Opponent */}
            <div className="match-card-team match-card-team--opponent">
              <span className="match-card-team-name match-card-team-name--opponent">{opponent}</span>
              <span className="match-card-score match-card-score--opponent">{opponentScore}</span>
            </div>
          </div>

          <MatchVerdict yourScore={yourScore} opponentScore={opponentScore} />
        </div>
      </div>

      {/* ── Bottom: player stats ──────────────────────────────────── */}
      <div className="match-card-stats">
        <MatchPostCount label="Goals" count={goalsCount} />
        <MatchPostCount label="Ast" count={assistsCount} />
        <MatchPostCount label="Min." count={minCount} />

        {showCards && (
          <div className="match-card-cards-stat">
            <span className="match-card-cards-label">Cards</span>
            <div className="match-card-cards">
              {Array.from({ length: yellowCards }).map((_, i) => (
                <div key={`y-${i}`} className="match-card-card match-card-card--yellow" />
              ))}
              {Array.from({ length: redCards }).map((_, i) => (
                <div key={`r-${i}`} className="match-card-card match-card-card--red" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
