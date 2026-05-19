import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Plus } from "@phosphor-icons/react";
import Button from "../../UI/Button";
import Tabs from "../../UI/Tabs";
import AISuggestion from "./AISuggestion";
import "./TargetsSection.css";

const TARGET_TABS = ["Season", "Month", "Week"];

const TARGETS_BY_TAB = {
  Season: [
    {
      id: 1,
      label: "20 goals this season",
      value: 14,
      max: 20,
      pct: 70,
      color: "#ff983d",
    },
    {
      id: 2,
      label: "100 Minutes of playing",
      value: 65,
      max: 100,
      pct: 65,
      color: "#6f92ff",
    },
  ],
  Month: [
    {
      id: 3,
      label: "5 goals this month",
      value: 3,
      max: 5,
      pct: 60,
      color: "#ff983d",
    },
  ],
  Week: [],
};

function EmptyState() {
  return (
    <div className="prog-empty-state">
      <div className="prog-empty-icon">
        <Target size={36} weight="light" color="var(--primary-400)" />
      </div>
      <div className="prog-empty-text">
        <p className="prog-empty-title">No targets yet</p>
        <p className="prog-empty-desc">
          Set your first goal to start tracking your progress this week
        </p>
      </div>
      <Button
        type="primary"
        size="small"
        fullWidth
        label="Add your first target"
        leadingIcon={Plus}
      />
    </div>
  );
}

function ProgressRing({ value, max, color }) {
  const r = 40;
  const halfCircum = Math.PI * r;
  const fullCircum = 2 * Math.PI * r;
  const filled = (value / max) * halfCircum;

  return (
    <div className="prog-ring-wrap">
      <svg className="prog-ring-svg" viewBox="0 0 90 53" aria-hidden="true">
        <circle
          className="prog-ring-track"
          cx="45"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeDasharray={`${halfCircum} ${halfCircum}`}
          transform="rotate(180 45 50)"
        />
        <circle
          cx="45"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${fullCircum - filled}`}
          transform="rotate(180 45 50)"
        />
      </svg>
      <div className="prog-ring-center">
        <span className="prog-ring-value">{value}</span>
        <span className="prog-ring-max">/{max}</span>
      </div>
    </div>
  );
}

export default function TargetsSection({ isPro = false }) {
  const [tab, setTab] = useState("Season");
  const navigate = useNavigate();
  const lockedTabs = isPro ? [] : ["Month", "Week"];
  const targets = TARGETS_BY_TAB[tab] ?? [];

  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Targets</h2>
          <p className="prog-section-subtitle">
            Work on your goals and track them
          </p>
        </div>
        <Button type="subtle" size="xsmall" label="See all" onClick={() => navigate("/progress/targets")} />
      </div>

      <Tabs
        tabs={TARGET_TABS}
        active={tab}
        onChange={setTab}
        lockedTabs={lockedTabs}
        onLockedClick={() => navigate("/upgrade-pro")}
      />

      {targets.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="prog-targets-row">
          {targets.map((target) => (
            <div key={target.id} className="prog-target-card">
              <ProgressRing
                value={target.value}
                max={target.max}
                color={target.color}
              />
              <p className="prog-target-label">{target.label}</p>
              <div className="prog-target-progress">
                <div className="prog-target-track">
                  <div
                    className="prog-target-fill"
                    style={{
                      width: `${target.pct}%`,
                      background: target.color,
                    }}
                  />
                </div>
                <div className="prog-target-meta">
                  <span className="prog-target-status">ongoing</span>
                  <span
                    className="prog-target-pct"
                    style={{ color: target.color }}
                  >
                    {target.pct}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isPro && (
        <AISuggestion
          title="Suggested target"
          desc="Players with fully logged seasons get 40% more profile views on average."
        />
      )}
    </section>
  );
}
