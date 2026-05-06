import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
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
