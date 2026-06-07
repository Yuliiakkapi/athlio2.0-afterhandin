import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import PostTypePicker from "./domain/MakeAPost/PostTypePicker";
import AddPostModal from "./domain/MakeAPost/AddPostModal";
import "./Navbar.css";
// Inline target icon so it inherits `currentColor`
function TargetIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17 12C17 12.9889 16.7068 13.9556 16.1574 14.7779C15.6079 15.6001 14.827 16.241 13.9134 16.6194C12.9998 16.9978 11.9945 17.0969 11.0246 16.9039C10.0546 16.711 9.16373 16.2348 8.46447 15.5355C7.76521 14.8363 7.289 13.9454 7.09608 12.9755C6.90315 12.0055 7.00217 11.0002 7.3806 10.0866C7.75904 9.17295 8.39991 8.39206 9.22215 7.84265C10.0444 7.29324 11.0111 7 12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 2.2C13.3533 2.068 12.6867 2.00133 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C21.9987 11.3133 21.932 10.6467 21.8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12.03 11.962L16.583 7.40899M19.74 4.34499L19.187 2.35699C19.1649 2.28126 19.1245 2.21214 19.0693 2.15576C19.0141 2.09937 18.9459 2.05746 18.8706 2.03373C18.7954 2.01 18.7155 2.00518 18.6379 2.01971C18.5604 2.03423 18.4876 2.06764 18.426 2.11699C16.99 3.28999 15.426 4.87099 16.703 7.36399C19.277 8.56399 20.747 6.94599 21.873 5.58499C21.924 5.52231 21.9585 5.44791 21.9734 5.36854C21.9884 5.28917 21.9833 5.20732 21.9587 5.13039C21.9341 5.05346 21.8907 4.98388 21.8324 4.92794C21.7742 4.872 21.7029 4.83146 21.625 4.80999L19.74 4.34499Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

function ScoutIcon({ active }) {
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none" aria-hidden="true">
      <path d="M0.75 14.7502L4.67678 8.85999C4.71353 8.80485 4.79278 8.80007 4.83591 8.85038L7.66077 12.146C7.70488 12.1975 7.78633 12.1911 7.82186 12.1334L11.6836 5.85798C11.7175 5.80296 11.7938 5.794 11.8395 5.83968L13.25 7.25015M17.25 7.25015L20.75 0.750153M18.4773 16.9002L18.4937 16.882C19.2728 16.025 19.7045 14.9084 19.7045 13.7502V13.6519C19.7045 12.5569 19.2964 11.5012 18.5598 10.691C17.7256 9.77331 16.543 9.25015 15.3028 9.25015H15.1063C13.8661 9.25015 12.6835 9.77331 11.8493 10.691C11.1127 11.5012 10.7045 12.5569 10.7045 13.6519V13.8484C10.7045 14.9434 11.1127 15.9991 11.8493 16.8093C12.6835 17.727 13.8661 18.2502 15.1063 18.2502H15.4255C16.5875 18.2502 17.6956 17.76 18.4773 16.9002ZM18.4773 16.9002L20.75 18.8499" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {active && (
        <path d="M13.8926 11.8C14.3926 11.4667 15.6926 11 16.8926 11.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      )}
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
          {isScout ? (
            <ScoutIcon active={isActive("/scouting")} />
          ) : (
            <TargetIcon />
          )}
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
