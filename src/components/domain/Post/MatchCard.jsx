import MatchPostCount from "../../UI/MatchPostCount";
import MatchVerdict from "../../UI/MatchVerdict";
import "./MatchCard.css";

//isImage will be false on the profile page bc we only need the content

export default function MatchCard({
  isImage,
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
}) {
  return (
    <div className="match-card">
      <div className={`card-top ${isImage ? "card-top-image" : ""}`}>
        {isImage && (
          <div className="image-wrapper">
            <img src={imageUrl} className="image-match" />
          </div>
        )}
        <div className={`card-content ${isImage ? "card-content-image" : ""}`}>
          <div className="teams">
            <div className="team yours">
              <p>{yourTeam}</p>
              <span>{yourScore}</span>
            </div>
            <div className="opponent team">
              <p>{opponent}</p>
              <span>{opponentScore}</span>
            </div>
          </div>
          <div className="league-verdict">
            <div className={`league ${isImage ? "league-image" : ""}`}>
              <p>{league}</p>
              <span>{date}</span>
            </div>
            <MatchVerdict yourScore={yourScore} opponentScore={opponentScore} />
          </div>
        </div>
      </div>
      <div className="card-bottom">
        <MatchPostCount label="Goals" count={goalsCount} />
        <MatchPostCount label="Ast" count={assistsCount} />
        <MatchPostCount label="Min." count={minCount} />
      </div>
    </div>
  );
}
