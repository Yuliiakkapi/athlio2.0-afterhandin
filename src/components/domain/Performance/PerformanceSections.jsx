import { CaretRight, SneakerMove, Heartbeat, Barbell } from "@phosphor-icons/react";
import PerformanceRadarChart from "./PerformanceRadarChart";
import "./Performance.css";

const DEFAULT_PREDICTIONS = [
  { label: "GOALS",   value: 15,  sub: "this season", pct: "57% this season" },
  { label: "ASSISTS", value: 21,  sub: "this season", pct: "10% this season" },
  { label: "MINUTES", value: 890, sub: "this season", pct: "6% this season"  },
];

const DEFAULT_TRAINING_IMPACT = [
  { Icon: SneakerMove, label: "Weeks with 4+ trainings", sub: "more goal contribution",      pct: "+35%" },
  { Icon: Heartbeat,   label: "Recovery days",           sub: "better average match rating",  pct: "+12%" },
  { Icon: Barbell,     label: "Gym sessions",            sub: "better late-game performance", pct: "+18%" },
];

export function PredictionsSection({ predictions = DEFAULT_PREDICTIONS }) {
  return (
    <section className="perf-section">
      <h2 className="perf-section-title">Performance predictions</h2>
      <div className="perf-predictions">
        {predictions.map((p) => (
          <div key={p.label} className="perf-pred-card">
            <span className="perf-pred-label">{p.label}</span>
            <span className="perf-pred-value">{p.value}</span>
            <span className="perf-pred-sub">{p.sub}</span>
            <div className="perf-pred-trend">
              <div className="perf-pred-arrow" aria-hidden="true" />
              <span>{p.pct}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SkillTrendsSection({ skills }) {
  return (
    <section className="perf-section">
      <h2 className="perf-section-title">Skill trends</h2>
      <div className="perf-radar-card">
        <PerformanceRadarChart skills={skills} />
      </div>
    </section>
  );
}

export function TrainingImpactSection({ items = DEFAULT_TRAINING_IMPACT, onSeeTrainings }) {
  return (
    <section className="perf-section">
      <h2 className="perf-section-title">Training impact</h2>
      <div className="perf-impact-card">
        {items.map(({ Icon, label, sub, pct }, idx) => (
          <div key={label} className={`perf-impact-row${idx < items.length - 1 ? " perf-impact-row--border" : ""}`}>
            <div className="perf-impact-icon">
              <Icon size={20} weight="regular" color="var(--primary-default)" />
            </div>
            <div className="perf-impact-info">
              <p className="perf-impact-label">{label}</p>
              <p className="perf-impact-sub">{sub}</p>
            </div>
            <span className="perf-impact-pct">{pct}</span>
          </div>
        ))}
        {onSeeTrainings && (
          <button className="perf-see-trainings" onClick={onSeeTrainings}>
            See trainings <CaretRight size={14} weight="bold" />
          </button>
        )}
      </div>
    </section>
  );
}
