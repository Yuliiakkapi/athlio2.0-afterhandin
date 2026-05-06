import { supabase } from "./supabase";

async function fetchSeasonIdByLabel(label) {
  if (!label) return null;
  const { data, error } = await supabase
    .from("seasons")
    .select("id, label, name")
    .or(`label.eq.${label},name.eq.${label}`)
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data?.id ?? null;
}

export async function fetchPlayerInfo(playerIds = [], { season } = {}) {
  if (!playerIds?.length) return [];
  let seasonId = null;
  if (season && season !== "all") {
    try {
      seasonId = await fetchSeasonIdByLabel(season);
    } catch {}
  }

  let query = supabase
    .from("info")
    .select(
      `
      profile_id,
      nationality,
      nationality_code,
      birth_date,
      weight_kg,
      height_cm,
      position,
      shirt_number,
      preferred_foot,
      club:club_id (name, logo_url),
      updated_at
      `
    )
    .in("profile_id", playerIds)
    .order("updated_at", { ascending: false });

  if (seasonId) {
    query = query.eq("season_id", seasonId);
  }

  const { data, error } = await query;
  if (error) throw error;
  const rows = data || [];

  const byPlayer = new Map();
  for (const row of rows) {
    if (!byPlayer.has(row.profile_id)) {
      byPlayer.set(row.profile_id, row);
    }
  }

  return Array.from(byPlayer.values()).map((row) => ({
    profile_id: row.profile_id,
    info: {
      country: row.nationality || null,
      nationalityCode: row.nationality_code || null,
      birthdate: row.birth_date || null,
      weightKg: row.weight_kg ?? null,
      heightCm: row.height_cm ?? null,
      position: row.position || null,
      shirtNumber: row.shirt_number || null,
      preferredFoot: row.preferred_foot || null,
      teamName: row?.club?.name || null,
      teamLogo: row?.club?.logo_url || null,
    },
  }));
}
