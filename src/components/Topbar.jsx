import { useLocation, useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import {
  ArrowLeft,
  Bell,
  ChatCircle,
  GearSix,
  MagnifyingGlass,
  Plus,
  ShareNetwork,
  X,
} from "@phosphor-icons/react";
import MainLogo from "../assets/logos/main-logo.svg?react";
import "./Topbar.css";
import Button from "./UI/Button";
import IconButton from "./UI/IconButton";
import ProfilePicture from "./UI/ProfilePicture";

function pageConfig(title, RightIcon) {
  return {
    variant: "page",
    left: (nav) => <IconButton size="small" type="subtle" icon={ArrowLeft} onClick={() => nav(-1)} />,
    center: () => <h1 className="topbar-page-title">{title}</h1>,
    right: RightIcon
      ? (nav) => <IconButton size="small" type="subtle" icon={RightIcon} onClick={() => {}} />
      : () => <span aria-hidden="true" />,
  };
}

const TOPBAR_CONFIG = {
  "/progress/performance": pageConfig("Performance"),
  "/progress/trainings":  pageConfig("Trainings", Plus),
  "/progress/visibility": pageConfig("Profile visibility"),
  "/progress/compare":    pageConfig("Compare"),
  "/progress/leaderboard":pageConfig("Leaderboard"),
  "/progress/targets":    pageConfig("Targets"),
  "/progress/challenges": pageConfig("Challenges"),
  "/home": {
    title: null,
    left: () => <MainLogo className="main-logo" aria-label="Logo" />,
    right: (nav, _profile, counts) => (
      <div className="topbar-icons">
        <div className="icon-with-badge" onClick={() => nav("/notifications")}>
          <Bell size={24} aria-label="Notifications" />
          {counts.notifications > 0 && (
            <span className="badge">+{counts.notifications}</span>
          )}
        </div>
        <div className="icon-with-badge" onClick={() => nav("/chat")}>
          <ChatCircle size={24} aria-label="Messages" />
          {counts.messages > 0 && (
            <span className="badge">{counts.messages}</span>
          )}
        </div>
      </div>
    ),
  },
  "/chat": {
    title: null,
    left: (nav) => (
      <IconButton size="large" type="subtle" icon={ArrowLeft} onClick={() => nav(-1)} />
    ),
    center: () => (
      <div className="topbar-search-wrap">
        <MagnifyingGlass size={18} className="topbar-search-icon" aria-hidden="true" />
        <input placeholder="Search for message" className="topbar-search" />
      </div>
    ),
  },
  "/notifications": {
    title: null,
    left: (nav) => (
      <div className="topbar-left-with-back">
        <IconButton size="large" type="subtle" icon={ArrowLeft} onClick={() => nav(-1)} />
        <MainLogo className="main-logo" aria-label="Logo" />
      </div>
    ),
  },
  "/post": {
    title: null,
    left: (nav) => (
      <div className="topbar-left-with-back">
        <IconButton size="large" type="subtle" icon={ArrowLeft} onClick={() => nav(-1)} />
        <MainLogo className="main-logo" aria-label="Logo" />
      </div>
    ),
  },
  "/add-post": {
    variant: "page",
    left: () => <span aria-hidden="true" />,
    center: () => <h1 className="topbar-page-title">Create new post</h1>,
    right: (nav) => (
      <IconButton onClick={() => nav(-1)} size="large" type="subtle" icon={X} />
    ),
  },
  "/post-match-select": {
    variant: "page",
    left: (nav) => (
      <IconButton onClick={() => nav(-1)} size="large" type="subtle" icon={ArrowLeft} />
    ),
    center: () => <h1 className="topbar-page-title">Post about match</h1>,
    right: (nav) => (
      <IconButton onClick={() => nav("/home")} size="large" type="subtle" icon={X} />
    ),
  },
  "/add-match": {
    variant: "page",
    left: (nav) => (
      <IconButton onClick={() => nav(-1)} size="large" type="subtle" icon={ArrowLeft} />
    ),
    center: () => <h1 className="topbar-page-title">Add your match</h1>,
    right: (nav) => (
      <IconButton onClick={() => nav("/home")} size="large" type="subtle" icon={X} />
    ),
  },
  "/profile/me/following": {
    left: (nav) => (
      <IconButton size="large" type="subtle" icon={ArrowLeft} onClick={() => nav(-1)} />
    ),
    center: () => <h1 className="topbar-page-title">Following</h1>,
    right: () => <span aria-hidden="true" />,
    variant: "page",
  },
  "/profile/me": {
    transparent: true,
    left: (nav) => (
      <IconButton size="large" type="subtle" icon={ArrowLeft} onClick={() => nav(-1)} />
    ),
    right: () => (
      <GearSix size={24} aria-label="Settings" onClick={() => console.log("Settings clicked")} />
    ),
  },
  "/profile/other": {
    transparent: true,
    left: (nav) => (
      <IconButton size="large" type="subtle" icon={ArrowLeft} onClick={() => nav(-1)} />
    ),
    right: () => (
      <ShareNetwork size={24} aria-label="Share profile" onClick={() => console.log("Share clicked")} />
    ),
  },
  "/profile/me/edit": {
    title: "Edit profile",
    left: (nav) => (
      <IconButton size="large" type="subtle" icon={X} onClick={() => nav(-1)} />
    ),
    center: () => <h1 className="topbar-title">Edit profile</h1>,
  },
  "/scouting": {
    title: null,
    left: () => <MainLogo className="main-logo" aria-label="Athlio" />,
    right: (nav, _profile, counts) => (
      <div className="topbar-icons">
        <div className="icon-with-badge" onClick={() => nav("/notifications")}>
          <Bell size={24} aria-label="Notifications" />
          {counts.notifications > 0 && (
            <span className="badge">+{counts.notifications}</span>
          )}
        </div>
        <div className="icon-with-badge" onClick={() => nav("/chat")}>
          <ChatCircle size={24} aria-label="Messages" />
          {counts.messages > 0 && (
            <span className="badge">{counts.messages}</span>
          )}
        </div>
      </div>
    ),
  },
  "/scouting/search": {
    title: null,
    left: (nav) => (
      <div className="topbar-left-with-back">
        <IconButton size="large" type="subtle" icon={ArrowLeft} onClick={() => nav(-1)} />
        <MainLogo className="main-logo" aria-label="Athlio" />
      </div>
    ),
    right: (nav, _profile, counts) => (
      <div className="topbar-icons">
        <div className="icon-with-badge" onClick={() => nav("/notifications")}>
          <Bell size={24} aria-label="Notifications" />
          {counts.notifications > 0 && (
            <span className="badge">+{counts.notifications}</span>
          )}
        </div>
        <div className="icon-with-badge" onClick={() => nav("/chat")}>
          <ChatCircle size={24} aria-label="Messages" />
          {counts.messages > 0 && (
            <span className="badge">{counts.messages}</span>
          )}
        </div>
      </div>
    ),
  },
};

export default function Topbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { profile, counts } = useUser();

  let config = TOPBAR_CONFIG[pathname];
  if (!config && pathname.startsWith("/add-post")) config = TOPBAR_CONFIG["/add-post"];
  if (!config && pathname.startsWith("/post/")) config = TOPBAR_CONFIG["/post"];
  if (!config && pathname.startsWith("/profile/")) {
    if (!pathname.startsWith("/profile/me")) config = TOPBAR_CONFIG["/profile/other"];
  }

  if (!config) return null;

  return (
    <header className={`topbar${config.variant === "page" ? " topbar--page" : ""}${config.transparent ? " topbar--transparent" : ""}`}>
      <div>{config.left?.(navigate, profile, counts)}</div>
      {config.center?.(navigate, profile, counts) || (
        <h1 className="topbar-title">{config.title}</h1>
      )}
      <div>{config.right?.(navigate, profile, counts)}</div>
    </header>
  );
}
