import { Link, useNavigate, useParams } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { useState } from "react";

// ============================================================================
// LANDING - Entry point, checks auth state
// ============================================================================
export function Landing() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    );

  if (user) {
    navigate("/home", { replace: true });
    return null;
  }

  return (
    <div className="page">
      <div className="page-card">
        <h1>Welcome to Athlio</h1>
        <p>Track your athletic performance and connect with scouts.</p>
        <div className="page-actions">
          <Link to="/intro" className="button">
            Get Started
          </Link>
          <Link to="/auth" className="button button-secondary">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INTRO - Onboarding intro screen
// ============================================================================
export function Intro() {
  const navigate = useNavigate();

  const handleStart = () => {
    localStorage.setItem("introSeen", "true");
    navigate("/auth");
  };

  return (
    <div className="page">
      <div className="page-card">
        <h1>Welcome to Athlio</h1>
        <p>
          Learn how to track your athletic journey and connect with
          opportunities.
        </p>
        <button onClick={handleStart} className="button">
          Continue
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// AUTH - Login / Signup
// ============================================================================
export function Auth() {
  const [mode, setMode] = useState("signup"); // 'signup' or 'login'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      // TODO: Connect to your actual auth backend (Supabase, Firebase, etc)
      // Example:
      // if (mode === 'signup') {
      //   await supabase.auth.signUp({ email, password })
      //   navigate('/setup-profile')
      // } else {
      //   await supabase.auth.signInWithPassword({ email, password })
      //   navigate('/home')
      // }

      // For now, just navigate (placeholder)
      if (mode === "signup") {
        navigate("/setup-profile");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setErr(error.message || "An error occurred");
    }
  };

  return (
    <div className="page">
      <form
        onSubmit={handleSubmit}
        className="page-card"
        style={{ maxWidth: "500px" }}
      >
        <h1>{mode === "signup" ? "Create Account" : "Sign In"}</h1>

        {err && <p style={{ color: "#ff6b6b", marginBottom: "1rem" }}>{err}</p>}

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              background: "rgba(0,0,0,0.2)",
              color: "white",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              background: "rgba(0,0,0,0.2)",
              color: "white",
              fontFamily: "inherit",
            }}
          />
        </div>

        <button type="submit" className="button" style={{ width: "100%" }}>
          {mode === "signup" ? "Create Account" : "Sign In"}
        </button>

        <p
          style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}
        >
          {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            style={{
              background: "none",
              border: "none",
              color: "#5e7bff",
              cursor: "pointer",
              textDecoration: "underline",
              font: "inherit",
            }}
          >
            {mode === "signup" ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
}

// ============================================================================
// SETUP PROFILE - Complete profile during onboarding
// ============================================================================
export function SetupProfile() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");

  const handleComplete = async (e) => {
    e.preventDefault();
    // TODO: Save profile to backend
    navigate("/home");
  };

  return (
    <div className="page">
      <form
        onSubmit={handleComplete}
        className="page-card"
        style={{ maxWidth: "500px" }}
      >
        <h1>Set Up Your Profile</h1>
        <p>Tell us about yourself so scouts can find you.</p>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              background: "rgba(0,0,0,0.2)",
              color: "white",
              fontFamily: "inherit",
            }}
          />
        </div>

        <button type="submit" className="button" style={{ width: "100%" }}>
          Complete Setup
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// AUTH CALLBACK - Handle OAuth redirects
// ============================================================================
export function AuthCallback() {
  return (
    <div className="page">
      <div className="page-card">
        <h1>Signing you in...</h1>
        <p>Please wait while we authenticate.</p>
      </div>
    </div>
  );
}

// ============================================================================
// HOME - Main feed
// ============================================================================
export function Home() {
  const { profile, loading } = useUser();

  if (loading)
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="page">
      <div className="page-card">
        <h1>Home Feed</h1>
        <p>Welcome{profile?.username ? ` ${profile.username}` : ""}!</p>
        <p>
          Your posts and activity from athletes you follow will appear here.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// PROFILE - User profiles
// ============================================================================
export function ProfileMe() {
  const { profile, loading } = useUser();

  if (loading)
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="page">
      <div className="page-card">
        <h1>{profile?.username || "Profile"}</h1>
        <p>Your profile page with stats, posts, and achievements.</p>
        <Link to="/profile/me/edit" className="button">
          Edit Profile
        </Link>
      </div>
    </div>
  );
}

export function ProfileEdit() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: Save changes to backend
    navigate("/profile/me");
  };

  return (
    <div className="page">
      <form
        onSubmit={handleSave}
        className="page-card"
        style={{ maxWidth: "500px" }}
      >
        <h1>Edit Profile</h1>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              background: "rgba(0,0,0,0.2)",
              color: "white",
              fontFamily: "inherit",
            }}
          />
        </div>

        <button type="submit" className="button">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export function ProfileFollowing() {
  return (
    <div className="page">
      <div className="page-card">
        <h1>Following</h1>
        <p>Athletes and scouts you follow will appear here.</p>
      </div>
    </div>
  );
}

export function ProfileOther() {
  const { id } = useParams();

  return (
    <div className="page">
      <div className="page-card">
        <h1>Athlete Profile</h1>
        <p>Viewing profile: {id}</p>
        <p>Stats, posts, and achievements from this athlete.</p>
      </div>
    </div>
  );
}

// ============================================================================
// OTHER PAGES
// ============================================================================
export function Notifications() {
  return (
    <div className="page">
      <div className="page-card">
        <h1>Notifications</h1>
        <p>Your notifications, messages, and updates will appear here.</p>
      </div>
    </div>
  );
}

export function PostDetails() {
  const { id } = useParams();

  return (
    <div className="page">
      <div className="page-card">
        <h1>Post</h1>
        <p>Viewing post: {id}</p>
        <p>Post content, comments, and reactions will display here.</p>
      </div>
    </div>
  );
}

export function AddPost() {
  const navigate = useNavigate();

  const handlePublish = (e) => {
    e.preventDefault();
    // TODO: Publish post
    navigate("/home");
  };

  return (
    <div className="page">
      <form
        onSubmit={handlePublish}
        className="page-card"
        style={{ maxWidth: "600px" }}
      >
        <h1>Create Post</h1>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            What's on your mind?
          </label>
          <textarea
            placeholder="Share your performance, highlights, or update..."
            rows="6"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              background: "rgba(0,0,0,0.2)",
              color: "white",
              fontFamily: "inherit",
            }}
          />
        </div>

        <button type="submit" className="button">
          Publish Post
        </button>
      </form>
    </div>
  );
}

export function Chat() {
  return (
    <div className="page">
      <div className="page-card">
        <h1>Messages</h1>
        <p>
          Direct messages with coaches, scouts, and other athletes will appear
          here.
        </p>
      </div>
    </div>
  );
}

export function Scouting() {
  return (
    <div className="page">
      <div className="page-card">
        <h1>Scouting & Search</h1>
        <p>Find and follow athletes that match your interests.</p>
        <Link to="/scouting" className="button">
          Search Athletes
        </Link>
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="page">
      <div className="page-card">
        <h1>404</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/home" className="button">
          Go Home
        </Link>
      </div>
    </div>
  );
}
