import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import "./BasicPost.css";
import { useEffect, useRef, useState } from "react";

export default function BasicPost({
  id,
  author,
  authorId,
  content,
  imageUrl,
  createdAt,
  author_role,
  position,
  yourTeam,
  likesCount,
  commentsCount,
  hideFollow = false,
}) {
  if (!id) return null;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [content]);

  return (
    <article className="post" data-id={id}>
      <PostHeader
        name={author}
        date={createdAt}
        role={author_role}
        authorId={authorId}
        position={position}
        club={yourTeam}
        hideFollow={hideFollow}
      />

      {content && (
        <div className="post-content-container">
          <p
            ref={textRef}
            className={`post-content ${isExpanded ? "expanded" : ""}`}
          >
            {content}
          </p>
          {isOverflowing && (
            <button
              className="see-more"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "See less" : "See more"}
            </button>
          )}
        </div>
      )}

      {imageUrl && (
        <div className="post-media">
          <img className="post-image" src={imageUrl} alt="" />
        </div>
      )}

      <PostActions
        postId={id}
        auraCount={likesCount}
        commentCount={commentsCount}
        postAuthorId={authorId}
      />
    </article>
  );
}
