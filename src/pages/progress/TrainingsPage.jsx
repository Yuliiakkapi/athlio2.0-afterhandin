import { useState, useEffect, useRef } from "react";
import { CheckCircle, CalendarCheck } from "@phosphor-icons/react";
import TrainingDayCard from "../../components/UI/TrainingDayCard";
import TrainingCard from "../../components/UI/TrainingCard";
import Button from "../../components/UI/Button";
import AISuggestion from "../../components/domain/Progress-athletes/AISuggestion";
import { useConnectedApps } from "../../context/ConnectedAppsContext";
import appleHealthImg from "../../assets/images/applehealth.png";
import stravaImg from "../../assets/images/strava.png";
import googleFitImg from "../../assets/images/googlefit.png";
import "./TrainingsPage.css";

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MOCK_PAST = [
  "logged",
  "logged",
  null,
  "logged",
  "missed",
  "logged",
  "logged",
];
const MOCK_PAST_TYPE = [
  "team",
  "individual",
  "none",
  "recovery",
  "match",
  "individual",
  "team",
];

function buildDayStrip() {
  const today = new Date();
  const days = [];
  for (let offset = -7; offset <= 10; offset++) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    const idx = ((offset % 7) + 7) % 7;
    days.push({
      id: `day${offset}`,
      day: DAY_NAMES[d.getDay()],
      date: String(d.getDate()),
      status:
        offset < 0
          ? MOCK_PAST[idx]
          : offset === 1 || offset === 3
            ? "planned"
            : null,
      type:
        offset < 0
          ? MOCK_PAST_TYPE[idx]
          : offset === 1
            ? "team"
            : offset === 3
              ? "match"
              : "none",
      isToday: offset === 0,
    });
  }
  return days;
}

const WEEK_DAYS = buildDayStrip();
const TODAY_ID = WEEK_DAYS.find((d) => d.isToday).id;

const STATS = [
  { label: "SESSIONS", value: "6", trend: "24% this week" },
  {
    label: "DURATION",
    value: "4h 20m",
    trend: "5% this week",
    smallValue: true,
  },
  {
    label: "AVR. RATING",
    value: "6.9",
    trend: null,
    down: true,
    downTrend: "10% vs last",
  },
];

const BREAKDOWN = [
  { label: "Team training", pct: 70 },
  { label: "Gym", pct: 20 },
  { label: "Football training", pct: 5 },
  { label: "Run", pct: 5 },
  { label: "Recovery", pct: 0 },
];

const CAL_SESSIONS = {
  2: "logged",
  3: "logged",
  4: "logged",
  7: "logged",
  8: "logged",
  9: "logged",
  10: "logged",
  13: "planned",
  14: "planned",
  15: "planned",
  16: "planned",
};

const APPS = [
  { key: "apple_health", name: "Apple Health", image: appleHealthImg },
  { key: "google_fit", name: "Google Fit", image: googleFitImg },
  { key: "strava", name: "Strava", image: stravaImg },
];

