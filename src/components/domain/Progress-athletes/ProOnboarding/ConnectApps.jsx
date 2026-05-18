import { useState } from "react";
import "./ConnectApps.css";

const APPS = [
  {
    key: "apple_health",
    name: "Connect with Apple Health",
    desc: "Import workouts from Health app.",
    icon: <AppleHealthIcon />,
  },
  {
    key: "strava",
    name: "Connect with Strava",
    desc: "Import your activities and workouts.",
    icon: <StravaIcon />,
  },
  {
    key: "google_fit",
    name: "Connect with Google Fit",
    desc: "Import workouts from Health app.",
    icon: <GoogleFitIcon />,
  },
];

function AppleHealthIcon() {
  return (
    <div className="ca-app-icon ca-app-icon--health">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 22C14 22 5 16.5 5 10.5C5 7.46 7.46 5 10.5 5C12.1 5 13.5 5.7 14 6.5C14.5 5.7 15.9 5 17.5 5C20.54 5 23 7.46 23 10.5C23 16.5 14 22 14 22Z" fill="white" />
      </svg>
    </div>
  );
}

function StravaIcon() {
  return (
    <div className="ca-app-icon ca-app-icon--strava">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M11 22L15 14L19 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 14L19 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function GoogleFitIcon() {
  return (
    <div className="ca-app-icon ca-app-icon--gfit">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 7C10.14 7 7 10.14 7 14C7 17.86 10.14 21 14 21C17.86 21 21 17.86 21 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M14 11V14L16 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

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
      <h1 className="ca-title">Connect Apps</h1>
      <p className="ca-subtitle">Pick the apps you want to connect</p>

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
              {app.icon}
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
