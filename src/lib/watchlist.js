import { supabase } from "./supabase";

async function getUid() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Not authenticated");
  return data.user.id;
}

export async function isBookmarked(playerId) {
  const uid = await getUid();
  const { data } = await supabase
    .from("follows")
    .select("is_watchlisted")
    .eq("follower_id", uid)
    .eq("following_id", playerId)
    .maybeSingle();
  return !!data?.is_watchlisted;
}

export async function addToWatchlist(playerId) {
  const uid = await getUid();
  const { error } = await supabase
    .from("follows")
    .upsert(
      { follower_id: uid, following_id: playerId, is_watchlisted: true },
      { onConflict: "follower_id,following_id" }
    );
  if (error) throw error;
}

export async function removeFromWatchlist(playerId) {
  const uid = await getUid();
  const { error } = await supabase
    .from("follows")
    .update({ is_watchlisted: false })
    .eq("follower_id", uid)
    .eq("following_id", playerId);
  if (error) throw error;
}

export async function fetchWatchlist() {
  const uid = await getUid();

  const { data: entries, error } = await supabase
    .from("follows")
    .select("following_id, created_at")
    .eq("follower_id", uid)
    .eq("is_watchlisted", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!entries?.length) return [];

  const playerIds = entries.map((e) => e.following_id);

  const { data: profiles, error: pErr } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, position, role")
    .in("id", playerIds);
  if (pErr) throw pErr;

  const { data: infoRows } = await supabase
    .from("info")
    .select("profile_id, birth_date, club:club_id (name, logo_url)")
    .in("profile_id", playerIds);

  const infoMap = new Map((infoRows || []).map((r) => [r.profile_id, r]));

  const profileMap = new Map((profiles || []).map((p) => {
    const info = infoMap.get(p.id);
    let age = null;
    if (info?.birth_date) {
      const birth = new Date(info.birth_date);
      const today = new Date();
      age = today.getFullYear() - birth.getFullYear();
      if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) age--;
    }
    return [p.id, { ...p, club: info?.club?.name || null, club_logo: info?.club?.logo_url || null, age }];
  }));

  return playerIds.map((id) => profileMap.get(id)).filter(Boolean);
}
