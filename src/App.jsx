import { Route, Routes } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import {
  Landing,
  Intro,
  Auth,
  SetupProfile,
  AuthCallback,
  Home,
  ProfileMe,
  ProfileEdit,
  ProfileFollowing,
  ProfileOther,
  Notifications,
  PostDetails,
  AddPost,
  Chat,
  Scouting,
  NotFound,
} from "./pages";

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

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
