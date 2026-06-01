import SuggestedFollowCard from "../onboarding/SuggestedFollowCard";
import "./SuggestedAccounts.css";

export default function SuggestedAccounts({ profiles }) {
  if (!profiles?.length) return null;

  return (
    <div className="suggested-block">
      <h3>Suggested for you</h3>
      <ul className="suggested-card-list">
        {profiles.map((p) => (
          <li key={p.id}>
            <SuggestedFollowCard
              id={p.id}
              name={p.full_name || p.username}
              avatarUrl={p.avatar_url}
              verified={p.verified}
              positions={p.position ?? []}
              clubName={p.clubs?.name || p.club_other_name || null}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
