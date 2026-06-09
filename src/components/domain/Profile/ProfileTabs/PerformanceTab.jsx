import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import OvrBadge from "../../../UI/OvrBadge";
import AISuggestion from "../../Progress-athletes/AISuggestion";
import SeasonOverviewCard from "../../Performance/SeasonOverviewCard";
import {
  PredictionsSection,
  SkillTrendsSection,
  TrainingImpactSection,
} from "../../Performance/PerformanceSections";
import ProUpgradeCard from "../../Progress-athletes/ProUpgradeCard";
import "./PerformanceTab.css";

const LEADERBOARD = [
  { id: 1, name: "Kylan Mbappe",      club: "Real Madrid FC", age: 16, goals: 18, ovr: 52 },
  { id: 2, name: "Samuel Soares",     club: "FC Benfica",      age: 17, goals: 15, ovr: 53 },
  { id: 3, name: "Emil Jensen Bryld", club: "Hobro IK",        age: 18, goals: 12, ovr: 53 },
  { id: 4, name: "Kylan Mbappe",      club: "Real Madrid FC",  age: 17, goals: 10, ovr: 55 },
  { id: 5, name: "Kylan Mbappe",      club: "Real Madrid FC",  age: 17, goals:  9, ovr: 56 },
];

function LeaderboardSection() {
  return (
    <section className="perf-lb-section">
      <div className="perf-lb-header">
        <div>
          <h3 className="perf-section-title">Leaderboard</h3>
          <p className="perf-lb-sub text-2xs-medium">Ranking your position and age</p>
        </div>
        <button className="perf-lb-scope text-sm-medium">
          All world <CaretDown size={14} />
        </button>
      </div>
      <div className="perf-lb-table">
        <div className="perf-lb-col-row text-2xs-medium">
          <span className="perf-lb-col-player">Player</span>
          <span className="perf-lb-col-a">A</span>
          <span className="perf-lb-col-g">G</span>
          <span className="perf-lb-col-rating">Rating</span>
        </div>
        {LEADERBOARD.map((p) => (
          <div key={p.id} className="perf-lb-row">
            <div className="perf-lb-player">
              <div className="perf-lb-avatar">
                <span className="text-xs-medium">
                  {p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div className="perf-lb-player-info">
                <span className="perf-lb-name text-sm-semibold">{p.name}</span>
                <span className="perf-lb-club text-2xs-medium">{p.club}</span>
              </div>
            </div>
            <span className="perf-lb-col-a text-sm-medium">{p.age}</span>
            <span className="perf-lb-col-g text-sm-medium">{p.goals}</span>
            <span className="perf-lb-col-rating">
              <OvrBadge value={p.ovr} size="xs" variant="default" />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}


export default function PerformanceTab({ viewerIsPro: initialIsPro = false }) {
  const [isPro, setIsPro] = useState(Boolean(initialIsPro));

  return (
    <div className="perf-tab">
      <SeasonOverviewCard />
      {isPro ? (
        <>
          <AISuggestion
            title="Player is getting better every match"
            desc="Top talent trajectory — on track for breakthrough season"
          />
          <PredictionsSection />
          <SkillTrendsSection />
          <TrainingImpactSection />
          <LeaderboardSection />
        </>
      ) : (
        <ProUpgradeCard badgeColor="pro-scout" buttonLabel="Get Premium features" onButtonClick={() => setIsPro(true)} />
      )}
    </div>
  );
}
