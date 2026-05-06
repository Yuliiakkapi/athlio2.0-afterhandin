import { useNavigate } from "react-router-dom";

export default function Intro() {
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
