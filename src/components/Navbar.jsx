import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import {
  Binoculars,
  House,
  MagnifyingGlass,
  Plus,
  Target,
} from "@phosphor-icons/react";
import PostTypePicker from "./domain/MakeAPost/PostTypePicker";
import AddPostModal from "./domain/MakeAPost/AddPostModal";
import "./Navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);
  const { profile, loading } = useUser();

  const isActive = (path) => pathname === path;
  const role = profile?.role || "athlete";

  if (loading) {
    return (
      <nav className="navbar">
        <span className="navbar-item">
          <House size={24} weight="regular" aria-hidden="true" />
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
      <nav className="navbar">

        {/* Home */}
        <Link
          to="/home"
          className={`navbar-item${isActive("/home") ? " navbar-item--active" : ""}`}
          aria-label="Home"
        >
          <House size={24} weight={isActive("/home") ? "fill" : "regular"} />
        </Link>

        {/* Search */}
        <Link
          to="/search"
          className={`navbar-item${isActive("/search") ? " navbar-item--active" : ""}`}
          aria-label="Search"
        >
          <MagnifyingGlass
            size={24}
            weight={isActive("/search") ? "fill" : "regular"}
          />
        </Link>

        {/* Create */}
        <button
          type="button"
          className={`navbar-item${showPicker ? " navbar-item--active" : ""}`}
          onClick={() => setShowPicker((prev) => !prev)}
          aria-label="Create"
        >
          <Plus size={24} weight={showPicker ? "bold" : "regular"} />
        </button>

        {/* Challenges / Scouting */}
        {role === "scout" ? (
          <Link
            to="/scouting"
            className={`navbar-item${isActive("/scouting") ? " navbar-item--active" : ""}`}
            aria-label="Scouting"
          >
            <Binoculars
              size={24}
              weight={isActive("/scouting") ? "fill" : "regular"}
            />
          </Link>
        ) : (
          <Link
            to="/challenges"
            className={`navbar-item${isActive("/challenges") ? " navbar-item--active" : ""}`}
            aria-label="Challenges"
          >
            <Target
              size={24}
              weight={isActive("/challenges") ? "fill" : "regular"}
            />
          </Link>
        )}

        {/* Profile */}
        <Link
          to="/profile/me"
          className={`navbar-item navbar-profile${isActive("/profile/me") ? " navbar-item--active" : ""}`}
          aria-label="Profile"
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="navbar-avatar"
            />
          ) : (
            <div className="navbar-avatar-placeholder" />
          )}
        </Link>

      </nav>

      <AddPostModal open={showPicker} onClose={() => setShowPicker(false)}>
        <PostTypePicker onChoose={(type) => { setShowPicker(false); navigate(`/add-post?type=${type}`); }} />
      </AddPostModal>
    </>
  );
}
