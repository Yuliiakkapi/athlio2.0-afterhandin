import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import {
  House,
  MagnifyingGlass,
  Plus,
  Trophy,
  UsersThree,
} from "@phosphor-icons/react";
import PostTypePicker from "./domain/MakeAPost/PostTypePicker";
import AddPostModal from "./domain/MakeAPost/AddPostModal";
import "./Navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);

  function handleChoose(type) {
    setShowPicker(false);
    navigate(`/add-post?type=${type}`);
  }

  const { profile, loading } = useUser();

  const isActive = (path) => pathname === path;

  if (loading) {
    return (
      <nav className="navbar">
        <Link to="/home" className={isActive("/home") ? "active" : ""}>
          <House
            size={24}
            weight={isActive("/home") ? "fill" : "regular"}
            aria-label="Home"
          />
        </Link>
        <span>Loading...</span>
        <Link to="/profile" className={isActive("/profile") ? "active" : ""}>
          <div className="profile-placeholder" />
        </Link>
      </nav>
    );
  }

  const role = profile?.role || "athlete";

  return (
    <>
      <nav className="navbar">
        <Link to="/home" className={isActive("/home") ? "active" : ""}>
          <House
            size={24}
            weight={isActive("/home") ? "fill" : "regular"}
            aria-label="Home"
          />
        </Link>
        <Link to="/search" className={isActive("/search") ? "active" : ""}>
          <MagnifyingGlass
            size={24}
            weight={isActive("/search") ? "fill" : "regular"}
            aria-label="Search"
          />
        </Link>
        <button
          type="button"
          className={`navbar-plus ${isActive("/add-post") ? "active" : ""}`}
          onClick={() => setShowPicker((prev) => !prev)}
          aria-label="Create new post"
          style={{
            background: "transparent",
            border: 0,
            padding: 0,
            cursor: "pointer",
          }}
        >
          <Plus size={24} aria-label="Add Post" />
        </button>
        {role === "scout" ? (
          <Link
            to="/scouting"
            className={isActive("/scouting") ? "active" : ""}
          >
            <UsersThree
              size={24}
              weight={isActive("/scouting") ? "fill" : "regular"}
              aria-label="Scouting"
            />
          </Link>
        ) : (
          <Link
            to="/challenges"
            className={isActive("/challenges") ? "active" : ""}
          >
            <Trophy
              size={24}
              weight={isActive("/challenges") ? "fill" : "regular"}
              aria-label="Challenges"
            />
          </Link>
        )}
        <Link
          to="/profile/me"
          className={isActive("/profile/me") ? "active" : ""}
        >
          <div>
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="profile-avatar"
              />
            ) : (
              <div className="profile-placeholder" />
            )}
            {isActive("/profile/me") && <div className="circle"></div>}
          </div>
        </Link>
      </nav>
      <AddPostModal open={showPicker} onClose={() => setShowPicker(false)}>
        <PostTypePicker onChoose={handleChoose} />
      </AddPostModal>
    </>
  );
}
