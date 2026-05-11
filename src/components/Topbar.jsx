import { useLocation, useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import {
  ArrowLeft,
  Bell,
  ChatCircle,
  List,
  MagnifyingGlass,
  ShareNetwork,
  X,
} from "@phosphor-icons/react";
import MainLogo from "../assets/logos/main-logo.svg?react";
import "./Topbar.css";
import Button from "./UI/Button";
import IconButton from "./UI/IconButton";
import ProfilePicture from "./UI/ProfilePicture";

const TOPBAR_CONFIG = {
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
    title: null,
    left: (nav, profile) => (
      <div className="button-avatar">
        <IconButton onClick={() => nav(-1)} size="large" type="subtle" icon={X} />
        <ProfilePicture imgUrl={profile?.avatar_url} size="medium" />
      </div>
    ),
    right: () => (
      <Button
        size="medium"
        type="primary"
        label="Post it"
        onClick={() => document.dispatchEvent(new Event("composer:submit"))}
      />
    ),
  },
  "/profile/me": {
    title: null,
    left: (nav) => (
      <div className="topbar-left-with-back">
        <IconButton size="large" type="subtle" icon={ArrowLeft} onClick={() => nav(-1)} />
        <MainLogo className="main-logo" />
      </div>
    ),
    right: () => (
      <div className="topbar-icons">
        <List
          size={24}
          className="topbar-menu-icon"
          aria-label="Menu"
          onClick={() => {
            console.log("Menu clicked");
          }}
        />
      </div>
    ),
  },
  "/profile/other": {
    title: null,
    left: (nav) => (
      <div className="topbar-left-with-back">
        <IconButton size="large" type="subtle" icon={ArrowLeft} onClick={() => nav(-1)} />
        <MainLogo className="main-logo" />
      </div>
    ),
    right: () => (
      <Button
        size="small"
        type="outline"
        onClick={() => {
          console.log("Share clicked");
        }}
        Icon={ShareNetwork}
      />
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
    <header className="topbar">
      <div>{config.left?.(navigate, profile, counts)}</div>
      {config.center?.(navigate, profile, counts) || (
        <h1 className="topbar-title">{config.title}</h1>
      )}
      <div>{config.right?.(navigate, profile, counts)}</div>
    </header>
  );
}
