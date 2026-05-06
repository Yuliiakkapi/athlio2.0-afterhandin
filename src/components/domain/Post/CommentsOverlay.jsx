import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useUser } from "../../../context/UserContext";
import ArrowUpIcon from "../../../assets/icons/arrow-up.svg?react";
import "./CommentsOverlay.css";
import IconButton from "../../UI/IconButton";
import CommentCard from "./CommentCard";

export default function CommentsOverlay({
  postId,
  postAuthorId,
  open,
  onClose,
  onCommentAdded,
}) {
  const { user, profile } = useUser();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadComments() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("post_comments")
        .select(
          `
          id,
          content,
          created_at,
          author_id,
          profiles:author_id (
            id,
            full_name,
            username,
            avatar_url,
            position
          )
        `,
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("load comments", error);
        setError(error.message);
        setComments([]);
      } else {
        setComments(Array.isArray(data) ? data : []);
      }

      setLoading(false);
    }

    loadComments();

    return () => {
      cancelled = true;
    };
  }, [postId, open]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    if (!user?.id) {
      // in v1 just bail, later you can show a toast / redirect to login
      return;
    }

    setSubmitting(true);
    setError(null);

    const { data, error } = await supabase
      .from("post_comments")
      .insert({
        post_id: postId,
        author_id: user.id,
        content: text.trim(),
      })
      .select(
        `
        id,
        content,
        created_at,
        author_id,
        profiles:author_id (
          id,
          full_name,
          username,
          avatar_url,
          position
        )
      `,
      )
      .single();

    if (error) {
      console.error("submit comment", error);
      setError(error.message);
      setSubmitting(false);
      return;
    }

    // create notification for post owner if someone else commented
    if (postAuthorId && profile?.id && postAuthorId !== profile.id) {
      try {
        await supabase.from("notifications").insert({
          recipient_id: postAuthorId,
          actor_id: profile.id,
          post_id: postId,
          comment_id: data.id,
          type: "comment",
        });
      } catch (e) {
        console.error("insert comment notification", e);
      }
    }

    setSubmitting(false);

    // add new comment to list
    setComments((prev) => {
      const next = [...prev, data];
      return next;
    });

    // clear input field
    setText("");

    if (onCommentAdded) {
      onCommentAdded();
    }
  }

  if (!open) return null;

  return (
    <div className="comments-backdrop" onClick={onClose}>
      <div
        className="comments-panel"
        onClick={(e) => e.stopPropagation()} // don't close when clicking inside
      >
        <div className="comments-header">
          <p>Comments</p>
          <button className="comments-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="comments-body">
          {loading && <p>Loading…</p>}
          {error && <p className="comments-error">{error}</p>}
          {!loading && comments.length === 0 && (
            <p className="comments-empty">Be the first to comment.</p>
          )}

          {!loading &&
            comments.map((c) => <CommentCard key={c.id} comment={c} />)}
        </div>

        <form className="comments-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Add a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting}
          />
          <IconButton
            icon={ArrowUpIcon}
            size="medium"
            type="primary"
            disabled={submitting || !text.trim()}
          />
        </form>
      </div>
    </div>
  );
}
