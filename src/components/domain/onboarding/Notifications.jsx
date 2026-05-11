import "./Notifications.css";

const imgPhone = "https://www.figma.com/api/mcp/asset/1ac5791e-31c2-4c87-8c63-e9c638ce74fe";
const imgPhoneOverlay = "https://www.figma.com/api/mcp/asset/309bfbd7-c4d3-47c9-95ab-73c2fe81021d";
const imgMagui = "https://www.figma.com/api/mcp/asset/1cbf5602-d369-4b9e-bce4-aeb909eb57ce";
const imgMourinho = "https://www.figma.com/api/mcp/asset/6ad86ae1-d7db-4e06-af24-867e64cc1d14";

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
          <img src={imgPhone} alt="" className="notif-phone-bg" aria-hidden="true" />
          <img src={imgPhoneOverlay} alt="" className="notif-phone-overlay" aria-hidden="true" />
          <div className="notif-phone-dim" aria-hidden="true" />
          <div className="notif-timer" aria-hidden="true">6:07</div>
        </div>

        {/* Notification preview cards */}
        <div className="notif-cards">
          <div className="notif-card">
            <img src={imgMagui} alt="Magui Sainz" className="notif-card-avatar" />
            <div className="notif-card-body">
              <div className="notif-card-name-row">
                <span className="notif-card-name">Magui Sainz</span>
                <span className="notif-card-badge">Scout</span>
              </div>
              <p className="notif-card-text">Hi! We invite you to go for a trial in FC Barcelona?</p>
            </div>
          </div>

          <div className="notif-card notif-card--secondary">
            <img src={imgMourinho} alt="Jośe Mourinho" className="notif-card-avatar" />
            <div className="notif-card-body">
              <div className="notif-card-name-row">
                <span className="notif-card-name">Jośe Mourinho</span>
                <span className="notif-card-badge">Coach</span>
              </div>
              <p className="notif-card-text">Are you ready to invest in your future?</p>
            </div>
          </div>
        </div>

        {/* Bottom fade over the phone */}
        <div className="notif-fade" aria-hidden="true" />
      </div>
    </div>
  );
}
