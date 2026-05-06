import { Link } from "react-router-dom";

export default function NotFound() {
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
