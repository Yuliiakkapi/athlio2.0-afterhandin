import { useState } from "react";
import appleHealth from "../../../../assets/images/applehealth.png";
import strava from "../../../../assets/images/strava.png";
import googleFit from "../../../../assets/images/googlefit.png";
import "./ConnectApps.css";

const APPS = [
  {
    key: "apple_health",
    name: "Connect with Apple Health",
    desc: "Import workouts from Health app.",
    image: appleHealth,
  },
  {
    key: "strava",
    name: "Connect with Strava",
    desc: "Import your activities and workouts.",
    image: strava,
  },
  {
    key: "google_fit",
    name: "Connect with Google Fit",
    desc: "Import workouts from Google Fit.",
    image: googleFit,
  },
];

export default function ConnectApps() {
  const [selected, setSelected] = useState(new Set());

  function toggle(key) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <div className="ca-content">
      <div className="ca-header">
        <h1 className="ca-title">Connect Apps</h1>
        <p className="ca-subtitle">Pick the apps you want to connect</p>
      </div>

      <div className="ca-list">
        {APPS.map((app, i) => {
          const on = selected.has(app.key);
          return (
            <button
              key={app.key}
              className={`ca-item${i < APPS.length - 1 ? " ca-item--border" : ""}${on ? " ca-item--selected" : ""}`}
              onClick={() => toggle(app.key)}
              type="button"
            >
              <img src={app.image} alt={app.name} className="ca-app-icon" />
              <div className="ca-item-text">
                <span className="ca-item-name">{app.name}</span>
                <span className="ca-item-desc">{app.desc}</span>
              </div>
              <div className={`ca-item-check${on ? " ca-item-check--on" : ""}`}>
                {on && (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                    <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
