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
import Scouting from "./pages/Scouting";
import NotFound from "./pages/NotFound";
import DesignSystem from "./pages/DesignSystem";

export default function App() {
  return (
    <Routes>
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
        <Route path="scouting" element={<Scouting />} />

        <Route path="design-system" element={<DesignSystem />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
