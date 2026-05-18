import { CaretRight } from "@phosphor-icons/react";
import { useUser } from "../../../context/UserContext";
import Button from "../../UI/Button";
import dembele from "../../../assets/images/dembele-comparison.png";
import "./CompareSection.css";

const COMPARE_STATS = [
  { label: "Goals",   mine: 14, theirs: 26 },
  { label: "Assists", mine: 10, theirs: 14 },
  { label: "Matches", mine: 22, theirs: 42 },
];

const PRO_NAME = "Dembélé";
const PRO_AGE  = 21;

export default function CompareSection() {
  const { profile } = useUser();

  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Compare</h2>
          <p className="prog-section-subtitle">Look how much do you have in common with stars</p>
        </div>
      </div>

      {/* ── Players row – sits above the card ─────────────────── */}
      <div className="cmp-players">
        <div className="cmp-player">
          <div className="cmp-avatar">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="" className="cmp-avatar__img" />
              : <span>{(profile?.full_name || profile?.username || "Y").charAt(0).toUpperCase()}</span>
            }
          </div>
          <span className="cmp-player__name">You</span>
        </div>

        <div className="cmp-match-badge">
          <span className="cmp-match-badge__label">Career match at<br />the age {PRO_AGE}</span>
          <span className="cmp-match-badge__pct">65%</span>
        </div>

        <div className="cmp-player">
          <div className="cmp-avatar cmp-avatar--bare">
            <img src={dembele} alt={PRO_NAME} className="cmp-avatar__img" />
          </div>
          <span className="cmp-player__name">{PRO_NAME}</span>
        </div>
      </div>

      {/* ── Stats card – overlaps up behind the avatars ───────── */}
      <div className="cmp-card">
        <div className="cmp-stats">
          <div className="cmp-stats__header">
            <span className="cmp-stats__col-label">You</span>
            <span className="cmp-stats__col-label">{PRO_NAME} at {PRO_AGE}</span>
          </div>

          {COMPARE_STATS.map((s) => {
            const total    = s.mine + s.theirs;
            const minePct  = Math.round((s.mine  / total) * 100);
            const theirPct = 100 - minePct;
            return (
              <div key={s.label} className="cmp-row">
                <span className="cmp-row__num cmp-row__num--mine">{s.mine}</span>
                <div className="cmp-row__center">
                  <span className="cmp-row__label">{s.label}</span>
                  <div className="cmp-bars">
                    <div className="cmp-bar cmp-bar--mine"   style={{ width: `${minePct}%` }} />
                    <div className="cmp-bar cmp-bar--theirs" style={{ width: `${theirPct}%` }} />
                  </div>
                </div>
                <span className="cmp-row__num cmp-row__num--theirs">{s.theirs}</span>
              </div>
            );
          })}
        </div>

        <Button
          type="subtle"
          size="small"
          fullWidth
          label="Compare to other players"
          trailingIcon={CaretRight}
        />
      </div>
    </section>
  );
}
