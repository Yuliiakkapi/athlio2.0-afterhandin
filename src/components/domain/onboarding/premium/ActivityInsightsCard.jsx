import { Star } from "@phosphor-icons/react";
import "./ActivityInsightsCard.css";

export default function ActivityInsightsCard() {
  return (
    <div className="activity-card">
      <div className="activity-content">
        <h3 className="activity-title">Most active day</h3>

        <div className="activity-icon-container">
          <div className="activity-icon-bg">
            <Star size={32} weight="fill" className="activity-icon" />
          </div>
          <h2 className="activity-day">Friday</h2>
        </div>

        <div className="activity-stats">
          <div className="activity-stat-line">
            <span className="activity-stat-number">85</span>
            <span className="activity-stat-text">visits last month</span>
          </div>
          <p className="activity-stat-description">
            You get the most visits on this day.
          </p>
        </div>
      </div>
    </div>
  );
}
