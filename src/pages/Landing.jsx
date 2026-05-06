import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Landing() {
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
          <a href="/intro" className="button">
            Get Started
          </a>
          <a href="/auth" className="button button-secondary">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
