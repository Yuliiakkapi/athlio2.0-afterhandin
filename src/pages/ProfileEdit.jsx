import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileEdit() {
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