function CalendarGrid() {
  const year = 2026,
    month = 5;
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = 13;

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const DAY_NAMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className="tp-calendar-card">
      <div className="tp-calendar-header-row">
        <p className="tp-calendar-month">June 2026</p>
      </div>
      <div className="tp-calendar-days-header">
        {DAY_NAMES.map((d) => (
          <span key={d} className="tp-calendar-day-name">
            {d}
          </span>
        ))}
      </div>
      <div className="tp-calendar-grid">
        {cells.map((day, idx) =>
          day === null ? (
            <div key={`empty-${idx}`} />
          ) : (
            <div
              key={day}
              className={[
                "tp-cal-cell",
                day === today ? "tp-cal-cell--today" : "",
                CAL_SESSIONS[day] ? `tp-cal-cell--${CAL_SESSIONS[day]}` : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="tp-cal-date">{day}</span>
              {CAL_SESSIONS[day] === "logged" && (
                <CheckCircle size={10} weight="fill" className="tp-cal-icon" />
              )}
              {CAL_SESSIONS[day] === "planned" && (
                <CalendarCheck
                  size={10}
                  weight="regular"
                  className="tp-cal-icon"
                />
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default function TrainingsPage() {
  const [activeDay, setActiveDay] = useState(TODAY_ID);
  const { isConnected, toggleApp } = useConnectedApps();
  const stripRef = useRef(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const activeCard = strip.querySelector(".tdc--active");
    if (!activeCard) return;
    strip.scrollLeft = activeCard.offsetLeft - strip.clientWidth / 2 + activeCard.offsetWidth / 2;
  }, []);

  const active = WEEK_DAYS.find((d) => d.id === activeDay);

  return (
    <div className="tp-page">
      {/* Scrollable date strip */}
      <div className="tp-date-strip-wrap" ref={stripRef}>
        <div className="tp-date-strip">
          {WEEK_DAYS.map((d) => (
            <TrainingDayCard
              key={d.id}
              variant="date"
              day={d.day}
              date={d.date}
              status={d.status}
              active={activeDay === d.id}
              onClick={() => setActiveDay(d.id)}
            />
          ))}
        </div>
      </div>

      {/* Training card (no internal button) */}
      <TrainingCard type={active.type} status={active.status} hideButton />

      {/* External CTA button */}
      <Button
        type="primary"
        size="medium"
        fullWidth
        label={
          active.status === "logged" || active.status === "missed"
            ? "See your performance"
            : "Log your training"
        }
      />

      {/* Your progress */}
      <section className="tp-section">
        <h2 className="tp-section-title">Your progress</h2>

        <div className="tp-stats">
          {STATS.map((s) => (
            <div key={s.label} className="tp-stat-card">
              <span className="tp-stat-label">{s.label}</span>
              <span
                className={`tp-stat-value${s.smallValue ? " tp-stat-value--sm" : ""}`}
              >
                {s.value}
              </span>
              {s.trend && (
                <div className="tp-stat-trend">
                  <div className="tp-stat-arrow" aria-hidden="true" />
                  <span>{s.trend}</span>
                </div>
              )}
              {s.down && (
                <div className="tp-stat-trend tp-stat-trend--down">
                  <div className="tp-stat-arrow-down" aria-hidden="true" />
                  <span>{s.downTrend}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="tp-breakdown-card">
          {BREAKDOWN.map((b) => (
            <div key={b.label} className="tp-breakdown-row">
              <div className="tp-breakdown-top">
                <span className="tp-breakdown-label">{b.label}</span>
                <span className="tp-breakdown-pct">{b.pct}%</span>
              </div>
              <div className="tp-breakdown-bar-bg">
                <div
                  className="tp-breakdown-bar-fill"
                  style={{ width: `${b.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consistency calendar */}
      <section className="tp-section">
        <h2 className="tp-section-title">Consistency</h2>
        <CalendarGrid />
      </section>

      {/* AI suggestion */}
      <AISuggestion
        title="Keep the streak going"
        desc="You peaked in Week 3 and reduced load in Week 4. Keep your consistency stable."
      />

      {/* Synced apps */}
      <section className="tp-section">
        <h2 className="tp-section-title">Synced apps</h2>
        <div className="tp-apps-card">
          {APPS.map((app, idx) => {
            const connected = isConnected(app.key);
            return (
              <div
                key={app.key}
                className={`tp-app-row${idx < APPS.length - 1 ? " tp-app-row--border" : ""}`}
              >
                <img src={app.image} alt={app.name} className="tp-app-icon" />
                <span className="tp-app-name">{app.name}</span>
                <Button
                  type={connected ? "outline" : "primary"}
                  size="small"
                  label={connected ? "Connected" : "Connect"}
                  onClick={() => toggleApp(app.key)}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
