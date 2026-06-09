import { supabase } from "./supabase";

export async function fetchPlayerSuggestions(limit = 20) {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, position, role")
    .not("full_name", "is", null)
    .limit(limit);
  if (error) throw error;
  if (!profiles?.length) return [];

  const ids = profiles.map((p) => p.id);
  const { data: infoRows } = await supabase
    .from("info")
    .select("profile_id, birth_date, club:club_id (name, logo_url)")
    .in("profile_id", ids);

  const infoMap = new Map((infoRows || []).map((r) => [r.profile_id, r]));

  return profiles.map((p) => {
    const info = infoMap.get(p.id);
    let age = null;
    if (info?.birth_date) {
      const birth = new Date(info.birth_date);
      const today = new Date();
      age = today.getFullYear() - birth.getFullYear();
      if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) age--;
    }
    return {
      ...p,
      club: info?.club?.name || null,
      club_logo: info?.club?.logo_url || null,
      age,
    };
  });
}

export async function getProfile(id) {
  if (!id) throw new Error("id required");
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(id, patch) {
  if (!id) throw new Error("id required");
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data;
}

