import { supabase } from "./supabase";

async function uid() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data?.user) throw new Error("Not authenticated");
  return data.user.id;
}

export async function getLikeState(postId) {
  const me = await uid();

  const { data, error, count } = await supabase
    .from("post_likes")
    .select("user_id", { count: "exact" })
    .eq("post_id", postId);

  if (error) throw error;

  // make 100% sure this is a number
  const likeCount =
    typeof count === "number" ? count : Array.isArray(data) ? data.length : 0;

  const liked = Array.isArray(data)
    ? data.some((row) => row.user_id === me)
    : false;

  return { liked, likeCount };
}

export async function like(postId) {
  const me = await uid();

  const { error } = await supabase
    .from("post_likes")
    .insert({ post_id: postId, user_id: me });

  // unique violation → ignore (already liked)
  if (
    error &&
    error.code !== "23505" && // Postgres unique error
    error.code !== "409" // sometimes comes back as HTTP conflict
  ) {
    throw error;
  }
}

export async function unlike(postId) {
  const me = await uid();

  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", me);

  if (error) throw error;
}
