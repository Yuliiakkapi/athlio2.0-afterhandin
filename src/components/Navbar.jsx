import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import PostTypePicker from "./domain/MakeAPost/PostTypePicker";
import AddPostModal from "./domain/MakeAPost/AddPostModal";
import "./Navbar.css";

/* ─── Custom SVG icons (paths from app's design system) ─────────── */

function HomeIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 19.12V12.387C21 11.8445 20.8896 11.3076 20.6756 10.809C20.4616 10.3105 20.1483 9.86069 19.755 9.48701L13.378 3.43001C13.0063 3.07689 12.5132 2.88 12.0005 2.88C11.4878 2.88 10.9947 3.07689 10.623 3.43001L4.245 9.48701C3.85165 9.86069 3.53844 10.3105 3.3244 10.809C3.11037 11.3076 3 11.8445 3 12.387V19.12C3 19.6504 3.21071 20.1591 3.58579 20.5342C3.96086 20.9093 4.46957 21.12 5 21.12H19C19.5304 21.12 20.0391 20.9093 20.4142 20.5342C20.7893 20.1591 21 19.6504 21 19.12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {active && (
        <line
          x1="7.75" y1="18.25" x2="16.25" y2="18.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 21L16.657 16.657M16.657 16.657C17.3998 15.9141 17.9891 15.0322 18.3912 14.0615C18.7932 13.0909 19.0002 12.0506 19.0002 11C19.0002 9.94939 18.7932 8.90908 18.3912 7.93845C17.9891 6.96782 17.3998 6.08588 16.657 5.34299C15.9141 4.6001 15.0321 4.01081 14.0615 3.60877C13.0909 3.20672 12.0506 2.99979 11 2.99979C9.94936 2.99979 8.90905 3.20672 7.93842 3.60877C6.96779 4.01081 6.08585 4.6001 5.34296 5.34299C3.84263 6.84332 2.99976 8.87821 2.99976 11C2.99976 13.1218 3.84263 15.1567 5.34296 16.657C6.84329 18.1573 8.87818 19.0002 11 19.0002C13.1217 19.0002 15.1566 18.1573 16.657 16.657Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11.2222 18.2222C11.2222 18.4285 11.3042 18.6263 11.45 18.7722C11.5959 18.9181 11.7937 19 12 19C12.2063 19 12.4041 18.9181 12.55 18.7722C12.6958 18.6263 12.7778 18.4285 12.7778 18.2222V12.7778H18.2222C18.4285 12.7778 18.6263 12.6958 18.7722 12.55C18.9181 12.4041 19 12.2063 19 12C19 11.7937 18.9181 11.5959 18.7722 11.45C18.6263 11.3042 18.4285 11.2222 18.2222 11.2222H12.7778V5.77778C12.7778 5.5715 12.6958 5.37367 12.55 5.22781C12.4041 5.08194 12.2063 5 12 5C11.7937 5 11.5959 5.08194 11.45 5.22781C11.3042 5.37367 11.2222 5.5715 11.2222 5.77778V11.2222H5.77778C5.5715 11.2222 5.37367 11.3042 5.22781 11.45C5.08194 11.5959 5 11.7937 5 12C5 12.2063 5.08194 12.4041 5.22781 12.55C5.37367 12.6958 5.5715 12.7778 5.77778 12.7778H11.2222V18.2222Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChallengesIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17 12C17 12.9889 16.7068 13.9556 16.1574 14.7779C15.6079 15.6001 14.827 16.241 13.9134 16.6194C12.9998 16.9978 11.9945 17.0969 11.0246 16.9039C10.0546 16.711 9.16373 16.2348 8.46447 15.5355C7.76521 14.8363 7.289 13.9454 7.09608 12.9755C6.90315 12.0055 7.00217 11.0002 7.3806 10.0866C7.75904 9.17295 8.39991 8.39206 9.22215 7.84265C10.0444 7.29324 11.0111 7 12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 2.2C13.3533 2.068 12.6867 2.00133 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C21.9987 11.3133 21.932 10.6467 21.8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12.03 11.962L16.583 7.40901M19.74 4.34501L19.187 2.35701C19.1649 2.28127 19.1245 2.21215 19.0693 2.15577C19.0141 2.09939 18.9459 2.05748 18.8706 2.03375C18.7954 2.01002 18.7155 2.0052 18.6379 2.01972C18.5604 2.03424 18.4876 2.06766 18.426 2.11701C16.99 3.29001 15.426 4.87101 16.703 7.36401C19.277 8.56401 20.747 6.94601 21.873 5.58501C21.924 5.52232 21.9585 5.44793 21.9734 5.36856C21.9884 5.28918 21.9833 5.20733 21.9587 5.1304C21.9341 5.05348 21.8907 4.9839 21.8324 4.92795C21.7742 4.87201 21.7029 4.83148 21.625 4.81001L19.74 4.34501Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScoutIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 19 19" fill="none" aria-hidden="true">
      <path d="M4.91742 10.7498C4.55366 10.7503 4.19439 10.8302 3.8647 10.9839C3.53502 11.1377 3.24284 11.3615 3.00858 11.6398C2.77432 11.918 2.60361 12.2441 2.50836 12.5952C2.41311 12.9462 2.39563 13.3139 2.45713 13.6724C2.51862 14.0309 2.65762 14.3717 2.86442 14.671C3.07121 14.9702 3.34082 15.2208 3.65444 15.4051C3.96805 15.5894 4.3181 15.7031 4.68017 15.7381C5.04224 15.7732 5.4076 15.7288 5.75075 15.6081" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.63741 12.0872C2.13871 11.8471 1.70765 11.4866 1.38312 11.0382C1.05859 10.5899 0.850813 10.0678 0.778541 9.51902C0.706268 8.97028 0.771774 8.41218 0.969147 7.89508C1.16652 7.37799 1.48955 6.91818 1.90908 6.55716M1.93408 6.48966C1.66078 6.0807 1.54099 5.58823 1.59593 5.09944C1.65086 4.61064 1.87697 4.15704 2.23422 3.81895C2.59148 3.48085 3.05684 3.28007 3.54791 3.25213C4.03899 3.2242 4.52412 3.37092 4.91741 3.66633M5.11574 3.72049C4.9828 3.43803 4.91504 3.1293 4.91747 2.81713C4.9199 2.50496 4.99245 2.19732 5.12977 1.91696C5.26709 1.6366 5.46566 1.39068 5.7108 1.19739C5.95594 1.00409 6.24139 0.86836 6.54605 0.800225C6.8507 0.73209 7.16678 0.733293 7.47091 0.803746C7.77503 0.874199 8.05944 1.0121 8.30311 1.20726C8.54677 1.40241 8.74346 1.64983 8.87864 1.93123C9.01381 2.21263 9.08402 2.52081 9.08408 2.83299V15.7497C9.08408 16.1917 8.90848 16.6156 8.59592 16.9282C8.28336 17.2407 7.85944 17.4163 7.41741 17.4163C6.97538 17.4163 6.55146 17.2407 6.2389 16.9282C5.92634 16.6156 5.75074 16.1917 5.75074 15.7497M9.08408 4.91633C9.08408 5.57937 9.34747 6.21525 9.81631 6.68409C10.2851 7.15293 10.921 7.41633 11.5841 7.41633M13.2507 10.7497C13.6145 10.7502 13.9738 10.8301 14.3035 10.9838C14.6331 11.1376 14.9253 11.3614 15.1596 11.6397C15.3938 11.9179 15.5646 12.244 15.6598 12.5951C15.755 12.9461 15.7725 13.3138 15.711 13.6723C15.6495 14.0308 15.5105 14.3716 15.3037 14.6709C15.0969 14.9701 14.8273 15.2207 14.5137 15.405C14.2001 15.5893 13.8501 15.703 13.488 15.738C13.1259 15.7731 12.7606 15.7287 12.4174 15.608" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.5308 12.0872C16.0295 11.8471 16.4605 11.4866 16.7851 11.0382C17.1096 10.5899 17.3174 10.0678 17.3896 9.51902C17.4619 8.97028 17.3964 8.41218 17.199 7.89508C17.0017 7.37799 16.6786 6.91818 16.2591 6.55716M16.2341 6.48966C16.5074 6.0807 16.6272 5.58823 16.5723 5.09944C16.5173 4.61064 16.2912 4.15704 15.934 3.81895C15.5767 3.48085 15.1113 3.28007 14.6203 3.25213C14.1292 3.2242 13.6441 3.37092 13.2508 3.66633M9.08411 2.83299C9.08416 2.52081 9.15437 2.21263 9.28954 1.93123C9.42472 1.64983 9.62141 1.40241 9.86508 1.20726C10.1087 1.0121 10.3931 0.874199 10.6973 0.803746C11.0014 0.733293 11.3175 0.73209 11.6221 0.800225C11.9268 0.86836 12.2122 1.00409 12.4574 1.19739C12.7025 1.39068 12.9011 1.6366 13.0384 1.91696C13.1757 2.19732 13.2483 2.50496 13.2507 2.81713C13.2531 3.1293 13.1854 3.43803 13.0524 3.72049M12.4174 15.7497C12.4174 16.1917 12.2418 16.6156 11.9293 16.9282C11.6167 17.2407 11.1928 17.4163 10.7508 17.4163C10.3087 17.4163 9.88482 17.2407 9.57226 16.9282C9.2597 16.6156 9.08411 16.1917 9.08411 15.7497" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────── */

const SCOUT_ROLES = ["scout", "coach", "manager", "agent", "professional"];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const [showPicker, setShowPicker] = useState(false);
  const { profile, loading }        = useUser();

  const isActive = (path) => pathname === path;
  const role     = profile?.role || "athlete";
  const isScout  = SCOUT_ROLES.includes(role);

  if (loading) {
    return (
      <nav className="navbar" aria-label="Main navigation">
        <span className="navbar-item">
          <HomeIcon active={false} />
        </span>
        <span className="navbar-item navbar-item--placeholder" />
        <span className="navbar-item">
          <div className="navbar-avatar-placeholder" />
        </span>
      </nav>
    );
  }

  return (
    <>
      <nav className="navbar" aria-label="Main navigation">

        {/* Home */}
        <Link
          to="/home"
          className={`navbar-item${isActive("/home") ? " navbar-item--active" : ""}`}
          aria-label="Home"
          aria-current={isActive("/home") ? "page" : undefined}
        >
          <HomeIcon active={isActive("/home")} />
        </Link>

        {/* Search */}
        <Link
          to="/search"
          className={`navbar-item${isActive("/search") ? " navbar-item--active" : ""}`}
          aria-label="Search"
          aria-current={isActive("/search") ? "page" : undefined}
        >
          <SearchIcon />
        </Link>

        {/* Create */}
        <button
          type="button"
          className={`navbar-item${showPicker ? " navbar-item--active" : ""}`}
          onClick={() => setShowPicker((p) => !p)}
          aria-label="Create post"
          aria-expanded={showPicker}
        >
          <PlusIcon />
        </button>

        {/* Scout Tools / Progress */}
        <Link
          to={isScout ? "/scouting" : "/progress"}
          className={`navbar-item${(isActive("/scouting") || isActive("/progress")) ? " navbar-item--active" : ""}`}
          aria-label={isScout ? "Scout Tools" : "Progress"}
          aria-current={(isActive("/scouting") || isActive("/progress")) ? "page" : undefined}
        >
          <ScoutIcon />
        </Link>

        <Link
          to="/profile/me"
          className={`navbar-item navbar-profile${isActive("/profile/me") ? " navbar-item--active" : ""}`}
          aria-label="Profile"
          aria-current={isActive("/profile/me") ? "page" : undefined}
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="navbar-avatar"
            />
          ) : (
            <div className="navbar-avatar-placeholder" />
          )}
        </Link>

      </nav>

      <AddPostModal open={showPicker} onClose={() => setShowPicker(false)}>
        <PostTypePicker
          onChoose={(type) => {
            setShowPicker(false);
            navigate(`/add-post?type=${type}`);
          }}
        />
      </AddPostModal>
    </>
  );
}
