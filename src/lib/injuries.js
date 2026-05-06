import { supabase } from "./supabase";

export async function fetchInjuries(profileIds = []) {
  if (!profileIds?.length) return [];

  const { data, error } = await supabase
    .from("injuries")
    .select(
      `
      profile_id,
      title,
      body_part,
      side,
      severity,
      category,
      start_date,
      end_date,
      expected_return_date,
      expected_duration_weeks,
      notes,
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

  return Array.from(grouped.entries()).map(([profile_id, injuries]) => ({
    profile_id,
    injuries,
  }));
}
