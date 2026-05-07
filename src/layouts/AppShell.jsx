import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";

export default function AppShell() {
  const { pathname } = useLocation();

  const hideNavbar =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/intro") ||
    pathname.startsWith("/setup-profile") ||
    pathname.startsWith("/add-post");

  const hideTopbar =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/intro") ||
    pathname.startsWith("/setup-profile");

  return (
    <div className="app-shell">
      {!hideTopbar && <Topbar />}
      <main className="main-content">
        <Outlet />
      </main>
      {!hideNavbar && <Navbar />}
    </div>
  );
}
