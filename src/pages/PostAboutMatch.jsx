import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, SlidersHorizontal } from "@phosphor-icons/react";
import { supabase } from "../lib/supabase";
import MatchCard from "../components/domain/Post/MatchCard";
import Button from "../components/UI/Button";
import { formatMatchDate } from "../lib/format";
import "./post-about-match.css";

export default function PostAboutMatch() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) { setLoading(false); return; }

      const { data } = await supabase
        .from("matches")
        .select(`
          id, your_team, opponent, your_score, opponent_score,
          league, date_of_game, goals, assists, minutes_played,
          yellow_cards, red_cards,
          opponent_club:opponent_club_id ( logo_url ),
          profiles:player_id ( club:club_id ( logo_url ) )
        `)
        .eq("player_id", userId)
        .order("date_of_game", { ascending: false });

      if (!cancel) {
        const rows = data ?? [];
        if (rows.length === 0) {
          navigate("/add-match", { replace: true });
        } else {
          setMatches(rows);
          setLoading(false);
        }
      }
    })();
    return () => { cancel = true; };
  }, [navigate]);

  if (loading) return null;

  return (
    <main className="pam-page">
      <div className="pam-body">
        <Button
          label="Filters"
          type="gray"
          size="small"
          fullWidth
          leadingIcon={SlidersHorizontal}
        />

        <div className="pam-cards-grid">
          {matches.map((m) => (
            <div key={m.id} className="pam-card-wrap" onClick={() => navigate(`/post-about-match/${m.id}`)} style={{ cursor: "pointer" }}>
              <MatchCard
                compact
                yourTeam={m.your_team}
                yourTeamLogoUrl={m.profiles?.club?.logo_url}
                yourScore={Number(m.your_score) || 0}
                opponent={m.opponent}
                opponentLogoUrl={m.opponent_club?.logo_url}
                opponentScore={Number(m.opponent_score) || 0}
                league={m.league}
                date={formatMatchDate(m.date_of_game)}
                goalsCount={Number(m.goals) || 0}
                assistsCount={Number(m.assists) || 0}
                minCount={Number(m.minutes_played) || 0}
                yellowCards={m.yellow_cards ?? 0}
                redCards={m.red_cards ?? 0}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pam-footer">
        <Button
          label="Add new match"
          type="primary"
          size="medium"
          fullWidth
          leadingIcon={Plus}
          onClick={() => navigate("/add-match")}
        />
      </div>
    </main>
  );
}
