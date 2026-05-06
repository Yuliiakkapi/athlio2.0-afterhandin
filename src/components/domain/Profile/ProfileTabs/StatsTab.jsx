import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import TableStats from "../../Scouting/TableStats";
import EditIcon from "../../../../assets/icons/edit.svg?react";
import "./StatsTab.css";
import Button from "../../../UI/Button";

export default function StatsTab({ profile, isMe = false }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profile?.id) return;

    async function fetchPlayerStats() {
      setLoading(true);
      setError(null);

      // Fetch latest season stats for this profile
      const { data, error } = await supabase
        .from("player_season_stats")
        .select(
          `
          appearances,
          starts,
          minutes_per_game,
          minutes
        `,
        )
        .eq("profile_id", profile.id)
        .order("season_id", { ascending: false }) // latest season first
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching player stats:", error);
        setError("Could not load stats.");
      } else {
        setStats(data);
      }

      setLoading(false);
    }

    fetchPlayerStats();
  }, [profile?.id]);

  if (loading) return <div className="page">Loading stats...</div>;
  if (error) return <div className="page">{error}</div>;
  if (!stats)
    return <div className="page">No stats available for this player.</div>;

  // ✅ Adapt values to what TableStats expects
  const players = [
    {
      id: profile.id,
      full_name: profile.full_name,
      stats: {
        totalPlayed: stats.appearances,
        started: stats.starts,
        minutesPerGame: stats.minutes_per_game,
        totalMinutes: stats.minutes,
      },
    },
  ];

  return (
    <main>
      <div className="profile-stats-tab">
        <div className="info-tab-header">
          {isMe && (
            <Button
              size="medium"
              type="outline"
              Icon={EditIcon}
              className="edit-info-btn"
              onClick={() => (window.location.href = "/edit-profile")}
            />
          )}
        </div>
        <section className="player-stats">
          <TableStats players={players} />
        </section>
      </div>
    </main>
  );
}
