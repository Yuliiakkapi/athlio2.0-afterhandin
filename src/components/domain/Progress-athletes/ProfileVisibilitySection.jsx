import { useNavigate } from "react-router-dom";
import { CaretRight } from "@phosphor-icons/react";
import Badge from "../../UI/Badge";
import Button from "../../UI/Button";
import scout1 from "../../../assets/images/scout1.jpg";
import scout2 from "../../../assets/images/scout2.png";
import coach1 from "../../../assets/images/coach1.png";
import club1 from "../../../assets/images/club1.png";
import "./ProfileVisibilitySection.css";

const VISITORS = [
  { id: 1, role: "Scout", image: scout1 },
  { id: 2, role: "Scout", image: scout2 },
  { id: 3, role: "Coach", image: coach1 },
  { id: 4, role: "Club",  image: club1  },
];

export default function ProfileVisibilitySection() {
  const navigate = useNavigate();
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
            <div className="prog-visit-arrow" aria-hidden="true" />
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
              <img src={v.image} alt={v.role} className="prog-visitor-avatar" />
              <Badge text={v.role} color="light" size="xs" />
            </div>
          ))}
          <div className="prog-visitor-item">
            <div className="prog-visitor-more">+2</div>
            <span className="prog-visitor-spacer" aria-hidden="true" />
          </div>
        </div>
        <Button
          type="subtle"
          size="small"
          fullWidth
          label="View full analytics"
          trailingIcon={CaretRight}
          onClick={() => navigate("/progress/visibility")}
        />
      </div>
    </section>
  );
}
