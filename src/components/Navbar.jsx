import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import HomeIcon from "../assets/icons/home.svg";
import HomeActive from "../assets/icons/home-active.svg";
import ChallengesIcon from "../assets/icons/challenges.svg";
import ChallengesActive from "../assets/icons/challenges-active.svg";
import ComparisonIcon from "../assets/icons/comparison.svg";
import ComparisonActive from "../assets/icons/comparison-active.svg";
import SearchIcon from "../assets/icons/search.svg";
import SearchActive from "../assets/icons/search-active.svg";
import PlusIcon from "../assets/icons/plus.svg";
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
          <img
            src={isActive("/home") ? HomeActive : HomeIcon}
            alt="Home"
            width="24"
            height="24"
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
          <img
            src={isActive("/home") ? HomeActive : HomeIcon}
            alt="Home"
            width="24"
            height="24"
          />
        </Link>
        <Link to="/search" className={isActive("/search") ? "active" : ""}>
          <img
            src={isActive("/search") ? SearchActive : SearchIcon}
            alt="Home"
            width="24"
            height="24"
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
          <img src={PlusIcon} alt="Add Post" width="24" height="24" />
        </button>
        {role === "scout" ? (
          <Link
            to="/scouting"
            className={isActive("/scouting") ? "active" : ""}
          >
            <img
              src={isActive("/scouting") ? ComparisonActive : ComparisonIcon}
              alt="Home"
              width="24"
              height="24"
            />
          </Link>
        ) : (
          <Link
            to="/challenges"
            className={isActive("/challenges") ? "active" : ""}
          >
            <img
              src={isActive("/challenges") ? ChallengesActive : ChallengesIcon}
              alt="Home"
              width="24"
              height="24"
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
