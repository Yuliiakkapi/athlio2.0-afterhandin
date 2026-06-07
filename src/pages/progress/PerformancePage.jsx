import { useNavigate } from "react-router-dom";
import { useSkills } from "../../context/SkillsContext";
import AISuggestion from "../../components/domain/Progress-athletes/AISuggestion";
import PerformanceChartCard from "../../components/domain/Performance/PerformanceChartCard";
import {
  PredictionsSection,
  SkillTrendsSection,
  TrainingImpactSection,
} from "../../components/domain/Performance/PerformanceSections";
import "./PerformancePage.css";

export default function PerformancePage() {
  const navigate = useNavigate();
  const { skills } = useSkills();

  return (
    <div className="perf-page">
      <PerformanceChartCard />
      <AISuggestion
        title="You're on track to your best season yet!"
        desc="Keep up the great work!"
      />
      <PredictionsSection />
      <SkillTrendsSection skills={skills} />
      <TrainingImpactSection onSeeTrainings={() => navigate("/progress/trainings")} />
    </div>
  );
}
