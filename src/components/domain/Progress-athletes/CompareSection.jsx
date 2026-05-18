import { CaretRight } from "@phosphor-icons/react";
import { useUser } from "../../../context/UserContext";
import "./CompareSection.css";

const COMPARE_STATS = [
  { label: "GOALS",   mine: 14, theirs: 26 },
  { label: "ASSISTS", mine: 10, theirs: 14 },
  { label: "MATCHES", mine: 22, theirs: 42 },
];

export default function CompareSection() {
  const { profile } = useUser();
  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Compare</h2>
          <p className="prog-section-subtitle">Ranking your position and age</p>
        </div>
      </div>
      <div className="prog-compare-card">
        <div className="prog-compare-players">
          <div className="prog-compare-player">
            <div className="prog-compare-avatar">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="" className="prog-compare-avatar-img" />
                : <span>{(profile?.full_name || profile?.username || "Y").charAt(0).toUpperCase()}</span>
              }
            </div>
            <span className="prog-compare-name">YOU</span>
            <div className="prog-compare-rating-badge">65%</div>
          </div>
          <span className="prog-compare-vs">VS</span>
          <div className="prog-compare-player">
            <div className="prog-compare-avatar prog-compare-avatar--other" />
            <span className="prog-compare-name">DEMBELE</span>
          </div>
        </div>

        <div className="prog-compare-stats">
          {COMPARE_STATS.map((s) => {
            const total = s.mine + s.theirs;
            const minePct = (s.mine / total) * 100;
            return (
              <div key={s.label} className="prog-compare-row">
                <span className="prog-compare-mine">{s.mine}</span>
                <div className="prog-compare-center">
                  <span className="prog-compare-label">{s.label}</span>
                  <div className="prog-compare-bars">
                    <div className="prog-compare-bar-mine"  style={{ width: `${minePct}%` }} />
                    <div className="prog-compare-bar-other" style={{ width: `${100 - minePct}%` }} />
                  </div>
                </div>
                <span className="prog-compare-theirs">{s.theirs}</span>
              </div>
            );
          })}
        </div>

        <button className="prog-compare-cta">
          Compare to other players
          <CaretRight size={20} />
        </button>
      </div>
    </section>
  );
}
