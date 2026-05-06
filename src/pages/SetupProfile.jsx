import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SetupProfile() {
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
