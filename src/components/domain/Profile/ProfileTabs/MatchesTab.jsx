import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import MatchCard from "../../Post/MatchCard";
import Button from "../../../UI/Button";
import Accordion from "../../../UI/Accordion";
import IconButton from "../../../UI/IconButton";
import PlusIcon from "../../../../assets/icons/plus.svg?react";
import "./MatchesTab.css";
import { useNavigate } from "react-router-dom";

export default function MatchesTab({ profile, isMe = false }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [season, setSeason] = useState("all");
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!profile?.id) return;

      setLoading(true);
      setError(null);

      let query = supabase
        .from("posts")
        .select(
          `
          id,
          type,
          content,
          media,
          created_at,
          goals,
          assists,
          minutes_played,
          date_of_game,
          league,
          your_team,
          opponent,
          your_score,
          opponent_score,
          author_id,
          profiles:author_id (
            id,
            club_id,
            club:club_id ( id, name, logo_url )
          )
        `,
        )
        .eq("author_id", profile.id)
        .eq("type", "match")
        .order("date_of_game", { ascending: false });

      const { data, error } = await query;
      if (cancelled) return;

      if (error) {
        console.error("Error loading matches:", error);
        setError(error.message);
        setLoading(false);
        return;
      }

      const noImageMatches = (data || []).map((m) => ({
        ...m,
        media: null,
      }));

      // 🧮 Build available seasons dynamically
      const seasons = new Set();
      noImageMatches.forEach((m) => {
        if (!m.date_of_game) return;
        const year = new Date(m.date_of_game).getFullYear();
        const seasonStart = `${year}-${year + 1}`;
        seasons.add(seasonStart);
      });

      const sortedSeasons = Array.from(seasons).sort().reverse();
      setAvailableSeasons(sortedSeasons);
      setMatches(noImageMatches);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  // Filter matches by selected season
  const filteredMatches =
    season === "all"
      ? matches
      : matches.filter((m) => {
          if (!m.date_of_game) return false;
          const date = new Date(m.date_of_game);
          const startYear = parseInt(season.split("-")[0]);
          const startDate = new Date(`${startYear}-07-01`);
          const endDate = new Date(`${startYear + 1}-06-30`);
          return date >= startDate && date <= endDate;
        });

  const seasonLabel =
    season === "all" ? "All Seasons" : season.replace("-", "–");

  if (loading) return <p>Loading matches…</p>;
  if (error) return <p className="error">Failed to load matches: {error}</p>;

  // 🧩 Empty state for your own profile
  if (!matches.length && isMe) {
    return (
      <main>
        <div className="profile-stats-tab">
          <div className="empty-state-box">
            <p className="empty-title">You don’t have available matches yet.</p>
            <p className="empty-subtitle">Add your match manually.</p>
          </div>

          <div className="empty-icon-container">
            <IconButton
              size="medium"
              type="primary"
              icon={PlusIcon}
              onClick={() => navigate("/add-post")}
            />
            <p className="empty-subtitle">Add a match.</p>
          </div>
        </div>
      </main>
    );
  }

  // 🧩 Empty state for others
  if (!matches.length)
    return (
      <main>
        <div className="profile-stats-tab">
          <p className="empty-subtitle">No match posts yet.</p>
        </div>
      </main>
    );

  return (
    <main>
      <div className="profile-matches-tab">
        <Accordion title={`Season ${seasonLabel}`}>
          <Button
            size="small"
            type={season === "all" ? "primary" : "outline"}
            label="All Seasons"
            onClick={() => setSeason("all")}
          />

          {availableSeasons.map((s) => (
            <Button
              key={s}
              size="small"
              type={season === s ? "primary" : "outline"}
              label={s.replace("-", "–")}
              onClick={() => setSeason(s)}
            />
          ))}
        </Accordion>

        {filteredMatches.map((m) => (
          <MatchCard
            key={m.id}
            isImage={false}
            imageUrl={null}
            yourTeam={m.your_team || m?.profiles?.club?.name || "—"}
            yourScore={m.your_score}
            opponent={m.opponent}
            opponentScore={m.opponent_score}
            league={m.league}
            date={m.date_of_game}
            goalsCount={m.goals}
            assistsCount={m.assists}
            minCount={m.minutes_played}
          />
        ))}
      </div>
    </main>
  );
}
