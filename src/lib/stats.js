import { supabase } from "./supabase";

export async function fetchProfiles(playerIds = []) {
  if (!playerIds?.length) return [];
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      avatar_url,
      club_other_name,
      club:club_id (name, logo_url)
      `
    )
    .in("id", playerIds);
  if (error) throw error;
  return data || [];
}

async function fetchSeasonIdByLabel(label) {
  if (!label) return null;
  // Try to match seasons by a human label like "2025-26"
  const { data, error } = await supabase
    .from("seasons")
    .select("id, label, name")
    .or(`label.eq.${label},name.eq.${label}`)
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data?.id ?? null;
}

export async function fetchSeasonStats(playerIds = [], { season } = {}) {
  if (!playerIds?.length) return [];
  let seasonId = null;
  if (season && season !== "all") {
    try {
      seasonId = await fetchSeasonIdByLabel(season);
    } catch {}
  }

  let query = supabase
    .from("player_season_stats")
    .select("*")
    .in("profile_id", playerIds);

  if (seasonId) {
    query = query.eq("season_id", seasonId);
  }

  const { data, error } = await query;
  if (error) throw error;
  const rows = data || [];

  // Group by profile and pick first (assumes latest or unique per season)
  const byPlayer = new Map();
  for (const r of rows) {
    const pid = r.profile_id;
    if (!byPlayer.has(pid)) byPlayer.set(pid, r);
  }
  const selected = seasonId ? rows : Array.from(byPlayer.values());

  // Normalize keys for UI components
  return selected.map((r) => {
    const appearances = r.appearances ?? r.matches_played ?? r.total_matches ?? 0;
    const minutes = r.minutes ?? r.total_minutes ?? 0;
    let mpg = r.minutes_per_game;
    if (mpg == null && appearances) mpg = Number(minutes) / Number(appearances);

    return {
      profile_id: r.profile_id,
      season_id: r.season_id ?? null,
      stats: {
        totalPlayed: appearances,
        started: r.starts ?? r.started ?? 0,
        minutesPerGame: mpg ?? 0,
        totalMinutes: minutes,
        scoringPerMinute: Number(r.scoring_per_minute ?? 0),
        goals: Number(r.goals ?? 0),
        goalsPerGame: Number(r.goals_per_game ?? 0),
        shotsPerGame: Number(r.shots_per_game ?? 0),
        assists: Number(r.assists ?? 0),
        touchesPerGame: Number(r.touches_per_game ?? 0),
        bigChancesCreated: Number(r.big_chances_created ?? 0),
        keyPassesPerGame: Number(r.key_passes_per_game ?? 0),
        tacklesPerGame: Number(r.tackles_per_game ?? 0),
        interceptionsPerGame: Number(r.interceptions_per_game ?? 0),
        ballsRecovered: Number(r.balls_recovered ?? 0),
        penaltiesCommitted: Number(r.penalties_committed ?? 0),
      },
    };
  });
}
