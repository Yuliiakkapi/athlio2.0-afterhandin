import { Link } from "react-router-dom";

export default function Scouting() {
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
