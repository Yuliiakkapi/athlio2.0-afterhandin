import { CaretRight } from "@phosphor-icons/react";
import "./ProfileVisibilitySection.css";

const VISITORS = [
  { id: 1, role: "Scout", initials: "JK" },
  { id: 2, role: "Scout", initials: "MS" },
  { id: 3, role: "Coach", initials: "AR" },
  { id: 4, role: "Club",  initials: "FC" },
];

export default function ProfileVisibilitySection() {
  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Profile visibility</h2>
          <p className="prog-section-subtitle">See who checked your profile this week</p>
        </div>
      </div>

      <div className="prog-visits-row">
        <div className="prog-visit-card">
          <span className="prog-visit-label">Profile visits</span>
          <span className="prog-visit-number">128</span>
          <div className="prog-visit-change">
            <svg width="12" height="12" viewBox="0 0 13 12" fill="none" aria-hidden="true">
              <path d="M1.5 9.5L6.5 3.5L11.5 9.5" stroke="#00ab3d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>24% this week</span>
          </div>
        </div>
        <div className="prog-visit-card">
          <span className="prog-visit-label">Unique visits</span>
          <span className="prog-visit-number">43</span>
          <span className="prog-visit-week">this week</span>
        </div>
      </div>

      <div className="prog-visitors-card">
        <p className="prog-visitors-title">Recent visitors</p>
        <div className="prog-visitors-row">
          {VISITORS.map((v) => (
            <div key={v.id} className="prog-visitor-item">
              <div className="prog-visitor-avatar">{v.initials}</div>
              <span className="prog-visitor-badge">{v.role}</span>
            </div>
          ))}
          <div className="prog-visitor-item">
            <div className="prog-visitor-more">+2</div>
            <span className="prog-visitor-badge prog-visitor-badge--spacer" aria-hidden="true">·</span>
          </div>
        </div>
        <button className="prog-analytics-btn">
          View full analytics
          <CaretRight size={20} />
        </button>
      </div>
    </section>
  );
}
