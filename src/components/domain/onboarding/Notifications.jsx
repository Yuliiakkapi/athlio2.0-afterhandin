import stadiumImg from "../../../assets/images/stadium-notif.jpg";
import avatar1 from "../../../assets/images/notif-avatar-1.jpg";
import avatar2 from "../../../assets/images/notif-avatar-2.jpg";
import "./Notifications.css";

export default function Notifications() {
  return (
    <div className="notif-step">
      {/* Header */}
      <div className="notif-header">
        <h1 className="notif-title">Keep track on the best prospects</h1>
        <p className="notif-subtitle">Turn on notifications to get the most out of the app</p>
      </div>

      {/* Phone mockup + notification cards */}
      <div className="notif-visual">
        {/* Phone frame */}
        <div className="notif-phone">
          <img src={stadiumImg} alt="" className="notif-phone-bg" aria-hidden="true" />
          <div className="notif-phone-dim" aria-hidden="true" />
          <div className="notif-timer" aria-hidden="true">6:07</div>
        </div>

        {/* Notification preview cards */}
        <div className="notif-cards">
          <div className="notif-card">
            <img src={avatar1} alt="Magui Sainz" className="notif-card-avatar" />
            <div className="notif-card-body">
              <div className="notif-card-name-row">
                <span className="notif-card-name">Magui Sainz</span>
                <span className="notif-card-badge">Scout</span>
              </div>
              <p className="notif-card-text">Hi! We invite you to go for a trial in FC Barcelona?</p>
            </div>
          </div>

          <div className="notif-card notif-card--secondary">
            <img src={avatar2} alt="Jośe Mourinho" className="notif-card-avatar" />
            <div className="notif-card-body">
              <div className="notif-card-name-row">
                <span className="notif-card-name">Jośe Mourinho</span>
                <span className="notif-card-badge">Coach</span>
              </div>
              <p className="notif-card-text">Are you ready to invest in your future?</p>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="notif-fade" aria-hidden="true" />
      </div>
    </div>
  );
}
