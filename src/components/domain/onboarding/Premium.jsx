import Button from "../../UI/Button";
import "./Premium.css";
import premiumGraph from "../../../assets/graphics/premium_graph.svg";
import trophyIcon from "../../../assets/icons/trophy.svg";
import aiIcon from "../../../assets/icons/ai.svg";

export default function Premium({ onContinue }) {
  return (
    <div className="premium-root">
      {/* Heading */}
      <h1 className="premium-title">Level up your game</h1>

      {/* Premium badge */}
      <div className="premium-badge" aria-label="Premium badge">
        <span className="premium-badge-dot" aria-hidden="true" />
        <span>Premium</span>
      </div>

      {/* Big training progress card */}
      <section className="premium-card">
        <div className="premium-card-header">
          {/* Use stats.svg icon with accent color via CSS */}
          <img src="/app/assets/icons/stats.svg" alt="stats icon" className="premium-icon-svg premium-icon-svg--accent" aria-hidden="true" />
          <p className="premium-card-title">Training Progress</p>
        </div>
        <p className="premium-card-subtext">
          Track your daily training sessions and see improvement over time
        </p>
        {/* Decorative performance graph illustration */}
        <img src={premiumGraph} alt="" className="premium-graph" aria-hidden="true" />
      </section>

      {/* Feature grid */}
      <div className="premium-features">
        <section className="premium-card premium-card--small">
          <div className="premium-card-header">
            <img src={aiIcon} alt="AI icon" className="premium-icon-svg premium-icon-svg--accent" aria-hidden="true" />
            <p className="premium-card-title">Performance Analytics</p>
          </div>
          <p className="premium-card-subtext">
            Get AI-powered insights on your stats and performance trends
          </p>
        </section>
        <section className="premium-card premium-card--small">
          <div className="premium-card-header">
            <img src={trophyIcon} alt="Trophy icon" className="premium-icon-svg premium-icon-svg--accent" aria-hidden="true" />
            <p className="premium-card-title">Goal Tracking</p>
          </div>
          <p className="premium-card-subtext">
            Set personal goals and get personalized recommendations
          </p>
        </section>
      </div>

      {/* CTA */}
      <section className="premium-cta">
        <div className="premium-cta-inner">
          <h2 className="premium-cta-title">Start your free trial</h2>
          <p className="premium-cta-sub">7 days free, then $9.99/month</p>
          <div className="premium-cta-button">
            <Button
              size="medium"
              type="outline"
              label="Try Premium Free"
              onClick={onContinue}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
