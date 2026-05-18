import { Route, Routes } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import Landing from "./pages/Landing";
import Intro from "./pages/Intro";
import Auth from "./pages/Auth";
import SetupProfile from "./pages/SetupProfile";
import AuthCallback from "./pages/AuthCallback";
import Home from "./pages/Home";
import ProfileMe from "./pages/ProfileMe";
import ProfileEdit from "./pages/ProfileEdit";
import ProfileFollowing from "./pages/ProfileFollowing";
import ProfileOther from "./pages/ProfileOther";
import Notifications from "./pages/Notifications";
import PostDetails from "./pages/PostDetails";
import AddPost from "./pages/AddPost";
import Chat from "./pages/Chat";
import ChatDetail from "./pages/ChatDetail";
import Progress from "./pages/Progress";
import Scouting from "./pages/Scouting";
import YourTeam from "./pages/YourTeam";
import Watchlist from "./pages/Watchlist";
import ProfileSearch from "./pages/ProfileSearch";
import NotFound from "./pages/NotFound";
import UpgradePro from "./pages/UpgradePro";
import ProOnboarding from "./pages/ProOnboarding";

export default function App() {
  return (
    <Routes>
      <Route path="upgrade-pro" element={<UpgradePro />} />
      <Route path="pro-onboarding" element={<ProOnboarding />} />
      <Route element={<AppShell />}>
        <Route index element={<Landing />} />
        <Route path="intro" element={<Intro />} />
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
        <Route path="chat" element={<Chat />} />
        <Route path="chat/:id" element={<ChatDetail />} />
        <Route path="progress" element={<Progress />} />
        <Route path="scouting" element={<Scouting />} />
        <Route path="scouting/team" element={<YourTeam />} />
        <Route path="scouting/watchlist" element={<Watchlist />} />
        <Route path="scouting/search" element={<ProfileSearch />} />
        <Route path="search" element={<ProfileSearch />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
