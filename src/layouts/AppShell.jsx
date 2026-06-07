import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";

export default function AppShell() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  const hideNavbar =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/intro") ||
    pathname.startsWith("/setup-profile") ||
    pathname.startsWith("/add-post") ||
    pathname.startsWith("/progress/") ||
    pathname === "/scouting/team" ||
    pathname === "/scouting/substitution" ||
    pathname === "/scouting/select-players" ||
    pathname === "/scouting/watchlist";

  const hideTopbar =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/intro") ||
    pathname.startsWith("/setup-profile") ||
    pathname === "/scouting/watchlist" ||
    pathname === "/scouting/substitution" ||
    pathname === "/scouting/select-players";

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
