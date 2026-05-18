import { useUser } from "../context/UserContext";
import PerformanceCard from "../components/domain/Progress-athletes/PerformanceCard";
import ProfileVisibilitySection from "../components/domain/Progress-athletes/ProfileVisibilitySection";
import TrainingsSection from "../components/domain/Progress-athletes/TrainingsSection";
import TargetsSection from "../components/domain/Progress-athletes/TargetsSection";
import ChallengesSection from "../components/domain/Progress-athletes/ChallengesSection";
import LeaderboardSection from "../components/domain/Progress-athletes/LeaderboardSection";
import CompareSection from "../components/domain/Progress-athletes/CompareSection";
import ProUpgradeCard from "../components/domain/Progress-athletes/ProUpgradeCard";
import "./Progress.css";

export default function Progress() {
  const { profile } = useUser();
  const isPro = Boolean(profile?.is_pro);

  return (
    <div className="progress-page">
      <div className="progress-sections">
        <PerformanceCard isPro={isPro} />
        {isPro ? (
          <>
            <ProfileVisibilitySection />
            <TrainingsSection />
            <TargetsSection isPro={isPro} />
            <ChallengesSection />
            <LeaderboardSection />
            <CompareSection />
          </>
        ) : (
          <>
            <TargetsSection isPro={isPro} />
            <ChallengesSection />
            <LeaderboardSection />
            <ProUpgradeCard />
          </>
        )}
      </div>
    </div>
  );
}
