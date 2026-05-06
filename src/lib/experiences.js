import { supabase } from "./supabase";
export async function fetchExperiences(profileIds = []) {
  if (!profileIds?.length) return [];
  const { data, error } = await supabase
    .from("experiences")
    .select(
      `
      profile_id,
      org_name,
      team_name,
      team_level,
      country,
      logo_url,
      start_date,
      end_date,
      is_current,
      created_at
      `
    )
    .in("profile_id", profileIds)
    .order("start_date", { ascending: false });
  if (error) throw error;
  const rows = data || [];
  const grouped = new Map();
  for (const row of rows) {
    if (!grouped.has(row.profile_id)) grouped.set(row.profile_id, []);
    grouped.get(row.profile_id).push(row);
  }
  return Array.from(grouped.entries()).map(([profile_id, experiences]) => ({
    profile_id,
    experiences,
  }));
}