import SuggestedCard from "./SuggestedCard";
import "./SuggestedAccounts.css";

export default function SuggestedAccounts({ profiles }) {
  if (!profiles?.length) return null;

  return (
    <div className="suggested-block">
      <h3>Suggested for you</h3>
      <ul className="suggested-card-list">
        {profiles.map((p) => (
          <li key={p.id}>
            <SuggestedCard profile={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
