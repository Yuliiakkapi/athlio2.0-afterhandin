import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { TargetsProvider } from "./context/TargetsContext";
import { ChallengesProvider } from "./context/ChallengesContext";
import { SkillsProvider } from "./context/SkillsContext";
import { ConnectedAppsProvider } from "./context/ConnectedAppsContext";
import AppShell from "./layouts/AppShell";

const Landing = lazy(() => import("./pages/Landing"));
const Intro = lazy(() => import("./pages/Intro"));
const Auth = lazy(() => import("./pages/Auth"));
const SetupProfile = lazy(() => import("./pages/SetupProfile"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Home = lazy(() => import("./pages/Home"));
const ProfileMe = lazy(() => import("./pages/ProfileMe"));
const ProfileEdit = lazy(() => import("./pages/ProfileEdit"));
const ProfileFollowing = lazy(() => import("./pages/ProfileFollowing"));
const ProfileOther = lazy(() => import("./pages/ProfileOther"));
const Notifications = lazy(() => import("./pages/Notifications"));
const PostDetails = lazy(() => import("./pages/PostDetails"));
const AddPost = lazy(() => import("./pages/AddPost"));
const AddMatchPost = lazy(() => import("./pages/AddMatchPost"));
const PostAboutMatch = lazy(() => import("./pages/PostAboutMatch"));
const PostAboutMatchComposer = lazy(() => import("./pages/PostAboutMatchComposer"));
const AddMatch = lazy(() => import("./pages/AddMatch"));
const Chat = lazy(() => import("./pages/Chat"));
const ChatDetail = lazy(() => import("./pages/ChatDetail"));
const Progress = lazy(() => import("./pages/Progress"));
const Scouting = lazy(() => import("./pages/Scouting"));
const YourTeam = lazy(() => import("./pages/YourTeam"));
const Substitution = lazy(() => import("./pages/Substitution"));
const SelectPlayers = lazy(() => import("./pages/SelectPlayers"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const ProfileSearch = lazy(() => import("./pages/ProfileSearch"));
const NotFound = lazy(() => import("./pages/NotFound"));
const UpgradePro = lazy(() => import("./pages/UpgradePro"));
const ProOnboarding = lazy(() => import("./pages/ProOnboarding"));
const ScoutProOnboarding = lazy(() => import("./pages/ScoutProOnboarding"));
const ScoutUpgradePro = lazy(() => import("./pages/ScoutUpgradePro"));
const AiScout = lazy(() => import("./pages/AiScout"));
const TrainingsPage = lazy(() => import("./pages/progress/TrainingsPage"));
const VisibilityPage = lazy(() => import("./pages/progress/VisibilityPage"));
const ComparePage = lazy(() => import("./pages/progress/ComparePage"));
const CompareSelectPage = lazy(() => import("./pages/progress/CompareSelectPage"));
const LeaderboardPage = lazy(() => import("./pages/progress/LeaderboardPage"));
const TargetsPage = lazy(() => import("./pages/progress/TargetsPage"));
const ChallengesPage = lazy(() => import("./pages/progress/ChallengesPage"));
const PerformancePage = lazy(() => import("./pages/progress/PerformancePage"));

export default function App() {
  return (
    <ConnectedAppsProvider>
    <SkillsProvider>
    <ChallengesProvider>
    <TargetsProvider>
    <Suspense fallback={null}>
    <Routes>
      <Route index element={<Navigate to="/intro" replace />} />
      <Route path="intro" element={<Intro />} />
      <Route path="upgrade-pro" element={<UpgradePro />} />
      <Route path="pro-onboarding" element={<ProOnboarding />} />
      <Route path="scout-pro-onboarding" element={<ScoutProOnboarding />} />
      <Route path="scout-upgrade-pro" element={<ScoutUpgradePro />} />
      <Route path="scouting/ai-scout" element={<AiScout />} />
      <Route element={<AppShell />}>
        <Route path="landing" element={<Landing />} />
        <Route path="auth" element={<Auth />} />
        <Route path="setup-profile" element={<SetupProfile />} />
        <Route path="auth/callback" element={<AuthCallback />} />

        <Route path="home" element={<Home />} />
        <Route path="profile/me" element={<ProfileMe />} />
        <Route path="profile/me/edit" element={<ProfileEdit />} />
        <Route path="profile/me/following" element={<ProfileFollowing />} />
        <Route path="profile/:id" element={<ProfileOther />} />

        <Route path="notifications" element={<Notifications />} />
        <Route path="post/:id" element={<PostDetails />} />
        <Route path="add-post" element={<AddPost />} />
        <Route path="add-post/match" element={<AddMatchPost />} />
        <Route path="post-match-select" element={<PostAboutMatch />} />
        <Route path="post-about-match/:matchId" element={<PostAboutMatchComposer />} />
        <Route path="add-match" element={<AddMatch />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chat/:id" element={<ChatDetail />} />
        <Route path="progress" element={<Progress />} />
        <Route path="progress/performance" element={<PerformancePage />} />
        <Route path="progress/trainings" element={<TrainingsPage />} />
        <Route path="progress/visibility" element={<VisibilityPage />} />
        <Route path="progress/compare" element={<ComparePage />} />
        <Route path="progress/compare/select" element={<CompareSelectPage />} />
        <Route path="progress/leaderboard" element={<LeaderboardPage />} />
        <Route path="progress/targets" element={<TargetsPage />} />
        <Route path="progress/challenges" element={<ChallengesPage />} />
        <Route path="scouting" element={<Scouting />} />
        <Route path="scouting/team" element={<YourTeam />} />
        <Route path="scouting/substitution" element={<Substitution />} />
        <Route path="scouting/select-players" element={<SelectPlayers />} />
        <Route path="scouting/watchlist" element={<Watchlist />} />
        <Route path="scouting/search" element={<ProfileSearch />} />
        <Route path="search" element={<ProfileSearch />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </Suspense>
    </TargetsProvider>
    </ChallengesProvider>
    </SkillsProvider>
    </ConnectedAppsProvider>
  );
}
