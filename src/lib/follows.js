import { supabase } from "./supabase";

async function getUid() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Not authenticated");
  return data.user.id;
}

export async function isFollowing(authorId) {
  const uid = await getUid();
  const { data, error } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", uid)
    .eq("following_id", authorId)
    .limit(1)
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error; // ignore no rows
  return !!data;
}

export async function follow(authorId) {
  const uid = await getUid();
  const { error } = await supabase
    .from("follows")
    .insert([{ follower_id: uid, following_id: authorId }]);
  // ignore duplicate follows due to PK
  if (error && error.code !== "23505") throw error;
}

export async function unfollow(authorId) {
  const uid = await getUid();
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", uid)
    .eq("following_id", authorId);
  if (error) throw error;
}
