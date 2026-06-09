import "./MatchCard.css";

function TeamIcon({ logoUrl, name }) {
  if (logoUrl) return <img src={logoUrl} alt={name} className="mc-team-icon-img" />;
  return <span className="mc-team-icon-initial">{(name || "?")[0].toUpperCase()}</span>;
}

function ResultBadge({ yourScore, opponentScore, size = "sm" }) {
  const win = Number(yourScore) > Number(opponentScore);
  const lose = Number(yourScore) < Number(opponentScore);
  const label = win ? "W" : lose ? "L" : "D";
  const mod = win ? "win" : lose ? "lose" : "draw";
  return (
    <div className={`mc-result-badge mc-result-badge--${mod} mc-result-badge--${size}`}>
      {label}
    </div>
  );
}

function StatsRow({ goalsCount, assistsCount, minCount, yellowCards, redCards, suggested }) {
  const showCards = !suggested && (yellowCards > 0 || redCards > 0);
  return (
    <div className={`mc-stats${suggested ? " mc-stats--suggested" : ""}`}>
      <div className="mc-stat">
        <span className="mc-stat-label">GOALS</span>
        <span className="mc-stat-value">{goalsCount ?? 0}</span>
      </div>
      <div className="mc-stat">
        <span className="mc-stat-label">AST</span>
        <span className="mc-stat-value">{assistsCount ?? 0}</span>
      </div>
      <div className="mc-stat">
        <span className="mc-stat-label">MIN.</span>
        <span className="mc-stat-value">{minCount ?? 0}</span>
      </div>
      {showCards && (
        <div className="mc-stat">
          <span className="mc-stat-label">CARDS</span>
          <div className="mc-cards">
            {Array.from({ length: yellowCards }).map((_, i) => (
              <div key={`y-${i}`} className="mc-card mc-card--yellow" />
            ))}
            {Array.from({ length: redCards }).map((_, i) => (
              <div key={`r-${i}`} className="mc-card mc-card--red" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
  compact = false,
  yourTeamLogoUrl,
  opponentLogoUrl,
}) {
  /* ── Variant 3: Suggested (compact) ── */
  if (compact) {
    return (
      <div className="mc mc--suggested">
        <div className="mc-suggested-header">
          <ResultBadge yourScore={yourScore} opponentScore={opponentScore} size="lg" />
          <div className="mc-suggested-meta">
            <span className="mc-meta-text">{league}</span>
            <span className="mc-meta-text">{date}</span>
          </div>
        </div>
        <div className="mc-suggested-body">
          <div className="mc-suggested-teams">
            <div className="mc-suggested-team">
              <div className="mc-team-icon">
                <TeamIcon logoUrl={yourTeamLogoUrl} name={yourTeam} />
              </div>
              <span className="mc-suggested-name mc-suggested-name--yours">{yourTeam}</span>
              <span className="mc-suggested-score">{yourScore}</span>
            </div>
            <div className="mc-suggested-team">
              <div className="mc-team-icon">
                <TeamIcon logoUrl={opponentLogoUrl} name={opponent} />
              </div>
              <span className="mc-suggested-name">{opponent}</span>
              <span className="mc-suggested-score mc-suggested-score--opponent">{opponentScore}</span>
            </div>
          </div>
          <StatsRow
            goalsCount={goalsCount}
            assistsCount={assistsCount}
            minCount={minCount}
            yellowCards={yellowCards}
            redCards={redCards}
            suggested
          />
        </div>
      </div>
    );
  }

  /* ── Variant 1: With picture ── */
  if (imageUrl) {
    return (
      <div className="mc mc--with-picture">
        <div className="mc-picture-top">
          <div className="mc-picture-bg" aria-hidden="true">
            <img src={imageUrl} alt="" className="mc-picture-bg-img" />
            <div className="mc-picture-gradient" />
          </div>
          <div className="mc-picture-meta">
            <span className="mc-picture-meta-text">{league}</span>
            <span className="mc-picture-meta-text">{date}</span>
          </div>
          <div className="mc-picture-bottom-row">
            <div className="mc-picture-teams">
              <div className="mc-picture-team">
                <div className="mc-team-icon">
                  <TeamIcon logoUrl={yourTeamLogoUrl} name={yourTeam} />
                </div>
                <span className="mc-picture-team-name">{yourTeam}</span>
                <span className="mc-picture-score">{yourScore}</span>
              </div>
              <div className="mc-picture-team">
                <div className="mc-team-icon">
                  <TeamIcon logoUrl={opponentLogoUrl} name={opponent} />
                </div>
                <span className="mc-picture-team-name mc-picture-team-name--opponent">{opponent}</span>
                <span className="mc-picture-score mc-picture-score--opponent">{opponentScore}</span>
              </div>
            </div>
            <ResultBadge yourScore={yourScore} opponentScore={opponentScore} />
          </div>
        </div>
        <StatsRow
          goalsCount={goalsCount}
          assistsCount={assistsCount}
          minCount={minCount}
          yellowCards={yellowCards}
          redCards={redCards}
        />
      </div>
    );
  }

  /* ── Variant 2: Without picture ── */
  return (
    <div className="mc mc--without-picture">
      <div className="mc-nopic-top">
        <div className="mc-nopic-teams">
          <div className="mc-nopic-team">
            <div className="mc-team-icon">
              <TeamIcon logoUrl={yourTeamLogoUrl} name={yourTeam} />
            </div>
            <span className="mc-nopic-team-name">{yourTeam}</span>
            <span className="mc-nopic-score">{yourScore}</span>
          </div>
          <div className="mc-nopic-team">
            <div className="mc-team-icon">
              <TeamIcon logoUrl={opponentLogoUrl} name={opponent} />
            </div>
            <span className="mc-nopic-team-name mc-nopic-team-name--opponent">{opponent}</span>
            <span className="mc-nopic-score mc-nopic-score--opponent">{opponentScore}</span>
          </div>
        </div>
        <div className="mc-nopic-right">
          <div className="mc-nopic-meta">
            <span className="mc-nopic-meta-text">{league}</span>
            <span className="mc-nopic-meta-text">{date}</span>
          </div>
          <ResultBadge yourScore={yourScore} opponentScore={opponentScore} />
        </div>
      </div>
      <StatsRow
        goalsCount={goalsCount}
        assistsCount={assistsCount}
        minCount={minCount}
        yellowCards={yellowCards}
        redCards={redCards}
      />
    </div>
  );
}
