import "./MatchPostCount.css";

export default function MatchPostCount({ label, count }) {
  return (
    <div className="match-post-count">
      <p>{label}</p>
      <h1>{count}</h1>
    </div>
  );
}
