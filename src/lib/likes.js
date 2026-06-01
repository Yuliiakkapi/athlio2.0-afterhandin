import { supabase } from "./supabase";

async function uid() {
  // getSession reads from localStorage — no network call
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Not authenticated");
  return session.user.id;
}

export async function getLikeState(postId) {
  const me = await uid();

  // Run both queries in parallel:
  // 1. Check only this user's row (not all likes)
  // 2. Count query — head:true means no data is transferred, just the count
  const [{ data: likeRow }, { count }] = await Promise.all([
    supabase.from("post_likes")
      .select("user_id")
      .eq("post_id", postId)
      .eq("user_id", me)
      .maybeSingle(),
    supabase.from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId),
  ]);

  return {
    liked: !!likeRow,
    likeCount: typeof count === "number" ? count : 0,
  };
}

export async function like(postId) {
  const { data: { session } } = await supabase.auth.getSession();
  const me = session?.user?.id;
  if (!me) throw new Error("Not authenticated");

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
  const { data: { session } } = await supabase.auth.getSession();
  const me = session?.user?.id;
  if (!me) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", me);

  if (error) throw error;
}
